from __future__ import annotations

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.waitlist import Waitlist, WaitlistRole

router = APIRouter()


class WaitlistSignup(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    role: WaitlistRole = WaitlistRole.BOTH
    referral_source: Optional[str] = None


class WaitlistResponse(BaseModel):
    message: str
    position: int


@router.post("/", response_model=WaitlistResponse)
async def join_waitlist(data: WaitlistSignup, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(Waitlist).where(Waitlist.email == data.email))
    if existing.scalar_one_or_none():
        count = await db.execute(select(func.count()).select_from(Waitlist))
        total = count.scalar() or 0
        raise HTTPException(status_code=400, detail=f"You're already on the waitlist! Position #{total}")

    entry = Waitlist(
        email=data.email,
        name=data.name,
        role=data.role,
        referral_source=data.referral_source,
    )
    db.add(entry)
    await db.flush()

    count = await db.execute(select(func.count()).select_from(Waitlist))
    position = count.scalar() or 1

    return WaitlistResponse(message="You're on the list!", position=position)


@router.get("/count")
async def waitlist_count(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(func.count()).select_from(Waitlist))
    return {"count": result.scalar() or 0}
