from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from .config import settings
import certifi
import logging

logger = logging.getLogger(__name__)

async def init_db():
    logger.info("Initializing MongoDB connection...")
    
    # Import all models
    from ..models import (
        Campaign,
        Post,
        Approval,
        EventLog,
        BrandVoice,
        Workspace,
        User,
        PlatformIntegration,
        Directive
    )
    
    all_models = [
        Campaign,
        Post,
        Approval,
        EventLog,
        BrandVoice,
        Workspace,
        User,
        PlatformIntegration,
        Directive
    ]
    
    try:
        # Attempt connecting to configured Mongo URL with certifi
        client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=3000
        )
        database = client.get_default_database("social_agent")
        await init_beanie(database=database, document_models=all_models)
        # Test command
        await database.command({"ping": 1})
        logger.info("Connected to primary MongoDB cluster successfully.")
    except Exception as e:
        logger.warning(f"Remote MongoDB connection failed ({e}). Falling back to local mongomock_motor...")
        from mongomock_motor import AsyncMongoMockClient
        mock_client = AsyncMongoMockClient()
        mock_db = mock_client.get_database("social_agent")
        await init_beanie(database=mock_db, document_models=all_models)
        logger.info("Initialized in-memory MongoDB via mongomock_motor successfully.")
        
    # Auto-seed essential records if empty
    await seed_default_data_if_needed()

async def seed_default_data_if_needed():
    from ..models import (
        Workspace, User, PlatformIntegration, IntegrationStatus
    )
    
    workspace_count = await Workspace.find_all().count()
    if workspace_count == 0:
        logger.info("Seeding essential empty workspace and default user...")
        
        # 1. Real Workspaces
        w1 = Workspace(name="Main Workspace", slug="social-swarm-default", description="Autonomous Multi-Agent Social Media Operations")
        await w1.insert()
        
        # 2. User Profile
        user = User(
            name="Admin Operator",
            email="operator@socialswarm.ai",
            avatar="🚀",
            role="Lead Operations Manager",
            current_workspace_slug="social-swarm-default"
        )
        await user.insert()

        # 3. Default Integrations (all unconfigured/disconnected until user connects them)
        integrations_seed = [
            PlatformIntegration(platform="twitter", status=IntegrationStatus.DISCONNECTED, account_name=None, assigned_pods=["Publishing Pod", "Strategy Pod"]),
            PlatformIntegration(platform="linkedin", status=IntegrationStatus.DISCONNECTED, account_name=None, assigned_pods=["Publishing Pod"]),
            PlatformIntegration(platform="instagram", status=IntegrationStatus.DISCONNECTED, account_name=None, assigned_pods=["Creation Pod", "Publishing Pod"]),
            PlatformIntegration(platform="facebook", status=IntegrationStatus.DISCONNECTED, account_name=None, assigned_pods=["Publishing Pod"]),
            PlatformIntegration(platform="tiktok", status=IntegrationStatus.DISCONNECTED, account_name=None, assigned_pods=[]),
            PlatformIntegration(platform="whatsapp", status=IntegrationStatus.DISCONNECTED, account_name=None, assigned_pods=[])
        ]
        for integ in integrations_seed:
            await integ.insert()

        logger.info("Database initialized clean without fake demo records.")


