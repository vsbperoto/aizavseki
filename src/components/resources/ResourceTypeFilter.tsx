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
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3 px-2">
        <h4 className="text-xs font-semibold text-brand-gray/60 uppercase tracking-wider">
          {"\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438"}
        </h4>
        {activeCategory && (
          <Link
            href={buildHref(searchParams, "category", null)}
            className="text-xs text-brand-gray/60 hover:text-brand-cyan transition-all"
          >
            {"\u0418\u0437\u0447\u0438\u0441\u0442\u0438"}
          </Link>
        )}
      </div>

      <ul className="space-y-1">
        {(
          Object.entries(RESOURCE_CATEGORIES) as [
            ResourceCategoryKey,
            (typeof RESOURCE_CATEGORIES)[ResourceCategoryKey],
          ][]
        ).map(([key, cat]) => {
          const isActive = activeCategory === key;

          if (isActive) {
            return (
              <li key={key}>
                <Link
                  href={buildHref(searchParams, "category", null)}
                  className="block px-2 py-1.5 flex justify-between items-center text-sm text-brand-cyan font-semibold bg-brand-navy border border-brand-cyan/20 rounded-md shadow-[0_0_15px_rgba(0,212,255,0.1)]"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{cat.icon}</span>
                    {cat.name}
                  </span>
                </Link>
              </li>
            );
          }

          return (
            <li key={key}>
              <Link
                href={buildHref(searchParams, "category", key)}
                className="block px-2 py-1.5 flex items-center gap-2 text-sm text-brand-gray hover:text-brand-white rounded-md hover:bg-brand-white/5 transition-colors"
              >
                <span className="text-base">{cat.icon}</span>
                {cat.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
