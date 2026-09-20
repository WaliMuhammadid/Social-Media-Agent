from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import api_router
from .core.config import settings
from .core.database import init_db

app = FastAPI(title="Social Media AI Agent Team API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev, should be restricted in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # Initialize MongoDB and Beanie
    await init_db()
    from .api.routes.realtime import start_realtime_ticker
    await start_realtime_ticker()

app.include_router(api_router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "environment": settings.ENVIRONMENT}
