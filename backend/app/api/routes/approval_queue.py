from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models import Approval, ApprovalStatus, Campaign, Post, EventLog

router = APIRouter()

class DecisionRequest(BaseModel):
    decision: str # "Approve", "Reject", "Escalate"
    notes: Optional[str] = None

@router.get("/")
async def get_approval_queue(workspace_slug: str = "social-swarm-default"):
    approvals = await Approval.find(
        Approval.workspace_slug == workspace_slug,
        Approval.status == ApprovalStatus.PENDING
    ).sort("-created_at").to_list()

    return [
        {
            "id": str(a.id),
            "title": a.title or "Untitled Asset Review",
            "hook": a.hook or "",
            "content": a.content or "",
            "platform": a.platform or "twitter",
            "creatorAgent": a.creator_agent or "Copywriting Agent",
            "qualityAuditReason": a.quality_audit_reason or "Automated quality check passed.",
            "qualityScore": a.quality_score or 95,
            "status": a.status.value.lower(),
            "scheduledFor": a.scheduled_for or "Tomorrow, 10:00 AM EST",
            "gateType": a.gate_type,
            "createdAt": a.created_at.isoformat()
        }
        for a in approvals
    ]

@router.post("/{id}/decision")
async def make_decision(id: str, req: DecisionRequest):
    from beanie import PydanticObjectId
    try:
        obj_id = PydanticObjectId(id)
        approval = await Approval.get(obj_id)
    except Exception:
        approval = await Approval.find_one(Approval.title == id)

    if not approval:
        raise HTTPException(status_code=404, detail="Approval task not found")

    decision_norm = req.decision.strip().capitalize()

    # Reject requires a mandatory notes field before submission
    if decision_norm == "Reject":
        if not req.notes or len(req.notes.strip()) < 5:
            raise HTTPException(
                status_code=400,
                detail="Rejection requires specific revision notes detailing why the piece was rejected."
            )
        approval.status = ApprovalStatus.REJECTED
        approval.notes = req.notes.strip()
    elif decision_norm == "Approve":
        approval.status = ApprovalStatus.APPROVED
        approval.notes = req.notes
    elif decision_norm == "Escalate":
        approval.status = ApprovalStatus.ESCALATED
        approval.notes = req.notes or "Escalated by operator for higher review."
    else:
        raise HTTPException(status_code=400, detail="Invalid decision. Choose Approve, Reject, or Escalate.")

    approval.resolved_at = datetime.utcnow()
    await approval.save()

    # Log the audit trail mutation
    evt = EventLog(
        event_id=f"EVT-{str(approval.id)[-4:].upper()}",
        agent_name="Manager Agent",
        pod="Quality Pod",
        action=f"operator_{decision_norm.lower()}",
        status="Complete" if decision_norm == "Approve" else "Pending Approval",
        title=f"Operator Decision: {decision_norm} on {approval.title}",
        description=f"Action: {decision_norm}. Notes: {approval.notes or 'None'}",
        workspace_slug=approval.workspace_slug
    )
    await evt.insert()

    # Realtime notification
    try:
        from .realtime import manager
        await manager.broadcast({
            "type": "approval_update",
            "data": {"id": str(approval.id), "status": approval.status.value, "decision": decision_norm}
        })
        await manager.broadcast({
            "type": "event_log",
            "data": {
                "id": evt.event_id,
                "title": evt.title,
                "description": evt.description,
                "pod": "Quality Pod",
                "agent": "Manager Agent",
                "status": evt.status,
                "time": datetime.utcnow().strftime("%H:%M:%S EST")
            }
        })
    except Exception:
        pass

    return {
        "id": str(approval.id),
        "status": approval.status.value,
        "decision": decision_norm,
        "notes": approval.notes,
        "resolvedAt": approval.resolved_at.isoformat()
    }

