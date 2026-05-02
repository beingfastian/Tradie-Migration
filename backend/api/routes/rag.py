"""
RAG Router – AI-powered document Q&A assistant.

Endpoints:
  POST /rag/ask                              – Ask a question about a candidate's documents
  GET  /rag/candidates/{candidate_id}/chunks – List stored text chunks (debug)
  POST /rag/ingest/{candidate_id}/{doc_id}  – Ingest a document (extract → embed → store)

Access: admin, company_admin, migration_agent, employer.
"""

import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query, Request
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from slowapi import Limiter
from slowapi.util import get_remote_address

from backend.db.setup import get_db
from backend.api.dependencies.rbac import require_roles
from backend.db.models.models import TextChunk, CandidateProfile, ApplicantDocument, User
from backend.services.rag_service import process_and_store_document, answer_question, search_candidates_by_content

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

RAG_ROLES = ("admin", "company_admin", "migration_agent")


# ── Schemas ───────────────────────────────────────────────────────────────────

class RAGQuery(BaseModel):
    candidate_id: str
    question: str = Field(..., min_length=3, max_length=1000)
    top_k: int = Field(default=5, ge=1, le=20)


class DocumentSearchQuery(BaseModel):
    search_term: str = Field(..., min_length=2, max_length=500,
                             description="Natural-language search term, e.g. 'electrician trade certificate Australia' or 'licensed plumber 5 years experience'")
    top_k: int = Field(default=10, ge=1, le=50,
                       description="Max number of candidates to return")
    document_type: Optional[str] = Field(None,
                                         description="Optional filter: trade_certificate | resume | passport | safety_certificate | english_test | reference_letter")
    trade_category: Optional[str] = Field(None,
                                          description="Optional filter: electrician | plumber | welder | carpenter …")
    nationality: Optional[str] = Field(None,
                                       description="Optional filter by candidate nationality, e.g. 'Pakistani'")


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/ask")
@limiter.limit("30/minute")
async def ask_question(
    request: Request,
    payload: RAGQuery,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(*RAG_ROLES)),
):
    """
    Ask a natural-language question about a specific candidate's uploaded documents.

    The system retrieves the most relevant document chunks using pgvector cosine
    similarity and passes them as context to OpenAI (gpt-4o-mini) to generate a grounded answer.

    - If no documents have been ingested, returns status='no_documents'.
    - In local/dev mode (USE_STUB_EMBEDDINGS=true), returns a stub answer.
    """
    # Verify candidate exists — cast str → UUID for asyncpg compatibility
    try:
        cid_uuid = uuid.UUID(payload.candidate_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="candidate_id must be a valid UUID")

    result = await db.execute(
        select(CandidateProfile).where(CandidateProfile.id == cid_uuid)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Candidate not found")

    try:
        return await answer_question(
            db=db,
            candidate_id=str(cid_uuid),
            question=payload.question,
            top_k=payload.top_k,
        )
    except Exception as exc:
        import logging as _logging
        _logging.getLogger(__name__).exception("RAG pipeline error for candidate %s", payload.candidate_id)
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your question. Please try again later."
        )


@router.post("/search")
@limiter.limit("30/minute")
async def search_documents(
    request: Request,
    payload: DocumentSearchQuery,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(*RAG_ROLES)),
):
    """
    **Global semantic document search across all candidates.**

    Use a natural-language search term to find candidates whose ingested
    documents (resumes, trade certificates, credentials) are most relevant.

    Examples:
    - `"licensed electrician with high voltage experience"`
    - `"trade certificate Pakistan electrical"`
    - `"5 years commercial electrical work"`
    - `"IELTS English test score"`

    Returns candidates ranked by relevance, each with:
    - Candidate profile details (name, trade, experience, nationality)
    - The matching document type and file name
    - A short excerpt of the matching text
    - A relevance score (0–1, higher = better match)

    Documents must be ingested first via `POST /rag/ingest/{candidate_id}/{doc_id}`.

    Access: admin, company_admin, migration_agent.
    """
    try:
        result = await search_candidates_by_content(
            db=db,
            search_term=payload.search_term,
            top_k=payload.top_k,
            document_type=payload.document_type,
            trade_category=payload.trade_category,
            nationality=payload.nationality,
        )
        return result
    except Exception as exc:
        import logging as _logging
        _logging.getLogger(__name__).exception("RAG search error: %s", exc)
        raise HTTPException(
            status_code=500,
            detail="An error occurred during document search. Please try again later."
        )


@router.post("/ingest/{candidate_id}/{document_id}", status_code=201)
async def ingest_document(
    candidate_id: str,
    document_id: str,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(*RAG_ROLES)),
):
    """
    Ingest an uploaded document for a candidate into the RAG vector store.

    Pipeline:
      1. Extract text from the file (PDF or DOCX).
      2. Split into overlapping chunks.
      3. Embed each chunk with OpenAI text-embedding-3-small.
      4. Store TextChunk rows in Postgres / pgvector.

    Args (path params):
      candidate_id: UUID of the CandidateProfile.
      document_id:  UUID of an existing ApplicantDocument record.

    Body: multipart/form-data with a 'file' field (.pdf or .docx).
    """
    # Validate candidate — cast str → UUID for asyncpg compatibility
    try:
        cid_uuid = uuid.UUID(candidate_id)
        did_uuid = uuid.UUID(document_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="candidate_id and document_id must be valid UUIDs")

    cand_result = await db.execute(
        select(CandidateProfile).where(CandidateProfile.id == cid_uuid)
    )
    profile = cand_result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate not found")

    # Validate document record
    doc_result = await db.execute(
        select(ApplicantDocument).where(ApplicantDocument.id == did_uuid)
    )
    doc_record = doc_result.scalar_one_or_none()
    if not doc_record:
        raise HTTPException(status_code=404, detail="Document record not found")

    # Read file bytes
    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum allowed size is 10 MB."
        )

    # ── Build rich metadata for hybrid BM25 retrieval ────────────────────────
    # Pull structured fields from the candidate profile and document record so
    # that BM25 full-text search + JSONB metadata filters work at query time.
    extra_metadata: dict = {
        "candidate_id":       candidate_id,
        "document_type":      doc_record.document_type  if hasattr(doc_record, "document_type")  else None,
        "file_name":          doc_record.file_name      if hasattr(doc_record, "file_name")      else (file.filename or "upload"),
        "candidate_name":     profile.full_name         if hasattr(profile, "full_name")         else None,
        "candidate_username": profile.username          if hasattr(profile, "username")          else None,
        "trade_category":     profile.trade_category    if hasattr(profile, "trade_category")    else None,
        "nationality":        profile.nationality       if hasattr(profile, "nationality")       else None,
        "years_experience":   profile.years_experience  if hasattr(profile, "years_experience")  else None,
        "is_electrical_worker": profile.is_electrical_worker if hasattr(profile, "is_electrical_worker") else None,
    }
    # Strip None values to keep JSONB lean
    extra_metadata = {k: v for k, v in extra_metadata.items() if v is not None}

    try:
        result = await process_and_store_document(
            db=db,
            candidate_id=candidate_id,
            source_document_id=document_id,
            file_bytes=file_bytes,
            file_name=file.filename or "upload",
            extra_metadata=extra_metadata,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

    return result


@router.get("/candidates/{candidate_id}/chunks")
async def list_text_chunks(
    candidate_id: str,
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(*RAG_ROLES)),
):
    """
    List stored text chunks for a candidate (for inspection / debugging).
    Shows chunk text (truncated to 300 chars) and whether an embedding exists.
    """
    # Cast str → UUID for asyncpg compatibility
    try:
        cid_uuid = uuid.UUID(candidate_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="candidate_id must be a valid UUID")

    result = await db.execute(
        select(TextChunk)
        .where(TextChunk.candidate_id == cid_uuid)
        .order_by(TextChunk.created_at.asc())
        .limit(limit)
    )
    chunks = result.scalars().all()

    return [
        {
            "id":                str(c.id),
            "source_document_id": str(c.source_document_id),
            "chunk_text":        c.chunk_text[:300] + "..." if len(c.chunk_text) > 300 else c.chunk_text,
            "has_embedding":     c.embedding is not None,
            "chunk_metadata":    c.chunk_metadata or {},
            "created_at":        c.created_at.isoformat() if c.created_at else None,
        }
        for c in chunks
    ]
