'use client';

import React, { useState, useEffect } from 'react';
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
import { api } from '@/lib/api';
import { useWorkspace } from '@/context/WorkspaceContext';
import { EmptyState } from '@/components/ui/ErrorState';

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

export default function ApprovalsPage() {
  const { currentWorkspace } = useWorkspace();
  const [items, setItems] = useState<ApprovalItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [previewItem, setPreviewItem] = useState<ApprovalItem | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Mandatory rejection notes modal state
  const [rejectItem, setRejectItem] = useState<ApprovalItem | null>(null);
  const [rejectNotes, setRejectNotes] = useState<string>('');
  const [isSubmittingDecision, setIsSubmittingDecision] = useState<boolean>(false);

  const loadApprovals = async () => {
    try {
      setIsLoading(true);
      const data = await api.getApprovals(currentWorkspace?.slug);
      setItems(
        data.map((d: any) => ({
          ...d,
          platform: (d.platform?.toLowerCase() || 'twitter') as any,
          status: d.status as any,
        }))
      );
    } catch (err) {
      console.error('Failed to load approvals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApprovals();
  }, [currentWorkspace?.slug]);

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

  const handleDecision = async (
    id: string,
    decision: 'Approve' | 'Reject' | 'Escalate',
    notes?: string
  ) => {
    try {
      setIsSubmittingDecision(true);
      await api.submitApprovalDecision(id, decision, notes);
      
      const newStatus = decision === 'Approve' ? 'approved' : decision === 'Reject' ? 'rejected' : 'flagged';
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus as any } : item))
      );

      setFeedbackMessage(`Asset #${id} marked as ${decision.toUpperCase()}! LangGraph stage updated.`);
      setTimeout(() => setFeedbackMessage(null), 4000);
      setRejectItem(null);
      setRejectNotes('');
    } catch (err: any) {
      alert(`Decision failed: ${err.message}`);
    } finally {
      setIsSubmittingDecision(false);
    }
  };

  const handleBulkApprove = async () => {
    try {
      for (const id of selectedIds) {
        await api.submitApprovalDecision(id, 'Approve');
      }
      setItems((prev) =>
        prev.map((item) =>
          selectedIds.includes(item.id) ? { ...item, status: 'approved' } : item
        )
      );
      setFeedbackMessage(`${selectedIds.length} assets approved for publishing!`);
      setSelectedIds([]);
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch (err: any) {
      alert(`Bulk approval failed: ${err.message}`);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchPlatform =
      filterPlatform === 'all' || item.platform === filterPlatform;
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'flagged' && (item.status === 'flagged' || item.status === 'rejected')) ||
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
                        onClick={() => handleDecision(item.id, 'Approve')}
                        className="text-green-700 hover:bg-green-50 hover:border-green-300"
                        title="Approve Post"
                      >
                        Approve
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setRejectItem(item);
                          setRejectNotes('');
                        }}
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
                className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1 cursor-pointer"
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
              <p className="text-xs text-gray-700 p-3 rounded-lg bg-gray-50 border border-gray-200 leading-relaxed whitespace-pre-wrap">
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
                  handleDecision(previewItem.id, 'Approve');
                  setPreviewItem(null);
                }}
              >
                Approve & Dispatch
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Rejection Notes Modal */}
      {rejectItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                  <AlertTriangle className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Revision / Rejection Reason
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Asset #{rejectItem.id} — {rejectItem.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRejectItem(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Rejection feedback is mandatory so the Creator and Quality pods understand what changes are required before re-submitting to the pipeline.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Revision Notes <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                placeholder="e.g. Tone too informal; please add statistical citation regarding ROI metrics..."
                rows={4}
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0064E0] resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectItem(null)}
                disabled={isSubmittingDecision}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={!rejectNotes.trim() || isSubmittingDecision}
                onClick={() => handleDecision(rejectItem.id, 'Reject', rejectNotes)}
              >
                {isSubmittingDecision ? 'Submitting...' : 'Reject Asset'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
