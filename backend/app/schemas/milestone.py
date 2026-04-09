from typing import Optional
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime, date
from app.models.milestone import MilestoneStatus


class MilestoneCreate(BaseModel):
    title: str
    description: Optional[str] = None
    amount: float
    due_date: Optional[date] = None
    position: int = 0


class MilestoneUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[float] = None
    due_date: Optional[date] = None


class MilestoneOut(BaseModel):
    id: UUID
    contract_id: UUID
    title: str
    description: Optional[str] = None
    amount: float
    due_date: Optional[date] = None
    position: int
    status: MilestoneStatus
    funded_at: Optional[datetime] = None
    submitted_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None
    auto_release_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
