'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useWorkspace } from '@/context/WorkspaceContext';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentWorkspace } = useWorkspace();

  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [accountInfo, setAccountInfo] = useState<{ accountName: string; tokenExpiresAt: string } | null>(null);

  useEffect(() => {
    async function processOAuthCallback() {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (error) {
        setStatus('error');
        setErrorMessage(errorDescription || error || 'OAuth Authorization was denied by user.');
        return;
      }

      if (!code) {
        setStatus('error');
        setErrorMessage('No authorization code was returned by Meta.');
        return;
      }

      try {
        const res = await api.exchangeFacebookCode(
          code,
          currentWorkspace?.slug || 'social-swarm-default',
          window.location.origin + window.location.pathname
        );

        setStatus('success');
        setAccountInfo({
          accountName: res.accountName,
          tokenExpiresAt: res.tokenExpiresAt,
        });

        // Automatically return to integrations page after 2.5s
        setTimeout(() => {
          router.push('/settings/integrations');
        }, 2500);
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message || 'Failed to exchange authorization token with backend server.');
      }
    }

    processOAuthCallback();
  }, [searchParams, currentWorkspace?.slug, router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl max-w-md w-full p-8 text-center space-y-6">
        {status === 'processing' && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-[34px] animate-spin">progress_activity</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Connecting to Meta (Facebook)...</h2>
              <p className="text-[13px] text-slate-500 mt-2">
                Validating authorization handshake and requesting long-lived Page publishing access token.
              </p>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-[#eaf6ee] text-[#164e32] border border-[#d2edd9] flex items-center justify-center mx-auto shadow-xs">
              <span className="material-symbols-outlined text-[36px]">verified</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Facebook Connected!</h2>
              <p className="text-[13.5px] text-slate-600 mt-2">
                Successfully authorized <strong className="text-slate-900 font-mono">{accountInfo?.accountName}</strong>.
              </p>
              <p className="text-[11.5px] text-emerald-700 font-medium mt-1">
                Active permissions granted to Publishing, Creation, and Engagement Agent Pods.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => router.push('/settings/integrations')}
                className="w-full py-2.5 px-4 rounded-full bg-[#164e32] hover:bg-[#123e28] text-white text-[13px] font-bold shadow-xs transition-colors cursor-pointer"
              >
                Return to Integrations
              </button>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto shadow-xs">
              <span className="material-symbols-outlined text-[36px]">error</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Connection Failed</h2>
              <p className="text-[13px] text-red-600 mt-2 font-medium bg-red-50/70 p-3 rounded-xl border border-red-100 break-words text-left">
                {errorMessage}
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => router.push('/settings/integrations')}
                className="w-full py-2.5 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-bold shadow-xs transition-colors cursor-pointer"
              >
                Back to Integrations
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function IntegrationsCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <span className="material-symbols-outlined text-[30px] animate-spin text-slate-400">progress_activity</span>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
