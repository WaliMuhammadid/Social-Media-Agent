import React from 'react';
import { Calendar as CalendarIcon, Clock, Sparkles, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockCampaignState } from '@/lib/mockData';

export default function CalendarPage() {
  const days = [
    { day: 'Mon', date: 'Sep 08', posts: 3, active: true },
    { day: 'Tue', date: 'Sep 09', posts: 4, active: true },
    { day: 'Wed', date: 'Sep 10', posts: 2, active: true },
    { day: 'Thu', date: 'Sep 11', posts: 4, active: true },
    { day: 'Fri', date: 'Sep 12', posts: 3, active: false },
    { day: 'Sat', date: 'Sep 13', posts: 1, active: false },
    { day: 'Sun', date: 'Sep 14', posts: 2, active: false },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#0064E0] border border-blue-200">
              <CalendarIcon className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold text-[#0064E0] uppercase tracking-wider">
              Strategy Pod Calendar
            </span>
            <Badge variant="info">{mockCampaignState.scheduledPosts} Posts Scheduled</Badge>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Content Strategy Calendar & Scheduling View
          </h1>
          <p className="text-xs text-gray-600">
            Multi-network publication timetable generated autonomously by Strategy & Creation Pods.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<ChevronLeft className="h-3.5 w-3.5" />}>
            Prev Week
          </Button>
          <Button variant="outline" size="sm" icon={<ChevronRight className="h-3.5 w-3.5" />}>
            Next Week
          </Button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map((d) => (
          <Card key={d.date} className="p-4 bg-white border-gray-200 shadow-sm flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-gray-900">{d.day}</span>
                <span className="text-[11px] text-gray-500">{d.date}</span>
              </div>
              <div className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-center">
                <span className="text-lg font-bold text-gray-900">{d.posts}</span>
                <p className="text-[10px] text-gray-500 font-medium">Assets Slotted</p>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
              <span className={d.active ? 'text-green-700 font-bold' : 'text-gray-400'}>
                {d.active ? '• Scheduled' : '• Staged'}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
