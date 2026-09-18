from fastapi import APIRouter

router = APIRouter()

@router.get("/status")
async def get_swarm_status():
    return {"status": "Swarm is running"}

@router.post("/pause")
async def pause_swarm():
    return {"status": "Swarm paused"}

@router.post("/resume")
async def resume_swarm():
    return {"status": "Swarm resumed"}
