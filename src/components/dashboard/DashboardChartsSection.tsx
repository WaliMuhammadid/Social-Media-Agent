'use client';

import React, { useState } from 'react';

// Data for Line/Area Chart: Campaign Velocity Trend (Last 14 Days)
interface VelocityDataPoint {
  day: string;
  velocity: number;
  target: number;
  assetsDispatched: number;
  date: string;
}

const velocityData: VelocityDataPoint[] = [
  { day: 'May 15', date: 'May 15', velocity: 4.2, target: 4.0, assetsDispatched: 2 },
  { day: 'May 16', date: 'May 16', velocity: 8.5, target: 8.0, assetsDispatched: 5 },
  { day: 'May 17', date: 'May 17', velocity: 12.1, target: 12.0, assetsDispatched: 7 },
  { day: 'May 18', date: 'May 18', velocity: 15.8, target: 16.0, assetsDispatched: 9 },
  { day: 'May 19', date: 'May 19', velocity: 21.3, target: 20.0, assetsDispatched: 13 },
  { day: 'May 20', date: 'May 20', velocity: 26.0, target: 24.0, assetsDispatched: 16 },
  { day: 'May 21', date: 'May 21', velocity: 29.4, target: 28.0, assetsDispatched: 18 },
  { day: 'May 22', date: 'May 22', velocity: 33.1, target: 32.0, assetsDispatched: 20 },
  { day: 'May 23', date: 'May 23', velocity: 36.8, target: 36.0, assetsDispatched: 22 },
  { day: 'May 24', date: 'May 24', velocity: 41.5, target: 40.0, assetsDispatched: 25 },
  { day: 'May 25', date: 'May 25', velocity: 45.0, target: 44.0, assetsDispatched: 27 },
  { day: 'May 26', date: 'May 26', velocity: 49.2, target: 48.0, assetsDispatched: 30 },
  { day: 'May 27', date: 'May 27', velocity: 53.0, target: 52.0, assetsDispatched: 32 },
  { day: 'Today', date: 'May 28', velocity: 57.1, target: 56.0, assetsDispatched: 34 },
];

export const DashboardChartsSection: React.FC = () => {
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(13);
  const [hoveredDonutSegment, setHoveredDonutSegment] = useState<string | null>(null);

  // SVG dimensions for Line Chart
  const svgWidth = 560;
  const svgHeight = 220;
  const paddingLeft = 40;
  const paddingRight = 24;
  const paddingTop = 32;
  const paddingBottom = 34;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const maxVal = 70;
  const minVal = 0;

  const getY = (val: number) => {
    return paddingTop + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;
  };

  const getX = (index: number) => {
    return paddingLeft + (index / (velocityData.length - 1)) * chartWidth;
  };

  // Smooth spline path generator using cubic bezier
  const createSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i < points.length - 2 ? points[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return path;
  };

  const velocityPointsList = velocityData.map((d, i) => ({ x: getX(i), y: getY(d.velocity) }));
  const smoothVelocityPath = createSmoothPath(velocityPointsList);
  const smoothAreaPath = `${smoothVelocityPath} L ${getX(velocityData.length - 1)},${getY(0)} L ${getX(0)},${getY(0)} Z`;

  const targetPointsList = velocityData.map((d, i) => ({ x: getX(i), y: getY(d.target) }));
  const smoothTargetPath = createSmoothPath(targetPointsList);

  const activePoint = hoveredPointIndex !== null ? velocityData[hoveredPointIndex] : velocityData[13];

  // DONUT CHART CALCULATIONS:
  // Circumference for r=70 is 2 * PI * 70 = 439.82
  const r = 70;
  const circ = 2 * Math.PI * r;

  // Segments:
  // Dispatched: 48% -> stroke-dasharray = (0.48 * 439.82) (remaining)
  // Staged: 20% -> (0.20 * 439.82)
  // Remaining: 32% -> (0.32 * 439.82)
  const dispatchedLen = 0.48 * circ;
  const stagedLen = 0.20 * circ;
  const remainingLen = 0.32 * circ;

  const dispatchedOffset = 0;
  const stagedOffset = -dispatchedLen;
  const remainingOffset = -(dispatchedLen + stagedLen);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
      {/* 1. DONUT/RADIAL CHART CARD: "Content Pipeline Breakdown" */}
      <div className="bg-white p-6 sm:p-8 rounded-[20px] border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-6 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[19px]">donut_large</span>
              </span>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Content Pipeline Breakdown
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Live payload distribution across 120 campaign milestones
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
            Pacing Nominal
          </span>
        </div>

        {/* Donut Chart & Clean Side Legend */}
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-around gap-6 py-2">
          {/* Radial Donut Visualization */}
          <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
              {/* Background Track */}
              <circle
                cx="90"
                cy="90"
                r={r}
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="20"
              />

              {/* Segment 3: Remaining Pipeline (32%) */}
              <circle
                cx="90"
                cy="90"
                r={r}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth={hoveredDonutSegment === 'remaining' ? '24' : '20'}
                strokeDasharray={`${remainingLen} ${circ}`}
                strokeDashoffset={remainingOffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredDonutSegment('remaining')}
                onMouseLeave={() => setHoveredDonutSegment(null)}
              />

              {/* Segment 2: Staged for Release (20%) */}
              <circle
                cx="90"
                cy="90"
                r={r}
                fill="none"
                stroke="#10b981"
                strokeWidth={hoveredDonutSegment === 'staged' ? '24' : '20'}
                strokeDasharray={`${stagedLen} ${circ}`}
                strokeDashoffset={stagedOffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredDonutSegment('staged')}
                onMouseLeave={() => setHoveredDonutSegment(null)}
              />

              {/* Segment 1: Dispatched (48%) */}
              <circle
                cx="90"
                cy="90"
                r={r}
                fill="none"
                stroke="#0f172a"
                strokeWidth={hoveredDonutSegment === 'dispatched' ? '24' : '20'}
                strokeDasharray={`${dispatchedLen} ${circ}`}
                strokeDashoffset={dispatchedOffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredDonutSegment('dispatched')}
                onMouseLeave={() => setHoveredDonutSegment(null)}
              />
            </svg>

            {/* Centered Percentage Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
                {hoveredDonutSegment === 'dispatched'
                  ? '48%'
                  : hoveredDonutSegment === 'staged'
                  ? '20%'
                  : hoveredDonutSegment === 'remaining'
                  ? '32%'
                  : '68%'}
              </span>
              <span className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                {hoveredDonutSegment === 'dispatched'
                  ? 'Dispatched'
                  : hoveredDonutSegment === 'staged'
                  ? 'Staged'
                  : hoveredDonutSegment === 'remaining'
                  ? 'Remaining'
                  : 'Finished'}
              </span>
            </div>
          </div>

          {/* Clean Side Legend with Color Dots */}
          <div className="space-y-3.5 w-full sm:w-auto">
            {/* Legend Item 1 */}
            <div
              className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-4 border ${
                hoveredDonutSegment === 'dispatched'
                  ? 'bg-slate-100/90 border-slate-300 shadow-2xs'
                  : 'bg-slate-50/60 border-transparent hover:bg-slate-50'
              }`}
              onMouseEnter={() => setHoveredDonutSegment('dispatched')}
              onMouseLeave={() => setHoveredDonutSegment(null)}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-slate-900 shrink-0"></span>
                <span className="text-xs font-bold text-slate-800">Dispatched</span>
              </div>
              <span className="text-xs font-bold text-slate-900">48% (58)</span>
            </div>

            {/* Legend Item 2 */}
            <div
              className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-4 border ${
                hoveredDonutSegment === 'staged'
                  ? 'bg-emerald-50/90 border-emerald-300 shadow-2xs'
                  : 'bg-slate-50/60 border-transparent hover:bg-slate-50'
              }`}
              onMouseEnter={() => setHoveredDonutSegment('staged')}
              onMouseLeave={() => setHoveredDonutSegment(null)}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="text-xs font-bold text-slate-800">Staged for Release</span>
              </div>
              <span className="text-xs font-bold text-emerald-700">20% (24)</span>
            </div>

            {/* Legend Item 3 */}
            <div
              className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-4 border ${
                hoveredDonutSegment === 'remaining'
                  ? 'bg-slate-200/80 border-slate-300 shadow-2xs'
                  : 'bg-slate-50/60 border-transparent hover:bg-slate-50'
              }`}
              onMouseEnter={() => setHoveredDonutSegment('remaining')}
              onMouseLeave={() => setHoveredDonutSegment(null)}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-slate-300 shrink-0"></span>
                <span className="text-xs font-bold text-slate-800">Remaining Pipeline</span>
              </div>
              <span className="text-xs font-bold text-slate-500">32% (38)</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 flex-wrap gap-2">
          <span className="font-medium text-slate-500">Total Milestones: 82 / 120 completed</span>
          <span className="text-emerald-700 font-semibold">Active Swarm Buffer</span>
        </div>
      </div>

      {/* 2. LINE / AREA CHART CARD: "Campaign Velocity Trend" */}
      <div className="bg-white p-6 sm:p-8 rounded-[20px] border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-6 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[19px]">trending_up</span>
              </span>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Campaign Velocity Trend
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Smooth cumulative velocity curve ending at 57.1% vs target
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-900 text-xs font-bold border border-indigo-200/70">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
            Current: 57.1%
          </span>
        </div>

        {/* Hover preview */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-indigo-600 rounded-full inline-block"></span>
              <span className="font-bold text-slate-700 text-xs">Velocity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t border-dashed border-slate-400 inline-block"></span>
              <span className="font-medium text-slate-400 text-xs">Target Curve</span>
            </div>
          </div>
          {activePoint && (
            <div className="text-xs text-slate-800 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/80">
              <strong>{activePoint.date}</strong>: {activePoint.velocity}% ({activePoint.assetsDispatched} assets)
            </div>
          )}
        </div>

        {/* Smooth Curved Line & Gradient Area SVG */}
        <div className="w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto overflow-visible select-none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="velocityIndigoGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.22" />
                <stop offset="60%" stopColor="#6366f1" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Subtle Light Grid Lines */}
            {[0, 20, 40, 60].map((tick) => {
              const y = getY(tick);
              return (
                <g key={tick}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={svgWidth - paddingRight}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeDasharray="4 4"
                    strokeWidth="1.2"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 3.5}
                    textAnchor="end"
                    fontSize="10"
                    fill="#94a3b8"
                    fontFamily="monospace"
                  >
                    {tick}%
                  </text>
                </g>
              );
            })}

            {/* Soft Gradient Area Fill */}
            <path d={smoothAreaPath} fill="url(#velocityIndigoGradient)" />

            {/* Target Reference Line (Smooth Dashed) */}
            <path
              d={smoothTargetPath}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="1.75"
              strokeDasharray="4 4"
            />

            {/* Smooth Main Velocity Curve (Vibrant Indigo) */}
            <path
              d={smoothVelocityPath}
              fill="none"
              stroke="#4f46e5"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Points & Hover Targets */}
            {velocityData.map((d, i) => {
              const cx = getX(i);
              const cy = getY(d.velocity);
              const isHovered = hoveredPointIndex === i;
              const isLatest = i === velocityData.length - 1;

              return (
                <g key={d.day} className="cursor-pointer" onMouseEnter={() => setHoveredPointIndex(i)}>
                  {/* Hit Area */}
                  <rect
                    x={cx - 14}
                    y={paddingTop}
                    width={28}
                    height={chartHeight}
                    fill="transparent"
                  />

                  {/* Vertical Guide when hovered */}
                  {isHovered && (
                    <line
                      x1={cx}
                      y1={paddingTop}
                      x2={cx}
                      y2={getY(0)}
                      stroke="#c7d2fe"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Target reference dot */}
                  <circle
                    cx={cx}
                    cy={getY(d.target)}
                    r="2"
                    fill="#cbd5e1"
                    opacity={isHovered ? '0.9' : '0.4'}
                  />

                  {/* Velocity Data Dot */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? '5.5' : isLatest ? '5' : '3.5'}
                    fill={isHovered || isLatest ? '#4f46e5' : '#ffffff'}
                    stroke="#4f46e5"
                    strokeWidth={isHovered || isLatest ? '2.5' : '2'}
                    className="transition-all duration-150"
                  />

                  {/* Pulsing ring on current point (57.1%) */}
                  {isLatest && !isHovered && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="9"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="1.5"
                      opacity="0.3"
                      className="animate-ping"
                    />
                  )}

                  {/* Minimal unobtrusive X-axis labels (render key intervals) */}
                  {(i % 3 === 0 || i === velocityData.length - 1) && (
                    <text
                      x={cx}
                      y={svgHeight - 12}
                      textAnchor="middle"
                      fontSize="9.5"
                      fill={isHovered || isLatest ? '#1e1b4b' : '#94a3b8'}
                      fontWeight={isHovered || isLatest ? '700' : '500'}
                      fontFamily="sans-serif"
                    >
                      {d.day}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <span className="material-symbols-outlined text-[15px]">trending_up</span>
            <span>+1.1% delta ahead of trajectory</span>
          </div>
          <span className="text-slate-700 font-semibold">14 Days Recorded</span>
        </div>
      </div>
    </section>
  );
};
