export type AgentStatus = 'idle' | 'working' | 'waiting_approval' | 'completed' | 'error' | 'paused';

export type PodType = 
  | 'manager' 
  | 'strategy' 
  | 'creation' 
  | 'quality' 
  | 'publishing' 
  | 'engagement_analytics';

export interface SpecialistAgent {
  id: string;
  name: string;
  role: string;
  pod: PodType;
  status: AgentStatus;
  currentTask: string;
  progress: number; // 0 - 100
  model: string;
  tokensUsed: number;
  lastActive: string;
}

export interface AgentPod {
  id: PodType;
  name: string;
  description: string;
  status: AgentStatus;
  lead: string;
  agents: SpecialistAgent[];
  activeTasksCount: number;
  completedTasksCount: number;
  healthScore: number; // percentage
  iconName: string;
}

export type PlatformType = 'twitter' | 'linkedin' | 'instagram' | 'youtube';

export interface CampaignState {
  id: string;
  title: string;
  slogan: string;
  status: 'planning' | 'in_progress' | 'review' | 'published';
  startDate: string;
  endDate: string;
  totalPlannedPosts: number;
  completedPosts: number;
  pendingApprovalPosts: number;
  scheduledPosts: number;
  platforms: {
    platform: PlatformType;
    postCount: number;
    enabled: boolean;
  }[];
  activeSprint: string;
  qualityComplianceRate: number; // percentage
  brandSafetyCheckPassed: boolean;
}

export interface ManagerMetric {
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  subtext: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  agentName: string;
  pod: PodType;
  action: string;
  status: 'info' | 'success' | 'warning' | 'alert';
  details?: string;
}
