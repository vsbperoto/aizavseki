"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { RESOURCE_CATEGORIES } from "@/lib/constants";
import type { ResourceCategoryKey } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ResourcesSidebarProps {
  counts: { definition: number; howto: number; comparison: number };
}

function buildHref(
  searchParams: URLSearchParams,
  updates: Record<string, string | null>
): string {
  const params = new URLSearchParams(searchParams.toString());
  for (const [key, value] of Object.entries(updates)) {
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }
  params.delete("page");
  const qs = params.toString();
  return `/resources${qs ? `?${qs}` : ""}`;
}

const TYPE_PILLS = [
  {
    key: "definition" as const,
    label: "\u041a\u0430\u043a\u0432\u043e \u0435...?",
    color: "#00d4ff",
    activeClasses: "bg-brand-cyan/20 border-brand-cyan/50 shadow-[0_0_15px_rgba(0,212,255,0.2)]",
    inactiveClasses: "bg-brand-cyan/5 border-brand-cyan/10 hover:bg-brand-cyan/10 hover:border-brand-cyan/30",
    countBg: "rgba(0,212,255,0.15)",
    countColor: "#00d4ff",
  },
  {
    key: "howto" as const,
    label: "\u041a\u0430\u043a \u0434\u0430...?",
    color: "#10b981",
    activeClasses: "bg-accent-green/20 border-accent-green/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
    inactiveClasses: "bg-accent-green/5 border-accent-green/10 hover:bg-accent-green/10 hover:border-accent-green/30",
    countBg: "rgba(16,185,129,0.15)",
    countColor: "#10b981",
  },
  {
    key: "comparison" as const,
    label: "X vs Y",
    color: "#f59e0b",
    activeClasses: "bg-accent-amber/20 border-accent-amber/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
    inactiveClasses: "bg-accent-amber/5 border-accent-amber/10 hover:bg-accent-amber/10 hover:border-accent-amber/30",
    countBg: "rgba(245,158,11,0.15)",
    countColor: "#f59e0b",
  },
] as const;

export function ResourcesSidebar({ counts }: ResourcesSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeType = searchParams.get("type");
  const activeCategory = searchParams.get("category");
  const currentQ = searchParams.get("q") || "";

  const [value, setValue] = useState(currentQ);
  const [isFocused, setIsFocused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    setValue(currentQ);
  }, [currentQ]);

  const pushSearch = useCallback(
    (q: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (q.trim()) {
        params.set("q", q.trim());
      } else {
        params.delete("q");
      }
      params.delete("page");
      const qs = params.toString();
      router.push(`/resources${qs ? `?${qs}` : ""}`);
    },
    [router, searchParams]
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setValue(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => pushSearch(v), 300);
  }

  function handleClear() {
    setValue("");
    pushSearch("");
  }

  return (
    <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
      <div className="glass rounded-2xl p-4 space-y-5">

        {/* Search */}
        <div className="relative group">
          <div
            className={`absolute -inset-0.5 bg-gradient-to-r from-brand-cyan via-accent-purple to-brand-cyan rounded-xl blur transition duration-700 ${
              isFocused ? "opacity-60" : "opacity-0 group-hover:opacity-20"
            }`}
          />
          <div className="relative flex items-center">
            <div className="absolute left-3 text-brand-gray group-focus-within:text-brand-cyan transition-colors pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={value}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={"\u0422\u044a\u0440\u0441\u0438 \u0440\u0435\u0441\u0443\u0440\u0441\u0438..."}
              aria-label={"\u0422\u044a\u0440\u0441\u0438 \u0440\u0435\u0441\u0443\u0440\u0441\u0438"}
              className="w-full h-10 pl-9 pr-8 bg-brand-navy/80 backdrop-blur-xl text-sm text-brand-white placeholder:text-brand-gray/60 border border-brand-white/10 rounded-xl focus:outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/50 transition-all font-heading"
            />
            <AnimatePresence>
              {value && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleClear}
                  aria-label={"\u0418\u0437\u0447\u0438\u0441\u0442\u0438 \u0442\u044a\u0440\u0441\u0435\u043d\u0435\u0442\u043e"}
                  className="absolute right-2.5 p-1 rounded-full hover:bg-brand-white/10 text-brand-gray hover:text-brand-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-brand-white/5" />

        {/* Content Type Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-semibold text-brand-gray/50 uppercase tracking-widest">
              {"\u0422\u0438\u043f \u0441\u044a\u0434\u044a\u0440\u0436\u0430\u043d\u0438\u0435"}
            </p>
            {activeType && (
              <Link
                href={buildHref(searchParams, { type: null })}
                className="text-[10px] text-brand-cyan hover:underline transition-colors"
              >
                {"\u0418\u0437\u0447\u0438\u0441\u0442\u0438"}
              </Link>
            )}
          </div>

          {TYPE_PILLS.map((pill) => {
            const isActive = activeType === pill.key;
            const count = counts[pill.key];
            return (
              <Link
                key={pill.key}
                href={
                  isActive
                    ? buildHref(searchParams, { type: null })
                    : buildHref(searchParams, { type: pill.key })
                }
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all duration-200",
                  isActive ? pill.activeClasses : pill.inactiveClasses
                )}
              >
                <span className="text-sm font-medium text-brand-white">
                  {pill.label}
                </span>
                <span
                  className="text-xs font-bold tabular-nums px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: pill.countBg,
                    color: pill.countColor,
                  }}
                >
                  {count}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-brand-white/5" />

        {/* Categories Section */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between px-1 mb-2">
            <p className="text-[10px] font-semibold text-brand-gray/50 uppercase tracking-widest">
              {"\u041a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u0438"}
            </p>
            {activeCategory && (
              <Link
                href={buildHref(searchParams, { category: null })}
                className="text-[10px] text-brand-cyan hover:underline transition-colors"
              >
                {"\u0418\u0437\u0447\u0438\u0441\u0442\u0438"}
              </Link>
            )}
          </div>

          {(
            Object.entries(RESOURCE_CATEGORIES) as [
              ResourceCategoryKey,
              (typeof RESOURCE_CATEGORIES)[ResourceCategoryKey],
            ][]
          ).map(([key, cat]) => {
            const isActive = activeCategory === key;
            return (
              <Link
                key={key}
                href={
                  isActive
                    ? buildHref(searchParams, { category: null })
                    : buildHref(searchParams, { category: key })
                }
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 border-l-2 group",
                  isActive
                    ? "border-l-brand-cyan bg-brand-navy/70 text-brand-white"
                    : "border-l-transparent hover:bg-brand-navy/40 text-brand-gray hover:text-brand-gray-light"
                )}
              >
                <span className="text-base flex-shrink-0 w-6 text-center leading-none">
                  {cat.icon}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors truncate flex-1",
                    isActive ? "text-brand-white" : "text-brand-gray group-hover:text-brand-gray-light"
                  )}
                >
                  {cat.name}
                </span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-cyan flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-brand-white/5" />

        {/* Glossary Link */}
        <Link
          href="/resources/rechnik"
          className="flex items-center gap-2.5 px-3 py-3 rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 hover:bg-brand-cyan/10 hover:border-brand-cyan/40 transition-all group"
        >
          <BookOpen className="w-4 h-4 text-brand-cyan flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-brand-white">{"AI \u0420\u0435\u0447\u043d\u0438\u043a"}</p>
            <p className="text-xs text-brand-gray/70 mt-0.5">{"\u0422\u0435\u0440\u043c\u0438\u043d\u0438 \u043d\u0430 \u0431\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438"}</p>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-brand-cyan/50 group-hover:text-brand-cyan group-hover:translate-x-0.5 transition-all" />
        </Link>

      </div>
    </aside>
  );
}
