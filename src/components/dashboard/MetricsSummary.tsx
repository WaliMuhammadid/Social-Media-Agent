import React, { useEffect, useState } from 'react';
import { TrendingUp, AlertOctagon, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ManagerMetric } from '@/types';
import { mockManagerMetrics } from '@/lib/mockData';

export const MetricsSummary: React.FC = () => {
  const [metrics, setMetrics] = useState<ManagerMetric[]>(mockManagerMetrics);

  useEffect(() => {
    fetch('http://localhost:8000/analytics/metrics')
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(err => console.error("Backend connection error:", err));
  }, []);

  const metaThemes = [
    { icon: TrendingUp, accent: 'bg-blue-50 text-[#0064E0] border-blue-200' },
    { icon: AlertOctagon, accent: 'bg-amber-50 text-amber-700 border-amber-200' },
    { icon: ShieldCheck, accent: 'bg-green-50 text-green-700 border-green-200' },
    { icon: Cpu, accent: 'bg-purple-50 text-purple-700 border-purple-200' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {metrics.map((metric, idx) => {
        const theme = metaThemes[idx % metaThemes.length];
        const Icon = theme.icon;

        return (
          <Card key={metric.label} className="p-5 flex flex-col justify-between relative overflow-hidden">
            {/* Subtle blue top border highlight on first/key card */}
            {idx === 0 && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#0064E0]" />
            )}

            <div className="min-w-0">
              <div className="flex items-center justify-between mb-3 gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">
                  {metric.label}
                </span>
                <div className={`p-2 rounded-lg border ${theme.accent} shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="flex items-baseline gap-2.5 mb-1.5 flex-wrap">
                <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  {metric.value}
                </span>
                <span
                  className={`text-xs font-bold inline-flex items-center gap-0.5 ${
                    metric.isPositive ? 'text-green-700' : 'text-amber-700'
                  }`}
                >
                  <ArrowUpRight className="h-3 w-3 inline" />
                  {metric.change}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 mt-2 flex items-center justify-between text-xs text-gray-500 min-w-0">
              <span className="truncate">{metric.subtext}</span>
              <span className="text-[#0064E0] font-medium hover:underline cursor-pointer shrink-0 ml-2">
                Trend
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
