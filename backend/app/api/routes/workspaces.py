from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.models import Workspace, User

router = APIRouter()

class SwitchWorkspaceRequest(BaseModel):
    slug: str

@router.get("/")
async def list_workspaces():
    workspaces = await Workspace.find_all().to_list()
    return [
        {
            "id": str(w.id),
            "name": w.name,
            "slug": w.slug,
            "description": w.description
        }
        for w in workspaces
    ]

@router.get("/me")
async def get_current_user():
    user = await User.find_one()
    if not user:
        user = User(
            name="Totok Michael",
            email="tmichael20@mail.com",
            avatar="🧔‍♂️",
            role="Lead Operations Manager",
            current_workspace_slug="social-swarm-default"
        )
        await user.insert()

    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "avatar": user.avatar or "🧔‍♂️",
        "role": user.role,
        "currentWorkspaceSlug": user.current_workspace_slug
    }

@router.post("/switch")
async def switch_workspace(req: SwitchWorkspaceRequest):
    user = await User.find_one()
    if user:
        user.current_workspace_slug = req.slug
        await user.save()
    return {"status": "ok", "currentWorkspaceSlug": req.slug}
