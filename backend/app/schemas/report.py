from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.report import ReportType, ReportStatus

class ReportBase(BaseModel):
    report_type: ReportType
    title: str
    description: str
    evidence: Optional[str] = None

class ReportCreate(ReportBase):
    reported_user_id: int
    trade_id: Optional[int] = None

class ReportResponse(ReportBase):
    id: int
    reporter_id: int
    reported_user_id: int
    trade_id: Optional[int] = None
    status: ReportStatus
    created_at: datetime

    class Config:
        from_attributes = True
