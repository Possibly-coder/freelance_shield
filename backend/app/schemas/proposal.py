from typing import Optional
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from app.models.proposal import ProposalStatus
from app.schemas.user import UserOut


class ProposalCreate(BaseModel):
    project_id: UUID
    cover_letter: str
    proposed_amount: float
    estimated_duration: Optional[str] = None


class ProposalOut(BaseModel):
    id: UUID
    project_id: UUID
    freelancer_id: UUID
    cover_letter: str
    proposed_amount: float
    estimated_duration: Optional[str] = None
    status: ProposalStatus
    created_at: datetime
    freelancer: Optional[UserOut] = None

    model_config = {"from_attributes": True}
