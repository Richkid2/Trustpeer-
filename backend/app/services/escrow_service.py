from sqlalchemy.orm import Session
from datetime import datetime
from app.models.trade import Trade, TradeStatus
from app.services.trade_service import TradeService

class EscrowService:
    def __init__(self, db: Session):
        self.db = db
        self.trade_service = TradeService(db)
    
    def fund_escrow(self, trade_id: str, user_id: int, tx_hash: str) -> dict:
        """Fund escrow with crypto"""
        trade = self.trade_service.get_trade_by_id(trade_id)
        if not trade:
            raise ValueError("Trade not found")
        
        # Check if user is the seller (who funds escrow)
        if trade.seller_id != user_id:
            raise ValueError("Only seller can fund escrow")
        
        if trade.status != TradeStatus.INITIATED:
            raise ValueError("Trade is not in correct state for funding")
        
        # Update trade with escrow details
        trade.status = TradeStatus.ESCROW_FUNDED
        trade.escrow_tx_hash = tx_hash
        trade.updated_at = datetime.utcnow()
        
        # In production, verify the transaction on blockchain
        # For now, we'll assume it's valid
        
        self.db.commit()
        return {"message": "Escrow funded successfully", "tx_hash": tx_hash}
    
    def confirm_payment(self, trade_id: str, user_id: int, payment_reference: str, payment_proof: str = None) -> dict:
        """Confirm fiat payment has been sent"""
        trade = self.trade_service.get_trade_by_id(trade_id)
        if not trade:
            raise ValueError("Trade not found")
        
        # Check if user is the buyer
        if trade.buyer_id != user_id:
            raise ValueError("Only buyer can confirm payment")
        
        if trade.status != TradeStatus.ESCROW_FUNDED:
            raise ValueError("Escrow must be funded before payment confirmation")
        
        trade.status = TradeStatus.PAYMENT_SENT
        trade.payment_reference = payment_reference
        trade.payment_proof = payment_proof
        trade.updated_at = datetime.utcnow()
        
        self.db.commit()
        return {"message": "Payment confirmation recorded"}
    
    def release_escrow(self, trade_id: str, user_id: int) -> dict:
        """Release escrow funds to buyer"""
        trade = self.trade_service.get_trade_by_id(trade_id)
        if not trade:
            raise ValueError("Trade not found")
        
        # Check if user is the seller
        if trade.seller_id != user_id:
            raise ValueError("Only seller can release escrow")
        
        if trade.status != TradeStatus.PAYMENT_SENT:
            raise ValueError("Payment must be confirmed before release")
        
        # In production, execute blockchain transaction to release funds
        # For now, we'll simulate it
        release_tx_hash = f"release_{trade_id}_{datetime.utcnow().timestamp()}"
        
        trade.status = TradeStatus.PAYMENT_CONFIRMED
        trade.release_tx_hash = release_tx_hash
        trade.updated_at = datetime.utcnow()
        
        # Complete the trade
        self.trade_service.complete_trade(trade_id)
        
        self.db.commit()
        return {"message": "Escrow released successfully", "tx_hash": release_tx_hash}
    
    def get_escrow_status(self, trade_id: str, user_id: int) -> dict:
        """Get current escrow status"""
        trade = self.trade_service.get_trade_by_id(trade_id)
        if not trade:
            raise ValueError("Trade not found")
        
        # Check if user is participant
        if trade.buyer_id != user_id and trade.seller_id != user_id:
            raise ValueError("Access denied")
        
        return {
            "trade_id": trade.trade_id,
            "status": trade.status.value,
            "escrow_funded": trade.status.value in ["escrow_funded", "payment_sent", "payment_confirmed", "completed"],
            "payment_sent": trade.status.value in ["payment_sent", "payment_confirmed", "completed"],
            "payment_confirmed": trade.status.value in ["payment_confirmed", "completed"],
            "completed": trade.status == TradeStatus.COMPLETED,
            "escrow_tx_hash": trade.escrow_tx_hash,
            "release_tx_hash": trade.release_tx_hash,
            "expires_at": trade.expires_at.isoformat() if trade.expires_at else None,
            "payment_deadline": trade.payment_deadline.isoformat() if trade.payment_deadline else None
        }
