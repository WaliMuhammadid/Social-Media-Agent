import React from 'react';
import { TrendingUp, AlertOctagon, ShieldCheck, Cpu } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { mockManagerMetrics } from '@/lib/mockData';

export const MetricsSummary: React.FC = () => {
  const icons = [
    { icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { icon: AlertOctagon, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { icon: Cpu, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {mockManagerMetrics.map((metric, idx) => {
        const iconConfig = icons[idx % icons.length];
        const Icon = iconConfig.icon;

        return (
          <Card key={metric.label} glow className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">{metric.label}</span>
              <div className={`p-2 rounded-lg border ${iconConfig.bg} ${iconConfig.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold tracking-tight text-white">{metric.value}</span>
                <span
                  className={`text-xs font-semibold ${
                    metric.isPositive ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {metric.change}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{metric.subtext}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
