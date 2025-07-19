from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.services.auth_service import AuthService
from app.services.user_service import UserService

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    user_service = UserService(db)
    
    # Check if user already exists
    if user_data.email and user_service.get_user_by_email(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    if user_data.wallet_address and user_service.get_user_by_wallet(user_data.wallet_address):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Wallet already registered"
        )
    
    if user_service.get_user_by_username(user_data.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    user = user_service.create_user(user_data)
    return user

@router.post("/login")
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """Login user with wallet or email"""
    auth_service = AuthService(db)
    user_service = UserService(db)
    
    user = None
    
    if login_data.wallet_address:
        # Wallet-based authentication
        user = user_service.get_user_by_wallet(login_data.wallet_address)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Wallet not registered"
            )
        
        # In production, verify the signature here
        # For now, we'll skip signature verification
        
    elif login_data.email:
        # Email-based authentication
        user = user_service.get_user_by_email(login_data.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Email not registered"
            )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide either wallet address or email"
        )
    
    # Generate JWT token
    token = auth_service.create_access_token(user.id)
    
    # Update last login
    user_service.update_last_login(user.id)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(user)
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user(current_user_id: int = Depends(AuthService.get_current_user), db: Session = Depends(get_db)):
    """Get current user profile"""
    user_service = UserService(db)
    user = user_service.get_user_by_id(current_user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user
