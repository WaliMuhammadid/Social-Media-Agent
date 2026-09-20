from fastapi import APIRouter, Query
from typing import Optional
from app.models import EventLog

router = APIRouter()

@router.get("/")
async def get_event_logs(
    workspace_slug: str = "social-swarm-default",
    search: Optional[str] = None,
    status: Optional[str] = None,
    pod: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    query = EventLog.find(EventLog.workspace_slug == workspace_slug)

    all_logs = await query.sort("-timestamp").to_list()

    # In-memory filter for flexible search matching title, description, agent or pod
    filtered = []
    for l in all_logs:
        if status and status != "All Statuses" and l.status.lower() != status.lower():
            continue
        if pod and pod != "All Pods" and pod.lower() not in l.pod.lower():
            continue
        if search:
            s = search.lower()
            if not (s in (l.title or "").lower() or s in (l.description or "").lower() or s in l.agent_name.lower() or s in (l.event_id or "").lower()):
                continue
        filtered.append(l)

    total_count = len(filtered)
    start_idx = (page - 1) * limit
    paged = filtered[start_idx : start_idx + limit]

    pod_colors = {
        "Creation Pod": {"color": "bg-purple-50 text-purple-700 border-purple-200/60", "icon": "brush"},
        "Publishing Pod": {"color": "bg-sky-50 text-sky-700 border-sky-200/60", "icon": "cloud_upload"},
        "Quality Pod": {"color": "bg-amber-50 text-amber-700 border-amber-200/70", "icon": "verified"},
        "Engagement Pod": {"color": "bg-teal-50 text-teal-700 border-teal-200/60", "icon": "forum"},
        "Strategy Pod": {"color": "bg-emerald-50 text-emerald-800 border-emerald-200/60", "icon": "query_stats"},
        "Manager Agent": {"color": "bg-blue-50 text-blue-700 border-blue-200/60", "icon": "account_tree"}
    }

    return {
        "total": total_count,
        "page": page,
        "limit": limit,
        "logs": [
            {
                "id": l.event_id or f"EVT-{str(l.id)[-4:].upper()}",
                "status": l.status,
                "title": l.title or f"Agent Action: {l.action}",
                "description": l.description or f"Executed by {l.agent_name}",
                "pod": l.pod,
                "podColor": pod_colors.get(l.pod, {}).get("color", "bg-slate-50 text-slate-700 border-slate-200"),
                "podIcon": pod_colors.get(l.pod, {}).get("icon", "smart_toy"),
                "agent": l.agent_name,
                "time": l.timestamp.strftime("%H:%M:%S EST"),
                "timestamp": l.timestamp.isoformat()
            }
            for l in paged
        ],
        "kpis": {
            "totalMutations": total_count,
            "auditRate": "100%" if total_count > 0 else "N/A",
            "pendingSignOff": sum(1 for l in all_logs if "pending" in (l.status or "").lower()),
            "activePods": "6 / 6"
        }
    }

