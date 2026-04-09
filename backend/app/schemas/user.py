from typing import Optional
from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from app.models.user import UserRole


class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str
    role: UserRole = UserRole.BOTH


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: UUID
    email: str
    name: str
    role: UserRole
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
