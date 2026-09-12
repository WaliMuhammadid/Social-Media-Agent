'use client';

import React, { useState, useEffect } from 'react';

export default function DashboardPage() {
  // Optional view tab to toggle between the Donezo Projects Overview and Autonomous Swarm Telemetry
  const [activeTab, setActiveTab] = useState<'projects' | 'swarm'>('projects');
  
  // Timer state for Time Tracker
  const [timerSeconds, setTimerSeconds] = useState(5048); // 01:24:08 in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-[1360px] mx-auto space-y-6 pb-6 select-none">
      {/* 1. TOP HEADER — Exactly matches Donezo reference */}
      <section className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[34px] sm:text-[38px] font-bold text-slate-900 tracking-tight leading-tight">
            Dashboard
          </h1>
          <p className="text-[14px] text-slate-400 font-normal">
            Plan, prioritize, and accomplish your tasks with ease.
          </p>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-3 shrink-0 pt-1">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#164e32] hover:bg-[#123e28] text-white text-[13.5px] font-semibold shadow-sm transition-all cursor-pointer"
          >
            <span className="text-[17px] font-bold leading-none">+</span>
            <span>Add Project</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-900 text-[13.5px] font-semibold shadow-xs transition-all cursor-pointer"
          >
            <span>Import Data</span>
          </button>
        </div>
      </section>

      {/* 2. TOP 4 METRIC CARDS ROW — Exactly matches Donezo reference */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Projects — Hero Deep Forest Green Card */}
        <div className="bg-[#164e32] p-5 rounded-[22px] text-white shadow-sm flex flex-col justify-between h-[175px] relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-[14px] font-medium text-white/90">Total Projects</span>
            {/* White circle with diagonal arrow ↗ */}
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 cursor-pointer shadow-xs">
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="#164e32" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div>
            <div className="text-[44px] font-bold tracking-tight text-white leading-none mb-3">24</div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/15 text-[11.5px] text-white font-normal">
              <span className="px-1 py-0.2 rounded bg-white/20 text-[10px] font-bold">5▲</span>
              <span>Increased from last month</span>
            </div>
          </div>
        </div>

        {/* Card 2: Ended Projects — Minimal White Card */}
        <div className="bg-white p-5 rounded-[22px] border border-slate-200/80 shadow-xs flex flex-col justify-between h-[175px]">
          <div className="flex items-start justify-between">
            <span className="text-[14px] font-medium text-slate-700">Ended Projects</span>
            <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center shrink-0 cursor-pointer">
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div>
            <div className="text-[44px] font-bold tracking-tight text-slate-900 leading-none mb-3">10</div>
            <div className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-400 font-normal">
              <span className="px-1 py-0.2 rounded border border-slate-200 text-slate-600 text-[10px] font-bold">6▲</span>
              <span>Increased from last month</span>
            </div>
          </div>
        </div>

        {/* Card 3: Running Projects — Minimal White Card */}
        <div className="bg-white p-5 rounded-[22px] border border-slate-200/80 shadow-xs flex flex-col justify-between h-[175px]">
          <div className="flex items-start justify-between">
            <span className="text-[14px] font-medium text-slate-700">Running Projects</span>
            <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center shrink-0 cursor-pointer">
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div>
            <div className="text-[44px] font-bold tracking-tight text-slate-900 leading-none mb-3">12</div>
            <div className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-400 font-normal">
              <span className="px-1 py-0.2 rounded border border-slate-200 text-slate-600 text-[10px] font-bold">2▲</span>
              <span>Increased from last month</span>
            </div>
          </div>
        </div>

        {/* Card 4: Pending Project — Minimal White Card */}
        <div className="bg-white p-5 rounded-[22px] border border-slate-200/80 shadow-xs flex flex-col justify-between h-[175px]">
          <div className="flex items-start justify-between">
            <span className="text-[14px] font-medium text-slate-700">Pending Project</span>
            <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center shrink-0 cursor-pointer">
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div>
            <div className="text-[44px] font-bold tracking-tight text-slate-900 leading-none mb-3">2</div>
            <div className="text-[12px] text-slate-400 font-medium">On Discuss</div>
          </div>
        </div>
      </section>

      {/* 3. MAIN DASHBOARD CONTENT GRID — EXACT SAME ORDER AS REFERENCE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN (lg:col-span-5) : Project Analytics + Team Collaboration */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card: Project Analytics — EXACT capsule bar chart with hatched lines */}
          <div className="bg-white rounded-[22px] border border-slate-200/80 p-5 shadow-xs">
            <h2 className="text-[15px] font-bold text-slate-900 mb-5">Project Analytics</h2>

            {/* Custom Capsule Bar Chart with SVG patterns */}
            <div className="relative w-full h-[200px] flex items-end justify-between px-2 pb-6">
              {/* SVG Pattern Definitions for diagonal hatched bars */}
              <svg className="absolute w-0 h-0">
                <defs>
                  <pattern
                    id="diagonalHatchBar"
                    width="6"
                    height="6"
                    patternTransform="rotate(45 0 0)"
                    patternUnits="userSpaceOnUse"
                  >
                    <line x1="0" y1="0" x2="0" y2="6" stroke="#94a3b8" strokeWidth="1.8" />
                  </pattern>
                </defs>
              </svg>

              {/* Sunday — Hatched */}
              <div className="flex flex-col items-center gap-2 w-10">
                <div className="relative w-9 h-[90px] rounded-full border border-slate-300 overflow-hidden">
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, #cbd5e1 0, #cbd5e1 1.5px, transparent 0, transparent 6px)',
                    }}
                  />
                </div>
                <span className="text-[12px] font-semibold text-slate-400">S</span>
              </div>

              {/* Monday — Solid Dark Green */}
              <div className="flex flex-col items-center gap-2 w-10">
                <div className="w-9 h-[125px] rounded-full bg-[#164e32]" />
                <span className="text-[12px] font-semibold text-slate-400">M</span>
              </div>

              {/* Tuesday — Mint Green with floating "74%" Tooltip */}
              <div className="flex flex-col items-center gap-2 w-10 relative">
                {/* 74% Tooltip Pill above bar */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#164e32] text-white text-[10.5px] font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                  74%
                  <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-1.5 h-1.5 bg-[#164e32] rotate-45" />
                </div>
                <div className="w-9 h-[105px] rounded-full bg-[#48a97c]" />
                <span className="text-[12px] font-semibold text-slate-400">T</span>
              </div>

              {/* Wednesday — Very Tall Solid Dark Forest Green */}
              <div className="flex flex-col items-center gap-2 w-10">
                <div className="w-9 h-[155px] rounded-full bg-[#0e3b24]" />
                <span className="text-[12px] font-semibold text-slate-400">W</span>
              </div>

              {/* Thursday — Hatched */}
              <div className="flex flex-col items-center gap-2 w-10">
                <div className="w-9 h-[95px] rounded-full border border-slate-300 overflow-hidden">
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, #cbd5e1 0, #cbd5e1 1.5px, transparent 0, transparent 6px)',
                    }}
                  />
                </div>
                <span className="text-[12px] font-semibold text-slate-400">T</span>
              </div>

              {/* Friday — Hatched */}
              <div className="flex flex-col items-center gap-2 w-10">
                <div className="w-9 h-[115px] rounded-full border border-slate-300 overflow-hidden">
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, #cbd5e1 0, #cbd5e1 1.5px, transparent 0, transparent 6px)',
                    }}
                  />
                </div>
                <span className="text-[12px] font-semibold text-slate-400">F</span>
              </div>

              {/* Saturday — Hatched */}
              <div className="flex flex-col items-center gap-2 w-10">
                <div className="w-9 h-[100px] rounded-full border border-slate-300 overflow-hidden">
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

          {/* Card: Team Collaboration — 4 member rows */}
          <div className="bg-white rounded-[22px] border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-[15px] font-bold text-slate-900">Team Collaboration</h2>
              <button
                type="button"
                className="px-3 py-1 rounded-full border border-slate-200 text-slate-600 text-[12px] font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                + Add Member
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {/* Member 1 */}
              <div className="py-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-[16px] shrink-0">
                    👩‍🦰
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-bold text-slate-900 truncate">Alexandra Deff</h3>
                    <p className="text-[11px] text-slate-400 truncate">Working on <strong className="font-semibold text-slate-600">Github Project Repository</strong></p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-[#eaf6ee] text-[#164e32] text-[11px] font-semibold shrink-0">
                  Completed
                </span>
              </div>

              {/* Member 2 */}
              <div className="py-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-[16px] shrink-0">
                    👨‍🦱
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-bold text-slate-900 truncate">Edwin Adenike</h3>
                    <p className="text-[11px] text-slate-400 truncate">Working on <strong className="font-semibold text-slate-600">Integrate User Authentication System</strong></p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-[#fef8ea] text-[#b45309] text-[11px] font-semibold shrink-0">
                  In Progress
                </span>
              </div>

              {/* Member 3 */}
              <div className="py-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-[16px] shrink-0">
                    👦
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-bold text-slate-900 truncate">Isaac Oluwatemilorun</h3>
                    <p className="text-[11px] text-slate-400 truncate">Working on <strong className="font-semibold text-slate-600">Develop Search and Filter Functionality</strong></p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-[#fdf2f4] text-[#e11d48] text-[11px] font-semibold shrink-0">
                  Pending
                </span>
              </div>

              {/* Member 4 */}
              <div className="py-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-[16px] shrink-0">
                    👨‍🦰
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-bold text-slate-900 truncate">David Oshodi</h3>
                    <p className="text-[11px] text-slate-400 truncate">Working on <strong className="font-semibold text-slate-600">Responsive Layout for Homepage</strong></p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-[#fef8ea] text-[#b45309] text-[11px] font-semibold shrink-0">
                  In Progress
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTER COLUMN (lg:col-span-3) : Reminders + Project Progress */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 space-y-5">
          {/* Card: Reminders */}
          <div className="bg-white rounded-[22px] border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-slate-900 mb-3">Reminders</h2>
              <p className="text-[17px] font-bold text-slate-900 leading-snug">
                Meeting with Arc Company
              </p>
              <p className="text-[12px] text-slate-400 mt-1 mb-5">
                Time : 02.00 pm - 04.00 pm
              </p>
            </div>

            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-full bg-[#164e32] hover:bg-[#123e28] text-white text-[13px] font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              <span>Start Meeting</span>
            </button>
          </div>

          {/* Card: Project Progress — EXACT Semicircular Donut/Gauge */}
          <div className="bg-white rounded-[22px] border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
            <h2 className="text-[15px] font-bold text-slate-900 mb-2">Project Progress</h2>

            {/* Semicircle Gauge SVG */}
            <div className="relative flex flex-col items-center justify-center my-2">
              <svg className="w-[190px] h-[110px]" viewBox="0 0 200 110">
                <defs>
                  {/* Gauge Hatch Pattern */}
                  <pattern
                    id="gaugeHatchPattern"
                    width="6"
                    height="6"
                    patternTransform="rotate(45 0 0)"
                    patternUnits="userSpaceOnUse"
                  >
                    <line x1="0" y1="0" x2="0" y2="6" stroke="#94a3b8" strokeWidth="2" />
                  </pattern>
                </defs>

                {/* Semicircular Arc Path: radius 80, stroke 22 */}
                {/* 1. Pending: full background arc with diagonal hatched pattern */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="url(#gaugeHatchPattern)"
                  strokeWidth="24"
                  strokeLinecap="round"
                />

                {/* 2. In Progress: mint green arc section */}
                <path
                  d="M 20 100 A 80 80 0 0 1 140 32"
                  fill="none"
                  stroke="#48a97c"
                  strokeWidth="24"
                  strokeLinecap="round"
                />

                {/* 3. Completed: dark forest green arc section */}
                <path
                  d="M 20 100 A 80 80 0 0 1 85 24"
                  fill="none"
                  stroke="#164e32"
                  strokeWidth="24"
                  strokeLinecap="round"
                />
              </svg>

              {/* Center text: 41% Project Ended */}
              <div className="absolute bottom-2 flex flex-col items-center">
                <span className="text-[34px] font-bold text-slate-900 tracking-tight leading-none">
                  41%
                </span>
                <span className="text-[11.5px] text-slate-400 font-medium mt-1">
                  Project Ended
                </span>
              </div>
            </div>

            {/* Legend matching Donezo reference */}
            <div className="flex items-center justify-center gap-4 text-[11px] font-medium text-slate-600 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#164e32] inline-block" />
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#48a97c] inline-block" />
                <span>In Progress</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-xs inline-block border border-slate-300"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #94a3b8 0, #94a3b8 1px, transparent 0, transparent 3px)',
                  }}
                />
                <span>Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN (lg:col-span-4) : Project List + Time Tracker */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card: Project List — 5 items with badges */}
          <div className="bg-white rounded-[22px] border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-[15px] font-bold text-slate-900">Project</h2>
              <button
                type="button"
                className="px-3 py-1 rounded-full border border-slate-200 text-slate-600 text-[12px] font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                + New
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {/* Item 1 */}
              <div className="py-2.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <line x1="4" y1="9" x2="20" y2="9" />
                    <line x1="4" y1="15" x2="20" y2="15" />
                    <line x1="10" y1="3" x2="8" y2="21" />
                    <line x1="16" y1="3" x2="14" y2="21" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-[13px] font-bold text-slate-900 truncate">Develop API Endpoints</h3>
                  <p className="text-[11px] text-slate-400">Due date: Nov 26, 2024</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="py-2.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-[13px] font-bold text-slate-900 truncate">Onboarding Flow</h3>
                  <p className="text-[11px] text-slate-400">Due date: Nov 28, 2024</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="py-2.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-[13px] font-bold text-slate-900 truncate">Build Dashboard</h3>
                  <p className="text-[11px] text-slate-400">Due date: Nov 30, 2024</p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="py-2.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-[13px] font-bold text-slate-900 truncate">Optimize Page Load</h3>
                  <p className="text-[11px] text-slate-400">Due date: Dec 5, 2024</p>
                </div>
              </div>

              {/* Item 5 */}
              <div className="py-2.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="12" r="3" />
                    <line x1="9" y1="12" x2="15" y2="12" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-[13px] font-bold text-slate-900 truncate">Cross-Browser Testing</h3>
                  <p className="text-[11px] text-slate-400">Due date: Dec 6, 2024</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Time Tracker — Exactly matches Donezo with 3D wave background */}
          <div className="bg-[#0b2014] rounded-[22px] p-5 text-white shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[175px]">
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
              <h2 className="text-[14px] font-semibold text-white/90">Time Tracker</h2>
              {/* Big Digital Clock */}
              <div className="text-[36px] sm:text-[38px] font-bold text-white text-center tracking-wider my-3 font-mono">
                {formatTimer(timerSeconds)}
              </div>
            </div>

            {/* Play/Pause and Stop Controls */}
            <div className="relative z-10 flex items-center justify-center gap-3">
              {/* Pause / Resume Button */}
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="w-12 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-slate-100 transition-transform active:scale-95 cursor-pointer shadow-sm"
                title={isTimerRunning ? 'Pause' : 'Resume'}
              >
                {isTimerRunning ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>

              {/* Stop Button */}
              <button
                type="button"
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(5048);
                }}
                className="w-10 h-10 rounded-full bg-[#dc2626] text-white flex items-center justify-center hover:bg-[#b91c1c] transition-transform active:scale-95 cursor-pointer shadow-sm"
                title="Stop / Reset"
              >
                <div className="w-3.5 h-3.5 bg-white rounded-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
