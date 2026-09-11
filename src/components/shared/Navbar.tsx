'use client';

import React from 'react';
import Link from 'next/link';
import {
  Bell,
  Sliders,
  Play,
  Pause,
  AlertTriangle,
  FolderGit2,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockCampaignState } from '@/lib/mockData';

export const Navbar: React.FC = () => {
  const [isPaused, setIsPaused] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1200);
  };

  return (
    <header className="h-16 shrink-0 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl px-6 flex items-center justify-between z-20">
      {/* Left side: Active Campaign Context & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <FolderGit2 className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white tracking-tight">
                {mockCampaignState.title}
              </span>
              <Badge size="sm" variant="success" pulse>
                Active Sprint
              </Badge>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Campaign ID: {mockCampaignState.id}
            </span>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        {/* Manager Mode indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Manager Gate: Strict Brand-Safety</span>
          <ShieldCheck className="h-3 w-3 text-emerald-400" />
        </div>
      </div>

      {/* Right side: Actions, Approval Alerts & Human-in-the-Loop Profile */}
      <div className="flex items-center gap-3">
        {/* Sync / Refresh Agent State button */}
        <button
          onClick={handleSync}
          title="Force Pod State Sync"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800/60 transition-colors"
        >
          <RefreshCw
            className={`h-4 w-4 ${isSyncing ? 'animate-spin text-indigo-400' : ''}`}
          />
        </button>

        {/* Pending Approvals quick-action */}
        <Link href="/approvals">
          <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/15 transition-colors cursor-pointer text-xs font-medium">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            <span>{mockCampaignState.pendingApprovalPosts} Gates Pending</span>
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping absolute -top-0.5 -right-0.5" />
          </div>
        </Link>

        {/* Autopilot Pause / Resume toggle */}
        <Button
          variant={isPaused ? 'primary' : 'secondary'}
          size="sm"
          onClick={handleTogglePause}
          icon={isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
        >
          {isPaused ? 'Resume Swarm' : 'Pause Swarm'}
        </Button>

        {/* Trigger Sprint Quick Action */}
        <Button
          variant="primary"
          size="sm"
          icon={<Sparkles className="h-3.5 w-3.5 text-indigo-200" />}
        >
          New Content Sprint
        </Button>

        <div className="h-5 w-px bg-slate-800 ml-1" />

        {/* Human Operator Avatar */}
        <div className="flex items-center gap-2.5 pl-1 cursor-pointer">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 p-0.5 shadow-md">
            <div className="h-full w-full bg-slate-900 rounded-full flex items-center justify-center font-bold text-xs text-indigo-300">
              HO
            </div>
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-medium text-slate-200 leading-tight">Human Operator</span>
            <span className="text-[10px] text-slate-400 leading-tight">Super Admin</span>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden xl:block" />
        </div>
      </div>
    </header>
  );
};
