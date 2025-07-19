from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    wallet_address: Optional[str] = None
    telegram_handle: Optional[str] = None
    username: str
    full_name: Optional[str] = None
    phone_number: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserLogin(BaseModel):
    wallet_address: Optional[str] = None
    email: Optional[EmailStr] = None
    signature: Optional[str] = None  # For wallet authentication

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    telegram_handle: Optional[str] = None
    profile_image: Optional[str] = None

class UserResponse(UserBase):
    id: int
    trust_score: float
    total_trades: int
    successful_trades: int
    is_active: bool
    is_verified: bool
    kyc_status: str
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserSearchResponse(BaseModel):
    id: int
    username: str
    telegram_handle: Optional[str] = None
    trust_score: float
    total_trades: int
    successful_trades: int
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True
