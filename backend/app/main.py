from fastapi import FastAPI, Depends, HTTPExcption
from fastapi.middileware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from contextlib import asynccontextmanager
import uvicorn
from app.database import engine, Base
from app.routes import auth, traders, trade, escrow, ratings

# create tables on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # create database table
    Base.metadata.create_all(bind=engine)
    yeild
    
app = FastAPI(
    title="TrustPeer P2P Escrow API",
    description="Backend API for P2P crypto escrow platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# security
security = HTTPBearer()

# include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(traders.router, prefix="/api/traders", tags=["Traders"])
app.include_router(trades.router, prefix="/api/trades", tags=["Trades"])
app.include_router(escrow.router, prefix="/api/escrow", tags=["Escrow"])
app.include_router(ratings.router, prefix="/api/ratings", tags=["Ratings"])

@app.get("/")
async def root():
    return {
        "message": "TrustPeer P2P Escrow API",
        "status": "running"
    }
    
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "API is running smoothly"
    }
    
if __name__ == "__main__":
    uvicorn.run("main:app",  host="0.0.0.0", port=8000, reload=True)
