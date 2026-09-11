import React from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
  GitBranch,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockRecentActivity } from '@/lib/mockData';
import { ActivityEvent } from '@/types';

export const ActivityFeed: React.FC = () => {
  const getStatusIcon = (status: ActivityEvent['status']) => {
    switch (status) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case 'info':
        return <GitBranch className="h-4 w-4 text-indigo-400" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-rose-400" />;
    }
  };

  return (
    <Card className="p-5 border-slate-800/80 bg-slate-900/60">
      <CardHeader className="pb-3 mb-3 border-b border-slate-800/60 flex items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-400" />
            Manager Orchestration Log & Pod Handoffs
          </CardTitle>
          <p className="text-xs text-slate-400">
            Sequential handoffs, quality gate evaluations, and human checkpoint triggers
          </p>
        </div>

        <Link
          href="/pipeline"
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
        >
          Visual Pipeline <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>

      <div className="space-y-3">
        {mockRecentActivity.map((event) => (
          <div
            key={event.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/50 border border-slate-800/60 hover:border-slate-700/80 transition-colors"
          >
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
              {getStatusIcon(event.status)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">
                    {event.action}
                  </span>
                  <Badge size="sm" variant="default" className="text-[10px] px-1.5 py-0">
                    {event.pod.replace('_', ' & ')}
                  </Badge>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {event.timestamp}
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-1 leading-relaxed">
                {event.details}
              </p>

              <span className="text-[11px] text-indigo-300/80 font-mono">
                Initiated by: {event.agentName}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
