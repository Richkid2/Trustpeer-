from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import List, Optional
from datetime import datetime
from app.models.user import User
from app.models.trade import Trade
from app.models.rating import Rating
from app.schemas.user import UserCreate, UserUpdate

class UserService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_user(self, user_data: UserCreate) -> User:
        """Create a new user"""
        user = User(**user_data.dict())
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        return self.db.query(User).filter(User.id == user_id).first()
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        return self.db.query(User).filter(User.email == email).first()
    
    def get_user_by_wallet(self, wallet_address: str) -> Optional[User]:
        """Get user by wallet address"""
        return self.db.query(User).filter(User.wallet_address == wallet_address).first()
    
    def get_user_by_username(self, username: str) -> Optional[User]:
        """Get user by username"""
        return self.db.query(User).filter(User.username == username).first()
    
    def get_user_by_telegram(self, telegram_handle: str) -> Optional[User]:
        """Get user by telegram handle"""
        return self.db.query(User).filter(User.telegram_handle == telegram_handle).first()
    
    def search_traders(self, query: str, limit: int = 10) -> List[User]:
        """Search for traders by username or telegram handle"""
        return self.db.query(User).filter(
            or_(
                User.username.ilike(f"%{query}%"),
                User.telegram_handle.ilike(f"%{query}%")
            )
        ).filter(User.is_active == True).limit(limit).all()
    
    def get_top_traders(self, limit: int = 10) -> List[User]:
        """Get top traders by trust score"""
        return self.db.query(User).filter(
            User.is_active == True
        ).order_by(User.trust_score.desc()).limit(limit).all()
    
    def update_user(self, user_id: int, user_data: UserUpdate) -> Optional[User]:
        """Update user profile"""
        user = self.get_user_by_id(user_id)
        if not user:
            return None
        
        for field, value in user_data.dict(exclude_unset=True).items():
            setattr(user, field, value)
        
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def update_last_login(self, user_id: int):
        """Update user's last login timestamp"""
        user = self.get_user_by_id(user_id)
        if user:
            user.last_login = datetime.utcnow()
            self.db.commit()
    
    def get_trader_stats(self, user_id: int) -> dict:
        """Get comprehensive trader statistics"""
        user = self.get_user_by_id(user_id)
        if not user:
            return {}
        
        # Get average rating
        avg_rating = self.db.query(func.avg(Rating.rating)).filter(
            Rating.rated_user_id == user_id
        ).scalar() or 0.0
        
        # Get recent trades count (last 30 days)
        recent_trades = self.db.query(func.count(Trade.id)).filter(
            or_(Trade.buyer_id == user_id, Trade.seller_id == user_id),
            Trade.created_at >= datetime.utcnow() - timedelta(days=30)
        ).scalar() or 0
        
        return {
            "average_rating": round(avg_rating, 2),
            "recent_trades_30d": recent_trades,
            "success_rate": (user.successful_trades / user.total_trades * 100) if user.total_trades > 0 else 0,
            "member_since": user.created_at.strftime("%Y-%m-%d")
        }
    
    def update_trust_score(self, user_id: int):
        """Recalculate and update user's trust score"""
        user = self.get_user_by_id(user_id)
        if not user:
            return
        
        # Calculate trust score based on various factors
        base_score = 50.0  # Starting score
        
        # Success rate factor (0-30 points)
        if user.total_trades > 0:
            success_rate = user.successful_trades / user.total_trades
            success_points = success_rate * 30
        else:
            success_points = 0
        
        # Volume factor (0-10 points)
        volume_points = min(user.total_trades * 0.5, 10)
        
        # Rating factor (0-10 points)
        avg_rating = self.db.query(func.avg(Rating.rating)).filter(
            Rating.rated_user_id == user_id
        ).scalar() or 0.0
        rating_points = (avg_rating - 3) * 5 if avg_rating > 3 else 0
        
        # Verification bonus
        verification_bonus = 10 if user.is_verified else 0
        
        new_trust_score = base_score + success_points + volume_points + rating_points + verification_bonus
        user.trust_score = max(0, min(100, new_trust_score))  # Clamp between 0-100
        
        self.db.commit()
