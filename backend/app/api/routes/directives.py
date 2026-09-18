from fastapi import APIRouter

router = APIRouter()

@router.post("/")
async def create_directive():
    return {"message": "Directive created"}
