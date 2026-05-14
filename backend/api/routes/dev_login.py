"""
DEV ONLY — Quick login endpoint for testing all three roles.
Only active when SKIP_EMAIL_VERIFICATION=true in .env

GET /auth/dev-login?role=employer           → returns JWT for test employer
GET /auth/dev-login?role=candidate          → returns JWT for test candidate
GET /auth/dev-login?role=training_provider  → returns JWT for test trainer

Creates the test user automatically if it doesn't exist yet.
Remove this file (and the import in main.py) before going to production.
"""

import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.db.setup import get_db
from backend.db.models.models import User
from backend.utils.auth import hash_password, create_access_token

router = APIRouter()

DEV_USERS = {
    "candidate": {
        "email":    "test.worker@devtest.com",
        "name":     "Test Worker",
        "password": "DevTest123",
    },
    "employer": {
        "email":    "test.employer@devtest.com",
        "name":     "Test Employer",
        "password": "DevTest123",
    },
    "training_provider": {
        "email":    "test.trainer@devtest.com",
        "name":     "Test Trainer",
        "password": "DevTest123",
    },
}

ALLOWED_ROLES = set(DEV_USERS.keys())


@router.get("/dev-login")
async def dev_login(
    role: str = Query(..., description="candidate | employer | training_provider"),
    db: AsyncSession = Depends(get_db),
):
    # Only works in dev mode
    if os.getenv("SKIP_EMAIL_VERIFICATION", "false").lower() != "true":
        raise HTTPException(
            status_code=403,
            detail="Dev login is only available when SKIP_EMAIL_VERIFICATION=true in .env",
        )

    if role not in ALLOWED_ROLES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid role. Use one of: {', '.join(ALLOWED_ROLES)}",
        )

    info = DEV_USERS[role]

    # Find or create the test user
    result = await db.execute(select(User).where(User.email == info["email"]))
    user = result.scalar_one_or_none()

    # If employer exists but has no company — create the company now
    if user and role == "employer":
        from backend.db.models.models import EmployerCompany
        co_result = await db.execute(
            select(EmployerCompany).where(EmployerCompany.owner_user_id == user.id)
        )
        if co_result.scalar_one_or_none() is None:
            db.add(EmployerCompany(
                id=uuid.uuid4(),
                owner_user_id=user.id,
                company_name="Dev Test Company Pty Ltd",
                industry="Licensed Electrical Contractor",
                verification_status="approved",
            ))
            await db.commit()

    if not user:
        user = User(
            id=uuid.uuid4(),
            cognito_sub=f"dev-{role}-{uuid.uuid4().hex}",
            role=role,
            email=info["email"],
            password_hash=hash_password(info["password"]),
            status="active",
            email_verified=True,
        )
        db.add(user)

        # Auto-create candidate profile stub
        if role == "candidate":
            from backend.db.models.models import CandidateProfile
            stub = CandidateProfile(
                id=uuid.uuid4(),
                user_id=user.id,
                full_name=info["name"],
            )
            db.add(stub)

        # Auto-create approved company for employer
        if role == "employer":
            from backend.db.models.models import EmployerCompany
            company = EmployerCompany(
                id=uuid.uuid4(),
                owner_user_id=user.id,
                company_name="Dev Test Company Pty Ltd",
                industry="Licensed Electrical Contractor",
                verification_status="approved",
            )
            db.add(company)

        await db.commit()
        await db.refresh(user)

    # Mint token
    token = create_access_token({
        "user_id": str(user.id),
        "email":   user.email,
        "role":    user.role,
    })

    return {
        "access_token": token,
        "role":         user.role,
        "user_id":      str(user.id),
        "email":        user.email,
    }
