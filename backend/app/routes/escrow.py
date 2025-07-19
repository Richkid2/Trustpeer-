from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.escrow_service import EscrowService
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/{trade_id}/fund")
async def fund_escrow(
    trade_id: str,
    tx_hash: str,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(AuthService.get_current_user)
):
    """Fund escrow for a trade"""
    escrow_service = EscrowService(db)
    result = escrow_service.fund_escrow(trade_id, current_user_id, tx_hash)
    return result

@router.post("/{trade_id}/confirm-payment")
async def confirm_payment(
    trade_id: str,
    payment_reference: str,
    payment_proof: str = None,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(AuthService.get_current_user)
):
    """Confirm fiat payment has been sent"""
    escrow_service = EscrowService(db)
    result = escrow_service.confirm_payment(trade_id, current_user_id, payment_reference, payment_proof)
    return result

@router.post("/{trade_id}/release")
async def release_escrow(
    trade_id: str,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(AuthService.get_current_user)
):
    """Release escrow funds to buyer"""
    escrow_service = EscrowService(db)
    result = escrow_service.release_escrow(trade_id, current_user_id)
    return result

@router.get("/{trade_id}/status")
async def get_escrow_status(
    trade_id: str,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(AuthService.get_current_user)
):
    """Get escrow status for a trade"""
    escrow_service = EscrowService(db)
    status = escrow_service.get_escrow_status(trade_id, current_user_id)
    return status
