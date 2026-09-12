'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  GitBranch,
  ArrowRight,
  Search,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockRecentActivity } from '@/lib/mockData';
import { ActivityEvent } from '@/types';

export const ActivityFeed: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'warning' | 'info'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const getStatusIcon = (status: ActivityEvent['status']) => {
    switch (status) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />;
      case 'info':
        return <GitBranch className="h-4 w-4 text-blue-700 shrink-0" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />;
    }
  };

  const getStatusBadge = (status: ActivityEvent['status']) => {
    switch (status) {
      case 'warning':
        return <Badge variant="warning" size="sm">Flagged</Badge>;
      case 'success':
        return <Badge variant="success" size="sm">Passed</Badge>;
      case 'info':
        return <Badge variant="info" size="sm">Handoff</Badge>;
      case 'alert':
        return <Badge variant="danger" size="sm">Failed</Badge>;
    }
  };

  const filteredLogs = mockRecentActivity.filter((event) => {
    const matchesStatus =
      statusFilter === 'all' || event.status === statusFilter;
    const matchesSearch =
      event.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.pod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.details && event.details.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  return (
    <Card className="p-6">
      {/* Table Header & Title */}
      <CardHeader className="pb-4 mb-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-700" />
            Manager Event Log & Sequential Handoffs
          </CardTitle>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time immutable audit trail of pod handoffs, quality gate validations, and human checkpoint requests
          </p>
        </div>

        <Link
          href="/pipeline"
          className="text-xs text-blue-700 hover:text-blue-800 flex items-center gap-1 font-semibold transition-colors shrink-0"
        >
          View Chain Visualizer <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>

      {/* Enterprise Top Toolbar: Search + Filter Dropdown + Refresh Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs, agents, or handoffs..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>

        {/* Filter Controls & Refresh */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Filter className="h-3.5 w-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="py-1.5 px-2.5 text-xs rounded-lg border border-gray-200 bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="all">Status: All</option>
              <option value="success">Status: Passed</option>
              <option value="warning">Status: Flagged</option>
              <option value="info">Status: Handoffs</option>
            </select>
          </div>

          <button
            onClick={handleRefresh}
            title="Refresh logs"
            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-blue-700' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Enterprise Data Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80 text-gray-500 uppercase tracking-wider font-semibold">
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action & Details</th>
              <th className="py-3 px-4">Agent Pod</th>
              <th className="py-3 px-4">Initiated By</th>
              <th className="py-3 px-4 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500 text-xs">
                  No matching log events found for &quot;{searchQuery}&quot;
                </td>
              </tr>
            ) : (
              filteredLogs.map((event) => (
                <tr
                  key={event.id}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(event.status)}
                      {getStatusBadge(event.status)}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-gray-900 leading-tight">
                      {event.action}
                    </p>
                    <p className="text-gray-500 text-[11px] mt-0.5 leading-normal">
                      {event.details}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-medium text-gray-700 capitalize bg-gray-50 px-2 py-0.5 rounded border border-gray-200 text-[11px]">
                      {event.pod.replace('_', ' & ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="text-gray-600 font-medium">
                      {event.agentName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-right text-gray-500 font-mono text-[11px] tabular-nums">
                    {event.timestamp}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
