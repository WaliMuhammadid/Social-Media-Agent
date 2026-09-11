'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  GitFork,
  CheckSquare,
  BarChart3,
  Bot,
  Activity,
  Settings,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { mockCampaignState, mockAgentPods } from '@/lib/mockData';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Manager Control Center',
      href: '/',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      name: 'Content Calendar',
      href: '/calendar',
      icon: Calendar,
      badge: `${mockCampaignState.scheduledPosts} Scheduled`,
    },
    {
      name: 'Live Agent Pipeline',
      href: '/pipeline',
      icon: GitFork,
      badge: 'Live',
    },
    {
      name: 'Approval Gates',
      href: '/approvals',
      icon: CheckSquare,
      badge: `${mockCampaignState.pendingApprovalPosts} Pending`,
      badgeVariant: 'warning' as const,
    },
    {
      name: 'Analytics & Feedback',
      href: '/analytics',
      icon: BarChart3,
      badge: undefined,
    },
  ];

  const activePodsCount = mockAgentPods.filter(p => p.status === 'working').length;

  return (
    <aside className="w-64 h-screen shrink-0 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between select-none z-30">
      {/* Top Section: Branding & Navigation */}
      <div className="flex flex-col">
        {/* Logo / Brand Header */}
        <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-md">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-white">Social Swarm</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-wide">Manager-Led Orchestrator</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Workspace Operations
          </div>
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150',
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_-3px_rgba(99,102,241,0.2)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 border border-transparent'
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0 transition-colors',
                      isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                    )}
                  />
                  <span className="truncate">{item.name}</span>
                </div>

                {item.badge && (
                  <Badge
                    size="sm"
                    variant={item.badgeVariant || (isActive ? 'info' : 'default')}
                    className="text-[9px] px-1.5 py-0"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>

        {/* Pod Status Mini-Overview */}
        <div className="px-4 py-3 mx-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-emerald-400" />
              Pod Health
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">
              {activePodsCount}/6 Active
            </span>
          </div>

          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mb-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(activePodsCount / 6) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Quality Gate: Active</span>
            <span className="text-amber-400 font-medium">1 Blocked</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Orchestrator Engine Status & System Info */}
      <div className="p-3 border-t border-slate-800/60 bg-slate-950/60">
        <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80 flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <div className="absolute -top-0.5 -left-0.5 h-3 w-3 rounded-full bg-emerald-400/40 animate-ping" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-200">Manager Engine</p>
              <p className="text-[9px] text-slate-400 font-mono">Loop: Autopilot Active</p>
            </div>
          </div>
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
        </div>

        <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 hover:text-slate-300 cursor-pointer">
            <Activity className="h-3 w-3 text-slate-400" /> Latency: 420ms
          </span>
          <span className="hover:text-slate-300 cursor-pointer">
            <Settings className="h-3.5 w-3.5 text-slate-400 hover:text-white transition-colors" />
          </span>
        </div>
      </div>
    </aside>
  );
};
