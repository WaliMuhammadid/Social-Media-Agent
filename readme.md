Social Media AI Agent Team — System & Frontend ArchitectureAn autonomous, manager-led multi-agent system designed for end-to-end social media operations. This repository houses the complete project specifications, system architecture, folder structure, and frontend control dashboard implementation guidelines so it can be seamlessly executed in environments without direct file attachments.
  1. Project Vision & ArchitectureThe system operates on a hierarchical / manager-led orchestration pattern. Unlike free-form group chats, a central Manager Agent coordinates all specialist pods and holds the campaign state, ensuring strict quality gates, brand safety, and seamless sequential handoffs.  Core Pods & Agents Overview:Manager Agent: Owns the pipeline, task assignments, campaign state tracking, and human-approval gates.  Strategy Pod: Trend & Research Agent + Content Strategy Agent (calendar planning and brief generation).  Creation Pod: Copywriting Agent + Visual/Design Agent (drafting copy and visual asset creation).  Publishing Pod: Scheduling & Publishing Agent (API formatting and optimal scheduling).  Quality Pod: Quality & Brand-Safety Agent (final checkpoint for brand voice, factual claims, and compliance).  Engagement & Analytics Pods: Community Engagement Agent & Analytics/Reporting Agent (closing the feedback loop).  
  2. Repository Folder StructureThe project follows a strict modular structure optimized for scalability, maintainability, and clean separation of concerns:Plaintextsrc/
├── app/
│   ├── layout.tsx                # Root layout with providers & dark SaaS theme
│   ├── page.tsx                  # Manager Control Center & Global Campaign State
│   ├── calendar/                 # Content Strategy Calendar & Scheduling view
│   ├── pipeline/                 # Live Agent Chain Visualizer & Pod Status
│   ├── approvals/                # Human-in-the-loop Approval Gates queue
│   └── analytics/                # Performance metrics & feedback loop data
├── components/
│   ├── ui/                       # Reusable UI atoms (Buttons, Badges, Cards, Modals)
│   ├── dashboard/                # Manager status cards & quick metrics
│   ├── pipeline/                 # Visual step-by-step chain tracker
│   └── shared/                   # Sidebar, Navbar, Breadcrumbs
├── hooks/                        # Custom React hooks
├── lib/                          # Mock state & utility functions
└── types/                        # TypeScript interfaces for agents and posts
3. Frontend UI/UX & Technical StackFramework: Next.js (App Router) with TypeScript.  Styling & Icons: Tailwind CSS for modern dark SaaS styling, paired with Lucide React icons.Animations: GSAP and Framer Motion for smooth micro-interactions, state transitions, and live chain visualizers.Key Views to Implement:Manager Control Center (src/app/page.tsx): Real-time campaign state, global agent health across pods, and high-level success metrics.  Human-in-the-Loop Approval Queue (src/app/approvals/): Dedicated interface for human owners to review weekly calendars and borderline posts flagged by the Quality & brand-safety agent.  Live Agent Pipeline (src/app/pipeline/): Visual step-by-step tracker showing task progression through research, strategy, creation, quality checks, and publishing.  
4. Execution Guidelines for Antigravity AI AgentWhen building or expanding this project, reference this documentation as the absolute source of truth for PRD logic, folder hierarchy, and component scope. Ensure all code complies with strict TypeScript standards and uses the specified layout structure.