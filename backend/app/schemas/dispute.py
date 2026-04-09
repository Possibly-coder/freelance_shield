from typing import Optional
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from app.models.dispute import DisputeStatus


class DisputeCreate(BaseModel):
    contract_id: UUID
    milestone_id: Optional[UUID] = None
    reason: str


class DisputeResolve(BaseModel):
    resolution: str
    winner: str


class DisputeOut(BaseModel):
    id: UUID
    contract_id: UUID
    milestone_id: Optional[UUID] = None
    raised_by: UUID
    reason: str
    status: DisputeStatus
    resolution: Optional[str] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
