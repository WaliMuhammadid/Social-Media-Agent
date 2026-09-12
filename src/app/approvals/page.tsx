'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Eye,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Search,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ApprovalItem {
  id: string;
  title: string;
  hook: string;
  content: string;
  platform: 'twitter' | 'linkedin' | 'instagram' | 'youtube';
  creatorAgent: string;
  qualityAuditReason: string;
  qualityScore: number;
  status: 'pending' | 'flagged' | 'approved' | 'rejected';
  scheduledFor: string;
}

const initialApprovalItems: ApprovalItem[] = [
  {
    id: 'post-101',
    title: 'Benchmark Comparison: Multi-Agent vs Monolithic LLMs',
    hook: 'Why autonomous agent swarms achieve 4.2x higher throughput than single-model loops.',
    content: 'Deep dive into our latest performance benchmarks showing how specialist pods prevent context poisoning. [Benchmark charts attached]',
    platform: 'twitter',
    creatorAgent: 'Copywriting Agent',
    qualityAuditReason: 'Flagged: Slide 3 mentions an external benchmark citation requiring human verification.',
    qualityScore: 82,
    status: 'flagged',
    scheduledFor: 'Tomorrow, 10:00 AM EST',
  },
  {
    id: 'post-102',
    title: 'LinkedIn Carousel: The 6 Pods Architecture',
    hook: 'Inside our autonomous content engine: from Trend Research to Automated Quality Gates.',
    content: '5-slide PDF carousel explaining how the Strategy Pod hands off to Creation Pod, followed by automated compliance auditing.',
    platform: 'linkedin',
    creatorAgent: 'Visual / Design Agent',
    qualityAuditReason: 'All compliance checks passed. Meets brand voice guidelines (99.1% confidence).',
    qualityScore: 99,
    status: 'pending',
    scheduledFor: 'Sep 13, 09:30 AM EST',
  },
  {
    id: 'post-103',
    title: 'Behind-the-Scenes: Prompt Tuning Workflow',
    hook: 'How our Community Agent uses sentiment clustering to auto-tune weekly editorial hooks.',
    content: 'A breakdown of the closed feedback loop connecting real-time X comment triage directly into the Strategy Pod.',
    platform: 'twitter',
    creatorAgent: 'Copywriting Agent',
    qualityAuditReason: 'Factual verification passed. Readability score 8.4 grade level.',
    qualityScore: 97,
    status: 'pending',
    scheduledFor: 'Sep 14, 02:00 PM EST',
  },
  {
    id: 'post-104',
    title: 'Infographic: Agent Pod Health & Token Budgeting',
    hook: 'Managing 1M tokens/day with zero hallucinations: Our safety gate architecture.',
    content: 'High-res visual breakdown showing token allocation across Gemini 1.5 Pro and Flash specialists.',
    platform: 'instagram',
    creatorAgent: 'Visual / Design Agent',
    qualityAuditReason: 'Image asset aspect ratio verified (4:5). Color contrast conforms to AA guidelines.',
    qualityScore: 96,
    status: 'pending',
    scheduledFor: 'Sep 15, 11:15 AM EST',
  },
];

export default function ApprovalsPage() {
  const [items, setItems] = useState<ApprovalItem[]>(initialApprovalItems);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [previewItem, setPreviewItem] = useState<ApprovalItem | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredItems.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const updateStatus = (id: string, newStatus: ApprovalItem['status']) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    setFeedbackMessage(`Asset #${id} marked as ${newStatus.toUpperCase()}`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleBulkApprove = () => {
    setItems((prev) =>
      prev.map((item) =>
        selectedIds.includes(item.id) ? { ...item, status: 'approved' } : item
      )
    );
    setFeedbackMessage(`${selectedIds.length} assets approved for publishing!`);
    setSelectedIds([]);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const filteredItems = items.filter((item) => {
    const matchPlatform =
      filterPlatform === 'all' || item.platform === filterPlatform;
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'flagged' && item.status === 'flagged') ||
      (filterStatus === 'pending' && item.status === 'pending') ||
      (filterStatus === 'approved' && item.status === 'approved');
    return matchPlatform && matchStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <CheckSquare className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Human-in-the-Loop Review
            </span>
            <Badge variant="warning" size="sm">
              {items.filter((i) => i.status === 'flagged' || i.status === 'pending').length} Gates Pending
            </Badge>
          </div>

          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Approval Gates & Compliance Review Queue
          </h1>

          <p className="text-xs text-gray-600 max-w-2xl leading-relaxed">
            Meta Ads Manager style verification queue. Human Operators review auto-generated calendar items, inspect citations, and approve or request revisions before the Publishing Pod dispatches assets.
          </p>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200">
            <span className="text-xs font-bold text-[#0064E0]">
              {selectedIds.length} Selected
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={handleBulkApprove}
              icon={<Check className="h-3.5 w-3.5" />}
            >
              Approve All Selected
            </Button>
          </div>
        )}
      </div>

      {/* Toast Feedback Alert */}
      {feedbackMessage && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-semibold flex items-center justify-between shadow-sm">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            {feedbackMessage}
          </span>
        </div>
      )}

      {/* Filter and Control Bar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-gray-100 border border-gray-200 text-xs">
            {[
              { label: 'All Items', value: 'all' },
              { label: 'Flagged by Quality Pod (1)', value: 'flagged' },
              { label: 'Pending Review (3)', value: 'pending' },
              { label: 'Approved', value: 'approved' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilterStatus(tab.value)}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer font-semibold ${
                  filterStatus === tab.value
                    ? 'bg-white text-[#0064E0] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Platform Filter dropdown / pills */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 font-medium">Placement:</span>
            {['all', 'twitter', 'linkedin', 'instagram'].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPlatform(p)}
                className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors cursor-pointer ${
                  filterPlatform === p
                    ? 'bg-gray-200 text-gray-900 font-bold'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {p === 'twitter' ? 'X' : p}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Meta Ads Campaign Data Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === filteredItems.length &&
                      filteredItems.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-[#0064E0] focus:ring-[#0064E0]"
                  />
                </th>
                <th className="py-3.5 px-4">Post & Hook Concept</th>
                <th className="py-3.5 px-4">Placement</th>
                <th className="py-3.5 px-4">Quality & Brand Safety Audit</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Delivery Status</th>
                <th className="py-3.5 px-4 text-right">Human Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => {
                const isSelected = selectedIds.includes(item.id);

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50/80 transition-colors ${
                      isSelected ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <td className="py-4 px-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(item.id)}
                        className="rounded border-gray-300 text-[#0064E0] focus:ring-[#0064E0]"
                      />
                    </td>

                    <td className="py-4 px-4 max-w-sm">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-bold text-gray-900 text-sm">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs italic line-clamp-1 mb-1">
                        &quot;{item.hook}&quot;
                      </p>
                      <span className="text-[11px] text-gray-500">
                        Drafted by: {item.creatorAgent} • Scheduled: {item.scheduledFor}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-800 font-semibold uppercase text-[10px] tracking-wide border border-gray-200">
                        {item.platform === 'twitter' ? 'X (Twitter)' : item.platform}
                      </span>
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      <p
                        className={`text-xs font-medium leading-relaxed ${
                          item.status === 'flagged'
                            ? 'text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200'
                            : 'text-gray-600'
                        }`}
                      >
                        {item.qualityAuditReason}
                      </p>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span
                          className={`font-bold text-xs ${
                            item.qualityScore >= 95 ? 'text-green-700' : 'text-amber-700'
                          }`}
                        >
                          {item.qualityScore}% Match
                        </span>
                        <div className="w-16 bg-gray-200 h-1 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.qualityScore >= 95 ? 'bg-green-600' : 'bg-amber-500'
                            }`}
                            style={{ width: `${item.qualityScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {item.status === 'flagged' && (
                        <Badge variant="warning" size="sm">
                          Action Required
                        </Badge>
                      )}
                      {item.status === 'pending' && (
                        <Badge variant="info" size="sm">
                          Ready for Review
                        </Badge>
                      )}
                      {item.status === 'approved' && (
                        <Badge variant="success" size="sm">
                          Approved
                        </Badge>
                      )}
                      {item.status === 'rejected' && (
                        <Badge variant="danger" size="sm">
                          Rejected
                        </Badge>
                      )}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-right space-x-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewItem(item)}
                        title="Preview Content"
                      >
                        <Eye className="h-4 w-4 text-gray-500" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus(item.id, 'approved')}
                        className="text-green-700 hover:bg-green-50 hover:border-green-300"
                        title="Approve Post"
                      >
                        Approve
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateStatus(item.id, 'flagged')}
                        className="text-amber-700 hover:bg-amber-50"
                        title="Request Revision"
                      >
                        Revise
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Asset Preview Modal / Drawer */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Asset Preview #{previewItem.id}
                </span>
                <h3 className="text-base font-bold text-gray-900">
                  {previewItem.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-500">Hook Concept:</div>
              <p className="text-sm font-medium text-gray-900 p-3 rounded-lg bg-gray-50 border border-gray-200">
                &quot;{previewItem.hook}&quot;
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-500">Post Draft:</div>
              <p className="text-xs text-gray-700 p-3 rounded-lg bg-gray-50 border border-gray-200 leading-relaxed">
                {previewItem.content}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs">
              <span className="font-bold text-amber-800">Quality Pod Audit Note:</span>
              <p className="text-amber-900 mt-0.5">{previewItem.qualityAuditReason}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewItem(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  updateStatus(previewItem.id, 'approved');
                  setPreviewItem(null);
                }}
              >
                Approve & Dispatch
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
