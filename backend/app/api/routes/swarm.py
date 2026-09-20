from fastapi import APIRouter
from datetime import datetime
import time

router = APIRouter()

# Global swarm state tracking
swarm_state = {
    "is_active": True,
    "start_timestamp": time.time() - 5048, # default matches UI ~01:24:08
    "paused_at": None,
    "active_pod_count": 6,
    "total_pod_count": 6
}

@router.get("/status")
async def get_swarm_status():
    if swarm_state["is_active"]:
        uptime_seconds = int(time.time() - swarm_state["start_timestamp"])
    else:
        uptime_seconds = int((swarm_state["paused_at"] or time.time()) - swarm_state["start_timestamp"])

    return {
        "status": "active" if swarm_state["is_active"] else "paused",
        "isActive": swarm_state["is_active"],
        "uptimeSeconds": max(0, uptime_seconds),
        "activePodCount": swarm_state["active_pod_count"] if swarm_state["is_active"] else 0,
        "totalPodCount": swarm_state["total_pod_count"],
        "loopMode": "continuous_multi_agent_dispatch"
    }

@router.post("/pause")
async def pause_swarm():
    if swarm_state["is_active"]:
        swarm_state["is_active"] = False
        swarm_state["paused_at"] = time.time()
    return {
        "status": "paused",
        "isActive": False,
        "message": "Swarm orchestration loop paused successfully"
    }

@router.post("/resume")
async def resume_swarm():
    if not swarm_state["is_active"]:
        # adjust start_timestamp for the paused gap
        if swarm_state["paused_at"]:
            gap = time.time() - swarm_state["paused_at"]
            swarm_state["start_timestamp"] += gap
        swarm_state["is_active"] = True
        swarm_state["paused_at"] = None
    return {
        "status": "active",
        "isActive": True,
        "message": "Swarm orchestration loop resumed successfully"
    }

