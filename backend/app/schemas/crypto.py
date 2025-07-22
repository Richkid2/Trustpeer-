from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CryptoConfigBase(BaseModel):
    symbol: str
    name: str
    network: str
    contract_address: Optional[str] = None
    decimals: int = 18
    minimum_amount_trade: float = 0.0
    maximum_amount_trade: float = 1000000.0
    trade_percentage_fee: float = 0.1
    icon_url: Optional[str] = None
    color: Optional[str] = None
    is_active: bool = True
    is_testnet: bool = False

class CryptoConfigCreate(CryptoConfigBase):
    pass

class CryptoConfigResponse(CryptoConfigBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CryptoOption(BaseModel):
    symbol: str
    name: str
    icon_url: Optional[str] = None
    network: str
    min_amount: float
    max_amount: float
    decimals: int
    is_active: bool
