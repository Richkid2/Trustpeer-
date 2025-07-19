from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.rating import RatingCreate, RatingResponse
from app.schemas.report import ReportCreate, ReportResponse
from app.services.rating_service import RatingService
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/", response_model=RatingResponse)
async def create_rating(
    rating_data: RatingCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(AuthService.get_current_user)
):
    """Create a rating for a user after a trade"""
    rating_service = RatingService(db)
    rating = rating_service.create_rating(current_user_id, rating_data)
    return rating

@router.get("/user/{user_id}", response_model=List[RatingResponse])
async def get_user_ratings(
    user_id: int,
    limit: int = Query(20, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Get ratings for a specific user"""
    rating_service = RatingService(db)
    ratings = rating_service.get_user_ratings(user_id, limit, offset)
    return ratings

@router.post("/report", response_model=ReportResponse)
async def create_report(
    report_data: ReportCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(AuthService.get_current_user)
):
    """Report a user for misconduct"""
    rating_service = RatingService(db)
    report = rating_service.create_report(current_user_id, report_data)
    return report

@router.get("/reports/my")
async def get_my_reports(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(AuthService.get_current_user)
):
    """Get reports made by current user"""
    rating_service = RatingService(db)
    reports = rating_service.get_user_reports(current_user_id)
    return reports
