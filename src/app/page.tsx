import React from 'react';
import { MetricsSummary } from '@/components/dashboard/MetricsSummary';
import { CampaignOverviewCard } from '@/components/dashboard/CampaignOverviewCard';
import { AgentPodsGrid } from '@/components/dashboard/AgentPodsGrid';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { Bot, ShieldCheck, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function ManagerControlCenter() {
  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Executive Manager Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/80 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
              <Bot className="h-4 w-4" />
            </span>
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider font-mono">
              Manager Control Center
            </span>
            <Badge size="sm" variant="success" pulse>
              Autonomous Swarm Active
            </Badge>
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight">
            Multi-Agent Campaign Orchestration
          </h1>

          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Central Manager Agent coordinating 6 specialist pods across Strategy, Content Creation, Brand-Safety Verification, Publishing, and Real-Time Analytics feedback loops.
          </p>
        </div>

        {/* Quick Manager Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            icon={<SlidersHorizontal className="h-3.5 w-3.5" />}
          >
            Policy Rules
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Sparkles className="h-3.5 w-3.5" />}
          >
            Trigger New Directive
          </Button>
        </div>
      </div>

      {/* 1. High-Level Metrics Summary */}
      <MetricsSummary />

      {/* 2. Active Campaign Global State Card */}
      <CampaignOverviewCard />

      {/* 3. Pods Grid & Live Orchestration Activity Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left 2-Cols: Specialist Agent Pods Grid */}
        <div className="xl:col-span-2 space-y-6">
          <AgentPodsGrid />
        </div>

        {/* Right 1-Col: Live Sequential Handoff & Activity Feed */}
        <div className="xl:col-span-1 space-y-6">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
