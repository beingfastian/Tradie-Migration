"""
RAG Service – Orchestrator
Ties together document processing, embedding, storage, and retrieval.

Three main flows:
  1. INGEST:  process_and_store_document()
              Upload → extract text → chunk → embed → store in pgvector with rich metadata

  2. QUERY:   answer_question()
              Question → metadata filter → BM25 → vector re-rank → OpenAI LLM answer

  3. SEARCH:  search_candidates_by_content()
              Lead requirement — find candidates by document content:
              Step 1: Metadata pre-filter (candidate_username, document_type, trade_category, etc.)
              Step 2: BM25 keyword search on filtered chunk set
              Step 3: pgvector semantic re-rank on BM25-shortlisted chunks
              Returns ranked list of candidates with matched document excerpts

Lead requirement:
  "pehle metadata se filter karna, then BM25, then semantic search"
  "candidate_id and candidate_username add karo metadata mein, phir linking bano,
   phir uspe search karo — ye fast hogi"
"""

import logging
import os
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from backend.processors.document_processor import process_document
from backend.vector.embeddings import embed_text, embed_texts
from backend.vector.search import store_chunks
from backend.vector.retrieval import hybrid_search, HybridRetriever, hybrid_cross_candidate_search

logger = logging.getLogger(__name__)

USE_STUB_EMBEDDINGS = os.getenv("USE_STUB_EMBEDDINGS", "false").lower() == "true"


# ── Flow 1 — Ingest ───────────────────────────────────────────────────────────

async def process_and_store_document(
    db: AsyncSession,
    candidate_id: str,
    source_document_id: str,
    file_bytes: bytes,
    file_name: str,
    extra_metadata: Optional[dict] = None,
) -> dict:
    """
    Full ingestion pipeline for one uploaded document.

    Steps:
      1. Extract text from PDF or DOCX.
      2. Split into overlapping chunks.
      3. Generate OpenAI embeddings for each chunk.
      4. Persist TextChunk rows with rich JSONB metadata per chunk.

    The metadata stored per chunk is the key to fast retrieval:
      candidate_id, candidate_username, candidate_name, document_type,
      trade_category, nationality, years_experience, is_electrical_worker

    At search time, Step 1 does SQL WHERE on these metadata fields before
    any BM25 or vector operations — this "linking" makes the whole pipeline fast.

    Args:
        db:                 Async DB session.
        candidate_id:       UUID of the CandidateProfile owner.
        source_document_id: UUID of the ApplicantDocument record.
        file_bytes:         Raw bytes of the uploaded file.
        file_name:          Original filename (used for format detection).
        extra_metadata:     Dict of candidate-level fields to embed into each chunk:
                            {
                              "candidate_username":  str,
                              "candidate_name":      str,
                              "document_type":       str,   # "trade_certificate", "resume" …
                              "trade_category":      str,   # "electrician", "plumber" …
                              "nationality":         str,
                              "years_experience":    int,
                              "is_electrical_worker": bool,
                              "country_of_residence": str,
                            }

    Returns:
        Dict with chunk_count, candidate_id, source_document_id.

    Raises:
        ValueError:   Unsupported file type or empty document.
        RuntimeError: OpenAI unavailable and stub mode is off.
    """
    logger.info("Processing document '%s' for candidate %s", file_name, candidate_id)
    chunks: List[str] = process_document(file_bytes, file_name)

    if not chunks:
        raise ValueError(f"No text could be extracted from '{file_name}'.")

    logger.info("  → %d chunks created", len(chunks))

    # Embed chunks
    if USE_STUB_EMBEDDINGS:
        logger.warning("USE_STUB_EMBEDDINGS=true — using zero vectors (dev mode)")
        embeddings = [[0.0] * 1536 for _ in chunks]
    else:
        embeddings = await embed_texts(chunks)

    # Build per-chunk metadata: base fields + chunk_index
    base_meta: dict = {
        "candidate_id": candidate_id,
        "file_name":    file_name,
        **(extra_metadata or {}),
    }
    metadata_list = [
        {**base_meta, "chunk_index": idx}
        for idx in range(len(chunks))
    ]

    stored = await store_chunks(
        db=db,
        candidate_id=candidate_id,
        source_document_id=source_document_id,
        chunks=chunks,
        embeddings=embeddings,
        metadata_list=metadata_list,
    )
    logger.info("  → %d chunks stored (with BM25 metadata)", stored)

    return {
        "candidate_id":       candidate_id,
        "source_document_id": source_document_id,
        "chunk_count":        stored,
    }


# ── Flow 2 — Query (Ask about a specific candidate) ──────────────────────────

async def answer_question(
    db: AsyncSession,
    candidate_id: str,
    question: str,
    top_k: int = 5,
) -> dict:
    """
    RAG query pipeline using LangChain LCEL + MultiQuery expansion.

    Steps:
      1. HybridRetriever: metadata filter (candidate_id) → BM25 → vector re-rank.
      2. MultiQuery: ask LLM to rephrase question twice, retrieve for each phrasing,
         deduplicate by chunk_id to broaden coverage.
      3. Build context from all unique retrieved chunks.
      4. Feed context + question to gpt-4o-mini for grounded answer.
    """
    from langchain_openai import ChatOpenAI
    from langchain_core.prompts import PromptTemplate
    from langchain_core.output_parsers import StrOutputParser

    # Step 1 — base retriever scoped to this candidate
    # HybridRetriever uses: metadata filter (candidate_id) → BM25 → vector re-rank
    base_retriever = HybridRetriever(db=db, candidate_id=candidate_id, top_k=top_k)

    llm_model = os.getenv("OPENAI_LLM_MODEL", "gpt-4o-mini")

    # Dev mode — skip OpenAI
    if USE_STUB_EMBEDDINGS:
        docs = await base_retriever.ainvoke(question)
        return {
            "candidate_id": candidate_id,
            "question":     question,
            "answer":       f"[RAG stub — dev mode] Question received: '{question}'. OpenAI not called.",
            "sources": [
                {
                    "chunk_id":           doc.metadata.get("chunk_id"),
                    "source_document_id": doc.metadata.get("source_document_id"),
                    "excerpt":            doc.page_content[:200] + "..." if len(doc.page_content) > 200 else doc.page_content,
                    "distance":           doc.metadata.get("distance", 0.0),
                    "bm25_rank":          doc.metadata.get("bm25_rank", 0.0),
                    "hybrid_score":       doc.metadata.get("hybrid_score", 0.0),
                }
                for doc in docs
            ],
            "status": "success" if docs else "no_documents",
        }

    llm = ChatOpenAI(model=llm_model, temperature=0)

    # Step 2 — MultiQuery expansion
    rephrase_prompt = PromptTemplate.from_template(
        "Generate 2 alternative phrasings of the following question to improve document retrieval. "
        "Output ONLY the 2 questions, one per line, no numbering or extra text.\n\nQuestion: {question}"
    )
    rephrase_chain = rephrase_prompt | llm | StrOutputParser()
    try:
        rephrasings_raw = await rephrase_chain.ainvoke({"question": question})
        alt_questions = [q.strip() for q in rephrasings_raw.splitlines() if q.strip()]
    except Exception:
        alt_questions = []

    # Step 3 — Retrieve for original + rephrased, deduplicate by chunk_id
    all_queries = [question] + alt_questions[:2]
    seen_ids: set = set()
    retrieved_docs = []
    for q in all_queries:
        try:
            docs = await base_retriever.ainvoke(q)
            for doc in docs:
                cid = doc.metadata.get("chunk_id")
                if cid not in seen_ids:
                    seen_ids.add(cid)
                    retrieved_docs.append(doc)
        except Exception as exc:
            logger.warning("Retrieval failed for query '%s': %s", q, exc)

    if not retrieved_docs:
        return {
            "candidate_id": candidate_id,
            "question":     question,
            "answer":       None,
            "sources":      [],
            "status":       "no_documents",
            "message":      "No document chunks found for this candidate. Upload and ingest documents first.",
        }

    # Step 4 — Build context and generate answer
    context_str = "\n\n---\n\n".join(
        f"[Source {i + 1}] {doc.page_content}"
        for i, doc in enumerate(retrieved_docs)
    )

    answer_prompt = PromptTemplate.from_template(
        "You are an AI assistant helping migration agents assess international tradespeople.\n"
        "Answer the question below using ONLY the provided context. "
        "If the context does not contain enough information, say so clearly.\n\n"
        "### Context:\n{context}\n\n"
        "### Question:\n{question}\n\n"
        "### Answer:"
    )
    chain = answer_prompt | llm | StrOutputParser()
    answer = await chain.ainvoke({"context": context_str, "question": question})

    return {
        "candidate_id": candidate_id,
        "question":     question,
        "answer":       answer,
        "sources": [
            {
                "chunk_id":           doc.metadata.get("chunk_id"),
                "source_document_id": doc.metadata.get("source_document_id"),
                "excerpt":            doc.page_content[:200] + "..." if len(doc.page_content) > 200 else doc.page_content,
                "distance":           doc.metadata.get("distance", 0.0),
                "bm25_rank":          doc.metadata.get("bm25_rank", 0.0),
                "hybrid_score":       doc.metadata.get("hybrid_score", 0.0),
            }
            for doc in retrieved_docs
        ],
        "status": "success",
    }


# ── Flow 3 — Global Candidate Search ─────────────────────────────────────────

async def search_candidates_by_content(
    db: AsyncSession,
    search_term: str,
    top_k: int = 10,
    document_type: Optional[str] = None,
    trade_category: Optional[str] = None,
    nationality: Optional[str] = None,
    candidate_username: Optional[str] = None,
    is_electrical_worker: Optional[bool] = None,
    years_experience_min: Optional[int] = None,
) -> dict:
    """
    Hybrid BM25 + semantic search across ALL candidates' ingested documents.

    Lead requirement — 3-step pipeline that makes this fast:
      Step 1: Metadata pre-filter
              SQL WHERE on JSONB chunk_metadata fields:
              candidate_username, document_type, trade_category, nationality,
              is_electrical_worker, years_experience
              → instantly narrows chunk pool from millions to thousands

      Step 2: BM25 keyword pre-filter
              PostgreSQL plainto_tsquery on bm25_text column (GIN indexed)
              → sub-millisecond keyword scoring on already-filtered set

      Step 3: pgvector cosine re-rank
              Semantic vector scan ONLY on the small BM25-shortlisted chunk IDs
              → expensive operation runs on tiny subset, not entire table

    Returns one best-matching chunk per candidate, enriched with full profile data.

    Args:
        search_term:          Natural language search string.
        top_k:                Max candidates to return.
        document_type:        Metadata filter — narrows to specific doc type.
        trade_category:       Metadata filter — narrows to specific trade.
        nationality:          Metadata filter — narrows to specific nationality.
        candidate_username:   Metadata filter — scope to one candidate's docs.
        is_electrical_worker: Metadata filter — electrical workers only.
        years_experience_min: Post-filter on profile — minimum years experience.
    """
    import uuid as _uuid
    from sqlalchemy import select as _select
    from backend.db.models.models import CandidateProfile

    # Embed the search term for semantic re-rank (Step 3)
    if USE_STUB_EMBEDDINGS:
        query_vector = [0.0] * 1536
    else:
        query_vector = await embed_text(search_term)

    # Run hybrid cross-candidate search
    # Steps 1 (metadata) → 2 (BM25) → 3 (vector re-rank) happen inside here
    hits = await hybrid_cross_candidate_search(
        db=db,
        query=search_term,
        query_embedding=query_vector,
        document_type=document_type,
        trade_category=trade_category,
        nationality=nationality,
        candidate_username=candidate_username,
        is_electrical_worker=is_electrical_worker,
        top_k=top_k,
        bm25_top_n=top_k * 10,
    )

    # Normalise hit keys to consistent format
    hits = [
        {
            "candidate_id":       h["candidate_id"],
            "chunk_id":           h["id"],
            "chunk_text":         h["chunk_text"],
            "source_document_id": h["source_document_id"],
            "document_type":      h["chunk_metadata"].get("document_type"),
            "file_name":          h["chunk_metadata"].get("file_name"),
            "distance":           h["distance"],
            "hybrid_score":       h["hybrid_score"],
            "bm25_rank":          h["bm25_rank"],
        }
        for h in hits
    ]

    if not hits:
        return {
            "search_term": search_term,
            "results":     [],
            "total":       0,
            "status":      "no_matches",
            "message":     (
                "No ingested documents matched the search term. "
                "Documents must be ingested via POST /rag/ingest/{candidate_id}/{doc_id} first."
            ),
        }

    # Enrich hits with candidate profile data
    candidate_ids = [_uuid.UUID(h["candidate_id"]) for h in hits]
    profiles_res = await db.execute(
        _select(CandidateProfile).where(CandidateProfile.id.in_(candidate_ids))
    )
    profiles = {str(p.id): p for p in profiles_res.scalars().all()}

    results = []
    for hit in hits:
        profile = profiles.get(hit["candidate_id"])

        # Apply years_experience_min post-filter (int comparison, not JSONB)
        if years_experience_min is not None and profile:
            exp = profile.years_experience or 0
            if exp < years_experience_min:
                continue

        excerpt = hit["chunk_text"]
        results.append({
            "candidate_id":     hit["candidate_id"],
            "relevance_score":  round(hit.get("hybrid_score", 1 - hit["distance"]), 4),
            "bm25_rank":        round(hit.get("bm25_rank", 0.0), 6),
            "match_excerpt":    excerpt[:300] + "..." if len(excerpt) > 300 else excerpt,
            "matched_document": {
                "document_id":   hit["source_document_id"],
                "document_type": hit["document_type"],
                "file_name":     hit["file_name"],
            },
            "candidate": {
                "full_name":            profile.full_name            if profile else None,
                # username returned so callers can link back to candidate profile
                "username":             profile.username             if profile else None,
                "trade_category":       profile.trade_category       if profile else None,
                "nationality":          profile.nationality          if profile else None,
                "country_of_residence": profile.country_of_residence if profile else None,
                "years_experience":     profile.years_experience     if profile else None,
                "is_electrical_worker": profile.is_electrical_worker if profile else None,
                "published":            profile.published            if profile else None,
            },
        })

    return {
        "search_term": search_term,
        "results":     results,
        "total":       len(results),
        "status":      "success",
    }


# Alias — kept for backward compatibility
CandidateRetriever = HybridRetriever