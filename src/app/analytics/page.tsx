import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-400" />
            Performance Metrics & Feedback Loop Data
          </h1>
          <p className="text-xs text-slate-400">
            Impressions, engagement rates, sentiment clustering, and feedback loop ingestion for Strategy Pod
          </p>
        </div>
        <Badge variant="success">Analytics Ingesting</Badge>
      </div>

      <Card className="p-8 text-center border-dashed border-slate-800">
        <TrendingUp className="h-10 w-10 text-indigo-400 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-white mb-1">Engagement & Analytics Feedback Loop</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Performance metrics ingested across X, LinkedIn, Instagram, and YouTube to auto-tune upcoming sprint prompts.
        </p>
      </Card>
    </div>
  );
}
