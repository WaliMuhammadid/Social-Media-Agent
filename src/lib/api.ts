export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    let errorDetail = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const errJson = await res.json();
      if (errJson.detail) errorDetail = errJson.detail;
    } catch (_) {}
    throw new Error(errorDetail);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // Campaigns
  getCampaigns: (workspaceSlug = 'social-swarm-default') =>
    fetchJson<{
      statusCounts: { total: number; completed: number; active: number; pendingApproval: number };
      campaigns: any[];
    }>(`/campaigns?workspace_slug=${workspaceSlug}`),

  getCampaignById: (id: string) =>
    fetchJson<{
      id: string;
      name: string;
      title: string;
      status: string;
      currentStage: string;
      stages: string[];
      brandNiche: string;
      targetPlatforms: string[];
      totalPlannedPosts: number;
      completedPosts: number;
      pendingApprovalPosts: number;
      scheduledPosts: number;
      calendar: { day: string; date: string; posts: number; active: boolean; stage: string }[];
    }>(`/campaigns/${id}`),

  // Analytics
  getDashboardStats: (workspaceSlug = 'social-swarm-default') =>
    fetchJson<{
      totalCampaigns: { value: string; change: string; trend: string };
      completed: { value: string; change: string; trend: string };
      active: { value: string; change: string; trend: string };
      pendingApproval: { value: string; subtext: string };
    }>(`/analytics/dashboard-stats?workspace_slug=${workspaceSlug}`),

  getWeeklyOutput: () =>
    fetchJson<{
      unit: string;
      days: { day: string; label: string; assets: number; height: number; style: string; tooltip?: string }[];
    }>('/analytics/weekly-output'),

  getCampaignVelocity: () =>
    fetchJson<{
      overallPercentage: number;
      pacingTargetLabel: string;
      dispatched: number;
      staged: number;
      remaining: number;
      assetsProduced: number;
      assetsTarget: number;
    }>('/analytics/campaign-velocity'),

  getMetrics: (workspaceSlug = 'social-swarm-default') =>
    fetchJson<{ label: string; value: string | number; change: string; isPositive: boolean; subtext: string }[]>(
      `/analytics/metrics?workspace_slug=${workspaceSlug}`
    ),

  // Directives
  getDirectives: (workspaceSlug = 'social-swarm-default') =>
    fetchJson<{ id: string; title: string; due: string; pod: string; done: boolean; icon: string; color: string }[]>(
      `/directives?workspace_slug=${workspaceSlug}`
    ),

  getNextDirective: (workspaceSlug = 'social-swarm-default') =>
    fetchJson<{ id?: string; title: string; due: string; campaign: string; assetsSummary: string; pod: string }>(
      `/directives/next?workspace_slug=${workspaceSlug}`
    ),

  createDirective: (data: { title: string; due?: string; pod?: string; icon?: string; color?: string; workspace_slug?: string }) =>
    fetchJson<any>('/directives', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  toggleDirective: (id: string) =>
    fetchJson<{ id: string; done: boolean }>(`/directives/${id}/toggle`, {
      method: 'PATCH',
    }),

  // Agent Pods
  getAgentPods: () =>
    fetchJson<{
      id: string;
      name: string;
      description: string;
      statusLabel: string;
      status: string;
      lead: string;
      healthScore: number;
      activeTasksCount: number;
      completedTasksCount: number;
      icon: string;
      bgClass: string;
      badgeBg: string;
      model: string;
      taskDetail: string;
      connectedAccount: string;
    }[]>('/agent-pods'),

  // Swarm Orchestrator
  getSwarmStatus: () =>
    fetchJson<{
      status: string;
      isActive: boolean;
      uptimeSeconds: number;
      activePodCount: number;
      totalPodCount: number;
      loopMode: string;
    }>('/swarm/status'),

  pauseSwarm: () =>
    fetchJson<{ status: string; isActive: boolean; message: string }>('/swarm/pause', {
      method: 'POST',
    }),

  resumeSwarm: () =>
    fetchJson<{ status: string; isActive: boolean; message: string }>('/swarm/resume', {
      method: 'POST',
    }),

  // Approval Queue
  getApprovals: (workspaceSlug = 'social-swarm-default') =>
    fetchJson<{
      id: string;
      title: string;
      hook: string;
      content: string;
      platform: string;
      creatorAgent: string;
      qualityAuditReason: string;
      qualityScore: number;
      status: string;
      scheduledFor: string;
      gateType: string;
      createdAt: string;
    }[]>(`/approval-queue?workspace_slug=${workspaceSlug}`),

  submitApprovalDecision: (id: string, decision: 'Approve' | 'Reject' | 'Escalate', notes?: string) =>
    fetchJson<{
      id: string;
      status: string;
      decision: string;
      notes?: string;
      resolvedAt: string;
    }>(`/approval-queue/${id}/decision`, {
      method: 'POST',
      body: JSON.stringify({ decision, notes }),
    }),

  // Event Logs
  getEventLogs: (params: { workspace_slug?: string; search?: string; status?: string; pod?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params.workspace_slug) query.set('workspace_slug', params.workspace_slug);
    if (params.search) query.set('search', params.search);
    if (params.status && params.status !== 'All Statuses') query.set('status', params.status);
    if (params.pod && params.pod !== 'All Pods') query.set('pod', params.pod);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    return fetchJson<{
      total: number;
      page: number;
      limit: number;
      logs: {
        id: string;
        status: string;
        title: string;
        description: string;
        pod: string;
        podColor: string;
        podIcon: string;
        agent: string;
        time: string;
        timestamp: string;
      }[];
      kpis: {
        totalMutations: number;
        auditRate: string;
        pendingSignOff: number;
        activePods: string;
      };
    }>(`/event-logs?${query.toString()}`);
  },

  // Integrations
  getIntegrations: (workspaceSlug = 'social-swarm-default') =>
    fetchJson<{
      integrations: {
        id: string;
        platform: string;
        name: string;
        status: 'Connected' | 'Expired' | 'Disconnected';
        accountName: string | null;
        accountId: string | null;
        tokenExpiresAt: string | null;
        assignedPods: string[];
        isPublishingBlocked: boolean;
      }[];
      hasExpiredTokenAlert: boolean;
      expiredPlatforms: string[];
    }>(`/integrations?workspace_slug=${workspaceSlug}`),

  connectIntegration: (platform: string, workspaceSlug = 'social-swarm-default') =>
    fetchJson<{
      platform: string;
      isConfigured: boolean;
      authUrl: string;
      redirectUri?: string;
      appId?: string | null;
      message: string;
    }>(`/integrations/${platform}/connect?workspace_slug=${workspaceSlug}`, { method: 'POST' }),

  exchangeFacebookCode: (code: string, workspaceSlug = 'social-swarm-default', redirectUri?: string) =>
    fetchJson<{
      status: string;
      platform: string;
      accountName: string;
      accountId: string;
      tokenExpiresAt: string;
    }>('/integrations/facebook/exchange-token', {
      method: 'POST',
      body: JSON.stringify({ code, workspace_slug: workspaceSlug, redirect_uri: redirectUri }),
    }),

  verifyFacebookCredentials: (data: {
    account_name: string;
    page_id?: string;
    access_token?: string;
    workspace_slug?: string;
  }) =>
    fetchJson<{
      status: string;
      platform: string;
      accountName: string;
      accountId: string;
      tokenExpiresAt: string;
    }>('/integrations/facebook/verify-credentials', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  callbackIntegration: (platform: string, workspaceSlug = 'social-swarm-default') =>
    fetchJson<{ status: string; platform: string; accountName: string; tokenExpiresAt: string }>(
      `/integrations/${platform}/callback?workspace_slug=${workspaceSlug}`
    ),

  disconnectIntegration: (platform: string, workspaceSlug = 'social-swarm-default') =>
    fetchJson<{ status: string; platform: string; message: string }>(
      `/integrations/${platform}/disconnect?workspace_slug=${workspaceSlug}`,
      { method: 'DELETE' }
    ),

  simulateTokenExpiry: (platform: string, workspaceSlug = 'social-swarm-default') =>
    fetchJson<{ status: string; platform: string; alertTriggered: boolean; approvalQueueItemId: string; message: string }>(
      `/integrations/${platform}/expire?workspace_slug=${workspaceSlug}`,
      { method: 'POST' }
    ),

  // Workspaces & User Auth
  getWorkspaces: () =>
    fetchJson<{ id: string; name: string; slug: string; description?: string }[]>('/workspaces'),

  getCurrentUser: () =>
    fetchJson<{
      id: string;
      name: string;
      email: string;
      avatar: string;
      role: string;
      currentWorkspaceSlug: string;
    }>('/auth/me'),

  switchWorkspace: (slug: string) =>
    fetchJson<{ status: string; currentWorkspaceSlug: string }>('/workspaces/switch', {
      method: 'POST',
      body: JSON.stringify({ slug }),
    }),
};
