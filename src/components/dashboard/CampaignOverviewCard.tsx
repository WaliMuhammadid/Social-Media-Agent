import React from 'react';
import {
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Shield,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockCampaignState } from '@/lib/mockData';
import { PlatformType } from '@/types';

// Custom lightweight platform SVGs
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c-.88 0-1.59-.71-1.59-1.59a1.59 1.59 0 0 1 3.18 0c0 .88-.71 1.59-1.59 1.59m1.39 9.74v-8.37H5.07v8.37h2.78z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const CampaignOverviewCard: React.FC = () => {
  const percentage = Math.round(
    (mockCampaignState.completedPosts / mockCampaignState.totalPlannedPosts) * 100
  );

  const getPlatformIcon = (platform: PlatformType) => {
    switch (platform) {
      case 'twitter':
        return <TwitterIcon className="h-4 w-4 text-sky-500" />;
      case 'linkedin':
        return <LinkedinIcon className="h-4 w-4 text-[#0064E0]" />;
      case 'instagram':
        return <InstagramIcon className="h-4 w-4 text-pink-600" />;
      case 'youtube':
        return <YoutubeIcon className="h-4 w-4 text-red-600" />;
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
    <Card className="p-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4 pb-4 mb-5 border-b border-gray-100 min-w-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Badge variant="info" size="sm">
              Active Campaign
            </Badge>
            <span className="text-xs text-gray-500 font-medium truncate">
              ID: {mockCampaignState.id}
            </span>
          </div>
          <h2 className="text-xl text-gray-900 font-bold truncate">
            {mockCampaignState.title}
          </h2>
          <p className="text-xs text-gray-600 mt-1 truncate">
            Objective: &quot;{mockCampaignState.slogan}&quot;
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 shrink-0">
            <Calendar className="h-4 w-4 text-[#0064E0] shrink-0" />
            <span>{mockCampaignState.startDate} &rarr; {mockCampaignState.endDate}</span>
          </div>
        </div>
      </div>

      {/* Progress & Milestone Bar in Meta Blue */}
      <div className="space-y-2 mb-6 min-w-0">
        <div className="flex items-center justify-between text-xs font-semibold gap-2 flex-wrap">
          <span className="text-gray-700 flex items-center gap-2 truncate">
            <Layers className="h-4 w-4 text-[#0064E0] shrink-0" />
            <span className="truncate">{mockCampaignState.activeSprint}</span>
          </span>
          <span className="text-gray-900 shrink-0">
            {mockCampaignState.completedPosts} / {mockCampaignState.totalPlannedPosts} Finished ({percentage}%)
          </span>
        </div>

        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden border border-gray-200">
          <div
            className="bg-[#0064E0] h-full rounded-full transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-gray-600 pt-1 gap-2">
          <span className="flex items-center gap-1.5 text-green-700 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" /> 16 Drafted & Approved
          </span>
          <span className="flex items-center gap-1.5 text-amber-700 font-medium">
            <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" /> 4 In Approval Gate
          </span>
          <span className="flex items-center gap-1.5 text-[#0064E0] font-medium">
            <Sparkles className="h-3.5 w-3.5 shrink-0" /> 8 In Specialist Pods
          </span>
        </div>
      </div>

      {/* Platform Allocation & Guardrail Policies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
        {/* Multi-Platform Placement Breakdown */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Placements & Network Allocation
          </h4>
          <div className="grid grid-cols-2 gap-2.5">
            {mockCampaignState.platforms.map((p) => (
              <div
                key={p.platform}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {getPlatformIcon(p.platform)}
                  <span className="text-xs text-gray-800 font-semibold">
                    {getPlatformName(p.platform)}
                  </span>
                </div>
                <span className="text-xs font-bold text-gray-900 px-2 py-0.5 rounded bg-white border border-gray-200 shadow-2xs">
                  {p.postCount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Manager Guardrails */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Active Guardrails & Verification Rules
          </h4>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs">
              <span className="text-gray-700 flex items-center gap-2 font-medium">
                <Shield className="h-4 w-4 text-green-600" />
                Brand Safety Confidence Threshold
              </span>
              <span className="font-bold text-green-700">&gt; 95% Required</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs">
              <span className="text-gray-700 flex items-center gap-2 font-medium">
                <ArrowUpRight className="h-4 w-4 text-[#0064E0]" />
                Manager Gate Progression Check
              </span>
              <span className="font-bold text-[#0064E0]">Sequential Pod-by-Pod</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
