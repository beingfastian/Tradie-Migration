"""
Hybrid BM25 + Semantic Retrieval
=================================
Three-step pipeline for fast, high-precision document search:

  Step 1 — Metadata pre-filter (SQL WHERE on JSONB chunk_metadata)
            Instantly narrows the candidate pool by structured fields
            (candidate_id, document_type, trade_category, nationality …)

  Step 2 — BM25 keyword pre-filter (PostgreSQL full-text search on bm25_text)
            Uses ts_vector / plainto_tsquery with a GIN index for sub-millisecond
            keyword relevance scoring over the metadata-filtered chunk set.
            Returns top-N candidate chunks ordered by BM25 ts_rank.

  Step 3 — Semantic re-rank (pgvector cosine distance on the BM25-filtered set)
            Runs the expensive vector scan ONLY on the small BM25-shortlisted
            chunk IDs — dramatically reducing the search space while keeping
            top semantic precision.

Usage:
    from backend.vector.retrieval import hybrid_search, HybridRetriever

    # Direct async function
    results = await hybrid_search(
        db=db,
        query="certified electrician with 5 years experience",
        query_embedding=[0.1, 0.2, ...],   # 1536 floats
        filters={"candidate_id": "uuid-str", "document_type": "trade_certificate"},
        bm25_top_n=50,   # BM25 pre-filter keeps top 50 chunks
        final_top_k=5,   # semantic re-rank returns top 5
    )

    # LangChain BaseRetriever wrapper
    retriever = HybridRetriever(db=db, candidate_id="uuid-str", top_k=5)
    docs = await retriever.ainvoke("certified electrician")
"""

import logging
import os
from typing import Any, Dict, List, Optional

from langchain_core.callbacks import CallbackManagerForRetrieverRun
from langchain_core.documents import Document
from langchain_core.retrievers import BaseRetriever
from pydantic import Field
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

USE_STUB_EMBEDDINGS = os.getenv("USE_STUB_EMBEDDINGS", "false").lower() == "true"


def _pgvector_enabled() -> bool:
    return os.getenv("PGVECTOR_PG_EXTENSION_OK", "false").lower() == "true"


# ── Core hybrid search function ───────────────────────────────────────────────

async def hybrid_search(
    db: AsyncSession,
    query: str,
    query_embedding: List[float],
    filters: Optional[Dict[str, Any]] = None,
    bm25_top_n: int = 50,
    final_top_k: int = 5,
    min_bm25_rank: float = 0.0,
) -> List[Dict[str, Any]]:
    """
    Three-step hybrid search: metadata filter → BM25 pre-filter → vector re-rank.

    Args:
        db:              Async SQLAlchemy session.
        query:           Raw query string used for BM25 full-text search.
        query_embedding: 1536-dim embedding of the query (used in step 3).
        filters:         Optional dict of JSONB metadata fields to pre-filter on.
                         Supported keys: candidate_id, document_type, trade_category,
                         nationality, is_electrical_worker, candidate_username.
                         String values use exact equality; bool/int use cast comparison.
        bm25_top_n:      How many chunks BM25 step shortlists for re-ranking.
        final_top_k:     Final number of chunks returned after semantic re-rank.
        min_bm25_rank:   Minimum ts_rank score to include (0 = include all BM25 hits).

    Returns:
        List of dicts with keys:
          id, chunk_text, source_document_id, chunk_metadata,
          bm25_rank, distance, hybrid_score, candidate_id
    """
    filters = filters or {}

    # ── Step 1: Build metadata WHERE clause ───────────────────────────────────
    # We filter on JSONB operator ->> for string fields and cast for typed fields
    meta_conditions = []
    meta_params: Dict[str, Any] = {}

    _JSONB_STRING_FIELDS = {
        "candidate_id", "candidate_username", "document_type",
        "trade_category", "nationality", "file_name",
    }
    _JSONB_BOOL_FIELDS = {"is_electrical_worker"}
    _JSONB_INT_FIELDS = {"years_experience", "chunk_index"}

    for field, value in filters.items():
        param_key = f"meta_{field}"
        if field in _JSONB_STRING_FIELDS:
            meta_conditions.append(f"chunk_metadata ->> '{field}' = :{param_key}")
            meta_params[param_key] = str(value)
        elif field in _JSONB_BOOL_FIELDS:
            meta_conditions.append(
                f"(chunk_metadata ->> '{field}')::boolean = :{param_key}"
            )
            meta_params[param_key] = bool(value)
        elif field in _JSONB_INT_FIELDS:
            meta_conditions.append(
                f"(chunk_metadata ->> '{field}')::integer = :{param_key}"
            )
            meta_params[param_key] = int(value)

    # Also support direct SQL column filter for candidate_id (UUID column)
    # so callers can pass candidate_id as either a filter key or rely on the
    # JSONB metadata — here we honour the JSONB path only (more flexible).

    meta_where = ("AND " + " AND ".join(meta_conditions)) if meta_conditions else ""

    # ── Step 2: BM25 via PostgreSQL full-text search ──────────────────────────
    bm25_params: Dict[str, Any] = {
        **meta_params,
        "query_str": query,
        "bm25_top_n": bm25_top_n,
        "min_rank": min_bm25_rank,
    }

    bm25_sql = text(f"""
        SELECT
            tc.id,
            tc.chunk_text,
            tc.source_document_id,
            tc.chunk_metadata,
            tc.candidate_id,
            tc.embedding,
            ts_rank(
                to_tsvector('english', COALESCE(tc.bm25_text, tc.chunk_text, '')),
                plainto_tsquery('english', :query_str)
            ) AS bm25_rank
        FROM text_chunks tc
        WHERE
            to_tsvector('english', COALESCE(tc.bm25_text, tc.chunk_text, ''))
                @@ plainto_tsquery('english', :query_str)
            {meta_where}
            AND ts_rank(
                to_tsvector('english', COALESCE(tc.bm25_text, tc.chunk_text, '')),
                plainto_tsquery('english', :query_str)
            ) >= :min_rank
        ORDER BY bm25_rank DESC
        LIMIT :bm25_top_n
    """)

    bm25_result = await db.execute(bm25_sql, bm25_params)
    bm25_rows = bm25_result.fetchall()

    if not bm25_rows:
        # ── BM25 found nothing: fall back to pure metadata-filtered vector search
        logger.debug("hybrid_search: BM25 returned 0 rows — falling back to pure vector")
        return await _fallback_vector_search(
            db=db,
            query_embedding=query_embedding,
            meta_where=meta_where,
            meta_params=meta_params,
            top_k=final_top_k,
        )

    # ── Step 3: Semantic re-rank on BM25-shortlisted chunk IDs ───────────────
    if _pgvector_enabled():
        # Extract IDs returned by BM25 and build a bm25_rank lookup
        bm25_lookup: Dict[str, float] = {
            str(row.id): float(row.bm25_rank) for row in bm25_rows
        }
        chunk_ids = list(bm25_lookup.keys())

        # Cast IDs to uuid array for IN clause
        ids_literal = ", ".join(f"'{cid}'::uuid" for cid in chunk_ids)
        vector_literal = "[" + ",".join(str(v) for v in query_embedding) + "]"

        vector_sql = text(f"""
            SELECT
                id,
                chunk_text,
                source_document_id,
                chunk_metadata,
                candidate_id,
                embedding <=> CAST(:vec AS vector) AS distance
            FROM text_chunks
            WHERE id IN ({ids_literal})
              AND embedding IS NOT NULL
            ORDER BY distance ASC
            LIMIT :top_k
        """)

        vec_result = await db.execute(vector_sql, {"vec": vector_literal, "top_k": final_top_k})
        vec_rows = vec_result.fetchall()

        results = []
        for row in vec_rows:
            row_id = str(row.id)
            bm25_rank = bm25_lookup.get(row_id, 0.0)
            distance = float(row.distance)
            similarity = max(0.0, 1.0 - distance)  # cosine similarity

            # Hybrid score: weighted combination (60% semantic, 40% BM25)
            # BM25 ts_rank is typically 0–1; normalise both to same range
            hybrid_score = round(0.6 * similarity + 0.4 * bm25_rank, 6)

            results.append({
                "id":                str(row.id),
                "chunk_text":        row.chunk_text,
                "source_document_id": str(row.source_document_id),
                "chunk_metadata":    row.chunk_metadata or {},
                "candidate_id":      str(row.candidate_id),
                "bm25_rank":         bm25_rank,
                "distance":          distance,
                "hybrid_score":      hybrid_score,
            })

        # Return sorted by hybrid score descending
        return sorted(results, key=lambda x: x["hybrid_score"], reverse=True)

    else:
        # ── pgvector not installed: use in-memory BM25 re-rank (rank-bm25) ──────
        return _inmemory_bm25_rerank(bm25_rows, query, final_top_k)


# ── Fallback: pure vector search when BM25 has no matches ────────────────────

async def _fallback_vector_search(
    db: AsyncSession,
    query_embedding: List[float],
    meta_where: str,
    meta_params: Dict[str, Any],
    top_k: int,
) -> List[Dict[str, Any]]:
    """Pure pgvector search scoped by metadata filter (no BM25 shortlist)."""
    if not _pgvector_enabled():
        return []

    vector_literal = "[" + ",".join(str(v) for v in query_embedding) + "]"

    sql = text(f"""
        SELECT
            tc.id,
            tc.chunk_text,
            tc.source_document_id,
            tc.chunk_metadata,
            tc.candidate_id,
            tc.embedding <=> CAST(:vec AS vector) AS distance
        FROM text_chunks tc
        WHERE tc.embedding IS NOT NULL
        {meta_where}
        ORDER BY distance ASC
        LIMIT :top_k
    """)

    result = await db.execute(sql, {**meta_params, "vec": vector_literal, "top_k": top_k})
    rows = result.fetchall()

    return [
        {
            "id":                str(row.id),
            "chunk_text":        row.chunk_text,
            "source_document_id": str(row.source_document_id),
            "chunk_metadata":    row.chunk_metadata or {},
            "candidate_id":      str(row.candidate_id),
            "bm25_rank":         0.0,
            "distance":          float(row.distance),
            "hybrid_score":      round(max(0.0, 1.0 - float(row.distance)), 6),
        }
        for row in rows
    ]


# ── In-memory BM25 re-rank (no pgvector fallback) ────────────────────────────

def _inmemory_bm25_rerank(rows: list, query: str, top_k: int) -> List[Dict[str, Any]]:
    """
    Uses the rank-bm25 library to rank BM25-shortlisted rows in-memory.
    Activated when pgvector is not installed in PostgreSQL.
    """
    try:
        from rank_bm25 import BM25Okapi
    except ImportError:
        logger.warning("rank-bm25 not installed — returning BM25 rows unsorted.")
        return [
            {
                "id":                str(r.id),
                "chunk_text":        r.chunk_text,
                "source_document_id": str(r.source_document_id),
                "chunk_metadata":    r.chunk_metadata or {},
                "candidate_id":      str(r.candidate_id),
                "bm25_rank":         float(r.bm25_rank),
                "distance":          0.0,
                "hybrid_score":      float(r.bm25_rank),
            }
            for r in rows[:top_k]
        ]

    corpus = [r.chunk_text.lower().split() for r in rows]
    bm25 = BM25Okapi(corpus)
    query_tokens = query.lower().split()
    scores = bm25.get_scores(query_tokens)

    ranked = sorted(
        zip(scores, rows),
        key=lambda x: x[0],
        reverse=True,
    )[:top_k]

    return [
        {
            "id":                str(row.id),
            "chunk_text":        row.chunk_text,
            "source_document_id": str(row.source_document_id),
            "chunk_metadata":    row.chunk_metadata or {},
            "candidate_id":      str(row.candidate_id),
            "bm25_rank":         float(row.bm25_rank),
            "distance":          0.0,
            "hybrid_score":      round(score, 6),
        }
        for score, row in ranked
    ]


# ── LangChain-compatible Hybrid Retriever ─────────────────────────────────────

class HybridRetriever(BaseRetriever):
    """
    LangChain BaseRetriever that wraps hybrid_search().

    Performs: metadata filter → BM25 → vector re-rank.

    Example:
        retriever = HybridRetriever(
            db=db,
            candidate_id="uuid-str",
            document_type="trade_certificate",
            top_k=5,
        )
        docs = await retriever.ainvoke("licensed electrician Brisbane")
    """

    db: Any = Field(exclude=True)
    candidate_id: Optional[str] = None
    document_type: Optional[str] = None
    trade_category: Optional[str] = None
    nationality: Optional[str] = None
    is_electrical_worker: Optional[bool] = None
    bm25_top_n: int = 50
    top_k: int = 5

    def _get_relevant_documents(
        self, query: str, *, run_manager: CallbackManagerForRetrieverRun
    ) -> List[Document]:
        raise NotImplementedError("Use async interface: ainvoke() or aget_relevant_documents()")

    async def _aget_relevant_documents(
        self, query: str, *, run_manager: CallbackManagerForRetrieverRun
    ) -> List[Document]:
        from backend.vector.embeddings import embed_text

        # Embed query
        if USE_STUB_EMBEDDINGS:
            query_embedding = [0.0] * 1536
        else:
            query_embedding = await embed_text(query)

        # Build filters dict from set attributes
        filters: Dict[str, Any] = {}
        if self.candidate_id:
            filters["candidate_id"] = self.candidate_id
        if self.document_type:
            filters["document_type"] = self.document_type
        if self.trade_category:
            filters["trade_category"] = self.trade_category
        if self.nationality:
            filters["nationality"] = self.nationality
        if self.is_electrical_worker is not None:
            filters["is_electrical_worker"] = self.is_electrical_worker

        results = await hybrid_search(
            db=self.db,
            query=query,
            query_embedding=query_embedding,
            filters=filters,
            bm25_top_n=self.bm25_top_n,
            final_top_k=self.top_k,
        )

        return [
            Document(
                page_content=r["chunk_text"],
                metadata={
                    "chunk_id":          r["id"],
                    "source_document_id": r["source_document_id"],
                    "candidate_id":      r["candidate_id"],
                    "chunk_metadata":    r["chunk_metadata"],
                    "bm25_rank":         r["bm25_rank"],
                    "distance":          r["distance"],
                    "hybrid_score":      r["hybrid_score"],
                },
            )
            for r in results
        ]


# ── Cross-candidate hybrid search ─────────────────────────────────────────────

async def hybrid_cross_candidate_search(
    db: AsyncSession,
    query: str,
    query_embedding: List[float],
    document_type: Optional[str] = None,
    trade_category: Optional[str] = None,
    nationality: Optional[str] = None,
    top_k: int = 10,
    bm25_top_n: int = 100,
) -> List[Dict[str, Any]]:
    """
    Hybrid search across ALL candidates (no candidate_id filter).

    Returns one best result per candidate, ranked by hybrid_score.
    Used by the employer 'Find Candidates' search feature.
    """
    filters: Dict[str, Any] = {}
    if document_type:
        filters["document_type"] = document_type
    if trade_category:
        filters["trade_category"] = trade_category
    if nationality:
        filters["nationality"] = nationality

    all_results = await hybrid_search(
        db=db,
        query=query,
        query_embedding=query_embedding,
        filters=filters,
        bm25_top_n=bm25_top_n,
        final_top_k=top_k * 5,   # fetch extra so we can deduplicate per candidate
    )

    # Keep the best-scoring chunk per candidate
    seen: Dict[str, Dict] = {}
    for r in all_results:
        cid = r["candidate_id"]
        if cid not in seen or r["hybrid_score"] > seen[cid]["hybrid_score"]:
            seen[cid] = r

    return sorted(seen.values(), key=lambda x: x["hybrid_score"], reverse=True)[:top_k]
