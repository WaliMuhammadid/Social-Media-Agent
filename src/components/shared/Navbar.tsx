'use client';

import React from 'react';
import Link from 'next/link';
import { useSidebar } from '@/context/SidebarContext';

export const Navbar: React.FC = () => {
  const { toggleSidebar } = useSidebar();

  return (
    /*
      Donezo navbar:
      - Pure white bg, no backdrop blur, no bottom shadow (just a very light border)
      - Height 72px
      - Left: search input (rounded-full, light border, magnifier + ⌘F chip)
      - Right: mail icon → bell icon (with green dot) → divider → profile (circle photo + name + email)
    */
    <header className="h-[72px] flex items-center justify-between px-6 bg-white border-b border-slate-100 sticky top-0 z-40 w-full shrink-0">

      {/* Left: mobile toggle + search */}
      <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
        {/* Mobile hamburger */}
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-1 rounded-xl text-slate-500 hover:bg-slate-100 lg:hidden cursor-pointer shrink-0"
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        {/* Search — Donezo: rounded-full pill, light border, "Search task" placeholder */}
        <div className="relative w-full max-w-xs hidden sm:block">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[17px]">search</span>
          <input
            type="text"
            placeholder="Search task"
            className="w-full h-9 bg-white border border-slate-200 pl-9 pr-14 rounded-full text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#1a5c38]/40 focus:ring-2 focus:ring-[#1a5c38]/10 transition-all"
          />
          {/* ⌘F chip — Donezo style: bordered box on right of input */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 border border-slate-200 rounded px-1.5 py-0.5 pointer-events-none">
            <span className="text-[10px] text-slate-400">⌘</span>
            <span className="text-[10px] text-slate-400">F</span>
          </div>
        </div>
      </div>

      {/* Right: icons + profile */}
      <div className="flex items-center gap-4 shrink-0">

        {/* Mail icon — Donezo: plain icon, no circle background */}
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
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#1a5c38] ring-2 ring-white"></span>
        </button>

        {/* Vertical divider */}
        <div className="h-8 w-px bg-slate-100"></div>

        {/* Profile — Donezo: circle avatar, name bold, email small gray */}
        <Link href="#profile" className="flex items-center gap-3 cursor-pointer select-none">
          {/* Memoji Avatar matching Totok Michael in Donezo image */}
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-[#fde68a] border border-amber-200 flex items-center justify-center text-[20px] shadow-xs">
            🧔‍♂️
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-[13.5px] font-bold text-slate-900 leading-tight">Totok Michael</span>
            <span className="text-[11px] text-slate-400 leading-tight">tmichael20@mail.com</span>
          </div>
        </Link>
      </div>
    </header>
  );
};
