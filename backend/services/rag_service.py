"""
RAG Service – Orchestrator
Ties together document processing, embedding, storage, and retrieval.

Two main flows:
  1. INGEST:  process_and_store_document()
              Upload → extract text → chunk → embed → store in pgvector

  2. QUERY:   answer_question()
              Question → embed → similarity search → build context → OpenAI LLM answer
"""

import logging
import os
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from backend.processors.document_processor import process_document
from backend.vector.embeddings import embed_text, embed_texts
from backend.vector.search import similarity_search, store_chunks, cross_candidate_search
from backend.vector.retrieval import hybrid_search, HybridRetriever, hybrid_cross_candidate_search

logger = logging.getLogger(__name__)

# Set USE_STUB_EMBEDDINGS=true in .env to skip real OpenAI calls during local dev/testing
USE_STUB_EMBEDDINGS = os.getenv("USE_STUB_EMBEDDINGS", "false").lower() == "true"


# ── Flow 1 — Ingest ──────────────────────────────────────────────────────────

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
      4. Persist TextChunk rows to Postgres / pgvector, with rich JSONB metadata
         that enables hybrid BM25 + semantic retrieval.

    Args:
        db:                 Async DB session.
        candidate_id:       UUID of the CandidateProfile owner.
        source_document_id: UUID of the ApplicantDocument record.
        file_bytes:         Raw bytes of the uploaded file.
        file_name:          Original filename (used for format detection).
        extra_metadata:     Optional dict with additional candidate-level fields to
                            embed into each chunk's metadata:
                            {
                              "candidate_username":  str,
                              "candidate_name":      str,
                              "document_type":       str,   # "trade_certificate", "resume" …
                              "trade_category":      str,   # "electrician", "plumber" …
                              "nationality":         str,
                              "years_experience":    int,
                              "is_electrical_worker": bool,
                            }

    Returns:
        Dict with chunk_count, candidate_id, source_document_id.

    Raises:
        ValueError:   Unsupported file type or empty document.
        RuntimeError: OpenAI unavailable and stub mode is off.
    """
    # Step 1 + 2 — extract and chunk
    logger.info(f"Processing document '{file_name}' for candidate {candidate_id}")
    chunks: List[str] = process_document(file_bytes, file_name)

    if not chunks:
        raise ValueError(f"No text could be extracted from '{file_name}'.")

    logger.info(f"  → {len(chunks)} chunks created")

    # Step 3 — embed
    if USE_STUB_EMBEDDINGS:
        logger.warning("USE_STUB_EMBEDDINGS=true — using zero vectors (dev mode)")
        embeddings = [[0.0] * 1536 for _ in chunks]
    else:
        embeddings = await embed_texts(chunks)

    # Step 4 — build per-chunk metadata for hybrid BM25 + semantic retrieval
    base_meta: dict = {
        "candidate_id":   candidate_id,
        "file_name":      file_name,
        **(extra_metadata or {}),
    }
    # Each chunk gets a copy of base metadata + its own chunk_index
    metadata_list = [
        {**base_meta, "chunk_index": idx}
        for idx in range(len(chunks))
    ]

    # Step 5 — store with metadata
    stored = await store_chunks(
        db=db,
        candidate_id=candidate_id,
        source_document_id=source_document_id,
        chunks=chunks,
        embeddings=embeddings,
        metadata_list=metadata_list,
    )
    logger.info(f"  → {stored} chunks stored (with BM25 metadata)")

    return {
        "candidate_id": candidate_id,
        "source_document_id": source_document_id,
        "chunk_count": stored,
    }


# ── Flow 3 — Global Candidate Search ─────────────────────────────────────────

async def search_candidates_by_content(
    db: AsyncSession,
    search_term: str,
    top_k: int = 10,
    document_type: str | None = None,
    trade_category: str | None = None,
    nationality: str | None = None,
) -> dict:
    """
    Hybrid BM25 + semantic search across ALL candidates' ingested documents.

    Pipeline:
      1. Metadata pre-filter (document_type, trade_category, nationality).
      2. BM25 PostgreSQL full-text pre-filter on bm25_text column.
      3. pgvector cosine re-rank on the BM25-shortlisted chunks.

    Each step narrows the candidate pool, making this significantly faster
    than a pure cross-table vector scan for large datasets.

    Returns a ranked list of candidates whose documents best match the term.
    """
    import uuid as _uuid
    from sqlalchemy import select as _select
    from backend.db.models.models import CandidateProfile, ApplicantDocument

    # Embed the search term
    if USE_STUB_EMBEDDINGS:
        query_vector = [0.0] * 1536
    else:
        query_vector = await embed_text(search_term)

    # Hybrid cross-candidate search (BM25 pre-filter + vector re-rank)
    hits = await hybrid_cross_candidate_search(
        db=db,
        query=search_term,
        query_embedding=query_vector,
        document_type=document_type,
        trade_category=trade_category,
        nationality=nationality,
        top_k=top_k,
        bm25_top_n=top_k * 10,
    )

    # Map hybrid result keys to the legacy format expected by callers
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
            "results": [],
            "total": 0,
            "status": "no_matches",
            "message": "No ingested documents matched the search term. Ingest candidate documents first.",
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
        excerpt = hit["chunk_text"]
        results.append({
            "candidate_id":    hit["candidate_id"],
            "relevance_score": round(hit.get("hybrid_score", 1 - hit["distance"]), 4),
            "bm25_rank":       round(hit.get("bm25_rank", 0.0), 6),
            "match_excerpt":   excerpt[:300] + "..." if len(excerpt) > 300 else excerpt,
            "matched_document": {
                "document_id":   hit["source_document_id"],
                "document_type": hit["document_type"],
                "file_name":     hit["file_name"],
            },
            "candidate": {
                "full_name":            profile.full_name            if profile else None,
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


# ── Retriever alias — use HybridRetriever from retrieval.py ──────────────────
# CandidateRetriever is kept as an alias so existing callers continue to work.
# New code should use HybridRetriever directly for full metadata + BM25 support.
CandidateRetriever = HybridRetriever

# ── Flow 2 — Query ────────────────────────────────────────────────────────────

async def answer_question(
    db: AsyncSession,
    candidate_id: str,
    question: str,
    top_k: int = 5,
) -> dict:
    """
    RAG query pipeline using LangChain LCEL.

    Steps:
      1. Embed question and retrieve top-K similar chunks from pgvector.
      2. (MultiQuery) Generate 2 alternative phrasings with LLM, retrieve for each,
         then deduplicate by chunk_id to broaden coverage.
      3. Feed combined unique chunks as context to LLM for final answer.
    """
    from langchain_openai import ChatOpenAI
    from langchain_core.prompts import PromptTemplate
    from langchain_core.output_parsers import StrOutputParser

    # 1. Base retriever — hybrid BM25 + semantic, scoped to this candidate
    base_retriever = HybridRetriever(db=db, candidate_id=candidate_id, top_k=top_k)

    # 2. Stub mode — skip OpenAI
    llm_model = os.getenv("OPENAI_LLM_MODEL", "gpt-4o-mini")
    if USE_STUB_EMBEDDINGS:
        docs = await base_retriever.ainvoke(question)
        return {
            "candidate_id": candidate_id,
            "question": question,
            "answer": f"[RAG stub — dev mode] Question received: '{question}'. OpenAI not called.",
            "sources": [
                {
                    "chunk_id":          doc.metadata.get("chunk_id"),
                    "source_document_id": doc.metadata.get("source_document_id"),
                    "excerpt":           doc.page_content[:200] + "..." if len(doc.page_content) > 200 else doc.page_content,
                    "distance":          doc.metadata.get("distance", 0.0),
                    "bm25_rank":         doc.metadata.get("bm25_rank", 0.0),
                    "hybrid_score":      doc.metadata.get("hybrid_score", 0.0),
                }
                for doc in docs
            ],
            "status": "success" if docs else "no_documents",
        }

    llm = ChatOpenAI(model=llm_model, temperature=0)

    # 3. Multi-query expansion: ask LLM to rephrase the question twice
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

    # 4. Retrieve for original + rephrased questions, deduplicate by chunk_id
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
            logger.warning(f"Retrieval failed for query '{q}': {exc}")

    if not retrieved_docs:
        return {
            "candidate_id": candidate_id,
            "question": question,
            "answer": None,
            "sources": [],
            "status": "no_documents",
            "message": "No document chunks found for this candidate. Upload and process documents first.",
        }

    # 5. Build context and run answer LLM
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
        "question": question,
        "answer": answer,
        "sources": [
            {
                "chunk_id":          doc.metadata.get("chunk_id"),
                "source_document_id": doc.metadata.get("source_document_id"),
                "excerpt":           doc.page_content[:200] + "..." if len(doc.page_content) > 200 else doc.page_content,
                "distance":          doc.metadata.get("distance", 0.0),
                "bm25_rank":         doc.metadata.get("bm25_rank", 0.0),
                "hybrid_score":      doc.metadata.get("hybrid_score", 0.0),
            }
            for doc in retrieved_docs
        ],
        "status": "success",
    }
