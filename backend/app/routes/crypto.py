from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from app.database import get_db
from app.schemas.crypto import CryptoOption, CryptoConfigResponse
from app.services.crypto_service import CryptoService
from app.services.auth_service import AuthService

router = APIRouter()

@router.get("/supported", response_model=List[CryptoOption])
async def get_supported_cryptocurrencies(db:Session =  Depends(get_db)):
    """get all supported cryptocurrencies for trading"""
    crypto_service = CryptoService(db)
    return crypto_service.get_supported_cryptocurrencies()

@router.get("/{symbol}/config", response_model=CryptoConfigResponse)
async def get_crypto_config(symbol: str, db: Session = Depends(get_db)):
    """get configuration for a specific cryptocurrency"""
    crypto_service = CryptoService(db)
    config = crypto_service.get_crypto_config(Symbol)
    
    if not config:
        raise HTTPException(
            status_code=404,
            detail=f"Cryptocurrncey {symbol} not found or not supported"
        )
    return config

@router.get("/{symbol}/netwrok-info")
async def get_network_info(symbol" str, db: Session = Depends(get_db)):
    """get network information for a specific cryptocurrency"""
    crypto_service = CryptoService(db)
    network_info = crypto_service.get_network_info(symbol)
    
    if not network_info:
        raise HTTPException(
            status_code=404,
            detail=f"Network information for {symbol} not found"
        )
    return network_info
    
@router.post("/{symbol}/validate-amount")
async def validate_trade_amount(symbol: str, amount: float, db: Session = Depends(get_db), current_user_id: int =  Depends(AuthService.get_current_user)):
    """ valide trade amount if its within allowed limts"""
    crypto_service = CryptoService(db)
    is_valid = crypto_service.validate_trade_amount(symbol, amount)
   
    if  not is_valid:
        config = crypto_service.get_crypto_config(symbol)
        if not config:
            raise HTTPException(
                status_code = 404,
                detail=f"Cryptocurrency {symbol} not supported"
            )
        return {
            "valid": False,
            "message": f"Amount must be between {config.minimum_amount_trade} and {config.maximum_amount_trade} {symbol}",
            "min_amount": config.minimum_amount_trade,
            "max_amount": config.maximum_amount_trade
        }
    return {
        "valid": True,
        "message": "Amount is valid"
    }
    
@router.get("/{symbol}/fee")
async def calculate_trading_fee(symbol: str, amount: float, db: Session = Depends(get_db)):
    """Calculate trading fee for a cryptocurrency trade"""
    crypto_service = CryptoService(db)
    fee = crypto_service.calculate_trading_fee(symbol, amount)
    config = crypto_service.get_crypto_config(symbol)
    
    if not config:
        raise HTTPException(
            status_code=404,
            detail=f"Cryptocurrency {symbol} not found"
        )
    
    return {
        "symbol": symbol,
        "amount": amount,
        "fee": fee,
        "fee_percentage": config.trade_percentage_fee,
        "total_amount": amount + fee
    }

@router.post("/seed-defaults")
async def seed_default_cryptocurrencies(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(AuthService.get_current_user)
):
    """Seed database with default cryptocurrency configurations (Admin only)"""
    # In production, add admin role check here
    crypto_service = CryptoService(db)
    crypto_service.seed_default_cryptocurrencies()
    return {"message": "Default cryptocurrencies seeded successfully"}
