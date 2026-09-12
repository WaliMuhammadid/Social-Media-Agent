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
  ChevronDown,
  ChevronUp,
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
        return <ShieldAlert className="h-5 w-5 text-blue-700 shrink-0" />;
      case 'strategy':
        return <Compass className="h-5 w-5 text-sky-600 shrink-0" />;
      case 'creation':
        return <Sparkles className="h-5 w-5 text-purple-600 shrink-0" />;
      case 'quality':
        return <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />;
      case 'publishing':
        return <SendHorizontal className="h-5 w-5 text-amber-600 shrink-0" />;
      case 'engagement_analytics':
        return <BarChart3 className="h-5 w-5 text-pink-600 shrink-0" />;
    }
  };

  const filteredPods = selectedPodFilter === 'all'
    ? mockAgentPods
    : mockAgentPods.filter((pod) => pod.status === selectedPodFilter);

  const toggleExpand = (podId: PodType) => {
    setExpandedPod(expandedPod === podId ? null : podId);
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2 truncate">
            <Bot className="h-5 w-5 text-blue-700 shrink-0" />
            Agent Pods & Telemetry
          </h2>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            Real-time health, active tasks, and execution progress across all 6 pods
          </p>
        </div>

        {/* Filter Pills (Meta Ads tab filter style) */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-gray-100 border border-gray-200 text-xs shrink-0 overflow-x-auto">
          {[
            { label: 'All (6)', value: 'all' },
            { label: 'Running', value: 'working' },
            { label: 'Review Needed', value: 'waiting_approval' },
            { label: 'Idle', value: 'idle' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedPodFilter(tab.value)}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer font-semibold whitespace-nowrap ${
                selectedPodFilter === tab.value
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Responsive 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPods.map((pod: AgentPod) => {
          const isExpanded = expandedPod === pod.id;

          return (
            <Card
              key={pod.id}
              className="flex flex-col justify-between p-6 border-gray-200 bg-white shadow-xs hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="min-w-0">
                {/* Pod Header */}
                <div className="flex items-start justify-between gap-3 pb-4 mb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 shadow-2xs shrink-0">
                      {getPodIcon(pod.id)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 truncate">
                        {pod.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium truncate">
                        Lead: {pod.lead}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Badge status={pod.status} size="sm" />
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 leading-relaxed mb-5 line-clamp-2 min-h-[36px]">
                  {pod.description}
                </p>

                {/* Pod Metrics Bar: bold numeric values with muted labels underneath */}
                <div className="grid grid-cols-3 gap-2 p-3.5 rounded-xl bg-gray-50 border border-gray-200 mb-5 text-center">
                  <div className="min-w-0">
                    <div className="text-xl font-bold text-emerald-700 tracking-tight truncate">
                      {pod.healthScore}%
                    </div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5 truncate">
                      Health
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl font-bold text-gray-900 tracking-tight truncate">
                      {pod.activeTasksCount}
                    </div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5 truncate">
                      Active
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl font-bold text-blue-700 tracking-tight truncate">
                      {pod.agents.length}
                    </div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5 truncate">
                      Agents
                    </div>
                  </div>
                </div>

                {/* Specialist Agents inside this Pod */}
                <div className="space-y-2.5">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Specialists ({pod.agents.length})</span>
                    <span className="font-mono text-gray-500 text-[11px] truncate ml-2">
                      {pod.agents.reduce((acc, a) => acc + a.tokensUsed, 0).toLocaleString()} tok
                    </span>
                  </div>

                  {pod.agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="p-3 rounded-lg bg-gray-50/80 border border-gray-200 hover:border-gray-300 transition-colors min-w-0"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5 min-w-0">
                        <span className="font-bold text-xs text-gray-900 truncate flex-1">
                          {agent.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-gray-600 border border-gray-200 font-mono shrink-0">
                          {agent.model.split(' ')[0]}
                        </span>
                      </div>

                      {/* Current Task with break-words to prevent overflow */}
                      <p className="text-xs text-gray-600 mb-2 leading-relaxed break-words line-clamp-2">
                        <span className="text-gray-900 font-semibold">Task: </span>
                        {agent.currentTask}
                      </p>

                      {/* Clean thin progress bar */}
                      {agent.status === 'working' && (
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
                            <span>Progress</span>
                            <span className="font-bold text-gray-700">{agent.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#0064E0] h-full rounded-full transition-all duration-300"
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
              <div className="pt-4 mt-5 border-t border-gray-100 flex items-center justify-between min-w-0">
                <span className="text-xs text-gray-500 flex items-center gap-1.5 font-medium truncate">
                  <Activity className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  Live Stream
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpand(pod.id)}
                  className="text-xs text-blue-700 hover:text-blue-800 shrink-0"
                >
                  {isExpanded ? (
                    <>Hide <ChevronUp className="h-3.5 w-3.5 ml-1" /></>
                  ) : (
                    <>Details <ChevronDown className="h-3.5 w-3.5 ml-1" /></>
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
