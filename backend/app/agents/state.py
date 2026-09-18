from typing import TypedDict, Annotated, List, Dict, Any, Optional
from operator import add
from pydantic import BaseModel, Field

class PostDraft(BaseModel):
    platform: str
    content: str
    media_brief: Optional[str] = None
    media_url: Optional[str] = None
    fail_count: int = 0
    approved: bool = False
    
class CampaignState(TypedDict):
    campaign_id: str
    brand_niche: str
    target_platforms: List[str]
    competitor_list: List[str]
    brand_goals: str
    
    # State tracking
    current_stage: str
    
    # Artifacts passed between agents
    trend_brief: Optional[str]
    content_calendar: Optional[List[Dict[str, Any]]]
    drafts: Annotated[List[PostDraft], add] # Use add to accumulate drafts
    
    # Approvals & Escalations
    calendar_approved: bool
    escalation_reason: Optional[str]
    
    # Agent Communication
    messages: Annotated[List[Any], add]
