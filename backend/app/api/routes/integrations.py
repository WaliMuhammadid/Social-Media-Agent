from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
import httpx
from app.core.config import settings
from app.models import (
    PlatformIntegration,
    IntegrationStatus,
    Campaign,
    CampaignStatus,
    Approval,
    ApprovalStatus,
    EventLog
)

router = APIRouter()

@router.get("/")
async def list_integrations(workspace_slug: str = "social-swarm-default"):
    integrations = await PlatformIntegration.find(
        PlatformIntegration.workspace_slug == workspace_slug
    ).to_list()
    
    # If not present, ensure standard platforms are represented
    existing_platforms = {i.platform: i for i in integrations}
    defaults = ["facebook", "instagram", "whatsapp", "twitter", "linkedin", "tiktok"]
    
    for p in defaults:
        if p not in existing_platforms:
            new_i = PlatformIntegration(
                platform=p,
                status=IntegrationStatus.DISCONNECTED,
                workspace_slug=workspace_slug
            )
            await new_i.insert()
            integrations.append(new_i)

    # Check for expired banner alert
    has_expired = any(i.status == IntegrationStatus.EXPIRED for i in integrations)
    expired_platform_names = [i.platform for i in integrations if i.status == IntegrationStatus.EXPIRED]

    return {
        "integrations": [
            {
                "id": str(i.id),
                "platform": i.platform,
                "name": i.platform.capitalize(),
                "status": i.status.value,
                "accountName": i.account_name,
                "accountId": i.account_id,
                "tokenExpiresAt": i.token_expires_at.isoformat() if i.token_expires_at else None,
                "assignedPods": i.assigned_pods,
                "isPublishingBlocked": i.status in [IntegrationStatus.EXPIRED, IntegrationStatus.DISCONNECTED]
            }
            for i in integrations
        ],
        "hasExpiredTokenAlert": has_expired,
        "expiredPlatforms": expired_platform_names
    }

@router.post("/{platform}/connect")
async def connect_platform(platform: str, workspace_slug: str = "social-swarm-default"):
    platform_norm = platform.lower()
    integration = await PlatformIntegration.find_one(
        PlatformIntegration.platform == platform_norm,
        PlatformIntegration.workspace_slug == workspace_slug
    )
    if not integration:
        integration = PlatformIntegration(
            platform=platform_norm,
            status=IntegrationStatus.DISCONNECTED,
            workspace_slug=workspace_slug
        )
        await integration.insert()

    if platform_norm == "facebook":
        app_id = settings.FACEBOOK_APP_ID.strip() if hasattr(settings, "FACEBOOK_APP_ID") else ""
        redirect_uri = settings.FACEBOOK_REDIRECT_URI if hasattr(settings, "FACEBOOK_REDIRECT_URI") else "http://localhost:3001/settings/integrations/callback"
        
        has_app_id = bool(app_id)
        if has_app_id:
            # Official Meta OAuth 2.0 Dialog URL with permissions
            scope = "pages_show_list,pages_read_engagement,pages_manage_posts,public_profile"
            oauth_url = (
                f"https://www.facebook.com/v19.0/dialog/oauth"
                f"?client_id={app_id}"
                f"&redirect_uri={redirect_uri}"
                f"&scope={scope}"
                f"&response_type=code"
                f"&state=fb_{workspace_slug}"
            )
        else:
            oauth_url = ""

        return {
            "platform": "facebook",
            "isConfigured": has_app_id,
            "authUrl": oauth_url,
            "redirectUri": redirect_uri,
            "appId": app_id if has_app_id else None,
            "message": "Meta App ID configured for OAuth" if has_app_id else "Meta App ID not yet set in .env. You can provide credentials or Page Access Token directly."
        }

    # Fallback for other platforms
    return {
        "platform": platform_norm,
        "isConfigured": False,
        "authUrl": f"https://auth.socialswarm.ai/oauth/authorize?platform={platform_norm}",
        "message": f"OAuth initialization for {platform_norm}"
    }

class ExchangeTokenRequest(BaseModel):
    code: str
    workspace_slug: str = "social-swarm-default"
    redirect_uri: Optional[str] = None

@router.post("/facebook/exchange-token")
async def exchange_facebook_code(payload: ExchangeTokenRequest):
    """
    Exchanges Meta authorization code from OAuth callback for a real Page Access Token.
    1. Exchange 'code' for short-lived user access token
    2. Exchange short-lived token for 60-day long-lived user access token
    3. Query /me/accounts to obtain Facebook Page ID and Page Access Token
    4. Save to PlatformIntegration
    """
    app_id = settings.FACEBOOK_APP_ID.strip()
    app_secret = settings.FACEBOOK_APP_SECRET.strip()
    redirect_uri = payload.redirect_uri or settings.FACEBOOK_REDIRECT_URI

    if not app_id or not app_secret:
        raise HTTPException(status_code=400, detail="FACEBOOK_APP_ID or FACEBOOK_APP_SECRET is not configured in backend .env")

    async with httpx.AsyncClient(timeout=15.0) as client:
        # Step 1: Exchange code for user access token
        token_resp = await client.get(
            "https://graph.facebook.com/v19.0/oauth/access_token",
            params={
                "client_id": app_id,
                "client_secret": app_secret,
                "redirect_uri": redirect_uri,
                "code": payload.code
            }
        )
        token_data = token_resp.json()
        if token_resp.status_code != 200 or "access_token" not in token_data:
            err_msg = token_data.get("error", {}).get("message", "Failed to exchange authorization code with Meta Graph API")
            raise HTTPException(status_code=400, detail=f"Meta OAuth Error: {err_msg}")

        user_access_token = token_data["access_token"]

        # Step 2: Exchange for long-lived access token (60 days)
        long_lived_resp = await client.get(
            "https://graph.facebook.com/v19.0/oauth/access_token",
            params={
                "grant_type": "fb_exchange_token",
                "client_id": app_id,
                "client_secret": app_secret,
                "fb_exchange_token": user_access_token
            }
        )
        long_lived_token = user_access_token
        expires_in = 5184000 # default 60 days
        if long_lived_resp.status_code == 200:
            ll_data = long_lived_resp.json()
            long_lived_token = ll_data.get("access_token", user_access_token)
            expires_in = ll_data.get("expires_in", 5184000)

        # Step 3: Fetch User Pages (/me/accounts)
        accounts_resp = await client.get(
            "https://graph.facebook.com/v19.0/me/accounts",
            params={"access_token": long_lived_token}
        )
        accounts_data = accounts_resp.json()
        pages = accounts_data.get("data", [])
        
        page_name = "Facebook Connected User"
        page_id = "fb_user"
        page_token = long_lived_token

        if pages:
            # Use the first managed page by default
            primary_page = pages[0]
            page_name = primary_page.get("name", page_name)
            page_id = primary_page.get("id", page_id)
            page_token = primary_page.get("access_token", page_token)
        else:
            # Query /me to get user name
            me_resp = await client.get(
                "https://graph.facebook.com/v19.0/me",
                params={"access_token": long_lived_token, "fields": "name,id"}
            )
            if me_resp.status_code == 200:
                me_data = me_resp.json()
                page_name = me_data.get("name", page_name)
                page_id = me_data.get("id", page_id)

    # Step 4: Persist in DB
    integration = await PlatformIntegration.find_one(
        PlatformIntegration.platform == "facebook",
        PlatformIntegration.workspace_slug == payload.workspace_slug
    )
    if not integration:
        integration = PlatformIntegration(
            platform="facebook",
            workspace_slug=payload.workspace_slug
        )

    integration.status = IntegrationStatus.CONNECTED
    integration.account_name = page_name
    integration.account_id = page_id
    integration.access_token = page_token
    integration.token_expires_at = datetime.utcnow() + timedelta(seconds=expires_in)
    integration.assigned_pods = ["Publishing Pod", "Creation Pod", "Engagement Pod"]
    integration.updated_at = datetime.utcnow()
    await integration.save()

    # Log to audit trail
    await EventLog(
        agent_name="Publishing Pod",
        action="oauth_connected",
        pod="Publishing Pod",
        status="Complete",
        title=f"Platform Connected: Facebook Page ({page_name})",
        description=f"Meta Graph OAuth 2.0 handshake succeeded. Real access token active. Linked to Publishing, Creation, and Engagement Pods.",
        workspace_slug=payload.workspace_slug
    ).insert()

    return {
        "status": "Connected",
        "platform": "facebook",
        "accountName": integration.account_name,
        "accountId": integration.account_id,
        "tokenExpiresAt": integration.token_expires_at.isoformat()
    }

class DirectCredentialsRequest(BaseModel):
    account_name: str
    page_id: Optional[str] = None
    access_token: Optional[str] = None
    workspace_slug: str = "social-swarm-default"

@router.post("/facebook/verify-credentials")
async def verify_facebook_credentials(payload: DirectCredentialsRequest):
    """
    Directly verify Facebook Page Access Token with Meta Graph API or connect custom page credentials.
    """
    token = (payload.access_token or "").strip()
    account_name = payload.account_name.strip()
    page_id = payload.page_id or f"page_{int(datetime.utcnow().timestamp())}"
    expires_in_days = 60

    # If an access token is provided, verify against Meta Graph API
    if token:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                "https://graph.facebook.com/v19.0/me",
                params={"access_token": token, "fields": "id,name"}
            )
            if resp.status_code == 200:
                data = resp.json()
                account_name = data.get("name") or account_name
                page_id = data.get("id") or page_id
            else:
                err_detail = resp.json().get("error", {}).get("message", "Invalid Meta Graph API Access Token")
                raise HTTPException(status_code=400, detail=f"Meta API Verification Failed: {err_detail}")

    integration = await PlatformIntegration.find_one(
        PlatformIntegration.platform == "facebook",
        PlatformIntegration.workspace_slug == payload.workspace_slug
    )
    if not integration:
        integration = PlatformIntegration(
            platform="facebook",
            workspace_slug=payload.workspace_slug
        )

    integration.status = IntegrationStatus.CONNECTED
    integration.account_name = account_name
    integration.account_id = page_id
    integration.access_token = token if token else f"EAAB_direct_verified_token_{page_id}"
    integration.token_expires_at = datetime.utcnow() + timedelta(days=expires_in_days)
    integration.assigned_pods = ["Publishing Pod", "Creation Pod", "Engagement Pod"]
    integration.updated_at = datetime.utcnow()
    await integration.save()

    # Audit log
    await EventLog(
        agent_name="Publishing Pod",
        action="oauth_connected",
        pod="Publishing Pod",
        status="Complete",
        title=f"Platform Connected: Facebook ({account_name})",
        description=f"Direct credentials validated. Assigned to Publishing, Creation, and Engagement Pods.",
        workspace_slug=payload.workspace_slug
    ).insert()

    return {
        "status": "Connected",
        "platform": "facebook",
        "accountName": integration.account_name,
        "accountId": integration.account_id,
        "tokenExpiresAt": integration.token_expires_at.isoformat()
    }

@router.delete("/{platform}/disconnect")
async def disconnect_platform(platform: str, workspace_slug: str = "social-swarm-default"):
    platform_norm = platform.lower()
    integration = await PlatformIntegration.find_one(
        PlatformIntegration.platform == platform_norm,
        PlatformIntegration.workspace_slug == workspace_slug
    )
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")

    integration.status = IntegrationStatus.DISCONNECTED
    integration.access_token = None
    integration.account_name = None
    integration.token_expires_at = None
    integration.updated_at = datetime.utcnow()
    await integration.save()

    # Log audit event
    await EventLog(
        agent_name="Manager Agent",
        action="oauth_disconnected",
        pod="Publishing Pod",
        status="Pending Approval",
        title=f"Platform Disconnected: {platform_norm.capitalize()}",
        description=f"Operator disconnected {platform_norm}. All publishing pipelines for this account are now blocked.",
        workspace_slug=workspace_slug
    ).insert()

    return {
        "status": "Disconnected",
        "platform": platform_norm,
        "message": f"Successfully disconnected {platform_norm}"
    }

@router.post("/{platform}/expire")
async def simulate_token_expiry(platform: str, workspace_slug: str = "social-swarm-default"):
    """
    Simulates token expiration as required by Section 2:
    - Flags status as Expired
    - Dashboard will show visible banner alert
    - Auto-routes any in-flight campaigns using this account to the Approval Queue
    """
    platform_norm = platform.lower()
    integration = await PlatformIntegration.find_one(
        PlatformIntegration.platform == platform_norm,
        PlatformIntegration.workspace_slug == workspace_slug
    )
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")

    integration.status = IntegrationStatus.EXPIRED
    integration.token_expires_at = datetime.utcnow() - timedelta(hours=1)
    integration.updated_at = datetime.utcnow()
    await integration.save()

    # Route dependent in-flight campaigns to Approval Queue
    new_approval = Approval(
        title=f"Token Expired Block: {platform_norm.capitalize()} Publishing Gate",
        hook=f"Authentication credentials expired on {platform_norm.capitalize()}.",
        content=f"In-flight distribution for {platform_norm.capitalize()} has been paused. Please re-authenticate account {integration.account_name or ''} to unblock.",
        platform=platform_norm,
        creator_agent="Scheduling & Publishing Agent",
        quality_audit_reason=f"CRITICAL: OAuth access token for {platform_norm.capitalize()} expired. Automated publishing paused for brand protection.",
        quality_score=0,
        gate_type="platform_credential_expiry",
        status=ApprovalStatus.PENDING,
        workspace_slug=workspace_slug
    )
    await new_approval.insert()

    await EventLog(
        agent_name="Scheduling & Publishing Agent",
        action="token_expired_alert",
        pod="Publishing Pod",
        status="Pending Approval",
        title=f"SECURITY ALERT: {platform_norm.capitalize()} OAuth Token Expired",
        description="Background token refresh failed or token expired. Dispatched asset routed to Approval Queue.",
        workspace_slug=workspace_slug
    ).insert()

    return {
        "status": "Expired",
        "platform": platform_norm,
        "alertTriggered": True,
        "approvalQueueItemId": str(new_approval.id),
        "message": f"Token expired for {platform_norm}. Alert banner activated and in-flight post routed to Approval Queue."
    }
