from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.user import UserSearchResponse
from app.services.user_service import UserService
from app.services.auth_service import AuthService

router = APIRouter()

@router.get("/search", response_model=List[UserSearchResponse])
async def search_traders(
    query: str = Query(..., min_length=1),
    limit: int = Query(10, le=50),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(AuthService.get_current_user)
):
    """Search for traders by username or telegram handle"""
    user_service = UserService(db)
    traders = user_service.search_traders(query, limit)
    return traders

@router.get("/verify/{identifier}")
async def verify_trader(
    identifier: str,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(AuthService.get_current_user)
):
    """Verify a trader by username, telegram handle, or wallet address"""
    user_service = UserService(db)
    
    # Try to find user by different identifiers
    user = (user_service.get_user_by_username(identifier) or 
            user_service.get_user_by_telegram(identifier) or
            user_service.get_user_by_wallet(identifier))
    
    if not user:
        raise HTTPException(
            status_code=404,
            detail="Trader not found"
        )
    
    # Get trader statistics
    stats = user_service.get_trader_stats(user.id)
    
    return {
        "user": UserSearchResponse.from_orm(user),
        "stats": stats,
        "trust_metrics": {
            "trust_score": user.trust_score,
            "total_trades": user.total_trades,
            "successful_trades": user.successful_trades,
            "success_rate": (user.successful_trades / user.total_trades * 100) if user.total_trades > 0 else 0,
            "is_verified": user.is_verified
        }
    }

@router.get("/top", response_model=List[UserSearchResponse])
async def get_top_traders(
    limit: int = Query(10, le=50),
    db: Session = Depends(get_db)
):
    """Get top traders by trust score"""
    user_service = UserService(db)
    traders = user_service.get_top_traders(limit)
    return traders
