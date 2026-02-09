"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";

interface PageInfo {
  page_name: string;
  page_id: string;
  is_active: boolean;
  expires_at: string;
  days_until_expiry: number;
  is_valid: boolean;
}

function StatusBadge({ page }: { page: PageInfo }) {
  let bg: string;
  let text: string;
  let label: string;

  if (!page.is_valid) {
    bg = "rgba(239, 68, 68, 0.15)";
    text = "#f87171";
    label = "Expired";
  } else if (page.days_until_expiry <= 7) {
    bg = "rgba(245, 158, 11, 0.15)";
    text = "#fbbf24";
    label = `${page.days_until_expiry}d left`;
  } else {
    bg = "rgba(34, 197, 94, 0.15)";
    text = "#4ade80";
    label = "Valid";
  }

  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: "9999px",
        fontSize: "12px",
        fontWeight: 600,
        background: bg,
        color: text,
      }}
    >
      {label}
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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <p style={{ color: "#94a3b8" }}>Loading...</p>
      </div>
    );
  }

  // No session — show login
  if (!pages) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          padding: "1rem",
        }}
      >
        <div
          style={{
            maxWidth: "400px",
            width: "100%",
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(148, 163, 184, 0.1)",
            borderRadius: "16px",
            padding: "2.5rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "0.5rem" }}>
            Admin Panel
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            Sign in to manage Facebook page tokens
          </p>
          {error && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                padding: "0.75rem",
                marginBottom: "1rem",
                color: "#f87171",
                fontSize: "0.8125rem",
              }}
            >
              Error: {decodeURIComponent(error)}
            </div>
          )}
          <a
            href="/api/auth/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              background: "#1877F2",
              color: "#fff",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.875rem",
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
          >
            Sign in with Facebook
          </a>
        </div>
      </div>
    );
  }

  // Authenticated — show dashboard
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f1f5f9" }}>
          Facebook Token Manager
        </h1>
        <a
          href="/api/auth/login"
          style={{
            padding: "0.5rem 1rem",
            background: "rgba(148, 163, 184, 0.1)",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            borderRadius: "8px",
            color: "#94a3b8",
            fontSize: "0.8125rem",
            fontWeight: 500,
            textDecoration: "none",
            transition: "border-color 0.2s",
          }}
        >
          Re-authenticate
        </a>
      </div>

      {error && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "8px",
            padding: "0.75rem",
            marginBottom: "1rem",
            color: "#f87171",
            fontSize: "0.8125rem",
          }}
        >
          Error: {decodeURIComponent(error)}
        </div>
      )}

      {/* Pages list */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          marginBottom: "2rem",
        }}
      >
        {pages.map((page) => (
          <div
            key={page.page_id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 1.25rem",
              background: "rgba(15, 23, 42, 0.8)",
              border: page.is_active
                ? "1px solid rgba(6, 182, 212, 0.5)"
                : "1px solid rgba(148, 163, 184, 0.1)",
              borderRadius: "12px",
              boxShadow: page.is_active ? "0 0 20px rgba(6, 182, 212, 0.1)" : "none",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <span style={{ fontWeight: 600, color: "#f1f5f9", fontSize: "0.9375rem" }}>
                  {page.page_name}
                </span>
                {page.is_active && (
                  <span
                    style={{
                      display: "inline-block",
                      padding: "1px 8px",
                      borderRadius: "9999px",
                      fontSize: "11px",
                      fontWeight: 600,
                      background: "rgba(6, 182, 212, 0.15)",
                      color: "#22d3ee",
                    }}
                  >
                    ACTIVE
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <span style={{ color: "#64748b", fontSize: "0.75rem", fontFamily: "monospace" }}>
                  {page.page_id}
                </span>
                <StatusBadge page={page} />
              </div>
            </div>
            {!page.is_active && (
              <button
                onClick={() => handleSetActive(page.page_id)}
                disabled={settingActive !== null}
                style={{
                  padding: "0.4rem 1rem",
                  background: "rgba(6, 182, 212, 0.1)",
                  border: "1px solid rgba(6, 182, 212, 0.3)",
                  borderRadius: "8px",
                  color: "#22d3ee",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  cursor: settingActive ? "wait" : "pointer",
                  opacity: settingActive ? 0.5 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {settingActive === page.page_id ? "Setting..." : "Set Active"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Active token detail */}
      {activePage && (
        <div
          style={{
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(148, 163, 184, 0.1)",
            borderRadius: "12px",
            padding: "1.25rem",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#94a3b8", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Active Token Details
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <span style={{ color: "#64748b", fontSize: "0.75rem" }}>Page Name</span>
              <p style={{ color: "#f1f5f9", fontSize: "0.875rem", fontWeight: 500, margin: "0.125rem 0 0" }}>
                {activePage.page_name}
              </p>
            </div>
            <div>
              <span style={{ color: "#64748b", fontSize: "0.75rem" }}>Page ID</span>
              <p style={{ color: "#f1f5f9", fontSize: "0.875rem", fontFamily: "monospace", margin: "0.125rem 0 0" }}>
                {activePage.page_id}
              </p>
            </div>
            <div>
              <span style={{ color: "#64748b", fontSize: "0.75rem" }}>Expires</span>
              <p style={{ color: "#f1f5f9", fontSize: "0.875rem", margin: "0.125rem 0 0" }}>
                {new Date(activePage.expires_at).toLocaleDateString("bg-BG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <span style={{ color: "#64748b", fontSize: "0.75rem" }}>Days Until Expiry</span>
              <p
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  margin: "0.125rem 0 0",
                  color: !activePage.is_valid
                    ? "#f87171"
                    : activePage.days_until_expiry <= 7
                      ? "#fbbf24"
                      : "#4ade80",
                }}
              >
                {activePage.is_valid ? `${activePage.days_until_expiry} days` : "Expired"}
              </p>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <span style={{ color: "#64748b", fontSize: "0.75rem" }}>Scopes</span>
              <p style={{ color: "#94a3b8", fontSize: "0.8125rem", fontFamily: "monospace", margin: "0.125rem 0 0" }}>
                pages_manage_posts, pages_read_engagement
              </p>
            </div>
          </div>
        </div>
      )}

      <p style={{ color: "#475569", fontSize: "0.75rem", textAlign: "center" }}>
        The active page&apos;s token is served to n8n at <code style={{ color: "#64748b" }}>/api/auth/token</code>
      </p>
    </div>
  );
}
