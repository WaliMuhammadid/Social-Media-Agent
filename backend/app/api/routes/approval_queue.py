from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_approval_queue():
    return {"message": "Pending approvals"}

@router.post("/{id}/decision")
async def make_decision(id: str):
    return {"message": f"Decision recorded for {id}"}
