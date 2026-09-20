'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useRealtime } from '@/context/RealtimeContext';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';

export default function DashboardPage() {
  const { currentWorkspace } = useWorkspace();
  const { isConnected, registerListener } = useRealtime();

  // 1. Top Card Stats - Honest Real Defaults
  const [stats, setStats] = useState({
    totalCampaigns: { value: '0', change: 'No campaigns yet', trend: '•' },
    completed: { value: '0', change: '0 finished', trend: '•' },
    active: { value: '0', change: 'Standing by', trend: '•' },
    pendingApproval: { value: '0', subtext: 'All caught up' },
  });

  // 2. Weekly Content Output
  const [weeklyOutput, setWeeklyOutput] = useState<{
    days: { day: string; label: string; assets: number; height: number; style: string; tooltip?: string }[];
  }>({
    days: [
      { day: 'S', label: 'Sun', assets: 0, height: 0, style: 'hatched' },
      { day: 'M', label: 'Mon', assets: 0, height: 0, style: 'hatched' },
      { day: 'T', label: 'Tue', assets: 0, height: 0, style: 'hatched' },
      { day: 'W', label: 'Wed', assets: 0, height: 0, style: 'hatched' },
      { day: 'T', label: 'Thu', assets: 0, height: 0, style: 'hatched' },
      { day: 'F', label: 'Fri', assets: 0, height: 0, style: 'hatched' },
      { day: 'S', label: 'Sat', assets: 0, height: 0, style: 'hatched' },
    ],
  });

  // 3. Next Scheduled Action
  const [nextAction, setNextAction] = useState({
    title: 'Swarm on Standby',
    due: 'No Action Pending',
    campaign: 'Create campaign or directive to begin',
    assetsSummary: 'Queue Idle',
    pod: 'Orchestrator',
  });

  // 4. Directives
  const [directives, setDirectives] = useState<any[]>([]);

  // 5. Specialist Agent Pods
  const [agentPods, setAgentPods] = useState<any[]>([]);

  // 6. Campaign Velocity
  const [velocity, setVelocity] = useState({
    overallPercentage: 0,
    pacingTargetLabel: 'Pacing Target',
    dispatched: 0,
    staged: 0,
    remaining: 100,
  });

  // 7. Swarm Orchestrator
  const [orchestratorSeconds, setOrchestratorSeconds] = useState(5048);
  const [isSwarmActive, setIsSwarmActive] = useState(true);
  const [activePodCount, setActivePodCount] = useState(6);

  // 8. Integrations Token Expiry Banner
  const [hasExpiredAlert, setHasExpiredAlert] = useState(false);
  const [expiredPlatforms, setExpiredPlatforms] = useState<string[]>([]);

  // 9. UI Modals / Loading
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isNewDirectiveOpen, setIsNewDirectiveOpen] = useState(false);
  const [newDirectiveTitle, setNewDirectiveTitle] = useState('');
  const [newDirectivePod, setNewDirectivePod] = useState('Creation');
  const [newDirectiveDue, setNewDirectiveDue] = useState('Due: 17:00 EST');

  // Load all live data from backend
  const loadDashboardData = useCallback(async () => {
    try {
      setErrorMsg(null);
      const wsSlug = currentWorkspace?.slug || 'social-swarm-default';

      const [statsData, weeklyData, nextDirData, dirsData, podsData, velData, swarmData, integData] =
        await Promise.allSettled([
          api.getDashboardStats(wsSlug),
          api.getWeeklyOutput(),
          api.getNextDirective(wsSlug),
          api.getDirectives(wsSlug),
          api.getAgentPods(),
          api.getCampaignVelocity(),
          api.getSwarmStatus(),
          api.getIntegrations(wsSlug),
        ]);

      if (statsData.status === 'fulfilled') setStats(statsData.value);
      if (weeklyData.status === 'fulfilled' && weeklyData.value.days) setWeeklyOutput(weeklyData.value);
      if (nextDirData.status === 'fulfilled') setNextAction(nextDirData.value);
      if (dirsData.status === 'fulfilled' && dirsData.value.length > 0) setDirectives(dirsData.value);
      if (podsData.status === 'fulfilled') setAgentPods(podsData.value);
      if (velData.status === 'fulfilled') setVelocity(velData.value);
      if (swarmData.status === 'fulfilled') {
        setIsSwarmActive(swarmData.value.isActive);
        setOrchestratorSeconds(swarmData.value.uptimeSeconds);
        setActivePodCount(swarmData.value.activePodCount);
      }
      if (integData.status === 'fulfilled') {
        setHasExpiredAlert(integData.value.hasExpiredTokenAlert);
        setExpiredPlatforms(integData.value.expiredPlatforms);
      }
    } catch (err: any) {
      console.error('Error loading dashboard live data:', err);
      setErrorMsg('Failed to connect to Social Swarm backend services. Please check network/API status.');
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkspace?.slug]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Realtime WebSocket listener registration
  useEffect(() => {
    const unregisterSwarm = registerListener('swarm_status', (data) => {
      if (data.isActive !== undefined) setIsSwarmActive(data.isActive);
      if (data.uptimeSeconds !== undefined) setOrchestratorSeconds(data.uptimeSeconds);
    });

    const unregisterPods = registerListener('pod_transition', (data) => {
      setAgentPods((prev) =>
        prev.map((p) => (p.id === data.podId ? { ...p, statusLabel: data.statusLabel, status: data.status } : p))
      );
    });

    const unregisterDirectives = registerListener('directive_update', () => {
      api.getDirectives(currentWorkspace?.slug).then((d) => setDirectives(d));
      api.getNextDirective(currentWorkspace?.slug).then((n) => setNextAction(n));
    });

    return () => {
      unregisterSwarm();
      unregisterPods();
      unregisterDirectives();
    };
  }, [registerListener, currentWorkspace?.slug]);

  // Live ticking counter synced with swarm active state
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isSwarmActive) {
      interval = setInterval(() => {
        setOrchestratorSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSwarmActive]);

  const formatUptime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Toggle directive with optimistic UI and live backend persistence
  const toggleDirective = async (id: string | number) => {
    const strId = String(id);
    setDirectives((prev) =>
      prev.map((d) => (String(d.id) === strId ? { ...d, done: !d.done } : d))
    );
    try {
      await api.toggleDirective(strId);
      // Refresh next scheduled action
      const next = await api.getNextDirective(currentWorkspace?.slug);
      setNextAction(next);
    } catch (err) {
      console.warn('Fallback toggling directive locally:', err);
    }
  };

  // Create new directive
  const handleCreateDirective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDirectiveTitle.trim()) return;

    try {
      const created = await api.createDirective({
        title: newDirectiveTitle.trim(),
        due: newDirectiveDue.trim() || 'Due: 17:00 EST',
        pod: newDirectivePod,
        workspace_slug: currentWorkspace?.slug,
      });

      setDirectives((prev) => [created, ...prev]);
      setNewDirectiveTitle('');
      setIsNewDirectiveOpen(false);
    } catch (err) {
      alert('Failed to save directive: ' + err);
    }
  };

  // Pause / Resume Swarm with optimistic UI & rollback
  const handleToggleSwarm = async () => {
    const previousState = isSwarmActive;
    setIsSwarmActive(!previousState);

    try {
      if (previousState) {
        await api.pauseSwarm();
      } else {
        await api.resumeSwarm();
      }
    } catch (err) {
      console.error('Swarm toggle failed, rolling back:', err);
      setIsSwarmActive(previousState);
      alert('Failed to update Swarm Orchestrator status on backend.');
    }
  };

  return (
    <div className="w-full max-w-[1360px] mx-auto space-y-6 pb-8 select-none">
      {/* 0. Expired Token Banner Alert */}
      {hasExpiredAlert && (
        <div className="p-4 rounded-[20px] bg-red-50 border border-red-200 text-red-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
            <div>
              <h4 className="text-[13.5px] font-bold">
                OAuth Token Expired for {expiredPlatforms.map((p) => p.toUpperCase()).join(', ')}
              </h4>
              <p className="text-[12px] text-red-700 mt-0.5">
                Publishing is paused and affected posts are routed to the Approval Queue. Reconnect immediately to resume.
              </p>
            </div>
          </div>
          <Link
            href="/settings/integrations"
            className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-[12px] font-bold shrink-0 self-start sm:self-center transition-colors shadow-xs"
          >
            Reconnect Now
          </Link>
        </div>
      )}

      {/* Error state if major API fails */}
      {errorMsg && (
        <ErrorState
          title="Backend Connection Notice"
          message={errorMsg}
          onRetry={loadDashboardData}
        />
      )}

      {/* 1. TOP HEADER — Exactly matches Donezo reference */}
      <section className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[30px] sm:text-[36px] md:text-[38px] font-bold text-slate-900 tracking-tight leading-tight">
            Dashboard
          </h1>
          <p className="text-[13px] sm:text-[14px] text-slate-400 font-normal">
            Plan, prioritize, and orchestrate autonomous social operations with ease.
          </p>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 shrink-0 pt-1 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsNewDirectiveOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-[#164e32] hover:bg-[#123e28] text-white text-[13.5px] font-semibold shadow-sm transition-all cursor-pointer"
          >
            <span className="text-[17px] font-bold leading-none">+</span>
            <span>Add Directive</span>
          </button>

          <button
            type="button"
            onClick={loadDashboardData}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-900 text-[13.5px] font-semibold shadow-xs transition-all cursor-pointer"
            title="Refresh live telemetry from backend"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span>Sync Live</span>
          </button>
        </div>
      </section>

      {/* 2. 4 STAT CARDS ROW — Strict 2 columns per row on mobile, 4 columns on desktop */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
        {/* Card 1: Total Campaigns — Hero Deep Forest Green Card */}
        <div className="col-span-1 min-w-0 bg-[#164e32] p-3 sm:p-5 rounded-[18px] sm:rounded-[22px] text-white shadow-sm flex flex-col justify-between min-h-[135px] sm:min-h-[165px] h-auto relative overflow-hidden">
          <div className="flex items-start justify-between gap-1">
            <span className="text-[11.5px] sm:text-[13px] md:text-[14px] font-medium text-white/90 leading-tight">
              Total Campaigns
            </span>
            <Link
              href="/calendar"
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
            >
              <svg width="10" height="10" className="sm:w-[13px] sm:h-[13px]" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="#164e32" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="mt-2">
            <div className="text-[26px] sm:text-[38px] lg:text-[44px] font-bold tracking-tight text-white leading-none mb-1.5 sm:mb-3">
              {stats.totalCampaigns.value}
            </div>
            <div className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-md bg-white/15 text-[9px] sm:text-[11.5px] text-white font-normal max-w-full">
              <span className="px-1 py-0.2 rounded bg-white/20 text-[8.5px] sm:text-[10px] font-bold shrink-0">
                {stats.totalCampaigns.trend}
              </span>
              <span className="truncate">{stats.totalCampaigns.change}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Completed Campaigns — Minimal White Card */}
        <div className="col-span-1 min-w-0 bg-white p-3 sm:p-5 rounded-[18px] sm:rounded-[22px] border border-slate-200/80 shadow-xs flex flex-col justify-between min-h-[135px] sm:min-h-[165px] h-auto">
          <div className="flex items-start justify-between gap-1">
            <span className="text-[11.5px] sm:text-[13px] md:text-[14px] font-medium text-slate-700 leading-tight">
              Completed
            </span>
            <Link
              href="/calendar"
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-slate-200 flex items-center justify-center shrink-0 cursor-pointer hover:bg-slate-50"
            >
              <svg width="10" height="10" className="sm:w-[13px] sm:h-[13px]" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="mt-2">
            <div className="text-[26px] sm:text-[38px] lg:text-[44px] font-bold tracking-tight text-slate-900 leading-none mb-1.5 sm:mb-3">
              {stats.completed.value}
            </div>
            <div className="inline-flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11.5px] text-slate-400 font-normal max-w-full">
              <span className="px-1 py-0.2 rounded border border-slate-200 text-slate-600 text-[8.5px] sm:text-[10px] font-bold shrink-0">
                {stats.completed.trend}
              </span>
              <span className="truncate">{stats.completed.change}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Active Campaigns — Minimal White Card */}
        <div className="col-span-1 min-w-0 bg-white p-3 sm:p-5 rounded-[18px] sm:rounded-[22px] border border-slate-200/80 shadow-xs flex flex-col justify-between min-h-[135px] sm:min-h-[165px] h-auto">
          <div className="flex items-start justify-between gap-1">
            <span className="text-[11.5px] sm:text-[13px] md:text-[14px] font-medium text-slate-700 leading-tight">
              Active
            </span>
            <Link
              href="/calendar"
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-slate-200 flex items-center justify-center shrink-0 cursor-pointer hover:bg-slate-50"
            >
              <svg width="10" height="10" className="sm:w-[13px] sm:h-[13px]" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="mt-2">
            <div className="text-[26px] sm:text-[38px] lg:text-[44px] font-bold tracking-tight text-slate-900 leading-none mb-1.5 sm:mb-3">
              {stats.active.value}
            </div>
            <div className="inline-flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11.5px] text-slate-400 font-normal max-w-full">
              <span className="px-1 py-0.2 rounded border border-slate-200 text-slate-600 text-[8.5px] sm:text-[10px] font-bold shrink-0">
                {stats.active.trend}
              </span>
              <span className="truncate">{stats.active.change}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Pending Approval — Minimal White Card */}
        <div className="col-span-1 min-w-0 bg-white p-3 sm:p-5 rounded-[18px] sm:rounded-[22px] border border-slate-200/80 shadow-xs flex flex-col justify-between min-h-[135px] sm:min-h-[165px] h-auto">
          <div className="flex items-start justify-between gap-1">
            <span className="text-[11.5px] sm:text-[13px] md:text-[14px] font-medium text-slate-700 leading-tight">
              Pending Approval
            </span>
            <Link
              href="/approvals"
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-slate-200 flex items-center justify-center shrink-0 cursor-pointer hover:bg-slate-50"
            >
              <svg width="10" height="10" className="sm:w-[13px] sm:h-[13px]" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="mt-2">
            <div className="text-[26px] sm:text-[38px] lg:text-[44px] font-bold tracking-tight text-slate-900 leading-none mb-1.5 sm:mb-3">
              {stats.pendingApproval.value}
            </div>
            <div className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/70 text-[9px] sm:text-[11px] font-medium max-w-full">
              <span className="truncate">{stats.pendingApproval.subtext}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MIDDLE ROW (3 Cards: Weekly Content Output / Next Scheduled Action / Recent Directives) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        {/* Card 1: Weekly Content Output (lg:col-span-5) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-5 bg-white rounded-[22px] border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-slate-900">Weekly Content Output</h2>
            <span className="text-[11px] font-medium text-slate-400">Posts &amp; Assets / Day</span>
          </div>

          {/* Capsule Bar Chart with Live Data */}
          <div className="relative w-full h-[195px] flex items-end justify-between px-1 sm:px-2 pb-4 sm:pb-5">
            {weeklyOutput.days.map((d, idx) => (
              <div key={idx} className="flex-1 max-w-[38px] sm:max-w-[42px] flex flex-col items-center gap-2 relative">
                {d.tooltip && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#164e32] text-white text-[10.5px] font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap z-10">
                    {d.tooltip}
                    <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-1.5 h-1.5 bg-[#164e32] rotate-45" />
                  </div>
                )}

                {d.style === 'solid_dark_peak' ? (
                  <div
                    className="w-7 sm:w-8 md:w-9 rounded-full bg-[#0e3b24]"
                    style={{ height: `${d.height}px` }}
                    title={`${d.assets} assets`}
                  />
                ) : d.style === 'mint' ? (
                  <div
                    className="w-7 sm:w-8 md:w-9 rounded-full bg-[#48a97c]"
                    style={{ height: `${d.height}px` }}
                    title={`${d.assets} assets`}
                  />
                ) : d.style === 'solid_dark' ? (
                  <div
                    className="w-7 sm:w-8 md:w-9 rounded-full bg-[#164e32]"
                    style={{ height: `${d.height}px` }}
                    title={`${d.assets} assets`}
                  />
                ) : (
                  <div
                    className="relative w-7 sm:w-8 md:w-9 rounded-full border border-slate-300 overflow-hidden"
                    style={{ height: `${d.height}px` }}
                    title={`${d.assets} assets`}
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(45deg, #cbd5e1 0, #cbd5e1 1.5px, transparent 0, transparent 6px)',
                      }}
                    />
                  </div>
                )}
                <span className="text-[12px] font-semibold text-slate-400">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Next Scheduled Action (lg:col-span-3) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-3 bg-white rounded-[22px] border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[15px] font-bold text-slate-900">Next Scheduled Action</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <p className="text-[16px] sm:text-[17px] font-bold text-slate-900 leading-snug">
              {nextAction.title}
            </p>
            <p className="text-[12px] text-slate-400 mt-1 mb-2">
              {nextAction.campaign}
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-[11.5px] text-slate-600 border border-slate-100 mb-5">
              <span className="material-symbols-outlined text-[14px] text-[#164e32]">schedule</span>
              <span>{nextAction.assetsSummary}</span>
            </div>
          </div>

          <Link
            href="/calendar"
            className="w-full py-2.5 px-4 rounded-full bg-[#164e32] hover:bg-[#123e28] text-white text-[13px] font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            <span>View Details</span>
          </Link>
        </div>

        {/* Card 3: Recent Directives (lg:col-span-4) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-4 bg-white rounded-[22px] border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-[15px] font-bold text-slate-900">Recent Directives</h2>
              <button
                type="button"
                onClick={() => setIsNewDirectiveOpen(true)}
                className="px-3 py-1 rounded-full border border-slate-200 text-slate-600 text-[12px] font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                + New
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-[220px] overflow-y-auto">
              {directives.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                    <span className="material-symbols-outlined text-[20px]">assignment</span>
                  </div>
                  <p className="text-[13px] font-semibold text-slate-700">No directives queued</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Click &ldquo;+ New&rdquo; to assign a directive to your agent pods.</p>
                </div>
              ) : (
                directives.map((dir) => (
                  <div
                    key={dir.id}
                    onClick={() => toggleDirective(dir.id)}
                    className="py-2.5 flex items-center justify-between gap-2.5 cursor-pointer group hover:bg-slate-50/60 px-1 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl ${dir.color || 'bg-purple-50 text-purple-600'} flex items-center justify-center shrink-0`}>
                        <span className="material-symbols-outlined text-[16px]">{dir.icon || 'brush'}</span>
                      </div>
                      <div className="min-w-0">
                        <h3
                          className={`text-[13px] font-bold truncate transition-colors ${
                            dir.done ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {dir.title}
                        </h3>
                        <p className="text-[11px] text-slate-400">{dir.due}</p>
                      </div>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        dir.done ? 'bg-[#164e32] border-[#164e32]' : 'border-slate-300'
                      }`}
                    >
                      {dir.done && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM ROW (3 Cards: Specialist Agent Pods / Campaign Velocity / Swarm Orchestrator) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        {/* Card 1: Specialist Agent Pods (lg:col-span-5) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-5 bg-white rounded-[22px] border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-bold text-slate-900">Specialist Agent Pods</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#eaf6ee] text-[#164e32] border border-[#d2edd9]">
                  {agentPods.length > 0 ? `${agentPods.length} Live` : '6 Live'}
                </span>
              </div>
              <Link
                href="/pipeline"
                className="px-3 py-1 rounded-full border border-slate-200 text-slate-600 text-[12px] font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                View Chain
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {(agentPods.length > 0 ? agentPods : [
                { id: 'manager', name: 'Manager Agent', taskDetail: 'Awaiting directive dispatch · Claude 3.5 Sonnet', statusLabel: 'Standby', icon: 'account_tree', bgClass: 'bg-blue-100 text-blue-700', badgeBg: 'bg-blue-50 text-blue-800' },
                { id: 'strategy', name: 'Strategy Pod', taskDetail: 'Standing by for audience niche briefing', statusLabel: 'Standby', icon: 'query_stats', bgClass: 'bg-emerald-100 text-emerald-800', badgeBg: 'bg-[#eaf6ee] text-[#164e32]' },
                { id: 'creation', name: 'Creation Pod', taskDetail: 'Standing by for creative copy prompts', statusLabel: 'Standby', icon: 'brush', bgClass: 'bg-purple-100 text-purple-700', badgeBg: 'bg-purple-50 text-purple-700' },
                { id: 'quality', name: 'Quality Pod', taskDetail: 'Guardrails active · Awaiting staged assets', statusLabel: 'Standby', icon: 'verified', bgClass: 'bg-amber-100 text-amber-800', badgeBg: 'bg-amber-50 text-amber-800' },
                { id: 'publishing', name: 'Publishing Pod', taskDetail: 'OAuth Standby · Queue empty', statusLabel: 'Standby', icon: 'cloud_upload', bgClass: 'bg-sky-100 text-sky-700', badgeBg: 'bg-sky-50 text-sky-700' },
                { id: 'engagement_analytics', name: 'Engagement Pod', taskDetail: 'Listener standing by for active channels', statusLabel: 'Standby', icon: 'forum', bgClass: 'bg-teal-100 text-teal-800', badgeBg: 'bg-teal-50 text-teal-800' },
              ]).map((pod) => (
                <div key={pod.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-full ${pod.bgClass} flex items-center justify-center shrink-0`}>
                      <span className="material-symbols-outlined text-[16px]">{pod.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[13px] font-bold text-slate-900 truncate">{pod.name}</h3>
                      <p className="text-[11px] text-slate-400 truncate">{pod.taskDetail}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-md ${pod.badgeBg} text-[11px] font-semibold shrink-0`}>
                    {pod.statusLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Campaign Velocity (lg:col-span-3) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-3 bg-white rounded-[22px] border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <h2 className="text-[15px] font-bold text-slate-900 mb-2">Campaign Velocity</h2>

          {/* Semicircle Gauge SVG */}
          <div className="relative flex flex-col items-center justify-center my-2">
            <svg className="w-[190px] h-[110px]" viewBox="0 0 200 110">
              <defs>
                <pattern
                  id="campaignVelocityHatch"
                  width="6"
                  height="6"
                  patternTransform="rotate(45 0 0)"
                  patternUnits="userSpaceOnUse"
                >
                  <line x1="0" y1="0" x2="0" y2="6" stroke="#94a3b8" strokeWidth="2" />
                </pattern>
              </defs>

              {/* 1. Remaining: 32% (hatched lines) */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#campaignVelocityHatch)"
                strokeWidth="24"
                strokeLinecap="round"
              />

              {/* 2. Staged: 20% (mint green) */}
              <path
                d="M 20 100 A 80 80 0 0 1 140 32"
                fill="none"
                stroke="#48a97c"
                strokeWidth="24"
                strokeLinecap="round"
              />

              {/* 3. Dispatched: 48% (dark forest green) */}
              <path
                d="M 20 100 A 80 80 0 0 1 95 22"
                fill="none"
                stroke="#164e32"
                strokeWidth="24"
                strokeLinecap="round"
              />
            </svg>

            {/* Center text */}
            <div className="absolute bottom-2 flex flex-col items-center">
              <span className="text-[32px] sm:text-[34px] font-bold text-slate-900 tracking-tight leading-none">
                {velocity.overallPercentage}%
              </span>
              <span className="text-[11.5px] text-slate-400 font-medium mt-1">
                {velocity.pacingTargetLabel}
              </span>
            </div>
          </div>

          {/* Legend matching Donezo reference */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10.5px] font-medium text-slate-600 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#164e32] inline-block shrink-0" />
              <span>Dispatched ({velocity.dispatched}%)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#48a97c] inline-block shrink-0" />
              <span>Staged ({velocity.staged}%)</span>
            </div>
            <div className="flex items-center gap-1">
              <span
                className="w-2.5 h-2.5 rounded-xs inline-block border border-slate-300 shrink-0"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #94a3b8 0, #94a3b8 1px, transparent 0, transparent 3px)',
                }}
              />
              <span>Remaining ({velocity.remaining}%)</span>
            </div>
          </div>
        </div>

        {/* Card 3: Swarm Orchestrator (lg:col-span-4) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-4 bg-[#0b2014] rounded-[22px] p-4 sm:p-5 text-white shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[185px] h-auto">
          {/* 3D Green Waves Background */}
          <svg
            className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
            viewBox="0 0 300 160"
            fill="none"
            preserveAspectRatio="none"
          >
            <path d="M0 160 C 50 100, 150 150, 300 80" stroke="#22c55e" strokeWidth="2" fill="none" />
            <path d="M0 140 C 70 80, 180 130, 300 50" stroke="#16a34a" strokeWidth="2" fill="none" />
            <path d="M0 120 C 90 60, 210 110, 300 20" stroke="#4ade80" strokeWidth="1.5" fill="none" />
            <path d="M0 100 C 110 40, 230 90, 300 0" stroke="#22c55e" strokeWidth="1" fill="none" />
            <path d="M50 160 C 120 110, 220 140, 300 110" stroke="#15803d" strokeWidth="3" fill="none" />
          </svg>

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-semibold text-white/90">Swarm Orchestrator</h2>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10.5px] font-bold border border-emerald-500/30">
                <span className={`w-1.5 h-1.5 rounded-full ${isSwarmActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {isSwarmActive ? `Active · ${activePodCount} Pods` : 'Paused'}
              </span>
            </div>

            {/* Monospace-Free Digital Status Readout */}
            <div className="text-[32px] sm:text-[38px] font-bold text-white text-center tracking-normal my-3">
              {formatUptime(orchestratorSeconds)}
            </div>
            <p className="text-[11px] text-white/60 text-center font-normal">
              Continuous multi-agent dispatch loop
            </p>
          </div>

          {/* Swarm Controls */}
          <div className="relative z-10 flex items-center justify-center gap-3 pt-2">
            {/* Pause / Resume Button */}
            <button
              type="button"
              onClick={handleToggleSwarm}
              className="px-4 py-2 rounded-full bg-white text-[#164e32] text-[12px] font-bold flex items-center gap-2 hover:bg-slate-100 transition-transform active:scale-95 cursor-pointer shadow-sm"
              title={isSwarmActive ? 'Pause Swarm' : 'Resume Swarm'}
            >
              {isSwarmActive ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                  <span>Pause Swarm</span>
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>Resume Swarm</span>
                </>
              )}
            </button>

            {/* Reset / Sync Button */}
            <button
              type="button"
              onClick={loadDashboardData}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer border border-white/20"
              title="Sync Telemetry"
            >
              <span className="material-symbols-outlined text-[16px]">sync</span>
            </button>
          </div>
        </div>
      </div>

      {/* New Directive Modal */}
      {isNewDirectiveOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">+ Add Manual Directive</h3>
              <button
                onClick={() => setIsNewDirectiveOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateDirective} className="space-y-3">
              <div>
                <label className="text-[12px] font-semibold text-slate-600 block mb-1">Directive Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Audit Brand Safety for X Thread #2"
                  value={newDirectiveTitle}
                  onChange={(e) => setNewDirectiveTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-[13px] text-slate-800 focus:outline-none focus:border-[#164e32]/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[12px] font-semibold text-slate-600 block mb-1">Target Pod</label>
                  <select
                    value={newDirectivePod}
                    onChange={(e) => setNewDirectivePod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-[12.5px] text-slate-800 focus:outline-none"
                  >
                    <option value="Strategy">Strategy Pod</option>
                    <option value="Creation">Creation Pod</option>
                    <option value="Quality">Quality Pod</option>
                    <option value="Publishing">Publishing Pod</option>
                    <option value="Engagement">Engagement Pod</option>
                    <option value="Manager">Manager Agent</option>
                  </select>
                </div>

                <div>
                  <label className="text-[12px] font-semibold text-slate-600 block mb-1">Due Window</label>
                  <input
                    type="text"
                    value={newDirectiveDue}
                    onChange={(e) => setNewDirectiveDue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-[12.5px] text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewDirectiveOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-[12px] font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#164e32] hover:bg-[#123e28] text-white text-[12px] font-bold shadow-xs cursor-pointer"
                >
                  Create Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

