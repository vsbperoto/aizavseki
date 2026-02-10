"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CONTENT_TYPES, RESOURCE_CATEGORIES } from "@/lib/constants";
import type { ContentTypeKey, ResourceCategoryKey } from "@/lib/constants";
import { cn } from "@/lib/utils";

const TYPE_COLORS: Record<ContentTypeKey, string> = {
  definition: "#00d4ff",
  howto: "#10b981",
  comparison: "#f59e0b",
};

function buildHref(searchParams: URLSearchParams, key: string, value: string | null) {
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
  const activeType = searchParams.get("type");
  const activeCategory = searchParams.get("category");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Link
          href={buildHref(searchParams, "type", null)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-all",
            !activeType
              ? "bg-brand-cyan text-brand-dark"
              : "bg-brand-navy text-brand-gray hover:text-brand-white hover:bg-brand-navy-light"
          )}
        >
          {"\u0412\u0441\u0438\u0447\u043A\u0438"}
        </Link>
        {(Object.entries(CONTENT_TYPES) as [ContentTypeKey, (typeof CONTENT_TYPES)[ContentTypeKey]][]).map(
          ([key, type]) => (
            <Link
              key={key}
              href={buildHref(searchParams, "type", key)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all",
                activeType === key
                  ? "text-brand-dark"
                  : "bg-brand-navy text-brand-gray hover:text-brand-white hover:bg-brand-navy-light"
              )}
              style={
                activeType === key
                  ? { backgroundColor: TYPE_COLORS[key] }
                  : undefined
              }
            >
              {type.label}
            </Link>
          )
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={buildHref(searchParams, "category", null)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
            !activeCategory
              ? "bg-brand-cyan/20 text-brand-cyan"
              : "bg-brand-navy text-brand-gray hover:text-brand-white hover:bg-brand-navy-light"
          )}
        >
          {"\u0412\u0441\u0438\u0447\u043A\u0438 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438"}
        </Link>
        {(Object.entries(RESOURCE_CATEGORIES) as [ResourceCategoryKey, (typeof RESOURCE_CATEGORIES)[ResourceCategoryKey]][]).map(
          ([key, cat]) => (
            <Link
              key={key}
              href={buildHref(searchParams, "category", key)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                activeCategory === key
                  ? "bg-brand-cyan/20 text-brand-cyan"
                  : "bg-brand-navy text-brand-gray hover:text-brand-white hover:bg-brand-navy-light"
              )}
            >
              {cat.icon} {cat.name}
            </Link>
          )
        )}
      </div>
    </div>
  );
}
