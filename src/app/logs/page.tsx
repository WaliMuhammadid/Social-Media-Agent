'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface EventLog {
  id: string;
  status: 'Complete' | 'Pending Approval' | 'Auto-Approved' | 'Safety Cleared' | 'In Progress';
  title: string;
  description: string;
  pod: string;
  podColor: string;
  podIcon: string;
  agent: string;
  time: string;
}

const initialLogs: EventLog[] = [
  {
    id: 'EVT-1094',
    status: 'Pending Approval',
    title: 'High-Impact Carousel Stage: AI Agent Autonomy Slide Deck',
    description: 'Creation Pod completed 4 visual slides with Imagen 3. Safety score 98.4%. Requires human operator sign-off before dispatch.',
    pod: 'Creation Pod',
    podColor: 'bg-purple-50 text-purple-700 border-purple-200/60',
    podIcon: 'brush',
    agent: 'Agent-Creation-02',
    time: '14:22:18 EST',
  },
  {
    id: 'EVT-1093',
    status: 'Complete',
    title: 'Payload Dispatched: Tech Launch Announcement Thread',
    description: 'Simultaneous distribution via Meta Graph and X APIs. Initial reach: 1,420 accounts in 120 seconds.',
    pod: 'Publishing Pod',
    podColor: 'bg-sky-50 text-sky-700 border-sky-200/60',
    podIcon: 'cloud_upload',
    agent: 'Agent-Publish-01',
    time: '14:15:02 EST',
  },
  {
    id: 'EVT-1092',
    status: 'Safety Cleared',
    title: 'Multi-Modal Brand Alignment Audit: Q3 Autonomous Tech',
    description: 'Negative sentiment filter applied. Zero copyright or hallucination triggers detected across 4 assets.',
    pod: 'Quality Pod',
    podColor: 'bg-amber-50 text-amber-700 border-amber-200/70',
    podIcon: 'verified',
    agent: 'Agent-Audit-03',
    time: '14:08:44 EST',
  },
  {
    id: 'EVT-1091',
    status: 'Auto-Approved',
    title: 'Real-Time Audience Triage: 412 Comments Synthesized',
    description: 'Positive engagement clustered around technical specifications. 14 high-value replies auto-drafted.',
    pod: 'Engagement Pod',
    podColor: 'bg-teal-50 text-teal-700 border-teal-200/60',
    podIcon: 'forum',
    agent: 'Agent-Interact-01',
    time: '13:58:19 EST',
  },
  {
    id: 'EVT-1090',
    status: 'In Progress',
    title: 'Cross-Network Viral Latency Optimization Benchmark',
    description: 'Comparing organic reach curve against prior cohort. Strategy Pod adjusting dispatch frequency.',
    pod: 'Strategy Pod',
    podColor: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
    podIcon: 'query_stats',
    agent: 'Agent-Strategy-01',
    time: '13:42:10 EST',
  },
  {
    id: 'EVT-1089',
    status: 'Complete',
    title: 'Automated Token Refresh: LinkedIn OAuth v2 Handshake',
    description: 'Session credentials validated with zero token drop. Refresh window extended by 60 days.',
    pod: 'Publishing Pod',
    podColor: 'bg-sky-50 text-sky-700 border-sky-200/60',
    podIcon: 'cloud_upload',
    agent: 'Agent-Publish-02',
    time: '13:10:05 EST',
  },
  {
    id: 'EVT-1088',
    status: 'Safety Cleared',
    title: 'Red-Teaming Prompt Injection Stress Test: Model Router v4',
    description: '90 simulated jailbreak payloads executed against Claude 3.5 Sonnet router. Guardrails 100% intact.',
    pod: 'Quality Pod',
    podColor: 'bg-amber-50 text-amber-700 border-amber-200/70',
    podIcon: 'verified',
    agent: 'Agent-Audit-01',
    time: '12:45:30 EST',
  },
];

export default function EventLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [selectedPodFilter, setSelectedPodFilter] = useState('All Pods');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<EventLog | null>(null);

  const filteredLogs = initialLogs.filter((log) => {
    const matchesQuery =
      searchQuery === '' ||
      log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.pod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All Statuses' || log.status === statusFilter;

    const matchesPod =
      selectedPodFilter === 'All Pods' || log.pod === selectedPodFilter;

    return matchesQuery && matchesStatus && matchesPod;
  });

  const getStatusBadge = (status: EventLog['status']) => {
    switch (status) {
      case 'Complete':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#eaf6ee] text-[#164e32] border border-[#d2edd9]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#164e32]" />
            Complete
          </span>
        );
      case 'Pending Approval':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/70">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending Approval
          </span>
        );
      case 'Auto-Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Auto-Approved
          </span>
        );
      case 'Safety Cleared':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Safety Cleared
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            In Progress
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-[1360px] mx-auto space-y-6 pb-8 select-none">
      {/* Header Section */}
      <section className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[34px] sm:text-[38px] font-bold text-slate-900 tracking-tight leading-tight">
              Event Logs &amp; Audit
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#eaf6ee] text-[#164e32] border border-[#d2edd9] text-[11px] font-bold">
              Live Stream
            </span>
          </div>
          <p className="text-[14px] text-slate-400 font-normal">
            Deterministic audit ledger of multi-agent state mutations, directives, and approvals.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 pt-1">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-[13px] font-semibold shadow-xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Dashboard</span>
          </Link>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#164e32] hover:bg-[#123e28] text-white text-[13px] font-semibold shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Export Audit Log</span>
          </button>
        </div>
      </section>

      {/* KPI Highlights Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[22px] border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[13px] font-medium text-slate-500">Total Mutations Logged</span>
          <div className="text-[36px] font-bold text-slate-900 leading-none my-2">1,482</div>
          <span className="text-[11px] text-[#164e32] font-semibold">+68 in last 24 hours</span>
        </div>

        <div className="bg-white p-5 rounded-[22px] border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[13px] font-medium text-slate-500">Audit Verification Rate</span>
          <div className="text-[36px] font-bold text-slate-900 leading-none my-2">99.8%</div>
          <span className="text-[11px] text-[#164e32] font-semibold">Zero schema violations</span>
        </div>

        <div className="bg-white p-5 rounded-[22px] border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[13px] font-medium text-slate-500">Pending Operator Sign-off</span>
          <div className="text-[36px] font-bold text-amber-600 leading-none my-2">4</div>
          <span className="text-[11px] text-amber-700 font-semibold">Creation &amp; Quality Pods</span>
        </div>

        <div className="bg-white p-5 rounded-[22px] border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[13px] font-medium text-slate-500">Active Agent Pods</span>
          <div className="text-[36px] font-bold text-slate-900 leading-none my-2">6 / 6</div>
          <span className="text-[11px] text-slate-500 font-medium">All pods telemetry verified</span>
        </div>
      </section>

      {/* Event Log Table Card — Exact Donezo Card Styling */}
      <section className="bg-white rounded-[22px] border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Header & Filter Toolbar */}
        <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100">
          <div>
            <h2 className="text-[16px] font-bold text-slate-900">
              Manager Event Log &amp; Sequential Audit
            </h2>
            <p className="text-[12px] text-slate-400">
              Deterministic audit ledger of multi-agent state mutations
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64 min-w-[160px]">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[16px]">search</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 pl-8 pr-3 py-2 rounded-full text-[12px] text-slate-800 focus:outline-none focus:border-[#164e32]/40 placeholder:text-slate-400 transition-all"
                placeholder="Search events, pods, agents..."
                type="text"
              />
            </div>

            {/* Pod Filter */}
            <select
              value={selectedPodFilter}
              onChange={(e) => setSelectedPodFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-full text-[12px] text-slate-700 focus:outline-none cursor-pointer"
            >
              <option>All Pods</option>
              <option>Creation Pod</option>
              <option>Publishing Pod</option>
              <option>Quality Pod</option>
              <option>Engagement Pod</option>
              <option>Strategy Pod</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-full text-[12px] text-slate-700 focus:outline-none cursor-pointer"
            >
              <option>All Statuses</option>
              <option>Complete</option>
              <option>Pending Approval</option>
              <option>Auto-Approved</option>
              <option>Safety Cleared</option>
              <option>In Progress</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4 whitespace-nowrap">Status</th>
                <th className="py-3 px-3 min-w-[220px]">Event &amp; Directives</th>
                <th className="py-3 px-3 whitespace-nowrap">Agent Pod</th>
                <th className="py-3 px-3 whitespace-nowrap">Initiated By</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[12.5px] text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center text-slate-400">
                    No matching events found in audit buffer.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getStatusBadge(log.status)}
                    </td>
                    <td className="py-4 px-3 min-w-0 max-w-lg">
                      <div className="flex flex-col space-y-0.5 min-w-0">
                        <span className="font-bold text-slate-900 truncate text-[13px]">{log.title}</span>
                        <span className="text-slate-400 text-[11.5px] truncate">
                          {log.description}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${log.podColor}`}>
                        <span className="material-symbols-outlined text-[13px]">{log.podIcon}</span>
                        <span>{log.pod}</span>
                      </span>
                    </td>
                    <td className="py-4 px-3 whitespace-nowrap text-[11.5px] text-slate-500">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60 font-medium">
                        {log.agent}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-slate-500 whitespace-nowrap text-[11.5px]">
                      {log.time}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>Showing <strong className="text-slate-900 font-semibold">{filteredLogs.length}</strong> active events</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#164e32] font-medium">Continuous audit stream</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-400 disabled:opacity-40 cursor-pointer text-[12px] font-medium hover:bg-slate-50"
              disabled={currentPage === 1}
              type="button"
            >
              Prev
            </button>
            <span className="px-2 font-medium text-slate-700">1 / 3</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
              className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-[12px] font-medium cursor-pointer"
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Selected Event Details Modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="bg-white rounded-[24px] max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-slate-400">{selectedLog.id}</span>
                <h3 className="text-[16px] font-bold text-slate-900 leading-snug">{selectedLog.title}</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-[13px]">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Directive Details</label>
                <p className="text-slate-700 mt-1">{selectedLog.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400">Agent Pod</span>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedLog.pod}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400">Initiated By</span>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedLog.agent}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400">Status</span>
                  <div className="mt-1">{getStatusBadge(selectedLog.status)}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400">Timestamp</span>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedLog.time}</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-full bg-[#164e32] text-white text-[12.5px] font-semibold hover:bg-[#123e28] cursor-pointer"
              >
                Close Audit Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
