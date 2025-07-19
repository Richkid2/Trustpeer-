from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.trade import TradeStatus, TradeType

class TradeBase(BaseModel):
    crypto_amount: float
    fiat_amount: float
    exchange_rate: float
    crypto_currency: str = "USDT"
    fiat_currency: str = "NGN"
    trade_type: TradeType
    payment_method: str

class TradeCreate(TradeBase):
    seller_id: Optional[int] = None  # For buy orders
    buyer_id: Optional[int] = None   # For sell orders

class TradeUpdate(BaseModel):
    status: Optional[TradeStatus] = None
    payment_reference: Optional[str] = None
    payment_proof: Optional[str] = None
    escrow_tx_hash: Optional[str] = None
    release_tx_hash: Optional[str] = None

class TradeResponse(TradeBase):
    id: int
    trade_id: str
    buyer_id: int
    seller_id: int
    status: TradeStatus
    escrow_address: Optional[str] = None
    payment_reference: Optional[str] = None
    expires_at: Optional[datetime] = None
    payment_deadline: Optional[datetime] = None
    is_disputed: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
