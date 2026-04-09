from typing import Optional, List
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from app.models.contract import ContractStatus
from app.schemas.milestone import MilestoneCreate, MilestoneOut
from app.schemas.user import UserOut


class ContractCreate(BaseModel):
    title: str
    description: Optional[str] = None
    total_amount: float
    currency: str = "INR"
    auto_release_days: int = 7
    milestones: List[MilestoneCreate] = []


class ContractUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ContractStatus] = None


class ContractOut(BaseModel):
    id: UUID
    title: str
    description: Optional[str] = None
    client_id: UUID
    freelancer_id: Optional[UUID] = None
    status: ContractStatus
    total_amount: float
    currency: str
    auto_release_days: int = 7
    invite_token: str
    created_at: datetime
    signed_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    milestones: List[MilestoneOut] = []
    client: Optional[UserOut] = None
    freelancer: Optional[UserOut] = None

    model_config = {"from_attributes": True}


class ContractListOut(BaseModel):
    id: UUID
    title: str
    status: ContractStatus
    total_amount: float
    currency: str
    created_at: datetime
    client: Optional[UserOut] = None
    freelancer: Optional[UserOut] = None

    model_config = {"from_attributes": True}
