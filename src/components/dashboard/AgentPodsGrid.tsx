'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Compass,
  Sparkles,
  ShieldCheck,
  SendHorizontal,
  BarChart3,
  Bot,
  Activity,
  Cpu,
  ChevronDown,
  ChevronUp,
  Flame,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockAgentPods } from '@/lib/mockData';
import { AgentPod, PodType } from '@/types';

export const AgentPodsGrid: React.FC = () => {
  const [selectedPodFilter, setSelectedPodFilter] = useState<string>('all');
  const [expandedPod, setExpandedPod] = useState<PodType | null>(null);

  const getPodIcon = (podId: PodType) => {
    switch (podId) {
      case 'manager':
        return <ShieldAlert className="h-5 w-5 text-indigo-400" />;
      case 'strategy':
        return <Compass className="h-5 w-5 text-sky-400" />;
      case 'creation':
        return <Sparkles className="h-5 w-5 text-purple-400" />;
      case 'quality':
        return <ShieldCheck className="h-5 w-5 text-emerald-400" />;
      case 'publishing':
        return <SendHorizontal className="h-5 w-5 text-amber-400" />;
      case 'engagement_analytics':
        return <BarChart3 className="h-5 w-5 text-pink-400" />;
    }
  };

  const filteredPods = selectedPodFilter === 'all'
    ? mockAgentPods
    : mockAgentPods.filter((pod) => pod.status === selectedPodFilter);

  const toggleExpand = (podId: PodType) => {
    setExpandedPod(expandedPod === podId ? null : podId);
  };

  return (
    <div className="space-y-4">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
            <Bot className="h-4 w-4 text-indigo-400" />
            Specialist Agent Pods & Pod Telemetry
          </h2>
          <p className="text-xs text-slate-400">
            Real-time status, execution progress, and resource utilization across the hierarchical swarm
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
          {[
            { label: 'All Pods (6)', value: 'all' },
            { label: 'Working', value: 'working' },
            { label: 'Approval Required', value: 'waiting_approval' },
            { label: 'Idle', value: 'idle' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedPodFilter(tab.value)}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium ${
                selectedPodFilter === tab.value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Pod Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredPods.map((pod: AgentPod) => {
          const isExpanded = expandedPod === pod.id;

          return (
            <Card
              key={pod.id}
              glow
              glowColor={pod.status === 'waiting_approval' ? 'amber' : 'indigo'}
              className="flex flex-col justify-between p-5 border-slate-800/80 bg-slate-900/70"
            >
              <div>
                {/* Pod Header */}
                <CardHeader className="pb-3 mb-3 border-b border-slate-800/70">
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-sm">
                        {getPodIcon(pod.id)}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold text-white">
                          {pod.name}
                        </CardTitle>
                        <span className="text-[11px] text-indigo-300/80 font-mono">
                          Lead: {pod.lead}
                        </span>
                      </div>
                    </div>
                    <Badge status={pod.status} size="sm" />
                  </div>
                </CardHeader>

                {/* Description */}
                <CardDescription className="mb-4 line-clamp-2">
                  {pod.description}
                </CardDescription>

                {/* Pod Quick Stats */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/70 mb-4 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                      Health
                    </div>
                    <div className="text-xs font-bold text-emerald-400">
                      {pod.healthScore}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                      Active
                    </div>
                    <div className="text-xs font-bold text-white">
                      {pod.activeTasksCount} Tasks
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                      Agents
                    </div>
                    <div className="text-xs font-bold text-indigo-300">
                      {pod.agents.length} Online
                    </div>
                  </div>
                </div>

                {/* Specialist Agents inside this Pod */}
                <div className="space-y-2.5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Specialist Agents ({pod.agents.length})</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {pod.agents.reduce((acc, a) => acc + a.tokensUsed, 0).toLocaleString()} tokens
                    </span>
                  </div>

                  {pod.agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/60 hover:border-slate-700/80 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-semibold text-xs text-slate-200 truncate">
                            {agent.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                            {agent.model.split('/')[0]}
                          </span>
                        </div>
                        <Badge status={agent.status} size="sm" className="text-[10px] px-1.5 py-0" />
                      </div>

                      {/* Current Task */}
                      <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
                        <span className="text-slate-400 font-medium">Task: </span>
                        {agent.currentTask}
                      </p>

                      {/* Progress Bar */}
                      {agent.status === 'working' && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>Execution Progress</span>
                            <span className="font-mono text-slate-300">{agent.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div
                              className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                              style={{ width: `${agent.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Activity className="h-3 w-3 text-emerald-400" />
                  Telemetry streaming
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpand(pod.id)}
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  {isExpanded ? (
                    <>Less Details <ChevronUp className="h-3.5 w-3.5 ml-1" /></>
                  ) : (
                    <>Full Pod Logs <ChevronDown className="h-3.5 w-3.5 ml-1" /></>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
