"""
RAG Router – AI-powered document Q&A + candidate search.

Endpoints:
  POST /rag/ask                              – Ask a question about a candidate's documents
  POST /rag/search                           – Search across all candidates by document content (BM25 + semantic)
  POST /rag/ingest/{candidate_id}/{doc_id}  – Ingest a document (extract → chunk → embed → store)
  GET  /rag/candidates/{candidate_id}/chunks – List stored text chunks (debug)

Access: admin, company_admin, migration_agent, employer.

Lead requirement:
  - Metadata stored per chunk: candidate_id, candidate_username, document_type, trade_category, nationality, etc.
  - Search pipeline: metadata filter FIRST → BM25 on filtered set → semantic re-rank
  - This "linking" makes search fast — expensive vector scan only runs on already-narrowed chunk set
  - Search returns relevant resumes and credential documents tagged to candidates
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

# employer added so company dashboard can use /rag/search to find candidates
RAG_ROLES = ("admin", "company_admin", "migration_agent", "employer")


# ── Schemas ───────────────────────────────────────────────────────────────────

class RAGQuery(BaseModel):
    candidate_id: str
    question: str = Field(..., min_length=3, max_length=1000)
    top_k: int = Field(default=5, ge=1, le=20)


class DocumentSearchQuery(BaseModel):
    """
    Search across all ingested candidate documents using BM25 + semantic search.

    Lead requirement:
      - Filter by metadata fields FIRST (fast SQL WHERE on JSONB chunk_metadata)
      - Then BM25 keyword search on the filtered chunk set
      - Then semantic vector re-rank on BM25 results

    Filter fields map directly to chunk_metadata keys stored during ingest:
      candidate_id, candidate_username, document_type, trade_category,
      nationality, is_electrical_worker, years_experience
    """
    search_term: str = Field(
        ..., min_length=2, max_length=500,
        description=(
            "Natural-language search term. Examples:\n"
            "  'licensed electrician high voltage'\n"
            "  'trade certificate Pakistan electrical'\n"
            "  '5 years commercial electrical work'\n"
            "  'IELTS English test score'"
        )
    )
    top_k: int = Field(default=10, ge=1, le=50, description="Max number of candidates to return")

    # ── Metadata pre-filter fields (Step 1 — narrows chunk set before BM25) ──
    document_type: Optional[str] = Field(
        None,
        description=(
            "Filter by document type stored in chunk metadata.\n"
            "Values: resume | trade_certificate | passport | safety_certificate | "
            "english_test | reference_letter | employment_reference | visa_application"
        )
    )
    trade_category: Optional[str] = Field(
        None,
        description="Filter by candidate trade. Examples: electrician | plumber | welder | carpenter"
    )
    nationality: Optional[str] = Field(
        None,
        description="Filter by candidate nationality stored in chunk metadata. Example: 'Pakistani'"
    )
    candidate_username: Optional[str] = Field(
        None,
        description=(
            "Filter chunks to a specific candidate by their username.\n"
            "Useful when you want to search within one candidate's documents only."
        )
    )
    is_electrical_worker: Optional[bool] = Field(
        None,
        description="Filter to only electrical workers (true) or only non-electrical (false)"
    )
    years_experience_min: Optional[int] = Field(
        None, ge=0, le=70,
        description="Only return candidates with at least this many years of experience"
    )


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

    Pipeline:
      1. Embed question.
      2. Metadata filter on candidate_id → BM25 pre-filter → pgvector cosine re-rank.
      3. Pass top-K chunks as context to gpt-4o-mini.
      4. Returns grounded answer + source excerpts.

    Returns status='no_documents' if the candidate has no ingested chunks yet.
    In dev mode (USE_STUB_EMBEDDINGS=true) returns a stub answer without calling OpenAI.
    """
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
    Global hybrid document search across all candidates.

    Lead requirement — 3-step pipeline:
      Step 1: Metadata pre-filter (SQL WHERE on JSONB chunk_metadata)
              → narrows chunk pool by candidate_username, document_type,
                trade_category, nationality, is_electrical_worker instantly
      Step 2: BM25 keyword search (PostgreSQL plainto_tsquery on bm25_text)
              → sub-millisecond keyword scoring on metadata-filtered set
      Step 3: pgvector semantic re-rank on BM25-shortlisted chunk IDs
              → expensive cosine scan ONLY on already-narrowed small set

    Returns candidates ranked by relevance with:
      - Candidate profile details (name, username, trade, experience, nationality)
      - Matched document type and file name
      - Excerpt of matching text
      - Hybrid relevance score (0–1)

    Documents must be ingested first via POST /rag/ingest/{candidate_id}/{doc_id}.
    """
    try:
        result = await search_candidates_by_content(
            db=db,
            search_term=payload.search_term,
            top_k=payload.top_k,
            document_type=payload.document_type,
            trade_category=payload.trade_category,
            nationality=payload.nationality,
            candidate_username=payload.candidate_username,
            is_electrical_worker=payload.is_electrical_worker,
            years_experience_min=payload.years_experience_min,
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
      4. Store TextChunk rows with rich JSONB metadata for hybrid BM25 + semantic retrieval.

    Metadata stored per chunk (enables fast metadata pre-filter at search time):
      candidate_id, candidate_username, candidate_name, document_type,
      trade_category, nationality, years_experience, is_electrical_worker

    Args (path params):
      candidate_id: UUID of the CandidateProfile.
      document_id:  UUID of an existing ApplicantDocument record.

    Body: multipart/form-data with a 'file' field (.pdf or .docx, max 10 MB).
    """
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

    doc_result = await db.execute(
        select(ApplicantDocument).where(ApplicantDocument.id == did_uuid)
    )
    doc_record = doc_result.scalar_one_or_none()
    if not doc_record:
        raise HTTPException(status_code=404, detail="Document record not found")

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum allowed size is 10 MB.")

    # ── Build rich metadata for hybrid BM25 retrieval ────────────────────────
    # These fields are stored in chunk_metadata JSONB on every chunk.
    # At search time: metadata pre-filter (Step 1) queries these fields with
    # SQL WHERE before BM25 (Step 2) and vector re-rank (Step 3).
    # This "linking" of candidate identity to each chunk makes search fast.
    extra_metadata: dict = {
        "candidate_id":         candidate_id,
        "document_type":        doc_record.document_type  if hasattr(doc_record, "document_type")  else None,
        "file_name":            doc_record.file_name      if hasattr(doc_record, "file_name")      else (file.filename or "upload"),
        "candidate_name":       profile.full_name         if hasattr(profile, "full_name")         else None,
        "candidate_username":   profile.username          if hasattr(profile, "username")          else None,
        "trade_category":       profile.trade_category    if hasattr(profile, "trade_category")    else None,
        "nationality":          profile.nationality       if hasattr(profile, "nationality")       else None,
        "years_experience":     profile.years_experience  if hasattr(profile, "years_experience")  else None,
        "is_electrical_worker": profile.is_electrical_worker if hasattr(profile, "is_electrical_worker") else None,
        "country_of_residence": profile.country_of_residence if hasattr(profile, "country_of_residence") else None,
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
    List stored text chunks for a candidate (debug / inspection).
    Shows chunk text (truncated to 300 chars), embedding status, and stored metadata.
    """
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