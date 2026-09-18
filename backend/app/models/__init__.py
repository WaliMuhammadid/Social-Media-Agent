from beanie import Document, Link
from pydantic import Field
from typing import List, Optional, Any, Dict
from datetime import datetime
import enum

class CampaignStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    COMPLETED = "COMPLETED"
    PAUSED = "PAUSED"
    FAILED = "FAILED"

class PostStatus(str, enum.Enum):
    DRAFTING = "DRAFTING"
    NEEDS_REVIEW = "NEEDS_REVIEW"
    APPROVED = "APPROVED"
    SCHEDULED = "SCHEDULED"
    PUBLISHED = "PUBLISHED"
    FAILED = "FAILED"

class ApprovalStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    ESCALATED = "ESCALATED"

class Campaign(Document):
    name: str
    status: CampaignStatus = CampaignStatus.ACTIVE
    brand_niche: str
    target_platforms: List[str] = Field(default_factory=list)
    competitor_list: List[str] = Field(default_factory=list)
    brand_goals: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "campaigns"

class Post(Document):
    campaign: Link[Campaign]
    platform: str
    status: PostStatus = PostStatus.DRAFTING
    content_draft: Optional[str] = None
    media_assets: List[Dict[str, Any]] = Field(default_factory=list)
    published_url: Optional[str] = None
    scheduled_for: Optional[datetime] = None
    fail_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "posts"

class Approval(Document):
    campaign: Optional[Link[Campaign]] = None
    post: Optional[Link[Post]] = None
    gate_type: str
    status: ApprovalStatus = ApprovalStatus.PENDING
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None

    class Settings:
        name = "approvals"

class EventLog(Document):
    campaign: Link[Campaign]
    agent_name: str
    action: str
    input_summary: Optional[Dict[str, Any]] = None
    output_summary: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "event_logs"

class BrandVoice(Document):
    version: int = 1
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

    class Settings:
        name = "brand_voice"
