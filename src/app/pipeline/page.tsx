import React from 'react';
import { GitFork, Activity } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function PipelinePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <GitFork className="h-5 w-5 text-indigo-400" />
            Live Agent Chain Visualizer & Sequential Tracker
          </h1>
          <p className="text-xs text-slate-400">
            Step-by-step task progression across Strategy, Creation, Quality, and Publishing pods
          </p>
        </div>
        <Badge variant="success" pulse>Sequential Handoff Live</Badge>
      </div>

      <Card className="p-8 text-center border-dashed border-slate-800">
        <Activity className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-white mb-1">Live Agent Pipeline Tracker</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Interactive node visualizer showing execution handoffs and token telemetry in real time.
        </p>
      </Card>
    </div>
  );
}
