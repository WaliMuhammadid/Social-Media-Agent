'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, MessageSquare, ArrowUpRight, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useWorkspace } from '@/context/WorkspaceContext';

export default function AnalyticsPage() {
  const { currentWorkspace } = useWorkspace();
  const [stats, setStats] = useState({
    totalImpressions: '428,500',
    engagementRate: '5.82%',
    commentsHandled: '142',
    sentimentScore: '94.2%',
  });

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const metrics = await api.getMetrics(currentWorkspace?.slug);
        if (metrics && metrics.length >= 4) {
          setStats({
            totalImpressions: String(metrics[0]?.value || '428,500'),
            engagementRate: String(metrics[1]?.value || '5.82%'),
            commentsHandled: String(metrics[2]?.value || '142'),
            sentimentScore: String(metrics[3]?.value || '94.2%'),
          });
        }
      } catch (err) {
        console.error('Failed to load analytics data:', err);
      }
    }
    loadAnalytics();
  }, [currentWorkspace?.slug]);

  const analyticsKpis = [
    { label: 'Total Impressions', value: stats.totalImpressions, change: '+22.4%', isPositive: true },
    { label: 'Engagement Rate', value: stats.engagementRate, change: '+1.4%', isPositive: true },
    { label: 'Audience Comments Handled', value: stats.commentsHandled, change: '84% automated', isPositive: true },
    { label: 'Feedback Sentiment Score', value: stats.sentimentScore, change: '+3.1%', isPositive: true },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#0064E0] border border-blue-200">
              <BarChart3 className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold text-[#0064E0] uppercase tracking-wider">
              Feedback Loop
            </span>
            <Badge variant="success">Real-time Stream</Badge>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Performance Metrics & Community Analytics
          </h1>
          <p className="text-xs text-gray-600">
            Analytics & Reporting Agent telemetry informing the Strategy Pod to auto-tune upcoming sprint prompts.
          </p>
        </div>

        <Button variant="primary" size="sm" icon={<TrendingUp className="h-3.5 w-3.5" />}>
          Export Meta Ads Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {analyticsKpis.map((kpi) => (
          <Card key={kpi.label} className="p-5">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {kpi.label}
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-extrabold text-gray-900">{kpi.value}</span>
              <span className="text-xs font-bold text-green-700">{kpi.change}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Feedback Loop Digest */}
      <Card className="p-6">
        <CardHeader className="pb-3 mb-4 border-b border-gray-100">
          <CardTitle className="text-sm font-bold text-gray-900">
            Closed-Loop Insights Fed Back to Strategy Pod
          </CardTitle>
        </CardHeader>
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs">
            <span className="font-bold text-gray-900">Insight #1 (X Thread Velocity):</span>
            <p className="text-gray-600 mt-1 leading-relaxed">
              Technical breakdowns featuring multi-agent benchmark comparisons generated 3.1x higher reply depth than generic summary announcements. Strategy Pod auto-prioritizing architecture slides for Sprint 3.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs">
            <span className="font-bold text-gray-900">Insight #2 (LinkedIn Carousel Dropoff):</span>
            <p className="text-gray-600 mt-1 leading-relaxed">
              Carousels with 5 slides retain 74% reader completion vs 41% on 8-slide decks. Creation Pod constrained to max 5 slides for upcoming batch.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
