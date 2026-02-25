"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

interface PageInfo {
  page_name: string;
  page_id: string;
  is_active: boolean;
  expires_at: string;
  days_until_expiry: number;
  is_valid: boolean;
}

function StatusBadge({ page }: { page: PageInfo }) {
  if (!page.is_valid) {
    return (
      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/15 text-red-400">
        Expired
      </span>
    );
  }
  if (page.days_until_expiry <= 7) {
    return (
      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/15 text-yellow-400">
        {page.days_until_expiry}d left
      </span>
    );
  }
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500/15 text-green-400">
      Valid
    </span>
  );
}

export default function AdminPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [pages, setPages] = useState<PageInfo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [settingActive, setSettingActive] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/status");
      if (res.status === 401) {
        setPages(null);
        return;
      }
      const data = await res.json();
      setPages(data.pages || []);
    } catch {
      setPages(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleSetActive = async (pageId: string) => {
    setSettingActive(pageId);
    try {
      await fetch("/api/auth/set-active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page_id: pageId }),
      });
      await fetchStatus();
    } finally {
      setSettingActive(null);
    }
  };

  const activePage = pages?.find((p) => p.is_active);

  if (loading) {
    return (
      <div className="relative flex min-h-[80vh] items-center justify-center">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute top-1/4 left-1/3 h-[500px] w-[500px] rounded-full bg-brand-cyan/5 blur-[120px] animate-pulse" />
        </div>
        <div className="flex items-center gap-2 text-brand-gray">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // No session — show login
  if (!pages) {
    return (
      <div className="relative flex min-h-[80vh] items-center justify-center p-4">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute top-1/4 left-1/3 h-[500px] w-[500px] rounded-full bg-brand-cyan/5 blur-[120px] animate-pulse" />
        </div>
        <div className="relative glass max-w-[400px] w-full rounded-2xl p-10 text-center">
          <h1 className="text-2xl font-bold text-brand-white mb-2">
            Admin Panel
          </h1>
          <p className="text-brand-gray text-sm mb-6">
            Sign in to manage Facebook page tokens
          </p>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 text-red-400 text-sm">
              Error: {decodeURIComponent(error)}
            </div>
          )}
          <a
            href="/api/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1877F2] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Sign in with Facebook
          </a>
        </div>
      </div>
    );
  }

  // Authenticated — show dashboard
  return (
    <div className="relative max-w-[800px] mx-auto p-4 pt-24 sm:pt-32">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/4 left-1/3 h-[500px] w-[500px] rounded-full bg-brand-cyan/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-accent-purple/5 blur-[100px] animate-pulse [animation-delay:1s]" />
      </div>

      <div className="relative">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-brand-white">
            Facebook Token Manager
          </h1>
          <a
            href="/api/auth/login"
            className="px-4 py-2 glass rounded-xl text-brand-gray text-sm font-medium hover:text-brand-white hover:border-brand-cyan/30 transition-colors"
          >
            Re-authenticate
          </a>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 text-red-400 text-sm">
            Error: {decodeURIComponent(error)}
          </div>
        )}

        {/* Pages list */}
        <div className="flex flex-col gap-3 mb-8">
          {pages.map((page) => (
            <div
              key={page.page_id}
              className={`flex items-center justify-between p-4 rounded-2xl flex-wrap gap-3 transition-all ${
                page.is_active
                  ? "glass border-brand-cyan/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                  : "glass"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-brand-white text-[15px]">
                    {page.page_name}
                  </span>
                  {page.is_active && (
                    <span className="inline-block px-2 py-px rounded-full text-[11px] font-semibold bg-brand-cyan/15 text-brand-cyan">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-brand-gray/60 text-xs font-mono">
                    {page.page_id}
                  </span>
                  <StatusBadge page={page} />
                </div>
              </div>
              {!page.is_active && (
                <button
                  onClick={() => handleSetActive(page.page_id)}
                  disabled={settingActive !== null}
                  className="px-4 py-1.5 bg-brand-cyan/10 border border-brand-cyan/30 rounded-xl text-brand-cyan text-sm font-medium hover:bg-brand-cyan/20 transition-colors disabled:opacity-50 disabled:cursor-wait"
                >
                  {settingActive === page.page_id ? "Setting..." : "Set Active"}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Active token detail */}
        {activePage && (
          <div className="glass rounded-2xl p-5 mb-6">
            <h2 className="text-sm font-semibold text-brand-gray uppercase tracking-wider mb-4">
              Active Token Details
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-brand-gray/60 text-xs">Page Name</span>
                <p className="text-brand-white text-sm font-medium mt-0.5">
                  {activePage.page_name}
                </p>
              </div>
              <div>
                <span className="text-brand-gray/60 text-xs">Page ID</span>
                <p className="text-brand-white text-sm font-mono mt-0.5">
                  {activePage.page_id}
                </p>
              </div>
              <div>
                <span className="text-brand-gray/60 text-xs">Expires</span>
                <p className="text-brand-white text-sm mt-0.5">
                  {new Date(activePage.expires_at).toLocaleDateString("bg-BG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <span className="text-brand-gray/60 text-xs">Days Until Expiry</span>
                <p className={`text-sm font-semibold mt-0.5 ${
                  !activePage.is_valid
                    ? "text-red-400"
                    : activePage.days_until_expiry <= 7
                      ? "text-yellow-400"
                      : "text-green-400"
                }`}>
                  {activePage.is_valid ? `${activePage.days_until_expiry} days` : "Expired"}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-brand-gray/60 text-xs">Scopes</span>
                <p className="text-brand-gray text-sm font-mono mt-0.5">
                  pages_manage_posts, pages_read_engagement
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="text-brand-gray/40 text-xs text-center">
          The active page&apos;s token is served to n8n at <code className="text-brand-gray/60">/api/auth/token</code>
        </p>
      </div>
    </div>
  );
}
