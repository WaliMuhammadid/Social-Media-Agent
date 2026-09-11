import React from 'react';
import {
  Calendar,
  Layers,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockCampaignState } from '@/lib/mockData';
import { PlatformType } from '@/types';

export const CampaignOverviewCard: React.FC = () => {
  const percentage = Math.round(
    (mockCampaignState.completedPosts / mockCampaignState.totalPlannedPosts) * 100
  );

  const getPlatformIcon = (platform: PlatformType) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="h-3.5 w-3.5 text-sky-400" />;
      case 'linkedin':
        return <Linkedin className="h-3.5 w-3.5 text-blue-400" />;
      case 'instagram':
        return <Instagram className="h-3.5 w-3.5 text-pink-400" />;
      case 'youtube':
        return <Youtube className="h-3.5 w-3.5 text-rose-400" />;
    }
  };

  const getPlatformName = (platform: PlatformType) => {
    switch (platform) {
      case 'twitter':
        return 'X (Twitter)';
      case 'linkedin':
        return 'LinkedIn';
      case 'instagram':
        return 'Instagram';
      case 'youtube':
        return 'YouTube';
    }
  };

  return (
    <Card className="p-5 border-indigo-500/20 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/80">
      <CardHeader className="pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="purple" size="sm">
                Global Campaign State
              </Badge>
              <span className="text-[11px] text-slate-400 font-mono">
                Sprint 2 of 4
              </span>
            </div>
            <CardTitle className="text-lg text-white font-bold tracking-tight">
              {mockCampaignState.title}
            </CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              &quot;{mockCampaignState.slogan}&quot;
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-xs text-slate-300">
              <Calendar className="h-3.5 w-3.5 text-indigo-400" />
              <span>{mockCampaignState.startDate} &rarr; {mockCampaignState.endDate}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Progress & Milestone Bar */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            Active Sprint: {mockCampaignState.activeSprint}
          </span>
          <span className="font-semibold text-white">
            {mockCampaignState.completedPosts} / {mockCampaignState.totalPlannedPosts} Assets Finalized ({percentage}%)
          </span>
        </div>

        <div className="w-full bg-slate-800/90 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> 16 Drafted & Quality Checked
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <Clock className="h-3 w-3" /> 4 In Human Approval Gate
          </span>
          <span className="flex items-center gap-1 text-indigo-300">
            <Sparkles className="h-3 w-3" /> 8 In Strategy / Creation Pods
          </span>
        </div>
      </div>

      {/* Platform Breakdown & Manager Directives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
        {/* Multi-Platform Allocation */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
            Cross-Network Target Allocation
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {mockCampaignState.platforms.map((p) => (
              <div
                key={p.platform}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/70 hover:border-slate-700/80 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {getPlatformIcon(p.platform)}
                  <span className="text-xs text-slate-300 font-medium">
                    {getPlatformName(p.platform)}
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-white px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/50">
                  {p.postCount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Manager Directives & Safety Gates */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
            Manager Guardrails & Orchestration Policies
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/70 text-xs">
              <span className="text-slate-300 flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                Brand Safety Confidence Threshold
              </span>
              <span className="font-mono text-emerald-400 font-semibold">&gt; 95% Required</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/70 text-xs">
              <span className="text-slate-300 flex items-center gap-2">
                <ArrowUpRight className="h-3.5 w-3.5 text-indigo-400" />
                Sequential Handoff Validation
              </span>
              <span className="font-mono text-indigo-300 font-semibold">Enabled (Pod-by-Pod)</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
