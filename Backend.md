Backend Build Prompt — Social Media AI Agent Team (for Antigravity)

Copy everything below into Antigravity as your build prompt.

PROJECT CONTEXT

Build the complete backend system for "Social Media AI Agent Team" — a hierarchical, manager-led multi-agent system that autonomously runs end-to-end social media operations: trend research, content strategy, copywriting, visual asset briefing, scheduling/publishing, community engagement, quality/brand-safety review, and analytics reporting — all coordinated by a single Manager Agent.

The frontend dashboard already exists (Next.js/React UI called "Social Swarm" with Dashboard, Campaigns, Agent Pods, Approval Queue, Event Logs, and Analytics screens). Your job is to build the backend that powers it.

1. TECH STACK REQUIREMENTS
Language/Runtime: Node.js (TypeScript) or Python — pick one and be consistent throughout.
Agent orchestration framework: LangGraph (stateful graph orchestration) — preferred for the manager-led hierarchical pattern with conditional branching. CrewAI is an acceptable alternative if it better fits role-based crews.
Tool-calling standard: Model Context Protocol (MCP) for all external tool integrations (scheduling APIs, analytics APIs, image generation APIs).
LLM provider: Anthropic Claude API (model tiering — see Section 6).
Database: PostgreSQL for relational data (campaigns, posts, approvals, agent runs); Redis for queueing/state caching between agent handoffs.
API layer: REST or GraphQL API server exposing all data the frontend dashboard needs (campaigns, pods, approvals, event logs, analytics).
Realtime layer: WebSockets or Server-Sent Events for live dashboard updates (agent status changes, event log streaming, "Next Scheduled Action" countdown).
Background job runner: For scheduled/recurring tasks (weekly trend brief, scheduled publishing, 48-hour analytics pull).
Secrets management: A secrets manager (e.g., Vault, AWS Secrets Manager, or environment-based encrypted store) — platform credentials must never sit in agent prompts, code, or logs.
Observability: OpenTelemetry tracing on every agent call, plus structured logging for the audit trail.
2. CORE ARCHITECTURE — MANAGER-LED HIERARCHY
Implement a hierarchical orchestration pattern: the Manager Agent is the only node that communicates with every other agent. Specialist agents never call each other directly.
The Manager owns and persists a shared "campaign state" object per campaign/content item, tracking: current stage, approvals granted/pending, blockers, revision count, and full history of transitions.
Each specialist agent must be stateless between tasks — it receives its full required context as input and returns output; it does not remember prior calls.
Model tiering: route lightweight/deterministic tasks (character-limit checks, formatting validation, routing decisions) to a cheaper/smaller model; route strategy, writing, and quality-judgment tasks to a stronger reasoning model. Make this configurable per agent, not hardcoded.
3. BUILD THESE 9 AGENTS (as LangGraph/CrewAI nodes)

For each agent below, implement: input schema, output schema, the system prompt/role definition, and its explicit escalation condition (when it must stop and hand control back to the Manager instead of deciding on its own).

Manager Agent — assigns tasks, sequences the chain, tracks campaign state, applies human-approval gates, resolves inter-agent conflicts, reports status. Escalates only to the human owner (top of the chain).
Trend & Research Agent — Input: brand niche, competitor list, target platforms. Output: weekly trend brief, opportunity list. Escalates when a trend touches politics, tragedy, or controversy.
Content Strategy Agent — Input: trend brief, brand goals, past performance data. Output: content calendar (themes, formats, cadence). Escalates when a planned theme conflicts with brand guidelines or a client-specific restriction.
Copywriting Agent — Input: calendar item, brand voice guide. Output: draft copy variants per platform. Escalates when a claim in the copy can't be verified.
Visual/Design Agent — Input: calendar item, brand style guide. Output: image/video asset or a creative brief for a human designer. Escalates when the concept needs real photography, licensed footage, or a named public figure's likeness.
Scheduling & Publishing Agent — Input: approved post (copy + asset). Output: scheduled/published post, confirmation log. Escalates on platform API errors or policy-check failures.
Community Engagement Agent — Input: incoming comments/DMs. Output: replies sent, flagged-conversation list. Escalates on complaints, legal/safety issues, or anything a bot reply could worsen.
Quality & Brand-Safety Agent — Input: any draft ready to publish. Output: pass/fail + specific revision notes. This is the only agent allowed to grant final publish approval. Escalates when the same piece fails twice.
Analytics & Reporting Agent — Input: platform analytics APIs. Output: plain-language performance report fed back into the Strategy agent's next cycle. Escalates when a metric spikes/crashes outside its normal range.
4. THE "PERFECT CHAIN" — END-TO-END WORKFLOW LOGIC

Implement this exact sequence as a LangGraph state machine with conditional edges:

Trend & Research Agent produces weekly brief → Manager reviews → forwards to Strategy.
Content Strategy Agent builds the content calendar → held at a human sign-off gate (weekly calendar approval).
Per calendar item, run Copywriting and Visual agents in parallel → both outputs go to Quality & Brand-Safety together.
Quality Agent passes or returns with notes → on fail, Manager routes back to the relevant agent → loop until pass. Track fail count per item for the double-fail escalation rule.
On pass, Manager sends the finished post to Scheduling & Publishing.
Once live, Community Engagement Agent starts monitoring that post's replies/DMs.
After a configurable window (default 48 hours), Analytics & Reporting Agent pulls performance data and reports to the Manager.
Manager feeds performance data back into the Content Strategy Agent's next planning cycle — closing the loop.

Build this as a resumable, persisted graph — if the process crashes mid-chain, it must resume from the last completed stage, not restart.

5. HUMAN-IN-THE-LOOP APPROVAL GATES (hard requirements)

Implement blocking approval checkpoints — the chain must not proceed past these without an explicit human decision recorded in the database:

Weekly content calendar (before any drafting begins).
Any post the Quality & Brand-Safety Agent flags as borderline (neither clean pass nor fail).
Any community reply involving a complaint, legal matter, or anything beyond routine FAQ-style questions.
Paid promotion / ad-spend decisions (if/when ad spend is added later — build the hook now even if unused).

These gates must be configurable (an admin can loosen non-safety gates over time) but the brand-safety and complaint-handling gates must be non-removable in code, not just in UI.

Expose an Approval Queue API (list pending, approve, reject-with-notes, escalate) matching the frontend's "Approval Queue" screen.

6. GUARDRAILS & BRAND SAFETY (hard requirements)
A single versioned "brand voice and rules" document stored in the DB that every content-producing agent must fetch and include in its prompt context before generating anything. Version every change; log which version was used for every generated piece.
Enforce in code that only the Quality & Brand-Safety Agent can set a post's status to "approved for publish."
Sensitive-topic filter: build a classifier/check step (keyword + LLM-based) that auto-routes anything touching politics, tragedy, health claims, or competitor disputes to a human approval gate — never allow auto-publish for these.
Full audit log: every agent decision, revision, and approval must be written to an immutable log table with a timestamp, agent name, input/output summary, and resulting state transition. This must power the frontend's "Event Logs" screen and support tracing any published post back through its entire chain.
7. NON-FUNCTIONAL REQUIREMENTS
Requirement	Implementation detail
Latency	Routine community replies processed within minutes; content drafts ready within 1 hour of a calendar slot opening
Cost control	Enforce model tiering at the config level (cheap model for routing/formatting, strong model for writing/judgment); log token cost per agent call
Platform compliance	Respect each social platform's API rate limits and content policies; Publishing Agent must retry/backoff and handle API errors gracefully without crashing the chain
Security	All platform credentials in a secrets manager; never in agent prompts, code, or logs — enforce this with a lint/CI check
Observability	OpenTelemetry trace per agent call; structured logs; failures and slow steps must be visible on a dashboard, not silent
8. RISK MITIGATIONS TO BUILD IN
Hallucinated claims: Quality Agent must fact-check copy claims against a source-of-truth document; anything unverifiable is flagged, never published.
Mishandled community replies: Community Agent must default to "hand off to human" whenever confidence is low or a trigger keyword matches — never guess.
Silent chain failures: Manager must require an explicit success signal from each agent before advancing; implement timeouts that trigger a human alert if an agent doesn't respond in time.
Rising model costs: Implement caching for repeated research/context lookups (e.g., cache trend data and brand-voice doc fetches).
9. API SURFACE THE FRONTEND NEEDS

Build REST/GraphQL endpoints (and WebSocket/SSE channels) covering, at minimum:

GET /campaigns — list + status counts (total, completed, active, pending approval) — powers the top dashboard cards.
GET /campaigns/:id — full campaign detail + content calendar.
GET /agent-pods — live status per pod/agent (e.g., "Analyzing", "Generating", "Reviewing", "Standby", "Orchestrating", "Listening") — powers "Specialist Agent Pods."
GET /approval-queue + POST /approval-queue/:id/decision — powers "Approval Queue" and "Pending Approval."
GET /event-logs (paginated, filterable, live-streamed) — powers "Event Logs" and "Recent Directives."
GET /analytics/weekly-output — posts/assets per day — powers "Weekly Content Output" chart.
GET /analytics/campaign-velocity — dispatched/staged/remaining % — powers "Campaign Velocity" gauge.
GET /swarm/status — active pod count, current dispatch-loop uptime — powers "Swarm Orchestrator" panel.
POST /swarm/pause / POST /swarm/resume — powers the "Pause Swarm" control.
POST /directives — create a new manual directive/task — powers "+ New" on Recent Directives and "+ Add Directive."
10. DELIVERABLES EXPECTED FROM ANTIGRAVITY
Full backend codebase (folder structure, all agent definitions, orchestration graph, API server, DB schema/migrations).
Seed/mock data script so the existing frontend can be connected and demoed immediately.
.env.example listing every required secret/config value (LLM API keys, platform API keys, DB connection, secrets manager config).
README with setup instructions, architecture diagram (text or Mermaid), and how to run the full chain end-to-end locally.
Basic test suite covering: the approval-gate blocking logic, the double-fail escalation rule, and the sensitive-topic auto-routing rule (these three are the non-negotiable safety behaviors).

Build the system exactly to this spec — do not simplify away the human-in-the-loop gates, the stateless-agent constraint, or the audit log, even for an MVP. These are the parts of the PRD that make the system trustworthy enough to actually publish content autonomously.