"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const STATUS_STYLES = {
  pending: {
    bg: "bg-yellow-500/20",
    border: "border-yellow-500/30",
    icon: Clock,
    iconColor: "text-yellow-400",
  },
  processing: {
    bg: "bg-blue-500/20",
    border: "border-blue-500/30",
    icon: AlertCircle,
    iconColor: "text-blue-400",
  },
  completed: {
    bg: "bg-green-500/20",
    border: "border-green-500/30",
    icon: CheckCircle2,
    iconColor: "text-green-400",
  },
  unknown: {
    bg: "bg-gray-500/20",
    border: "border-gray-500/30",
    icon: AlertCircle,
    iconColor: "text-brand-gray",
  },
} as const;

const STATUS_LABELS: Record<string, { title: string; description: string; label: string }> = {
  pending: {
    title: "\u0412 \u043F\u0440\u043E\u0446\u0435\u0441 \u043D\u0430 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0430",
    description: "\u0412\u0430\u0448\u0430\u0442\u0430 \u0437\u0430\u044F\u0432\u043A\u0430 \u0435 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0430 \u0438 \u0447\u0430\u043A\u0430 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0430.",
    label: "\u0412 \u043E\u0447\u0430\u043A\u0432\u0430\u043D\u0435",
  },
  processing: {
    title: "\u0414\u0430\u043D\u043D\u0438\u0442\u0435 \u0441\u0435 \u0438\u0437\u0442\u0440\u0438\u0432\u0430\u0442",
    description: "\u0412\u0430\u0448\u0430\u0442\u0430 \u0437\u0430\u044F\u0432\u043A\u0430 \u0441\u0435 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0432\u0430 \u0432 \u043C\u043E\u043C\u0435\u043D\u0442\u0430.",
    label: "\u0412 \u043F\u0440\u043E\u0446\u0435\u0441",
  },
  completed: {
    title: "\u0414\u0430\u043D\u043D\u0438\u0442\u0435 \u0441\u0430 \u0438\u0437\u0442\u0440\u0438\u0442\u0438 \u0443\u0441\u043F\u0435\u0448\u043D\u043E",
    description: "\u0412\u0441\u0438\u0447\u043A\u0438 \u0412\u0430\u0448\u0438 \u043B\u0438\u0447\u043D\u0438 \u0434\u0430\u043D\u043D\u0438 \u0441\u0430 \u043F\u0440\u0435\u043C\u0430\u0445\u043D\u0430\u0442\u0438 \u043E\u0442 \u043D\u0430\u0448\u0430\u0442\u0430 \u0441\u0438\u0441\u0442\u0435\u043C\u0430.",
    label: "\u0417\u0430\u0432\u044A\u0440\u0448\u0435\u043D\u043E",
  },
};

export default function DataDeletionStatusPage() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("id") || "";

  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<{
    status: string;
    requested_at: string;
    completed_at?: string;
  } | null>(null);

  useEffect(() => {
    if (initialCode) {
      checkStatus(initialCode);
    }
  }, [initialCode]);

  const checkStatus = async (confirmationCode: string) => {
    setError("");
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch(`/api/data-deletion?code=${encodeURIComponent(confirmationCode)}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("\u0417\u0430\u044F\u0432\u043A\u0430\u0442\u0430 \u043D\u0435 \u0435 \u043D\u0430\u043C\u0435\u0440\u0435\u043D\u0430. \u041F\u0440\u043E\u0432\u0435\u0440\u0435\u0442\u0435 \u0434\u0430\u043B\u0438 \u043A\u043E\u0434\u044A\u0442 \u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u0435\u043D.");
        }
        const data = await response.json();
        throw new Error(data.error || "\u0413\u0440\u0435\u0448\u043A\u0430 \u043F\u0440\u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u043D\u0430 \u0441\u0442\u0430\u0442\u0443\u0441\u0430");
      }

      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "\u0412\u044A\u0437\u043D\u0438\u043A\u043D\u0430 \u0433\u0440\u0435\u0448\u043A\u0430");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      checkStatus(code.trim());
    }
  };

  const statusKey = (status?.status || "unknown") as keyof typeof STATUS_STYLES;
  const styles = STATUS_STYLES[statusKey] || STATUS_STYLES.unknown;
  const labels = STATUS_LABELS[status?.status || ""] || {
    title: "\u041D\u0435\u043F\u043E\u0437\u043D\u0430\u0442 \u0441\u0442\u0430\u0442\u0443\u0441",
    description: "\u041C\u043E\u043B\u044F, \u0441\u0432\u044A\u0440\u0436\u0435\u0442\u0435 \u0441\u0435 \u0441 \u043D\u0430\u0441 \u0437\u0430 \u043F\u043E\u0432\u0435\u0447\u0435 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F.",
    label: "",
  };
  const StatusIcon = styles.icon;

  return (
    <div className="relative min-h-screen py-16 px-4">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/4 right-1/3 h-[500px] w-[500px] rounded-full bg-brand-cyan/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 h-[400px] w-[400px] rounded-full bg-accent-purple/5 blur-[100px] animate-pulse [animation-delay:1s]" />
      </div>

      <div className="relative max-w-2xl mx-auto">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-brand-cyan hover:text-brand-cyan-bright transition-all mb-8"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{"\u041D\u0430\u0437\u0430\u0434 \u043A\u044A\u043C \u043D\u0430\u0447\u0430\u043B\u043E"}</span>
        </Link>

        <ScrollReveal>
          <div className="glass p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-cyan/10 ring-1 ring-brand-cyan/20">
                <Search className="w-6 h-6 text-brand-cyan" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold gradient-text">
                {"\u0421\u0442\u0430\u0442\u0443\u0441 \u043D\u0430 \u0437\u0430\u044F\u0432\u043A\u0430"}
              </h1>
            </div>

            <p className="text-brand-gray mb-8">
              {"\u0412\u044A\u0432\u0435\u0434\u0435\u0442\u0435 \u043A\u043E\u0434\u0430 \u0437\u0430 \u043F\u0440\u043E\u0441\u043B\u0435\u0434\u044F\u0432\u0430\u043D\u0435, \u043A\u043E\u0439\u0442\u043E \u043F\u043E\u043B\u0443\u0447\u0438\u0445\u0442\u0435 \u043F\u0440\u0438 \u043F\u043E\u0434\u0430\u0432\u0430\u043D\u0435 \u043D\u0430 \u0437\u0430\u044F\u0432\u043A\u0430\u0442\u0430 \u0437\u0430 \u0438\u0437\u0442\u0440\u0438\u0432\u0430\u043D\u0435 \u043D\u0430 \u0434\u0430\u043D\u043D\u0438."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 mb-8">
              <div>
                <label htmlFor="code" className="block text-brand-white font-medium mb-2">
                  {"\u041A\u043E\u0434 \u0437\u0430 \u043F\u0440\u043E\u0441\u043B\u0435\u0434\u044F\u0432\u0430\u043D\u0435"}
                </label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={"\u0412\u044A\u0432\u0435\u0434\u0435\u0442\u0435 \u0412\u0430\u0448\u0438\u044F \u043A\u043E\u0434 \u0437\u0430 \u043F\u0440\u043E\u0441\u043B\u0435\u0434\u044F\u0432\u0430\u043D\u0435"}
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={loading || !code.trim()}
                className="w-full hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-shadow"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {"\u041F\u0440\u043E\u0432\u0435\u0440\u044F\u0432\u0430 \u0441\u0435..."}
                  </>
                ) : (
                  "\u041F\u0440\u043E\u0432\u0435\u0440\u0438 \u0441\u0442\u0430\u0442\u0443\u0441"
                )}
              </Button>
            </form>

            {status && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t border-brand-cyan/10 pt-8"
              >
                <div className="text-center">
                  <div
                    className={`w-16 h-16 ${styles.bg} ${styles.border} border rounded-full flex items-center justify-center mx-auto mb-6`}
                  >
                    <StatusIcon className={`w-8 h-8 ${styles.iconColor}`} />
                  </div>

                  <h2 className="font-heading text-2xl font-bold text-brand-white mb-3">
                    {labels.title}
                  </h2>

                  <p className="text-brand-gray mb-6">{labels.description}</p>

                  <div className="bg-brand-navy/50 border border-brand-cyan/20 rounded-xl p-6 text-left">
                    <div className="space-y-3">
                      <div>
                        <p className="text-brand-gray text-sm">{"\u0421\u0442\u0430\u0442\u0443\u0441:"}</p>
                        <p className="text-brand-white font-semibold">
                          {labels.label}
                        </p>
                      </div>
                      <div>
                        <p className="text-brand-gray text-sm">{"\u0414\u0430\u0442\u0430 \u043D\u0430 \u0437\u0430\u044F\u0432\u043A\u0430\u0442\u0430:"}</p>
                        <p className="text-brand-white">
                          {status.requested_at
                            ? new Date(status.requested_at).toLocaleString("bg-BG", {
                                dateStyle: "long",
                                timeStyle: "short",
                              })
                            : "\u041D\u044F\u043C\u0430 \u0434\u0430\u043D\u043D\u0438"}
                        </p>
                      </div>
                      {status.completed_at && (
                        <div>
                          <p className="text-brand-gray text-sm">{"\u0414\u0430\u0442\u0430 \u043D\u0430 \u0437\u0430\u0432\u044A\u0440\u0448\u0432\u0430\u043D\u0435:"}</p>
                          <p className="text-brand-white">
                            {new Date(status.completed_at).toLocaleString("bg-BG", {
                              dateStyle: "long",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {status.status !== "completed" && (
                    <p className="text-brand-gray text-sm mt-6">
                      {"\u0417\u0430\u044F\u0432\u043A\u0438\u0442\u0435 \u043E\u0431\u0438\u043A\u043D\u043E\u0432\u0435\u043D\u043E \u0441\u0435 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0432\u0430\u0442 \u0432 \u0440\u0430\u043C\u043A\u0438\u0442\u0435 \u043D\u0430 30 \u0434\u043D\u0438. \u0429\u0435 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0435 \u0438\u043C\u0435\u0439\u043B \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435, \u043A\u043E\u0433\u0430\u0442\u043E \u043F\u0440\u043E\u0446\u0435\u0441\u044A\u0442 \u043F\u0440\u0438\u043A\u043B\u044E\u0447\u0438."}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            <div className="mt-8 pt-8 border-t border-brand-cyan/10">
              <p className="text-brand-gray text-sm text-center">
                {"\u0410\u043A\u043E \u0438\u043C\u0430\u0442\u0435 \u0432\u044A\u043F\u0440\u043E\u0441\u0438 \u043E\u0442\u043D\u043E\u0441\u043D\u043E \u0412\u0430\u0448\u0430\u0442\u0430 \u0437\u0430\u044F\u0432\u043A\u0430, \u0441\u0432\u044A\u0440\u0436\u0435\u0442\u0435 \u0441\u0435 \u0441 \u043D\u0430\u0441 \u043D\u0430 "}{" "}
                <a
                  href="mailto:privacy@aizavseki.eu"
                  className="text-brand-cyan hover:text-brand-cyan-bright transition-colors"
                >
                  privacy@aizavseki.eu
                </a>
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
