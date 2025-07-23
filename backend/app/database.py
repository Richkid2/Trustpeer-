from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# database 
DATABASE_URL=os.getenv("DATABASE_URL", "sqlite:///./trustpeer.db")

# create engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# create session local class
SessionLocal = sessionmaker(autocommit=False, autoflush=False)

# create base class
Base = declarative_base()

# dependency to get database session
def get_db():
    db = SessionLocal(bind=engine)
    try:
        yield db
    finally:
        db.close()
# create base class
Base = declarative_base()

# dependency to get database session
def get_db():
    db = SessionLocal(bind=engine)
    try:
        yield db
    finally:
        db.close()