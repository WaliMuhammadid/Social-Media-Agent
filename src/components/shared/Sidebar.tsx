'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isOpen, closeSidebar } = useSidebar();

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      closeSidebar();
    }
  };

  const menuItems = [
    { label: 'Dashboard', href: '/', icon: 'dashboard', badge: null, active: true },
    { label: 'Campaigns', href: '/calendar', icon: 'campaign', badge: '12+' },
    { label: 'Agent Pods', href: '/pipeline', icon: 'smart_toy', badge: '6 Live', isLive: true },
    { label: 'Approval Queue', href: '/approvals', icon: 'fact_check', badge: '4' },
    { label: 'Analytics', href: '/analytics', icon: 'bar_chart', badge: null },
  ];

  const generalItems = [
    { label: 'Settings', href: '#settings', icon: 'settings' },
    { label: 'Help', href: '#help', icon: 'help_outline' },
    { label: 'Logout', href: '#logout', icon: 'logout' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          aria-hidden="true"
          className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar — Exactly matches Donezo reference styling */}
      <aside
        className={`fixed lg:absolute left-0 top-0 h-full w-56 bg-white z-50 flex flex-col select-none transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-slate-100/80 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand Logo — Donezo style swirl leaf logo + "Social Swarm" */}
          <div className="h-[72px] px-5 flex items-center justify-between shrink-0">
            <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
              {/* Concentric spiral/target green logo */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="16" fill="white" />
                  <circle cx="16" cy="16" r="12" stroke="#164e32" strokeWidth="2.5" fill="none" />
                  <path
                    d="M16 9C12.134 9 9 12.134 9 16C9 19.866 12.134 23 16 23C19.866 23 23 19.866 23 16C23 13.5 21.5 12 19.5 12C17.5 12 16.5 13.5 16.5 15V18"
                    stroke="#164e32"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="14" cy="16" r="1.5" fill="#164e32" />
                </svg>
              </div>
              <span className="text-[17px] font-extrabold text-slate-900 tracking-tight">Social Swarm</span>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={closeSidebar}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 lg:hidden cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Navigation Links Area */}
          <div className="flex flex-col flex-1 overflow-y-auto min-h-0 px-3 pb-3 space-y-5">
            {/* MENU Section */}
            <div>
              <div className="px-3 pb-2 pt-1 text-[11px] font-bold text-slate-400 tracking-wider">
                MENU
              </div>
              <nav className="flex flex-col gap-0.5">
                {menuItems.map((item) => {
                  const isActive = item.active || pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={handleNavClick}
                      className={`relative flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 text-[13px] font-medium group ${
                        isActive
                          ? 'text-[#164e32] font-bold bg-[#f2f7f4]'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      {/* Left indicator line for active item */}
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-[#164e32] rounded-r-full" />
                      )}

                      <div className="flex items-center gap-3 min-w-0">
                        {item.label === 'Dashboard' ? (
                          /* 4 rounded squares icon */
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={isActive ? '#164e32' : '#94a3b8'}
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="3" y="3" width="7" height="7" rx="2" fill={isActive ? '#164e32' : 'none'} />
                            <rect x="14" y="3" width="7" height="7" rx="2" fill={isActive ? '#164e32' : 'none'} />
                            <rect x="14" y="14" width="7" height="7" rx="2" fill={isActive ? '#164e32' : 'none'} />
                            <rect x="3" y="14" width="7" height="7" rx="2" fill={isActive ? '#164e32' : 'none'} />
                          </svg>
                        ) : item.label === 'Campaigns' ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                        ) : item.label === 'Agent Pods' ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="10" rx="2" />
                            <circle cx="12" cy="5" r="2" />
                            <path d="M12 7v4" />
                            <line x1="8" y1="16" x2="8" y2="16" />
                            <line x1="16" y1="16" x2="16" y2="16" />
                          </svg>
                        ) : item.label === 'Approval Queue' ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 11l3 3L22 4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                          </svg>
                        )}
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 leading-tight ${
                            item.isLive
                              ? 'bg-[#eaf6ee] text-[#164e32] border border-[#d2edd9]'
                              : 'bg-[#111827] text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* GENERAL Section */}
            <div>
              <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 tracking-wider">
                GENERAL
              </div>
              <nav className="flex flex-col gap-0.5">
                {generalItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={handleNavClick}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all text-[13px] font-medium cursor-pointer group"
                  >
                    {item.label === 'Settings' ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                    ) : item.label === 'Help' ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                    )}
                    <span className="truncate">{item.label}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Bottom Card — Donezo "Swarm Operations" style */}
          <div className="p-3 shrink-0">
            <div className="relative p-4 rounded-2xl bg-[#0e1f16] text-white space-y-3 overflow-hidden shadow-sm">
              {/* Decorative 3D green flow lines */}
              <svg
                className="absolute -right-3 -bottom-3 w-36 h-36 opacity-30 pointer-events-none"
                viewBox="0 0 100 100"
                fill="none"
              >
                <path d="M10 90C30 70 70 80 90 20" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" />
                <path d="M20 100C40 80 75 90 95 30" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
                <path d="M5 80C25 60 65 70 85 10" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
              </svg>

              {/* App icon badge */}
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/15">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>

              <div>
                <p className="text-[13px] font-bold leading-tight text-white">
                  Autonomous<br />Swarm Core
                </p>
                <p className="text-[11px] text-white/50 mt-1 font-normal">
                  6 pods active &amp; verified
                </p>
              </div>

              <button
                type="button"
                className="w-full py-2 rounded-xl bg-[#164e32] hover:bg-[#1d5c3d] text-white text-[12px] font-bold transition-colors cursor-pointer shadow-xs"
              >
                Live Console
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
