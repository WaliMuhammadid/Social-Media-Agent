'use client';

import React, { useState, useEffect } from 'react';

export default function DashboardPage() {
  // Swarm Orchestrator timer & state
  const [orchestratorSeconds, setOrchestratorSeconds] = useState(5048); // 01:24:08 in seconds
  const [isSwarmActive, setIsSwarmActive] = useState(true);

  // Directives checklist state
  const [directives, setDirectives] = useState([
    { id: 1, title: 'Draft Carousel Slides on AI Safety', due: 'Due: 14:30 EST', pod: 'Creation', done: false, icon: 'brush', color: 'bg-purple-50 text-purple-600' },
    { id: 2, title: 'Scan Viral Latency Benchmarks', due: 'Due: 15:00 EST', pod: 'Strategy', done: true, icon: 'query_stats', color: 'bg-emerald-50 text-emerald-600' },
    { id: 3, title: 'Tone Alignment & Guardrail Audit', due: 'Due: 15:30 EST', pod: 'Quality', done: false, icon: 'verified', color: 'bg-amber-50 text-amber-600' },
    { id: 4, title: 'Deploy Automated X Replies', due: 'Due: 16:00 EST', pod: 'Engagement', done: false, icon: 'forum', color: 'bg-teal-50 text-teal-600' },
    { id: 5, title: 'OAuth Token Handshake & Drop', due: 'Due: 16:30 EST', pod: 'Publishing', done: true, icon: 'cloud_upload', color: 'bg-sky-50 text-sky-600' },
  ]);

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

  const toggleDirective = (id: number) => {
    setDirectives((prev) =>
      prev.map((d) => (d.id === id ? { ...d, done: !d.done } : d))
    );
  };


  return (
    <div className="w-full max-w-[1360px] mx-auto space-y-6 pb-8 select-none">
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
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-[#164e32] hover:bg-[#123e28] text-white text-[13.5px] font-semibold shadow-sm transition-all cursor-pointer"
          >
            <span className="text-[17px] font-bold leading-none">+</span>
            <span>Add Directive</span>
          </button>

          <button
            type="button"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-900 text-[13.5px] font-semibold shadow-xs transition-all cursor-pointer"
          >
            <span>Export Data</span>
          </button>
        </div>
      </section>

      {/* 2. 4 STAT CARDS ROW — Exactly matches Donezo Total/Ended/Running/Pending layout */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Total Campaigns — Hero Deep Forest Green Card */}
        <div className="bg-[#164e32] p-4 sm:p-5 rounded-[22px] text-white shadow-sm flex flex-col justify-between min-h-[165px] h-auto relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-[13.5px] sm:text-[14px] font-medium text-white/90">Total Campaigns</span>
            {/* White circle with diagonal arrow ↗ */}
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 cursor-pointer shadow-xs">
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="#164e32" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div>
            <div className="text-[38px] sm:text-[44px] font-bold tracking-tight text-white leading-none mb-2.5 sm:mb-3">24</div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/15 text-[11px] sm:text-[11.5px] text-white font-normal">
              <span className="px-1 py-0.2 rounded bg-white/20 text-[10px] font-bold">5▲</span>
              <span>+18.4% from last month</span>
            </div>
          </div>
        </div>

        {/* Card 2: Completed Campaigns — Minimal White Card */}
        <div className="bg-white p-4 sm:p-5 rounded-[22px] border border-slate-200/80 shadow-xs flex flex-col justify-between min-h-[165px] h-auto">
          <div className="flex items-start justify-between">
            <span className="text-[13.5px] sm:text-[14px] font-medium text-slate-700">Completed Campaigns</span>
            <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center shrink-0 cursor-pointer">
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div>
            <div className="text-[38px] sm:text-[44px] font-bold tracking-tight text-slate-900 leading-none mb-2.5 sm:mb-3">10</div>
            <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-[11.5px] text-slate-400 font-normal">
              <span className="px-1 py-0.2 rounded border border-slate-200 text-slate-600 text-[10px] font-bold">6▲</span>
              <span>+12% from last month</span>
            </div>
          </div>
        </div>

        {/* Card 3: Active Campaigns — Minimal White Card */}
        <div className="bg-white p-4 sm:p-5 rounded-[22px] border border-slate-200/80 shadow-xs flex flex-col justify-between min-h-[165px] h-auto">
          <div className="flex items-start justify-between">
            <span className="text-[13.5px] sm:text-[14px] font-medium text-slate-700">Active Campaigns</span>
            <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center shrink-0 cursor-pointer">
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div>
            <div className="text-[38px] sm:text-[44px] font-bold tracking-tight text-slate-900 leading-none mb-2.5 sm:mb-3">12</div>
            <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-[11.5px] text-slate-400 font-normal">
              <span className="px-1 py-0.2 rounded border border-slate-200 text-slate-600 text-[10px] font-bold">2▲</span>
              <span>In Flight · Day 14/30</span>
            </div>
          </div>
        </div>

        {/* Card 4: Pending Approval — Minimal White Card */}
        <div className="bg-white p-4 sm:p-5 rounded-[22px] border border-slate-200/80 shadow-xs flex flex-col justify-between min-h-[165px] h-auto">
          <div className="flex items-start justify-between">
            <span className="text-[13.5px] sm:text-[14px] font-medium text-slate-700">Pending Approval</span>
            <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center shrink-0 cursor-pointer">
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div>
            <div className="text-[38px] sm:text-[44px] font-bold tracking-tight text-slate-900 leading-none mb-2.5 sm:mb-3">4</div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/70 text-[11px] font-medium">
              Action Required
            </div>
          </div>
        </div>
      </section>

      {/* 3. MIDDLE ROW (3 Cards: Weekly Content Output / Next Scheduled Action / Recent Directives) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        {/* ========================================================================= */}
        {/* Card 1: Weekly Content Output (lg:col-span-5) — Exact Capsule Bar Chart */}
        {/* ========================================================================= */}
        <div className="col-span-1 md:col-span-2 lg:col-span-5 bg-white rounded-[22px] border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-slate-900">Weekly Content Output</h2>
            <span className="text-[11px] font-medium text-slate-400">Posts &amp; Assets / Day</span>
          </div>

          {/* Capsule Bar Chart matching Donezo reference — fully responsive capsules */}
          <div className="relative w-full h-[195px] flex items-end justify-between px-1 sm:px-2 pb-4 sm:pb-5">
            {/* Sun — Hatched (14 assets) */}
            <div className="flex-1 max-w-[38px] sm:max-w-[42px] flex flex-col items-center gap-2">
              <div className="relative w-7 sm:w-8 md:w-9 h-[85px] rounded-full border border-slate-300 overflow-hidden">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #cbd5e1 0, #cbd5e1 1.5px, transparent 0, transparent 6px)',
                  }}
                />
              </div>
              <span className="text-[12px] font-semibold text-slate-400">S</span>
            </div>

            {/* Mon — Solid Dark Green (28 assets) */}
            <div className="flex-1 max-w-[38px] sm:max-w-[42px] flex flex-col items-center gap-2">
              <div className="w-7 sm:w-8 md:w-9 h-[120px] rounded-full bg-[#164e32]" />
              <span className="text-[12px] font-semibold text-slate-400">M</span>
            </div>

            {/* Tue — Mint Green with floating "74%" Tooltip (24 assets) */}
            <div className="flex-1 max-w-[38px] sm:max-w-[42px] flex flex-col items-center gap-2 relative">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#164e32] text-white text-[10.5px] font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap z-10">
                74%
                <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-1.5 h-1.5 bg-[#164e32] rotate-45" />
              </div>
              <div className="w-7 sm:w-8 md:w-9 h-[100px] rounded-full bg-[#48a97c]" />
              <span className="text-[12px] font-semibold text-slate-400">T</span>
            </div>

            {/* Wed — Peak Tall Dark Forest Green (38 assets) */}
            <div className="flex-1 max-w-[38px] sm:max-w-[42px] flex flex-col items-center gap-2">
              <div className="w-7 sm:w-8 md:w-9 h-[155px] rounded-full bg-[#0e3b24]" />
              <span className="text-[12px] font-semibold text-slate-400">W</span>
            </div>

            {/* Thu — Hatched (16 assets) */}
            <div className="flex-1 max-w-[38px] sm:max-w-[42px] flex flex-col items-center gap-2">
              <div className="relative w-7 sm:w-8 md:w-9 h-[90px] rounded-full border border-slate-300 overflow-hidden">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #cbd5e1 0, #cbd5e1 1.5px, transparent 0, transparent 6px)',
                  }}
                />
              </div>
              <span className="text-[12px] font-semibold text-slate-400">T</span>
            </div>

            {/* Fri — Hatched (22 assets) */}
            <div className="flex-1 max-w-[38px] sm:max-w-[42px] flex flex-col items-center gap-2">
              <div className="relative w-7 sm:w-8 md:w-9 h-[110px] rounded-full border border-slate-300 overflow-hidden">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #cbd5e1 0, #cbd5e1 1.5px, transparent 0, transparent 6px)',
                  }}
                />
              </div>
              <span className="text-[12px] font-semibold text-slate-400">F</span>
            </div>

            {/* Sat — Hatched (18 assets) */}
            <div className="flex-1 max-w-[38px] sm:max-w-[42px] flex flex-col items-center gap-2">
              <div className="relative w-7 sm:w-8 md:w-9 h-[95px] rounded-full border border-slate-300 overflow-hidden">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #cbd5e1 0, #cbd5e1 1.5px, transparent 0, transparent 6px)',
                  }}
                />
              </div>
              <span className="text-[12px] font-semibold text-slate-400">S</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Card 2: Next Scheduled Action (lg:col-span-3) — Reminder Card Style */}
        {/* ========================================================================= */}
        <div className="col-span-1 md:col-span-1 lg:col-span-3 bg-white rounded-[22px] border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[15px] font-bold text-slate-900">Next Scheduled Action</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <p className="text-[16px] sm:text-[17px] font-bold text-slate-900 leading-snug">
              14:30 EST Meta Graph &amp; X Drop
            </p>
            <p className="text-[12px] text-slate-400 mt-1 mb-2">
              Q3 Autonomous Tech Launch
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-[11.5px] text-slate-600 border border-slate-100 mb-5">
              <span className="material-symbols-outlined text-[14px] text-[#164e32]">schedule</span>
              <span>4 Carousel Slides cleared</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full py-2.5 px-4 rounded-full bg-[#164e32] hover:bg-[#123e28] text-white text-[13px] font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            <span>View Details</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* Card 3: Recent Directives (lg:col-span-4) — Project List Style */}
        {/* ========================================================================= */}
        <div className="col-span-1 md:col-span-1 lg:col-span-4 bg-white rounded-[22px] border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-[15px] font-bold text-slate-900">Recent Directives</h2>
              <button
                type="button"
                className="px-3 py-1 rounded-full border border-slate-200 text-slate-600 text-[12px] font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                + New
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {directives.map((dir) => (
                <div
                  key={dir.id}
                  onClick={() => toggleDirective(dir.id)}
                  className="py-2.5 flex items-center justify-between gap-2.5 cursor-pointer group hover:bg-slate-50/60 px-1 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl ${dir.color} flex items-center justify-center shrink-0`}>
                      <span className="material-symbols-outlined text-[16px]">{dir.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className={`text-[13px] font-bold truncate transition-colors ${dir.done ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {dir.title}
                      </h3>
                      <p className="text-[11px] text-slate-400">{dir.due}</p>
                    </div>
                  </div>

                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${dir.done ? 'bg-[#164e32] border-[#164e32]' : 'border-slate-300'}`}>
                    {dir.done && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM ROW (3 Cards: Specialist Agent Pods / Campaign Velocity / Swarm Orchestrator) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        {/* ========================================================================= */}
        {/* Card 1: Specialist Agent Pods (lg:col-span-5) — Team Collaboration Style */}
        {/* ========================================================================= */}
        <div className="col-span-1 md:col-span-2 lg:col-span-5 bg-white rounded-[22px] border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-bold text-slate-900">Specialist Agent Pods</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#eaf6ee] text-[#164e32] border border-[#d2edd9]">
                  6 Live
                </span>
              </div>
              <button
                type="button"
                className="px-3 py-1 rounded-full border border-slate-200 text-slate-600 text-[12px] font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                + Add Pod
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {/* Pod 1: Manager Agent */}
              <div className="py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px]">account_tree</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-bold text-slate-900 truncate">Manager Agent</h3>
                    <p className="text-[11px] text-slate-400 truncate">Balancing distribution load · Claude 3.5 Sonnet</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[11px] font-semibold shrink-0">
                  Orchestrating
                </span>
              </div>

              {/* Pod 2: Strategy Pod */}
              <div className="py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px]">query_stats</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-bold text-slate-900 truncate">Strategy Pod</h3>
                    <p className="text-[11px] text-slate-400 truncate">Scanning viral benchmarks · DeepSeek R1</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-[#eaf6ee] text-[#164e32] text-[11px] font-semibold shrink-0">
                  Analyzing
                </span>
              </div>

              {/* Pod 3: Creation Pod */}
              <div className="py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px]">brush</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-bold text-slate-900 truncate">Creation Pod</h3>
                    <p className="text-[11px] text-slate-400 truncate">Drafting 4 carousel slides · GPT-4o &amp; Imagen 3</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[11px] font-semibold shrink-0">
                  Generating
                </span>
              </div>

              {/* Pod 4: Quality Pod */}
              <div className="py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-bold text-slate-900 truncate">Quality Pod</h3>
                    <p className="text-[11px] text-slate-400 truncate">Automated red-teaming checks · Custom Guard</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-semibold shrink-0">
                  Reviewing
                </span>
              </div>

              {/* Pod 5: Publishing Pod */}
              <div className="py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-bold text-slate-900 truncate">Publishing Pod</h3>
                    <p className="text-[11px] text-slate-400 truncate">Meta Graph &amp; X API · OAuth Live</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-700 text-[11px] font-semibold shrink-0">
                  Standby
                </span>
              </div>

              {/* Pod 6: Engagement Pod */}
              <div className="py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px]">forum</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-bold text-slate-900 truncate">Engagement Pod</h3>
                    <p className="text-[11px] text-slate-400 truncate">Synthesizing 412 comments · Triage Live</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[11px] font-semibold shrink-0">
                  Listening
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Card 2: Campaign Velocity (lg:col-span-3) — Exact Project Progress Gauge */}
        {/* ========================================================================= */}
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

            {/* Center text: 57.1% Campaign Velocity */}
            <div className="absolute bottom-2 flex flex-col items-center">
              <span className="text-[32px] sm:text-[34px] font-bold text-slate-900 tracking-tight leading-none">
                57.1%
              </span>
              <span className="text-[11.5px] text-slate-400 font-medium mt-1">
                Pacing Target
              </span>
            </div>
          </div>

          {/* Legend matching Donezo reference */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10.5px] font-medium text-slate-600 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#164e32] inline-block shrink-0" />
              <span>Dispatched (48%)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#48a97c] inline-block shrink-0" />
              <span>Staged (20%)</span>
            </div>
            <div className="flex items-center gap-1">
              <span
                className="w-2.5 h-2.5 rounded-xs inline-block border border-slate-300 shrink-0"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #94a3b8 0, #94a3b8 1px, transparent 0, transparent 3px)',
                }}
              />
              <span>Remaining (32%)</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Card 3: Swarm Orchestrator (lg:col-span-4) — Time Tracker Card Style */}
        {/* ========================================================================= */}
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
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {isSwarmActive ? 'Active · 6 Pods' : 'Paused'}
              </span>
            </div>

            {/* Clean Monospace-Free Digital Status Readout */}
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
              onClick={() => setIsSwarmActive(!isSwarmActive)}
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
              onClick={() => {
                setIsSwarmActive(true);
                setOrchestratorSeconds(0);
              }}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer border border-white/20"
              title="Sync Telemetry"
            >
              <span className="material-symbols-outlined text-[16px]">sync</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
