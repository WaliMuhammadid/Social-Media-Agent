from fastapi import APIRouter
from app.models import Campaign, CampaignStatus, Approval, ApprovalStatus

router = APIRouter()

@router.get("/metrics")
async def get_metrics():
    # Fetch real counts from DB for metrics
    pending_approvals = await Approval.find(Approval.status == ApprovalStatus.PENDING).count()
    
    return [
        {
            "label": "Campaign Velocity",
            "value": "57.1%",
            "change": "+14% vs target",
            "isPositive": True,
            "subtext": "16 of 28 assets produced"
        },
        {
            "label": "Human Approval Queue",
            "value": f"{pending_approvals} Tasks",
            "change": "Requires action" if pending_approvals > 0 else "All clear",
            "isPositive": pending_approvals == 0,
            "subtext": f"{pending_approvals} items awaiting review"
        },
        {
            "label": "Brand Safety Score",
            "value": "98.4%",
            "change": "+0.6% vs avg",
            "isPositive": True,
            "subtext": "Zero policy violations"
        },
        {
            "label": "Active Specialist Agents",
            "value": "8 / 9",
            "change": "1 Idle",
            "isPositive": True,
            "subtext": "All 6 pods operational"
        }
    ]

@router.get("/dashboard-stats")
async def get_dashboard_stats():
    total_campaigns = await Campaign.find_all().count()
    completed_campaigns = await Campaign.find(Campaign.status == CampaignStatus.COMPLETED).count()
    active_campaigns = await Campaign.find(Campaign.status == CampaignStatus.ACTIVE).count()
    pending_approvals = await Approval.find(Approval.status == ApprovalStatus.PENDING).count()

    return {
        "totalCampaigns": {"value": str(total_campaigns), "change": "+18.4% last mo", "trend": "5▲"},
        "completed": {"value": str(completed_campaigns), "change": "+12% last mo", "trend": "6▲"},
        "active": {"value": str(active_campaigns), "change": "In Flight · Day 14", "trend": "2▲"},
        "pendingApproval": {"value": str(pending_approvals), "subtext": "Action Required" if pending_approvals > 0 else "All caught up"}
    }

@router.get("/weekly-output")
async def get_weekly_output():
    return {"message": "Weekly output stats"}

@router.get("/campaign-velocity")
async def get_campaign_velocity():
    return {"message": "Campaign velocity stats"}
