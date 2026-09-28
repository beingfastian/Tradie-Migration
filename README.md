# Tradie Migration App

Platform connecting skilled tradespeople with Australian employers, migration agents and training providers.

```
./
├── Backend/    FastAPI + PostgreSQL (pgvector) API — see Backend/README.md
└── Frontend/   React 19 + Vite web app            — see Frontend/README.md
```

## Quick start

```bash
# 1. Database
cd Backend
docker-compose up -d

# 2. API (http://localhost:8000, docs at /docs)
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env          # then fill in the values
python -m uvicorn app.main:app --reload --port 8000

# 3. Web app (http://localhost:5173) — in a second terminal
cd Frontend
npm install
npm run dev
```

The full walkthrough (roles, workflows, troubleshooting) is in [Backend/docs/USER_GUIDE.md](Backend/docs/USER_GUIDE.md).
