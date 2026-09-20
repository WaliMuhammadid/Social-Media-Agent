'use client';

import React from 'react';
import Link from 'next/link';
import { useSidebar } from '@/context/SidebarContext';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useRealtime } from '@/context/RealtimeContext';

export const Navbar: React.FC = () => {
  const { toggleSidebar } = useSidebar();
  const { workspaces, currentWorkspace, selectWorkspace, currentUser } = useWorkspace();
  const { isConnected, isReconnecting } = useRealtime();

  return (
    <header className="h-[68px] sm:h-[72px] flex items-center justify-between px-3.5 sm:px-6 bg-white border-b border-slate-100 sticky top-0 z-40 w-full shrink-0">
      {/* Left: mobile toggle + workspace switcher + search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 mr-2 sm:mr-4">
        {/* Mobile hamburger */}
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-1 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer shrink-0"
          type="button"
          aria-label="Toggle navigation"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        {/* Workspace Switcher Selector */}
        <div className="relative hidden md:flex items-center">
          <select
            value={currentWorkspace?.slug || 'social-swarm-default'}
            onChange={(e) => selectWorkspace(e.target.value)}
            className="h-8 sm:h-9 bg-slate-50 border border-slate-200 text-slate-700 text-[11.5px] sm:text-[12.5px] font-semibold rounded-full pl-3 pr-8 focus:outline-none focus:border-[#164e32]/40 cursor-pointer appearance-none"
            title="Switch Client Workspace"
          >
            {workspaces.map((ws) => (
              <option key={ws.slug} value={ws.slug}>
                🏢 {ws.name}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-2.5 pointer-events-none text-slate-400 text-[14px]">
            expand_more
          </span>
        </div>

        {/* Search — Donezo: rounded-full pill, light border, "Search directives..." */}
        <div className="relative w-full max-w-[180px] sm:max-w-xs block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[16px] sm:text-[17px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full h-8 sm:h-9 bg-white border border-slate-200 pl-8 sm:pl-9 pr-8 sm:pr-12 rounded-full text-[12px] sm:text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#164e32]/40 focus:ring-2 focus:ring-[#164e32]/10 transition-all"
          />
          {/* ⌘F chip — hidden on small mobile, visible on sm+ */}
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 border border-slate-200 rounded px-1.5 py-0.5 pointer-events-none">
            <span className="text-[10px] text-slate-400">⌘</span>
            <span className="text-[10px] text-slate-400">F</span>
          </div>
        </div>
      </div>

      {/* Right: real-time indicator + mail + notification bell + user profile */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Realtime Stream Status indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all">
          {isConnected ? (
            <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-full border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Stream
            </span>
          ) : isReconnecting ? (
            <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/70">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              Reconnecting…
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              Connecting…
            </span>
          )}
        </div>

        {/* Mail icon */}
        <button
          type="button"
          className="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          title="Messages"
        >
          <span className="material-symbols-outlined text-[22px]">mail</span>
        </button>

        {/* Bell icon with green notification dot */}
        <button
          type="button"
          className="relative text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#1a5c38] ring-2 ring-white" />
        </button>

        {/* Vertical divider */}
        <div className="h-8 w-px bg-slate-100" />

        {/* Profile — Real authenticated user session */}
        <div className="flex items-center gap-3 cursor-pointer select-none">
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-[#eaf6ee] border border-emerald-200 flex items-center justify-center text-[20px] shadow-xs">
            {currentUser?.avatar || '🚀'}
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-[13.5px] font-bold text-slate-900 leading-tight">
              {currentUser?.name || 'Admin Operator'}
            </span>
            <span className="text-[11px] text-slate-400 leading-tight">
              {currentUser?.email || 'operator@socialswarm.ai'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

