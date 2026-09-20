from fastapi import APIRouter
from typing import List

router = APIRouter()

@router.get("/")
async def get_agent_pods_status():
    # Return live specialist agent pods matching the exact 6 pods architecture
    return [
        {
            "id": "manager",
            "name": "Manager Agent",
            "description": "Central orchestrator governing pipeline progression, token budgeting, and human approvals",
            "statusLabel": "Standby",
            "status": "idle",
            "lead": "Executive Orchestrator",
            "healthScore": 100,
            "activeTasksCount": 0,
            "completedTasksCount": 0,
            "icon": "account_tree",
            "bgClass": "bg-blue-100 text-blue-700",
            "badgeBg": "bg-blue-50 text-blue-800",
            "model": "Claude 3.5 Sonnet",
            "taskDetail": "Awaiting directive dispatch · Claude 3.5 Sonnet",
            "connectedAccount": "Internal Orchestrator"
        },
        {
            "id": "strategy",
            "name": "Strategy Pod",
            "description": "Autonomous market pulse intelligence, trending topic synthesis, and editorial calendar framing",
            "statusLabel": "Standby",
            "status": "idle",
            "lead": "Trend & Research Agent",
            "healthScore": 100,
            "activeTasksCount": 0,
            "completedTasksCount": 0,
            "icon": "query_stats",
            "bgClass": "bg-emerald-100 text-emerald-800",
            "badgeBg": "bg-[#eaf6ee] text-[#164e32]",
            "model": "DeepSeek R1",
            "taskDetail": "Standing by for audience niche briefing",
            "connectedAccount": "Channel Unlinked"
        },
        {
            "id": "creation",
            "name": "Creation Pod",
            "description": "High-converting copy generation tailored by platform alongside visual asset prompts",
            "statusLabel": "Standby",
            "status": "idle",
            "lead": "Copywriting Agent",
            "healthScore": 100,
            "activeTasksCount": 0,
            "completedTasksCount": 0,
            "icon": "brush",
            "bgClass": "bg-purple-100 text-purple-700",
            "badgeBg": "bg-purple-50 text-purple-700",
            "model": "GPT-4o & Imagen 3",
            "taskDetail": "Standing by for creative copy prompts",
            "connectedAccount": "Channel Unlinked"
        },
        {
            "id": "quality",
            "name": "Quality Pod",
            "description": "Automated brand safety filters, factual verification, hallucination checks, and tone fidelity",
            "statusLabel": "Standby",
            "status": "idle",
            "lead": "Quality & Brand-Safety Agent",
            "healthScore": 100,
            "activeTasksCount": 0,
            "completedTasksCount": 0,
            "icon": "verified",
            "bgClass": "bg-amber-100 text-amber-800",
            "badgeBg": "bg-amber-50 text-amber-800",
            "model": "Custom Guard Strict",
            "taskDetail": "Guardrails active · Awaiting staged assets",
            "connectedAccount": "Internal Brand Gate"
        },
        {
            "id": "publishing",
            "name": "Publishing Pod",
            "description": "Native payload packaging, platform rate limit handling, and peak-engagement scheduling",
            "statusLabel": "Standby",
            "status": "idle",
            "lead": "Scheduling & Publishing Agent",
            "healthScore": 100,
            "activeTasksCount": 0,
            "completedTasksCount": 0,
            "icon": "cloud_upload",
            "bgClass": "bg-sky-100 text-sky-700",
            "badgeBg": "bg-sky-50 text-sky-700",
            "model": "Meta Graph & X API",
            "taskDetail": "OAuth Standby · Queue empty",
            "connectedAccount": "Channels Unlinked"
        },
        {
            "id": "engagement_analytics",
            "name": "Engagement Pod",
            "description": "Audience reply monitoring, sentiment clustering, and closing the feedback loop into Strategy Pod",
            "statusLabel": "Standby",
            "status": "idle",
            "lead": "Community Engagement Agent",
            "healthScore": 100,
            "activeTasksCount": 0,
            "completedTasksCount": 0,
            "icon": "forum",
            "bgClass": "bg-teal-100 text-teal-800",
            "badgeBg": "bg-teal-50 text-teal-800",
            "model": "Gemini 1.5 Flash",
            "taskDetail": "Listener standing by for active channels",
            "connectedAccount": "Customer Ops Standby"
        }
    ]

