from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from datetime import datetime, timedelta
import uuid
from app.models.trade import Trade, TradeStatus, TradeType
from app.models.user import User
from app.schemas.trade import TradeCreate, TradeUpdate
from app.services.crypto_service import CryptoService

class TradeService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_trade(self, user_id: int, trade_data: TradeCreate) -> Trade:
        """Create a new trade"""
        # Validate cryptocurrency and amount
        crypto_service = CryptoService(self.db)
        if not crypto_service.validate_trade_amount(trade_data.crypto_currency.value, trade_data.crypto_amount):
            raise ValueError(f"Invalid trade amount for {trade_data.crypto_currency.value}")
    
        # Generate unique trade ID
        trade_id = f"TP{uuid.uuid4().hex[:8].upper()}"
        
        # Set buyer/seller based on trade type
        if trade_data.trade_type == TradeType.BUY:
            buyer_id = user_id
            seller_id = trade_data.seller_id
        else:
            buyer_id = trade_data.buyer_id
            seller_id = user_id
        
        # Calculate expiration time (24 hours from now)
        expires_at = datetime.utcnow() + timedelta(hours=24)
        payment_deadline = datetime.utcnow() + timedelta(hours=2)
        
        trade = Trade(
            trade_id=trade_id,
            buyer_id=buyer_id,
            seller_id=seller_id,
            crypto_amount=trade_data.crypto_amount,
            fiat_amount=trade_data.fiat_amount,
            exchange_rate=trade_data.exchange_rate,
            crypto_currency=trade_data.crypto_currency,
            fiat_currency=trade_data.fiat_currency,
            trade_type=trade_data.trade_type,
            payment_method=trade_data.payment_method,
            expires_at=expires_at,
            payment_deadline=payment_deadline
        )
        
        self.db.add(trade)
        self.db.commit()
        self.db.refresh(trade)
        return trade
    
    def get_trade_by_id(self, trade_id: str) -> Optional[Trade]:
        """Get trade by trade ID"""
        return self.db.query(Trade).filter(Trade.trade_id == trade_id).first()
    
    def get_user_trades(self, user_id: int, status: Optional[TradeStatus] = None, 
                       limit: int = 20, offset: int = 0) -> List[Trade]:
        """Get trades for a user"""
        query = self.db.query(Trade).filter(
            or_(Trade.buyer_id == user_id, Trade.seller_id == user_id)
        )
        
        if status:
            query = query.filter(Trade.status == status)
        
        return query.order_by(Trade.created_at.desc()).offset(offset).limit(limit).all()
    
    def update_trade(self, trade_id: str, user_id: int, trade_update: TradeUpdate) -> Trade:
        """Update trade details"""
        trade = self.get_trade_by_id(trade_id)
        if not trade:
            raise ValueError("Trade not found")
        
        # Check if user is participant
        if trade.buyer_id != user_id and trade.seller_id != user_id:
            raise ValueError("Access denied")
        
        # Update fields
        for field, value in trade_update.dict(exclude_unset=True).items():
            setattr(trade, field, value)
        
        trade.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(trade)
        return trade
    
    def cancel_trade(self, trade_id: str, user_id: int, reason: str) -> dict:
        """Cancel a trade"""
        trade = self.get_trade_by_id(trade_id)
        if not trade:
            raise ValueError("Trade not found")
        
        # Check if user is participant
        if trade.buyer_id != user_id and trade.seller_id != user_id:
            raise ValueError("Access denied")
        
        # Check if trade can be cancelled
        if trade.status not in [TradeStatus.INITIATED, TradeStatus.ESCROW_FUNDED]:
            raise ValueError("Trade cannot be cancelled at this stage")
        
        trade.status = TradeStatus.CANCELLED
        trade.dispute_reason = reason
        trade.updated_at = datetime.utcnow()
        
        self.db.commit()
        return {"message": "Trade cancelled successfully"}
    
    def dispute_trade(self, trade_id: str, user_id: int, reason: str, evidence: str = None) -> dict:
        """Dispute a trade"""
        trade = self.get_trade_by_id(trade_id)
        if not trade:
            raise ValueError("Trade not found")
        
        # Check if user is participant
        if trade.buyer_id != user_id and trade.seller_id != user_id:
            raise ValueError("Access denied")
        
        trade.status = TradeStatus.DISPUTED
        trade.is_disputed = True
        trade.dispute_reason = reason
        trade.updated_at = datetime.utcnow()
        
        self.db.commit()
        return {"message": "Trade disputed successfully"}
    
    def complete_trade(self, trade_id: str) -> Trade:
        """Mark trade as completed and update user statistics"""
        trade = self.get_trade_by_id(trade_id)
        if not trade:
            raise ValueError("Trade not found")
        
        trade.status = TradeStatus.COMPLETED
        trade.completed_at = datetime.utcnow()
        trade.updated_at = datetime.utcnow()
        
        # Update user statistics
        buyer = self.db.query(User).filter(User.id == trade.buyer_id).first()
        seller = self.db.query(User).filter(User.id == trade.seller_id).first()
        
        if buyer:
            buyer.total_trades += 1
            buyer.successful_trades += 1
        
        if seller:
            seller.total_trades += 1
            seller.successful_trades += 1
        
        self.db.commit()
        self.db.refresh(trade)
        return trade
