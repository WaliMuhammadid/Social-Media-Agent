from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from .config import settings
import logging

logger = logging.getLogger(__name__)

async def init_db():
    logger.info("Initializing MongoDB connection...")
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    database = client.get_default_database("social_agent")
    
    # We will import our models here and pass them to Beanie
    from ..models import Campaign, Post, Approval, EventLog, BrandVoice
    
    await init_beanie(
        database=database,
        document_models=[
            Campaign,
            Post,
            Approval,
            EventLog,
            BrandVoice
        ]
    )
    logger.info("MongoDB and Beanie initialized successfully.")
