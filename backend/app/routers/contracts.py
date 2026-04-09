from __future__ import annotations

from uuid import UUID
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models.user import User
from app.models.contract import Contract, ContractStatus
from app.models.milestone import Milestone
from app.schemas.contract import ContractCreate, ContractUpdate, ContractOut, ContractListOut
from app.middleware.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=ContractOut, status_code=status.HTTP_201_CREATED)
async def create_contract(
    data: ContractCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contract = Contract(
        title=data.title,
        description=data.description,
        client_id=current_user.id,
        total_amount=data.total_amount,
        currency=data.currency,
        auto_release_days=data.auto_release_days,
    )
    db.add(contract)
    await db.flush()

    for i, m in enumerate(data.milestones):
        milestone = Milestone(
            contract_id=contract.id,
            title=m.title,
            description=m.description,
            amount=m.amount,
            due_date=m.due_date,
            position=m.position if m.position else i,
        )
        db.add(milestone)

    await db.flush()
    result = await db.execute(
        select(Contract)
        .options(selectinload(Contract.milestones), selectinload(Contract.client), selectinload(Contract.freelancer))
        .where(Contract.id == contract.id)
    )
    return ContractOut.model_validate(result.scalar_one())


@router.get("/", response_model=list[ContractListOut])
async def list_contracts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Contract)
        .options(selectinload(Contract.client), selectinload(Contract.freelancer))
        .where(or_(Contract.client_id == current_user.id, Contract.freelancer_id == current_user.id))
        .order_by(Contract.created_at.desc())
    )
    return [ContractListOut.model_validate(c) for c in result.scalars().all()]


@router.get("/invite/{token}", response_model=ContractOut)
async def get_contract_by_invite(token: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Contract)
        .options(selectinload(Contract.milestones), selectinload(Contract.client), selectinload(Contract.freelancer))
        .where(Contract.invite_token == token)
    )
    contract = result.scalar_one_or_none()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    return ContractOut.model_validate(contract)


@router.post("/invite/{token}/accept", response_model=ContractOut)
async def accept_contract(
    token: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Contract)
        .options(selectinload(Contract.milestones), selectinload(Contract.client), selectinload(Contract.freelancer))
        .where(Contract.invite_token == token)
    )
    contract = result.scalar_one_or_none()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    if contract.client_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot accept your own contract")
    if contract.freelancer_id is not None:
        raise HTTPException(status_code=400, detail="Contract already accepted")

    contract.freelancer_id = current_user.id
    contract.status = ContractStatus.ACTIVE
    contract.signed_at = datetime.now(timezone.utc)
    await db.flush()
    await db.refresh(contract)
    return ContractOut.model_validate(contract)


@router.get("/{contract_id}", response_model=ContractOut)
async def get_contract(
    contract_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Contract)
        .options(selectinload(Contract.milestones), selectinload(Contract.client), selectinload(Contract.freelancer))
        .where(Contract.id == contract_id)
    )
    contract = result.scalar_one_or_none()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    if contract.client_id != current_user.id and contract.freelancer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not a party to this contract")
    return ContractOut.model_validate(contract)


@router.patch("/{contract_id}", response_model=ContractOut)
async def update_contract(
    contract_id: UUID,
    data: ContractUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Contract)
        .options(selectinload(Contract.milestones), selectinload(Contract.client), selectinload(Contract.freelancer))
        .where(Contract.id == contract_id)
    )
    contract = result.scalar_one_or_none()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    if contract.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the client can update the contract")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(contract, field, value)

    await db.flush()
    await db.refresh(contract)
    return ContractOut.model_validate(contract)
