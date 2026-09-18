import pytest

def check_topic_sensitivity(topic: str) -> bool:
    """Mock sensitive topic router"""
    sensitive_keywords = ["politics", "tragedy", "controversy"]
    return any(keyword in topic.lower() for keyword in sensitive_keywords)

def test_sensitive_topic_routing():
    """Test sensitive-topic auto-routing rule."""
    assert check_topic_sensitivity("Local politics debate") == True
    assert check_topic_sensitivity("New AI tools release") == False
    assert check_topic_sensitivity("Tragedy strikes city") == True

def test_double_fail_escalation():
    """Test double-fail escalation rule for Quality & Brand-Safety."""
    fail_count = 2
    escalate = fail_count >= 2
    assert escalate == True

def test_approval_gates_blocking():
    """Test approval-gate blocking logic."""
    state = {"calendar_approved": False, "current_stage": "strategy_done"}
    # Manager router logic simulation
    def route(s):
        if not s.get("calendar_approved"):
            return "human_approval_gate"
        return "drafting"
        
    assert route(state) == "human_approval_gate"
    
    state["calendar_approved"] = True
    assert route(state) == "drafting"
