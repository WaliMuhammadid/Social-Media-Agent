from fastapi import APIRouter
from .routes import (
    campaigns,
    agent_pods,
    approval_queue,
    event_logs,
    analytics,
    swarm,
    directives,
    integrations,
    workspaces,
    realtime
)

api_router = APIRouter()
api_router.include_router(campaigns.router, prefix="/campaigns", tags=["campaigns"])
api_router.include_router(agent_pods.router, prefix="/agent-pods", tags=["agent-pods"])
api_router.include_router(approval_queue.router, prefix="/approval-queue", tags=["approval-queue"])
api_router.include_router(event_logs.router, prefix="/event-logs", tags=["event-logs"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(swarm.router, prefix="/swarm", tags=["swarm"])
api_router.include_router(directives.router, prefix="/directives", tags=["directives"])
api_router.include_router(integrations.router, prefix="/integrations", tags=["integrations"])
api_router.include_router(workspaces.router, prefix="/workspaces", tags=["workspaces"])
api_router.include_router(workspaces.router, prefix="/auth", tags=["auth"])
api_router.include_router(realtime.router, prefix="/ws", tags=["realtime"])

