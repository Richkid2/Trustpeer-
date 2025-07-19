from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class RatingBase(BaseModel):
    rating: float = Field(..., ge=1, le=5)
    comment: Optional[str] = None
    communication_rating: Optional[float] = Field(None, ge=1, le=5)
    reliability_rating: Optional[float] = Field(None, ge=1, le=5)
    speed_rating: Optional[float] = Field(None, ge=1, le=5)

class RatingCreate(RatingBase):
    rated_user_id: int
    trade_id: int

class RatingResponse(RatingBase):
    id: int
    rater_id: int
    rated_user_id: int
    trade_id: int
    created_at: datetime

    class Config:
        from_attributes = True
