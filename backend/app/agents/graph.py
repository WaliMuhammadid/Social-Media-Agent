from langgraph.graph import StateGraph, END
from .state import CampaignState
from .manager import manager_node, should_continue
from .specialists import (
    trend_research_node,
    content_strategy_node,
    copywriting_node,
    visual_design_node,
    quality_safety_node,
    scheduling_node,
    community_node,
    analytics_node
)
import logging

logger = logging.getLogger(__name__)


def build_graph():
    workflow = StateGraph(CampaignState)

    # Add nodes
    workflow.add_node("manager", manager_node)
    workflow.add_node("trend_research", trend_research_node)
    workflow.add_node("content_strategy", content_strategy_node)
    workflow.add_node("copywriting", copywriting_node)
    workflow.add_node("visual_design", visual_design_node)
    workflow.add_node("quality_safety", quality_safety_node)
    workflow.add_node("scheduling", scheduling_node)
    workflow.add_node("community", community_node)
    workflow.add_node("analytics", analytics_node)

    # Define edges (simplified perfect chain)
    workflow.set_entry_point("trend_research")
    workflow.add_edge("trend_research", "manager")
    workflow.add_edge("manager", "content_strategy")
    workflow.add_edge("content_strategy", "copywriting")
    workflow.add_edge("copywriting", "visual_design")
    workflow.add_edge("visual_design", "quality_safety")
    workflow.add_edge("quality_safety", "scheduling")
    workflow.add_edge("scheduling", "community")
    workflow.add_edge("community", "analytics")
    workflow.add_edge("analytics", END)

    app = workflow.compile()
    return app

campaign_graph = build_graph()
