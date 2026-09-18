from .state import CampaignState

def should_continue(state: CampaignState):
    """
    Determine if we should continue to the next node or escalate.
    """
    if state.get("escalation_reason"):
        return "escalate"
    
    current_stage = state.get("current_stage")
    
    if current_stage == "manager_review":
        return "content_strategy"
    elif current_stage == "strategy_done":
        # Check human-in-the-loop gate for calendar
        if not state.get("calendar_approved", False):
            return "human_approval_gate"
        return "drafting" # Parallel copywriting & visual design
    
    return "end"

def manager_node(state: CampaignState):
    """
    The Manager Agent assigns tasks, sequences the chain, tracks campaign state, 
    applies human-approval gates, resolves inter-agent conflicts.
    """
    # Manager logic here (LLM call to determine routing and summarize)
    return {"current_stage": "manager_review"}
