from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_event_logs():
    return {"message": "Event logs stream"}
