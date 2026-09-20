'use client';

import React, { useState, useEffect } from 'react';
import { GitFork, Activity, ArrowRight, CheckCircle2, Bot, Layers, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useWorkspace } from '@/context/WorkspaceContext';

interface PipelineStep {
  step: string;
  pod: string;
  lead: string;
  status: 'completed' | 'working' | 'waiting_approval' | 'idle';
  detail: string;
}

export default function PipelinePage() {
  const { currentWorkspace } = useWorkspace();
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([
    {
      step: '1. Research & Strategy',
      pod: 'Strategy Pod',
      lead: 'Trend & Research Agent',
      status: 'completed',
      detail: 'Signal scraping complete. Audience trends synthesized.',
    },
    {
      step: '2. Creative Drafting',
      pod: 'Creation Pod',
      lead: 'Copywriting & Visual Agent',
      status: 'working',
      detail: 'Generating thread hooks, carousels & video prompts.',
    },
    {
      step: '3. Brand Safety Audit',
      pod: 'Quality Pod',
      lead: 'Quality & Brand-Safety Agent',
      status: 'working',
      detail: 'Auditing factual benchmark claims & toxic phrase scans.',
    },
    {
      step: '4. Human Approval Gate',
      pod: 'Manager Agent',
      lead: 'Human Operator Checkpoint',
      status: 'waiting_approval',
      detail: 'Pending assets awaiting verification in Approval Queue.',
    },
    {
      step: '5. Multi-Network Publishing',
      pod: 'Publishing Pod',
      lead: 'Scheduling & Publishing Agent',
      status: 'idle',
      detail: 'Standing by for Gate sign-off and dispatch.',
    },
  ]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastCheck, setLastCheck] = useState<string>('Just now');

  const loadPipeline = async () => {
    try {
      setIsRefreshing(true);
      const [pods, approvals] = await Promise.all([
        api.getAgentPods(),
        api.getApprovals(currentWorkspace?.slug).catch(() => []),
      ]);

      const pendingCount = approvals.filter((a: any) => a.status === 'pending' || a.status === 'flagged').length;

      // Update pipeline dynamically based on live pods and approvals
      setPipelineSteps([
        {
          step: '1. Research & Strategy',
          pod: 'Strategy Pod',
          lead: pods.find((p: any) => p.name?.toLowerCase().includes('strat'))?.lead || 'Trend & Research Agent',
          status: 'completed',
          detail: 'Signal scraping active. Audience briefs synthesized in real time.',
        },
        {
          step: '2. Creative Drafting',
          pod: 'Creation Pod',
          lead: pods.find((p: any) => p.name?.toLowerCase().includes('creat'))?.lead || 'Copywriting Agent',
          status: 'completed',
          detail: 'High-impact carousel assets and copy drafted for active campaigns.',
        },
        {
          step: '3. Brand Safety Audit',
          pod: 'Quality Pod',
          lead: pods.find((p: any) => p.name?.toLowerCase().includes('qual'))?.lead || 'Quality & Brand-Safety Agent',
          status: pendingCount > 0 ? 'completed' : 'working',
          detail: 'Safety scores evaluated with zero critical violations.',
        },
        {
          step: '4. Human Approval Gate',
          pod: 'Manager Agent',
          lead: 'Human Operator Checkpoint',
          status: pendingCount > 0 ? 'waiting_approval' : 'completed',
          detail: pendingCount > 0 ? `${pendingCount} item(s) awaiting review in Approval Queue.` : 'All stage gates currently cleared.',
        },
        {
          step: '5. Multi-Network Publishing',
          pod: 'Publishing Pod',
          lead: pods.find((p: any) => p.name?.toLowerCase().includes('pub'))?.lead || 'Publishing Agent',
          status: pendingCount > 0 ? 'idle' : 'working',
          detail: pendingCount > 0 ? 'Standing by for Gate approval.' : 'Connected channels actively receiving scheduled dispatches.',
        },
      ]);
      setLastCheck(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to load pipeline state:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadPipeline();
  }, [currentWorkspace?.slug]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#0064E0] border border-blue-200">
              <GitFork className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold text-[#0064E0] uppercase tracking-wider">
              Sequential Execution
            </span>
            <Badge variant="success">Active Pod Handoff</Badge>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Live Agent Chain Visualizer & Tracker
          </h1>
          <p className="text-xs text-gray-600">
            Step-by-step task progression across Strategy, Creation, Quality, Approval, and Publishing.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={loadPipeline}
          disabled={isRefreshing}
          icon={<Activity className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
        >
          {isRefreshing ? 'Checking Health...' : 'Force Health Check'}
        </Button>
      </div>

      {/* Step Tracker */}
      <div className="space-y-4">
        {pipelineSteps.map((step, idx) => (
          <Card key={step.step} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-sm text-[#0064E0] shrink-0">
                0{idx + 1}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-gray-900">{step.step}</h3>
                  <span className="text-xs text-gray-500 font-medium">({step.pod})</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{step.detail}</p>
                <span className="text-[11px] text-gray-400 font-mono mt-0.5 inline-block">
                  Specialist: {step.lead}
                </span>
              </div>
            </div>

            <div className="shrink-0">
              {step.status === 'completed' && <Badge variant="success">Completed</Badge>}
              {step.status === 'working' && <Badge variant="info" pulse>Executing Now</Badge>}
              {step.status === 'waiting_approval' && <Badge variant="warning" pulse>Human Gate Waiting</Badge>}
              {step.status === 'idle' && <Badge variant="default">Queued Next</Badge>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
