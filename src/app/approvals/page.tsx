import React from 'react';
import { CheckSquare, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockCampaignState } from '@/lib/mockData';

export default function ApprovalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-amber-400" />
            Human-in-the-Loop Approval Gates Queue
          </h1>
          <p className="text-xs text-slate-400">
            Dedicated interface for human owners to review weekly calendars and borderline posts flagged by Quality Pod
          </p>
        </div>
        <Badge variant="warning" pulse>{mockCampaignState.pendingApprovalPosts} Gates Pending</Badge>
      </div>

      <Card className="p-8 text-center border-dashed border-slate-800">
        <AlertTriangle className="h-10 w-10 text-amber-400 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-white mb-1">Approval Gates Interface</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Allows Human Operators to approve, request revisions from the Copywriting Agent, or override brand safety flags.
        </p>
      </Card>
    </div>
  );
}
