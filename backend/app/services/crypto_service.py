from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from app.models.crypto_config import CryptoConfig
from app.models.trade import CryptoCurrency
from app.schemas.crypto import CryptoConfigCreate, CryptoOption

class CryptoService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_supported_cryptocurrencies(self) -> List[CryptoOption]:
        """Get all supported cryptocurrencies for trading"""
        configs = self.db.query(CryptoConfig).filter(
            CryptoConfig.is_active == True
        ).all()
        
        return [
            CryptoOption(
                symbol=config.symbol,
                name=config.name,
                icon_url=config.icon_url,
                network=config.network,
                min_amount=config.minimum_amount_trade,
                max_amount=config.maximum_amount_trade,
                decimals=config.decimals,
                is_active=config.is_active
            )
            for config in configs
        ]
    
    def get_crypto_config(self, symbol: str) -> Optional[CryptoConfig]:
        """Get configuration for a specific cryptocurrency"""
        return self.db.query(CryptoConfig).filter(
            CryptoConfig.symbol == symbol.upper(),
            CryptoConfig.is_active == True
        ).first()
    
    def create_crypto_config(self, config_data: CryptoConfigCreate) -> CryptoConfig:
        """Create a new cryptocurrency configuration"""
        config = CryptoConfig(**config_data.dict())
        self.db.add(config)
        self.db.commit()
        self.db.refresh(config)
        return config
    
    def get_trading_pairs(self) -> Dict[str, List[str]]:
        """Get available trading pairs"""
        active_cryptos = self.db.query(CryptoConfig).filter(
            CryptoConfig.is_active == True
        ).all()
        
        # For now, all cryptos can be traded against fiat currencies
        fiat_currencies = ["NGN", "USD", "EUR", "GBP", "KES", "GHS", "ZAR"]
        
        trading_pairs = {}
        for crypto in active_cryptos:
            trading_pairs[crypto.symbol] = fiat_currencies
        
        return trading_pairs
    
    def validate_trade_amount(self, symbol: str, amount: float) -> bool:
        """Validate if trade amount is within allowed limits"""
        config = self.get_crypto_config(symbol)
        if not config:
            return False
        
        return config.minimum_amount_trade <= amount <= config.maximum_amount_trade
    
    def calculate_trading_fee(self, symbol: str, amount: float) -> float:
        """Calculate trading fee for a cryptocurrency"""
        config = self.get_crypto_config(symbol)
        if not config:
            return 0.0
        
        return amount * (config.trade_percentage_fee / 100)
    
    def get_network_info(self, symbol: str) -> Optional[Dict]:
        """Get network information for a cryptocurrency"""
        config = self.get_crypto_config(symbol)
        if not config:
            return None
        
        return {
            "network": config.network,
            "contract_address": config.contract_address,
            "decimals": config.decimals,
            "is_testnet": config.is_testnet
        }
    
    def seed_default_cryptocurrencies(self):
        """Seed database with default cryptocurrency configurations"""
        default_cryptos = [
            {
                "symbol": "USDT",
                "name": "Tether",
                "network": "ethereum",
                "contract_address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
                "decimals": 6,
                "minimum_amount_trade": 10.0,
                "maximum_amount_trade": 100000.0,
                "trade_percentage_fee": 0.1,
                "icon_url": "https://cryptologos.cc/logos/tether-usdt-logo.png",
                "color": "#26A17B"
            },
            {
                "symbol": "BTC",
                "name": "Bitcoin",
                "network": "bitcoin",
                "decimals": 8,
                "minimum_amount_trade": 0.001,
                "maximum_amount_trade": 10.0,
                "trade_percentage_fee": 0.15,
                "icon_url": "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
                "color": "#F7931A"
            },
            {
                "symbol": "ETH",
                "name": "Ethereum",
                "network": "ethereum",
                "decimals": 18,
                "minimum_amount_trade": 0.01,
                "maximum_amount_trade": 100.0,
                "trade_percentage_fee": 0.12,
                "icon_url": "https://cryptologos.cc/logos/ethereum-eth-logo.png",
                "color": "#627EEA"
            },
            {
                "symbol": "USDC",
                "name": "USD Coin",
                "network": "ethereum",
                "contract_address": "0xA0b86a33E6441b8435b662303c0f218C8c7c8e37",
                "decimals": 6,
                "minimum_amount_trade": 10.0,
                "maximum_amount_trade": 100000.0,
                "trade_percentage_fee": 0.1,
                "icon_url": "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
                "color": "#2775CA"
            },
            {
                "symbol": "BNB",
                "name": "Binance Coin",
                "network": "binance-smart-chain",
                "decimals": 18,
                "minimum_amount_trade": 0.1,
                "maximum_amount_trade": 1000.0,
                "trade_percentage_fee": 0.12,
                "icon_url": "https://cryptologos.cc/logos/bnb-bnb-logo.png",
                "color": "#F3BA2F"
            },
            {
                "symbol": "ADA",
                "name": "Cardano",
                "network": "cardano",
                "decimals": 6,
                "minimum_amount_trade": 10.0,
                "maximum_amount_trade": 10000.0,
                "trade_percentage_fee": 0.12,
                "icon_url": "https://cryptologos.cc/logos/cardano-ada-logo.png",
                "color": "#0033AD"
            },
            {
                "symbol": "SOL",
                "name": "Solana",
                "network": "solana",
                "decimals": 9,
                "minimum_amount_trade": 0.1,
                "maximum_amount_trade": 1000.0,
                "trade_percentage_fee": 0.12,
                "icon_url": "https://cryptologos.cc/logos/solana-sol-logo.png",
                "color": "#9945FF"
            },
            {
                "symbol": "DOT",
                "name": "Polkadot",
                "network": "polkadot",
                "decimals": 10,
                "minimum_amount_trade": 1.0,
                "maximum_amount_trade": 1000.0,
                "trade_percentage_fee": 0.12,
                "icon_url": "https://cryptologos.cc/logos/polkadot-new-dot-logo.png",
                "color": "#E6007A"
            },
            {
                "symbol": "MATIC",
                "name": "Polygon",
                "network": "polygon",
                "decimals": 18,
                "minimum_amount_trade": 10.0,
                "maximum_amount_trade": 10000.0,
                "trade_percentage_fee": 0.1,
                "icon_url": "https://cryptologos.cc/logos/polygon-matic-logo.png",
                "color": "#8247E5"
            },
            {
                "symbol": "AVAX",
                "name": "Avalanche",
                "network": "avalanche",
                "decimals": 18,
                "minimum_amount_trade": 0.1,
                "maximum_amount_trade": 1000.0,
                "trade_percentage_fee": 0.12,
                "icon_url": "https://cryptologos.cc/logos/avalanche-avax-logo.png",
                "color": "#E84142"
            }
        ]
        
        for crypto_data in default_cryptos:
            existing = self.db.query(CryptoConfig).filter(
                CryptoConfig.symbol == crypto_data["symbol"]
            ).first()
            
            if not existing:
                config = CryptoConfig(**crypto_data)
                self.db.add(config)
        
        self.db.commit()
