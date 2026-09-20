'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useWorkspace } from '@/context/WorkspaceContext';

interface PlatformItem {
  id: string;
  platform: string;
  name: string;
  status: 'Connected' | 'Expired' | 'Disconnected';
  accountName: string | null;
  accountId: string | null;
  tokenExpiresAt: string | null;
  assignedPods: string[];
  isPublishingBlocked: boolean;
}

export default function IntegrationsPage() {
  const { currentWorkspace } = useWorkspace();
  const [integrations, setIntegrations] = useState<PlatformItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [hasExpiredAlert, setHasExpiredAlert] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [confirmDisconnect, setConfirmDisconnect] = useState<PlatformItem | null>(null);

  // Facebook Connection Modal State
  const [connectModal, setConnectModal] = useState<{
    platform: string;
    authUrl?: string;
    isConfigured?: boolean;
    appId?: string | null;
  } | null>(null);

  const [directCreds, setDirectCreds] = useState({
    accountName: '',
    pageId: '',
    accessToken: '',
  });
  const [isSubmittingCreds, setIsSubmittingCreds] = useState(false);

  const loadIntegrations = async () => {
    try {
      setIsLoading(true);
      const res = await api.getIntegrations(currentWorkspace?.slug);
      setIntegrations(res.integrations);
      setHasExpiredAlert(res.hasExpiredTokenAlert);
    } catch (err) {
      console.error('Failed to load integrations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIntegrations();
  }, [currentWorkspace?.slug]);

  const handleConnect = async (platform: string) => {
    try {
      setIsConnecting(platform);
      const res = await api.connectIntegration(platform, currentWorkspace?.slug);

      if (platform === 'facebook') {
        if (res.isConfigured && res.authUrl) {
          // Redirect directly to official Facebook OAuth login dialog
          window.location.href = res.authUrl;
          return;
        } else {
          // Open Connection dialog with direct Facebook verification
          setConnectModal({
            platform: 'facebook',
            authUrl: res.authUrl,
            isConfigured: res.isConfigured,
            appId: res.appId,
          });
          return;
        }
      }

      // Fallback for other platforms
      const callbackRes = await api.callbackIntegration(platform, currentWorkspace?.slug);
      setFeedback(`Successfully connected ${platform.toUpperCase()} account (${callbackRes.accountName})!`);
      setTimeout(() => setFeedback(null), 4000);
      await loadIntegrations();
    } catch (err: any) {
      alert(`Connection failed: ${err.message}`);
    } finally {
      setIsConnecting(null);
    }
  };

  const handleDirectConnectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directCreds.accountName.trim()) {
      alert('Please enter your Facebook Account or Page name');
      return;
    }

    try {
      setIsSubmittingCreds(true);
      const res = await api.verifyFacebookCredentials({
        account_name: directCreds.accountName,
        page_id: directCreds.pageId || undefined,
        access_token: directCreds.accessToken || undefined,
        workspace_slug: currentWorkspace?.slug,
      });

      setFeedback(`Successfully connected Facebook Page: ${res.accountName}!`);
      setTimeout(() => setFeedback(null), 4000);
      setConnectModal(null);
      setDirectCreds({ accountName: '', pageId: '', accessToken: '' });
      await loadIntegrations();
    } catch (err: any) {
      alert(`Connection failed: ${err.message}`);
    } finally {
      setIsSubmittingCreds(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirmDisconnect) return;
    try {
      await api.disconnectIntegration(confirmDisconnect.platform, currentWorkspace?.slug);
      setFeedback(`Disconnected ${confirmDisconnect.name}. Publishing pipelines are now blocked.`);
      setTimeout(() => setFeedback(null), 4000);
      setConfirmDisconnect(null);
      await loadIntegrations();
    } catch (err: any) {
      alert(`Disconnect failed: ${err.message}`);
    }
  };

  const handleSimulateExpiry = async (platform: string) => {
    try {
      const res = await api.simulateTokenExpiry(platform, currentWorkspace?.slug);
      setFeedback(`Token expired simulation active for ${platform.toUpperCase()}. Routed to Approval Queue.`);
      setTimeout(() => setFeedback(null), 5000);
      await loadIntegrations();
    } catch (err: any) {
      alert(`Simulation failed: ${err.message}`);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return '🌐';
      case 'instagram':
        return '📸';
      case 'whatsapp':
        return '💬';
      case 'twitter':
        return '🐦';
      case 'linkedin':
        return '💼';
      case 'tiktok':
        return '🎵';
      default:
        return '🔗';
    }
  };

  return (
    <div className="w-full max-w-[1360px] mx-auto space-y-6 pb-8 select-none">
      {/* Header Section */}
      <section className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[30px] sm:text-[36px] font-bold text-slate-900 tracking-tight leading-tight">
              Platform Integrations &amp; OAuth
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#eaf6ee] text-[#164e32] border border-[#d2edd9] text-[11px] font-bold">
              Multi-Network
            </span>
          </div>
          <p className="text-[14px] text-slate-400 font-normal">
            Connect Meta Graph, X, and WhatsApp accounts to empower autonomous Publishing, Engagement, and Analytics Pods.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-[13px] font-semibold shadow-xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </section>

      {/* Critical Expired Token Alert Banner */}
      {hasExpiredAlert && (
        <div className="p-4 rounded-[18px] bg-red-50 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-red-900 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">error</span>
            </div>
            <div>
              <h4 className="text-[13.5px] font-bold text-red-900">
                CRITICAL: OAuth Token Expired for Connected Account
              </h4>
              <p className="text-[12px] text-red-700 mt-0.5">
                Expired tokens immediately block automated publishing and comment triage. In-flight posts have been routed into the Approval Queue.
              </p>
            </div>
          </div>
          <Link
            href="/approvals"
            className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-[12px] font-bold shrink-0 self-start sm:self-center transition-colors"
          >
            Inspect Approval Queue
          </Link>
        </div>
      )}

      {/* Toast Feedback */}
      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12.5px] font-semibold flex items-center gap-2 shadow-xs">
          <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
          <span>{feedback}</span>
        </div>
      )}

      {/* Platforms Grid Card */}
      <section className="bg-white rounded-[22px] border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div>
            <h2 className="text-[16px] font-bold text-slate-900">Supported Social &amp; Messaging Networks</h2>
            <p className="text-[12px] text-slate-400">
              Assigned specialist agent pods inherit permissions from validated OAuth access tokens.
            </p>
          </div>
          <span className="text-[12px] font-medium text-slate-500">
            Current Workspace: <strong className="text-slate-800">{currentWorkspace?.name}</strong>
          </span>
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-slate-400 animate-spin text-[28px]">progress_activity</span>
            <span className="text-[13px] text-slate-500">Loading live platform credentials...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((item) => {
              const isConnected = item.status === 'Connected';
              const isExpired = item.status === 'Expired';
              const isDisconnected = item.status === 'Disconnected';

              return (
                <div
                  key={item.platform}
                  className={`p-5 rounded-[20px] border transition-all flex flex-col justify-between min-h-[220px] ${
                    isExpired
                      ? 'border-red-300 bg-red-50/20 shadow-xs'
                      : isConnected
                      ? 'border-emerald-200/90 bg-emerald-50/15'
                      : 'border-slate-200/80 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Top Row: Icon + Name + Status Chip */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center text-[22px] shadow-xs shrink-0">
                          {getPlatformIcon(item.platform)}
                        </div>
                        <div>
                          <h3 className="text-[15px] font-bold text-slate-900 leading-tight">{item.name}</h3>
                          <span className="text-[11px] text-slate-400 font-mono capitalize">
                            {item.platform === 'twitter' ? 'X (Twitter)' : item.platform}
                          </span>
                        </div>
                      </div>

                      {/* Status Chip */}
                      <div>
                        {isConnected && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#eaf6ee] text-[#164e32] border border-[#d2edd9] text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#164e32]" />
                            Connected
                          </span>
                        )}
                        {isExpired && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            Expired
                          </span>
                        )}
                        {isDisconnected && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-semibold">
                            Disconnected
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Account Name & Assigned Pods info */}
                    <div className="space-y-1.5 my-3 text-[12px]">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400">Account:</span>
                        <span className="font-bold text-slate-800 font-mono truncate max-w-[160px]">
                          {item.accountName || 'Not Linked'}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-2 text-slate-600">
                        <span className="text-slate-400 shrink-0">Active Pods:</span>
                        <span className="font-medium text-slate-700 text-right truncate">
                          {item.assignedPods.length > 0 ? item.assignedPods.join(', ') : 'None'}
                        </span>
                      </div>

                      {item.tokenExpiresAt && (
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                          <span className="text-slate-400">Token Health:</span>
                          <span className={isExpired ? 'text-red-600 font-bold' : 'text-emerald-700 font-semibold'}>
                            {isExpired ? 'Token Inactive' : 'Active (60d handshake)'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    {isConnected ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setConfirmDisconnect(item)}
                          className="flex-1 py-2 px-3 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 text-[12px] font-semibold transition-colors cursor-pointer"
                        >
                          Disconnect
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSimulateExpiry(item.platform)}
                          className="py-2 px-3 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11.5px] font-semibold transition-colors cursor-pointer"
                          title="Simulate token expiration to test alert banner and approval queue rerouting"
                        >
                          Test Expiry
                        </button>
                      </>
                    ) : isExpired ? (
                      <button
                        type="button"
                        onClick={() => handleConnect(item.platform)}
                        disabled={isConnecting === item.platform}
                        className="w-full py-2 px-4 rounded-full bg-red-600 hover:bg-red-700 text-white text-[12px] font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                      >
                        {isConnecting === item.platform ? (
                          <span>Re-authenticating...</span>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[15px]">refresh</span>
                            <span>Re-connect Account</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleConnect(item.platform)}
                        disabled={isConnecting === item.platform}
                        className="w-full py-2 px-4 rounded-full bg-[#164e32] hover:bg-[#123e28] text-white text-[12px] font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                      >
                        {isConnecting === item.platform ? (
                          <span>Connecting OAuth...</span>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[15px]">add_link</span>
                            <span>Connect Account</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Disconnect Confirmation Modal */}
      {confirmDisconnect && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <span className="material-symbols-outlined text-[24px]">warning</span>
              <h3 className="text-base font-bold text-slate-900">Disconnect {confirmDisconnect.name}?</h3>
            </div>
            <p className="text-[13px] text-slate-600 leading-relaxed">
              Disconnecting this platform will revoke publishing and listening capabilities for the <strong>{confirmDisconnect.assignedPods.join(', ') || 'assigned pods'}</strong>. In-flight campaigns on this account will be paused immediately.
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmDisconnect(null)}
                className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 text-[12.5px] font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDisconnect}
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-[12.5px] font-bold cursor-pointer"
              >
                Confirm Disconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meta / Facebook Connection Modal */}
      {connectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-xs">
                  🌐
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-slate-900 leading-tight">Connect Facebook (Meta)</h3>
                  <p className="text-[12px] text-slate-400">OAuth 2.0 &amp; Graph API Page Integration</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConnectModal(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Official OAuth Status */}
            {connectModal.isConfigured && connectModal.authUrl ? (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 space-y-3">
                <div className="flex items-center gap-2 text-blue-900 text-[13px] font-bold">
                  <span className="material-symbols-outlined text-[18px] text-blue-600">verified</span>
                  <span>Meta App ID Configured ({connectModal.appId})</span>
                </div>
                <p className="text-[12px] text-blue-700 leading-relaxed">
                  Log in with your official Facebook credentials to grant page publishing permissions to the Autonomous Agent Swarm.
                </p>
                <a
                  href={connectModal.authUrl}
                  className="w-full py-2.5 px-4 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>Continue with Facebook Login</span>
                </a>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-800 text-[12px] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <span className="material-symbols-outlined text-[16px]">info</span>
                  <span>Meta App ID Setup</span>
                </div>
                <p>
                  To enable one-click Facebook Login, add your <code>FACEBOOK_APP_ID</code> and <code>FACEBOOK_APP_SECRET</code> in <code>backend/.env</code>.
                  Meanwhile, you can connect directly with your Page Name and Page Access Token below:
                </p>
              </div>
            )}

            {/* Direct Page Credentials Form */}
            <form onSubmit={handleDirectConnectSubmit} className="space-y-4 pt-1">
              <div>
                <label className="block text-[12.5px] font-bold text-slate-700 mb-1">
                  Facebook Page / Account Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Brand Official or @brandpage"
                  value={directCreds.accountName}
                  onChange={(e) => setDirectCreds({ ...directCreds, accountName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#164e32]/20 focus:border-[#164e32]"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-bold text-slate-700 mb-1">
                  Page ID <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 104928172948291"
                  value={directCreds.pageId}
                  onChange={(e) => setDirectCreds({ ...directCreds, pageId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#164e32]/20 focus:border-[#164e32]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[12.5px] font-bold text-slate-700">
                    Page Access Token <span className="text-slate-400 font-normal">(Graph API)</span>
                  </label>
                  <a
                    href="https://developers.facebook.com/tools/explorer/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5"
                  >
                    <span>Get Graph Token</span>
                    <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                  </a>
                </div>
                <input
                  type="password"
                  placeholder="EAABwz... (Leave empty to connect with test access credentials)"
                  value={directCreds.accessToken}
                  onChange={(e) => setDirectCreds({ ...directCreds, accessToken: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-[#164e32]/20 focus:border-[#164e32]"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  If provided, the server validates this token with <code>graph.facebook.com/v19.0/me</code>.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setConnectModal(null)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 text-[12.5px] font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCreds}
                  className="px-5 py-2.5 rounded-full bg-[#164e32] hover:bg-[#123e28] text-white text-[12.5px] font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  {isSubmittingCreds ? (
                    <>
                      <span className="material-symbols-outlined text-[15px] animate-spin">progress_activity</span>
                      <span>Verifying &amp; Connecting...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">link</span>
                      <span>Authorize &amp; Connect Page</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
