"""
Script to seed the database with default cryptocurrency configurations
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.services.crypto_service import CryptoService

def seed_cryptocurrencies():
    """Seed database with default cryptocurrency configurations"""
    db = SessionLocal()
    try:
        crypto_service = CryptoService(db)
        crypto_service.seed_default_cryptocurrencies()
        print("✅ Successfully seeded default cryptocurrencies")
        
        # Display seeded cryptocurrencies
        cryptos = crypto_service.get_supported_cryptocurrencies()
        print(f"\n📊 Seeded {len(cryptos)} cryptocurrencies:")
        for crypto in cryptos:
            print(f"  • {crypto.symbol} ({crypto.name}) - {crypto.network}")
            print(f"    Min: {crypto.minimum_amount_trade}, Max: {crypto.maximum_amount_trade}")
        
    except Exception as e:
        print(f"❌ Error seeding cryptocurrencies: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_cryptocurrencies()
