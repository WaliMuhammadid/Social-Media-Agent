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

class IntegrationStatus(str, enum.Enum):
    CONNECTED = "Connected"
    EXPIRED = "Expired"
    DISCONNECTED = "Disconnected"

class Workspace(Document):
    name: str
    slug: str
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "workspaces"

class User(Document):
    name: str
    email: str
    avatar: Optional[str] = None
    role: str = "Administrator"
    current_workspace_slug: str = "social-swarm-default"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"

class PlatformIntegration(Document):
    platform: str # 'facebook', 'instagram', 'whatsapp', 'twitter', 'linkedin', 'tiktok'
    status: IntegrationStatus = IntegrationStatus.DISCONNECTED
    account_name: Optional[str] = None
    account_id: Optional[str] = None
    access_token: Optional[str] = None
    token_expires_at: Optional[datetime] = None
    workspace_slug: str = "social-swarm-default"
    assigned_pods: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "platform_integrations"

class Directive(Document):
    title: str
    due: str
    pod: str
    done: bool = False
    icon: str = "brush"
    color: str = "bg-purple-50 text-purple-600"
    workspace_slug: str = "social-swarm-default"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "directives"

class Campaign(Document):
    name: str
    title: Optional[str] = None
    status: CampaignStatus = CampaignStatus.ACTIVE
    current_stage: str = "Plan" # Research -> Plan -> Create -> QC -> Publish -> Engage -> Measure
    brand_niche: str
    target_platforms: List[str] = Field(default_factory=list)
    competitor_list: List[str] = Field(default_factory=list)
    brand_goals: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    total_planned_posts: int = 28
    completed_posts: int = 16
    pending_approval_posts: int = 4
    scheduled_posts: int = 12
    workspace_slug: str = "social-swarm-default"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "campaigns"

class Post(Document):
    campaign: Optional[Link[Campaign]] = None
    platform: str
    status: PostStatus = PostStatus.DRAFTING
    current_stage: str = "Create"
    title: Optional[str] = None
    content_draft: Optional[str] = None
    hook: Optional[str] = None
    media_assets: List[Dict[str, Any]] = Field(default_factory=list)
    published_url: Optional[str] = None
    scheduled_for: Optional[datetime] = None
    fail_count: int = 0
    workspace_slug: str = "social-swarm-default"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "posts"

class Approval(Document):
    campaign: Optional[Link[Campaign]] = None
    post: Optional[Link[Post]] = None
    title: Optional[str] = None
    hook: Optional[str] = None
    content: Optional[str] = None
    platform: Optional[str] = "twitter"
    creator_agent: Optional[str] = "Copywriting Agent"
    quality_audit_reason: Optional[str] = None
    quality_score: int = 95
    gate_type: str = "quality_check"
    status: ApprovalStatus = ApprovalStatus.PENDING
    notes: Optional[str] = None
    scheduled_for: Optional[str] = "Tomorrow, 10:00 AM EST"
    workspace_slug: str = "social-swarm-default"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None

    class Settings:
        name = "approvals"

class EventLog(Document):
    event_id: Optional[str] = None
    campaign: Optional[Link[Campaign]] = None
    agent_name: str
    action: str
    pod: str = "Creation Pod"
    title: Optional[str] = None
    description: Optional[str] = None
    status: str = "Complete"
    input_summary: Optional[Dict[str, Any]] = None
    output_summary: Optional[Dict[str, Any]] = None
    workspace_slug: str = "social-swarm-default"
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "event_logs"

class BrandVoice(Document):
    version: int = 1
    content: str
    workspace_slug: str = "social-swarm-default"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

    class Settings:
        name = "brand_voice"
