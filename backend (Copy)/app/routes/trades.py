from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.trade import TradeCreate, TradeResponse, TradeUpdate
from app.services.trade_service import TradeService
from app.services.auth_service import AuthService
from app.models.trade import TradeStatus

router = APIRouter()

@router.post("/", response_model=TradeResponse)
async def create_trade(
    trade_data: TradeCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(AuthService.get_current_user)
):
    """Create a new trade"""
    trade_service = TradeService(db)
    trade = trade_service.create_trade(current_user_id, trade_data)
    return trade

@router.get("/", response_model=List[TradeResponse])
async def get_user_trades(
    status: Optional[TradeStatus] = None,
    limit: int = Query(20, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(AuthService.get_current_user)
):
    """Get user's trades"""
    trade_service = TradeService(db)
    trades = trade_service.get_user_trades(current_user_id, status, limit, offset)
    return trades

@router.get("/{trade_id}", response_model=TradeResponse)
async def get_trade(
    trade_id: str,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(AuthService.get_current_user)
):
    """Get specific trade details"""
    trade_service = TradeService(db)
    trade = trade_service.get_trade_by_id(trade_id)
    
    if not trade:
        raise HTTPException(status_code=404, detail="Trade not found")
    
    # Check if user is participant in this trade
    if trade.buyer_id != current_user_id and trade.seller_id != current_user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return trade

@router.patch("/{trade_id}", response_model=TradeResponse)
async def update_trade(
    trade_id: str,
    trade_update: TradeUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(AuthService.get_current_user)
):
    """Update trade status or details"""
    trade_service = TradeService(db)
    trade = trade_service.update_trade(trade_id, current_user_id, trade_update)
    return trade

@router.post("/{trade_id}/cancel")
async def cancel_trade(
    trade_id: str,
    reason: str,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(AuthService.get_current_user)
):
    """Cancel a trade"""
    trade_service = TradeService(db)
    result = trade_service.cancel_trade(trade_id, current_user_id, reason)
    return result

@router.post("/{trade_id}/dispute")
async def dispute_trade(
    trade_id: str,
    reason: str,
    evidence: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(AuthService.get_current_user)
):
    """Dispute a trade"""
    trade_service = TradeService(db)
    result = trade_service.dispute_trade(trade_id, current_user_id, reason, evidence)
    return result
