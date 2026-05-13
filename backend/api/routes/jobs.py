"""
Jobs Router – Job postings by approved employer companies.

Endpoints:
  POST /jobs/                    – employer creates a job posting
  GET  /jobs/                    – list published job postings (any authenticated user)
  GET  /jobs/{id}                – get single job posting
  PUT  /jobs/{id}                – employer updates own job
  PUT  /jobs/{id}/status         – employer updates job status
  DELETE /jobs/{id}              – employer deletes own job
"""

import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from backend.db.setup import get_db
from backend.api.dependencies.rbac import get_current_user, require_roles
from backend.db.models.models import JobPosting, EmployerCompany, User

router = APIRouter()

ALLOWED_STATUSES = {"Hiring", "Closing Soon", "On Hold", "Draft"}


# ── Schemas ───────────────────────────────────────────────────────────────────

class JobCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    trade_category: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    visa_sponsorship: Optional[str] = None
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    currency: Optional[str] = None
    company_vehicle: bool = False
    overtime: bool = False
    superannuation: bool = False
    role_overview: Optional[str] = None
    key_requirements: Optional[str] = None
    benefits: Optional[str] = None
    responsibilities: Optional[str] = None
    status: str = "Hiring"


class JobUpdate(BaseModel):
    title: Optional[str] = None
    trade_category: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    visa_sponsorship: Optional[str] = None
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    currency: Optional[str] = None
    company_vehicle: Optional[bool] = None
    overtime: Optional[bool] = None
    superannuation: Optional[bool] = None
    role_overview: Optional[str] = None
    key_requirements: Optional[str] = None
    benefits: Optional[str] = None
    responsibilities: Optional[str] = None


# ── Helpers ───────────────────────────────────────────────────────────────────

async def _get_approved_company(user_id, db) -> EmployerCompany:
    result = await db.execute(
        select(EmployerCompany).where(EmployerCompany.owner_user_id == user_id)
    )
    company = result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found. Please register your company first.")
    if company.verification_status != "approved":
        raise HTTPException(
            status_code=403,
            detail=f"Your company is '{company.verification_status}'. Admin approval required to post jobs."
        )
    return company


def _job_dict(j: JobPosting, company_name: str = None) -> dict:
    return {
        "id": str(j.id),
        "employer_company_id": str(j.employer_company_id),
        "company_name": company_name or (j.employer_company.company_name if j.employer_company else None),
        "title": j.title,
        "trade_category": j.trade_category,
        "location": j.location,
        "employment_type": j.employment_type,
        "visa_sponsorship": j.visa_sponsorship,
        "min_salary": j.min_salary,
        "max_salary": j.max_salary,
        "currency": j.currency,
        "company_vehicle": j.company_vehicle,
        "overtime": j.overtime,
        "superannuation": j.superannuation,
        "role_overview": j.role_overview,
        "key_requirements": j.key_requirements,
        "benefits": j.benefits,
        "responsibilities": j.responsibilities,
        "status": j.status,
        "created_at": j.created_at.isoformat() if j.created_at else None,
        "updated_at": j.updated_at.isoformat() if j.updated_at else None,
    }


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/", status_code=201)
async def create_job(
    payload: JobCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("employer")),
):
    """Employer posts a new job role. Company must be approved."""
    company = await _get_approved_company(current_user.id, db)

    if payload.status not in ALLOWED_STATUSES:
        payload.status = "Hiring"

    job = JobPosting(
        id=uuid.uuid4(),
        employer_company_id=company.id,
        **payload.model_dump(),
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return _job_dict(job, company.company_name)


@router.get("/")
async def list_jobs(
    trade_category: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    employer_company_id: Optional[str] = Query(None),
    limit: int = Query(50, le=200),
    offset: int = Query(0),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """
    List job postings. Candidates browse all active jobs.
    Employers can filter by their own company_id.
    """
    filters = []
    if trade_category:
        filters.append(JobPosting.trade_category == trade_category)
    if location:
        filters.append(JobPosting.location.ilike(f"%{location}%"))
    if status:
        filters.append(JobPosting.status == status)
    if employer_company_id:
        try:
            co_uuid = uuid.UUID(employer_company_id)
            filters.append(JobPosting.employer_company_id == co_uuid)
        except ValueError:
            raise HTTPException(status_code=422, detail="employer_company_id must be a valid UUID")

    query = (
        select(JobPosting, EmployerCompany.company_name)
        .join(EmployerCompany, JobPosting.employer_company_id == EmployerCompany.id)
        .where(and_(*filters) if filters else True)
        .order_by(JobPosting.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(query)
    rows = result.all()
    return [_job_dict(job, name) for job, name in rows]


@router.get("/{job_id}")
async def get_job(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """Get a single job posting by ID."""
    try:
        job_uuid = uuid.UUID(job_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="job_id must be a valid UUID")

    result = await db.execute(
        select(JobPosting, EmployerCompany.company_name)
        .join(EmployerCompany, JobPosting.employer_company_id == EmployerCompany.id)
        .where(JobPosting.id == job_uuid)
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Job posting not found")
    job, name = row
    return _job_dict(job, name)


@router.put("/{job_id}/status")
async def update_job_status(
    job_id: str,
    status: str = Query(..., description="New status: Hiring | Closing Soon | On Hold | Draft"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("employer")),
):
    """Update the status of a job posting. Employer must own the posting."""
    if status not in ALLOWED_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Allowed: {', '.join(ALLOWED_STATUSES)}")

    company = await _get_approved_company(current_user.id, db)

    try:
        job_uuid = uuid.UUID(job_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="job_id must be a valid UUID")

    result = await db.execute(
        select(JobPosting).where(
            and_(JobPosting.id == job_uuid, JobPosting.employer_company_id == company.id)
        )
    )
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found or you don't own it")

    job.status = status
    await db.commit()
    await db.refresh(job)
    return _job_dict(job, company.company_name)


@router.put("/{job_id}")
async def update_job(
    job_id: str,
    payload: JobUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("employer")),
):
    """Update a job posting. Employer must own the posting."""
    company = await _get_approved_company(current_user.id, db)

    try:
        job_uuid = uuid.UUID(job_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="job_id must be a valid UUID")

    result = await db.execute(
        select(JobPosting).where(
            and_(JobPosting.id == job_uuid, JobPosting.employer_company_id == company.id)
        )
    )
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found or you don't own it")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(job, field, value)

    await db.commit()
    await db.refresh(job)
    return _job_dict(job, company.company_name)


@router.delete("/{job_id}", status_code=204)
async def delete_job(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("employer")),
):
    """Delete a job posting. Employer must own the posting."""
    company = await _get_approved_company(current_user.id, db)

    try:
        job_uuid = uuid.UUID(job_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="job_id must be a valid UUID")

    result = await db.execute(
        select(JobPosting).where(
            and_(JobPosting.id == job_uuid, JobPosting.employer_company_id == company.id)
        )
    )
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found or you don't own it")

    await db.delete(job)
    await db.commit()
    return None
