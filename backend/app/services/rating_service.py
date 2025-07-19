from sqlalchemy.orm import Session
from typing import List
from app.models.rating import Rating
from app.models.report import Report
from app.models.trade import Trade
from app.schemas.rating import RatingCreate
from app.schemas.report import ReportCreate
from app.services.user_service import UserService

class RatingService:
    def __init__(self, db: Session):
        self.db = db
        self.user_service = UserService(db)
    
    def create_rating(self, rater_id: int, rating_data: RatingCreate) -> Rating:
        """Create a rating for a user"""
        # Check if trade exists and rater was participant
        trade = self.db.query(Trade).filter(Trade.id == rating_data.trade_id).first()
        if not trade:
            raise ValueError("Trade not found")
        
        if trade.buyer_id != rater_id and trade.seller_id != rater_id:
            raise ValueError("You can only rate users from your own trades")
        
        # Check if rating already exists
        existing_rating = self.db.query(Rating).filter(
            Rating.rater_id == rater_id,
            Rating.trade_id == rating_data.trade_id
        ).first()
        
        if existing_rating:
            raise ValueError("You have already rated this trade")
        
        rating = Rating(
            rater_id=rater_id,
            **rating_data.dict()
        )
        
        self.db.add(rating)
        self.db.commit()
        self.db.refresh(rating)
        
        # Update user's trust score
        self.user_service.update_trust_score(rating_data.rated_user_id)
        
        return rating
    
    def get_user_ratings(self, user_id: int, limit: int = 20, offset: int = 0) -> List[Rating]:
        """Get ratings for a specific user"""
        return self.db.query(Rating).filter(
            Rating.rated_user_id == user_id
        ).order_by(Rating.created_at.desc()).offset(offset).limit(limit).all()
    
    def create_report(self, reporter_id: int, report_data: ReportCreate) -> Report:
        """Create a report against a user"""
        report = Report(
            reporter_id=reporter_id,
            **report_data.dict()
        )
        
        self.db.add(report)
        self.db.commit()
        self.db.refresh(report)
        return report
    
    def get_user_reports(self, user_id: int) -> List[Report]:
        """Get reports made by a user"""
        return self.db.query(Report).filter(
            Report.reporter_id == user_id
        ).order_by(Report.created_at.desc()).all()
