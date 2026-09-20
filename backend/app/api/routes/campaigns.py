from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.models import Campaign, CampaignStatus

router = APIRouter()

@router.get("/")
async def list_campaigns(workspace_slug: str = "social-swarm-default"):
    # Calculate status counts for dashboard top cards
    total_campaigns = await Campaign.find(Campaign.workspace_slug == workspace_slug).count()
    completed_campaigns = await Campaign.find(
        Campaign.workspace_slug == workspace_slug,
        Campaign.status == CampaignStatus.COMPLETED
    ).count()
    active_campaigns = await Campaign.find(
        Campaign.workspace_slug == workspace_slug,
        Campaign.status == CampaignStatus.ACTIVE
    ).count()
    pending_approvals = await Campaign.find(
        Campaign.workspace_slug == workspace_slug,
        Campaign.status == CampaignStatus.PENDING_APPROVAL
    ).count()

    campaigns = await Campaign.find(Campaign.workspace_slug == workspace_slug).sort("-created_at").to_list()

    return {
        "statusCounts": {
            "total": total_campaigns,
            "completed": completed_campaigns,
            "active": active_campaigns,
            "pendingApproval": pending_approvals
        },
        "campaigns": [
            {
                "id": str(c.id),
                "name": c.name,
                "title": c.title or c.name,
                "status": c.status.value.lower(),
                "currentStage": c.current_stage,
                "brandNiche": c.brand_niche,
                "targetPlatforms": c.target_platforms,
                "totalPlannedPosts": c.total_planned_posts,
                "completedPosts": c.completed_posts,
                "pendingApprovalPosts": c.pending_approval_posts,
                "scheduledPosts": c.scheduled_posts,
                "createdAt": c.created_at.isoformat()
            }
            for c in campaigns
        ]
    }

@router.get("/{id}")
async def get_campaign(id: str):
    from beanie import PydanticObjectId
    try:
        obj_id = PydanticObjectId(id)
        campaign = await Campaign.get(obj_id)
    except Exception:
        campaign = await Campaign.find_one(Campaign.name == id)

    if not campaign:
        # Fallback to the main active campaign
        campaign = await Campaign.find_one(Campaign.status == CampaignStatus.ACTIVE)
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")

    # Content calendar items with actual chain state: Research -> Plan -> Create -> QC -> Publish -> Engage -> Measure
    calendar_items = [
        {"day": "Mon", "date": "Sep 08", "posts": 3, "active": True, "stage": "Publish"},
        {"day": "Tue", "date": "Sep 09", "posts": 4, "active": True, "stage": "Publish"},
        {"day": "Wed", "date": "Sep 10", "posts": 2, "active": True, "stage": "Engage"},
        {"day": "Thu", "date": "Sep 11", "posts": 4, "active": True, "stage": "Create"},
        {"day": "Fri", "date": "Sep 12", "posts": 3, "active": False, "stage": "Plan"},
        {"day": "Sat", "date": "Sep 13", "posts": 1, "active": False, "stage": "Research"},
        {"day": "Sun", "date": "Sep 14", "posts": 2, "active": False, "stage": "Research"},
    ]

    return {
        "id": str(campaign.id),
        "name": campaign.name,
        "title": campaign.title or campaign.name,
        "status": campaign.status.value.lower(),
        "currentStage": campaign.current_stage,
        "stages": ["Research", "Plan", "Create", "QC", "Publish", "Engage", "Measure"],
        "brandNiche": campaign.brand_niche,
        "targetPlatforms": campaign.target_platforms,
        "totalPlannedPosts": campaign.total_planned_posts,
        "completedPosts": campaign.completed_posts,
        "pendingApprovalPosts": campaign.pending_approval_posts,
        "scheduledPosts": campaign.scheduled_posts,
        "calendar": calendar_items
    }

