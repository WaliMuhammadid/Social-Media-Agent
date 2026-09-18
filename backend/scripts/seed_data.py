import asyncio
import os
import sys

# Add the backend directory to python path so we can import app modules when running this script directly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import init_db
from app.models import Campaign, CampaignStatus, Approval, ApprovalStatus

async def seed():
    print("Starting database seed for MongoDB/Beanie...")
    await init_db()
    
    print("Clearing existing mock data...")
    await Campaign.find_all().delete()
    await Approval.find_all().delete()
    
    print("Inserting mock campaigns...")
    c1 = Campaign(
        name="Summer Marketing 2024",
        status=CampaignStatus.ACTIVE,
        brand_niche="Fashion",
        target_platforms=["Twitter", "LinkedIn"]
    )
    c2 = Campaign(
        name="Tech Startup Launch",
        status=CampaignStatus.COMPLETED,
        brand_niche="Technology",
        target_platforms=["LinkedIn"]
    )
    c3 = Campaign(
        name="Q3 Product Promo",
        status=CampaignStatus.ACTIVE,
        brand_niche="E-commerce",
        target_platforms=["Twitter", "Facebook"]
    )
    c4 = Campaign(
        name="Rebranding Teaser",
        status=CampaignStatus.PENDING_APPROVAL,
        brand_niche="SaaS",
        target_platforms=["Twitter"]
    )
    
    await c1.insert()
    await c2.insert()
    await c3.insert()
    await c4.insert()
    
    print("Inserting mock approvals...")
    a1 = Approval(
        campaign=c4,
        gate_type="brand_safety",
        status=ApprovalStatus.PENDING,
        notes="Needs review for new logo usage"
    )
    a2 = Approval(
        campaign=c1,
        gate_type="quality_check",
        status=ApprovalStatus.PENDING,
        notes="Please check tweet tone"
    )
    await a1.insert()
    await a2.insert()
    
    print("Database seeded successfully with real Beanie models.")

if __name__ == "__main__":
    asyncio.run(seed())
