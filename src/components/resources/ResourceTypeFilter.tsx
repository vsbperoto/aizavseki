"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RESOURCE_CATEGORIES } from "@/lib/constants";
import type { ResourceCategoryKey } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

function buildHref(
  searchParams: URLSearchParams,
  key: string,
  value: string | null
) {
  const params = new URLSearchParams(searchParams.toString());
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
  params.delete("page");
  const qs = params.toString();
  return `/resources${qs ? `?${qs}` : ""}`;
}

export function ResourceTypeFilter() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-brand-gray uppercase tracking-wider">
          {"\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438"}
        </h3>
        {activeCategory && (
          <Link
            href={buildHref(searchParams, "category", null)}
            className="text-xs text-brand-cyan hover:text-brand-cyan-bright hover:underline transition-all"
          >
            {"\u0418\u0437\u0447\u0438\u0441\u0442\u0438 \u0444\u0438\u043B\u0442\u044A\u0440\u0430"}
          </Link>
        )}
      </div>

      <div className="flex flex-nowrap gap-3 overflow-x-auto pb-1">
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
                  ? buildHref(searchParams, "category", null)
                  : buildHref(searchParams, "category", key)
              }
              className="relative group"
            >
              <div
                className={cn(
                  "relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300",
                  isActive
                    ? "bg-brand-navy border-brand-cyan/50 shadow-[0_0_15px_rgba(0,212,255,0.15)]"
                    : "bg-brand-navy/40 border-brand-white/5 hover:border-brand-white/20 hover:bg-brand-navy"
                )}
              >
                <span className="text-lg">{cat.icon}</span>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive
                      ? "text-brand-white"
                      : "text-brand-gray group-hover:text-brand-gray-light"
                  )}
                >
                  {cat.name}
                </span>
              </div>
              {/* Active Glow */}
              {isActive && (
                <motion.div
                  layoutId="category-glow"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-cyan/20 to-transparent blur-md -z-10"
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
