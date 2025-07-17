TrustPeer Backend

TrustPeer is a decentralized peer-to-peer (P2P) crypto trading platform built with escrow protection and DAO-based dispute resolution.

   Tech Stack

- Python (FastAPI)
- PostgreSQL + SQLALchemy
- Wallet Auth (ICP & EVM)
- ICP Smart Contracts
- Docker (optional)


    Features
 - Wallet-based auth (Plug, Metamask, etc.)
 - Escrow handling (Smart Contracts)
 - Trade creation & tracking
 - Trust & rating system
 - DAO-powered dispute resolution

     Setup
- Clone repo
- Install dependencies
- Set `.env` variables
- Run with `uvicorn main:app --reload`

     Structure
- `/api`: Routes
- `/models`: DB schemas
- `/services`: Business logic
- `/blockchain`: ICP integration
- `main.py`: Entry point

Liscence
MIT

- 
  
