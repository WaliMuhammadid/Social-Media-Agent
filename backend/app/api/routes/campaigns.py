from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_campaigns():
    return {"message": "List of campaigns"}

@router.get("/{id}")
async def get_campaign(id: str):
    return {"message": f"Campaign details for {id}"}
