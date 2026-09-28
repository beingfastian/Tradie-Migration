# Backend — Tradie Migration API

FastAPI · async SQLAlchemy 2 · PostgreSQL + pgvector · LangChain/OpenAI (RAG)

## Structure

```
Backend/
├── app/                    Python package (imported as `app.*`)
│   ├── main.py             FastAPI entry point — routers, CORS, /docs
│   ├── api/
│   │   ├── routes/         One router per feature (auth, candidates, employers, eoi, jobs, ...)
│   │   ├── dependencies/   RBAC: get_current_user, require_roles
│   │   └── schemas/        Pydantic request/response models
│   ├── db/                 Engine/session (setup.py) and ORM models
│   ├── processors/         Document text extraction, electrical scoring
│   ├── services/           RAG service
│   ├── vector/             Embeddings, pgvector + BM25 hybrid retrieval
│   ├── utils/              JWT/password, email, file storage, email validation
│   └── domain/             Reserved for domain enums (empty)
├── alembic/                DB migrations (alembic.ini)
├── scripts/                seed_demo_data.py, create_db.py
│   └── dev/                Manual endpoint/API analysis scripts
├── tests/                  Main pytest suite (unit / integration / security)
├── tests_legacy/           Older test suite (kept for reference)
├── docs/                   User guide, schema & problem statement
├── uploads/                Local document storage (gitignored)
├── docker-compose.yml      PostgreSQL 15 + pgvector
├── requirements.txt
└── .env.example
```

## Run

All commands are run from this `Backend/` folder.

```bash
docker-compose up -d                               # database on localhost:5433
pip install -r requirements.txt
copy .env.example .env                             # fill in values
python -m uvicorn app.main:app --reload --port 8000
python -m scripts.seed_demo_data                   # optional demo data
```

## Test

```bash
python -m pytest tests/unit           # no database needed
python -m pytest                      # full suite (needs the tradie_test DB, see tests/.env.test)
```

## Migrations

```bash
python -m alembic upgrade head
python -m alembic revision --autogenerate -m "describe change"
```
