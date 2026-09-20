from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.models import Directive

router = APIRouter()

class CreateDirectiveRequest(BaseModel):
    title: str
    due: Optional[str] = "Due: 17:00 EST"
    pod: Optional[str] = "Creation"
    icon: Optional[str] = "brush"
    color: Optional[str] = "bg-purple-50 text-purple-600"
    workspace_slug: Optional[str] = "social-swarm-default"

@router.get("/")
async def list_directives(workspace_slug: str = "social-swarm-default"):
    directives = await Directive.find(Directive.workspace_slug == workspace_slug).sort("-created_at").to_list()
    return [
        {
            "id": str(d.id),
            "title": d.title,
            "due": d.due,
            "pod": d.pod,
            "done": d.done,
            "icon": d.icon,
            "color": d.color,
            "createdAt": d.created_at.isoformat()
        }
        for d in directives
    ]

@router.get("/next")
async def get_next_directive(workspace_slug: str = "social-swarm-default"):
    # Find the next pending directive
    next_dir = await Directive.find_one(
        Directive.workspace_slug == workspace_slug,
        Directive.done == False
    )
    if not next_dir:
        return {
            "title": "Swarm on Standby",
            "due": "No Action Pending",
            "campaign": "Create campaign or directive to begin",
            "assetsSummary": "Queue Idle",
            "pod": "Orchestrator"
        }

    return {
        "id": str(next_dir.id),
        "title": f"{next_dir.due.replace('Due: ', '')} {next_dir.title}",
        "due": next_dir.due,
        "campaign": "Q3 Autonomous Tech Launch",
        "assetsSummary": f"{next_dir.pod} Pod Action Pending",
        "pod": next_dir.pod
    }

@router.post("/")
async def create_directive(req: CreateDirectiveRequest):
    new_d = Directive(
        title=req.title,
        due=req.due or "Due: 17:00 EST",
        pod=req.pod or "Creation",
        done=False,
        icon=req.icon or "brush",
        color=req.color or "bg-purple-50 text-purple-600",
        workspace_slug=req.workspace_slug or "social-swarm-default"
    )
    await new_d.insert()
    
    # Broadcast realtime update to connected clients
    try:
        from .realtime import manager
        await manager.broadcast({
            "type": "directive_update",
            "data": {"id": str(new_d.id), "title": new_d.title, "done": False}
        })
    except Exception:
        pass

    return {
        "id": str(new_d.id),
        "title": new_d.title,
        "due": new_d.due,
        "pod": new_d.pod,
        "done": new_d.done,
        "icon": new_d.icon,
        "color": new_d.color
    }

@router.patch("/{id}/toggle")
async def toggle_directive(id: str):
    from beanie import PydanticObjectId
    try:
        obj_id = PydanticObjectId(id)
        d = await Directive.get(obj_id)
    except Exception:
        d = await Directive.find_one(Directive.title == id)

    if not d:
        raise HTTPException(status_code=404, detail="Directive not found")

    d.done = not d.done
    await d.save()

    # Broadcast realtime update to connected clients
    try:
        from .realtime import manager
        await manager.broadcast({
            "type": "directive_update",
            "data": {"id": str(d.id), "done": d.done}
        })
    except Exception:
        pass

    return {"id": str(d.id), "done": d.done}

