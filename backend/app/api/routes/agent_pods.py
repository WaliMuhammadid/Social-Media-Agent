from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_agent_pods_status():
    return {"status": "all agents standby"}
