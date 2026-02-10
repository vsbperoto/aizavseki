"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CONTENT_TYPES, RESOURCE_CATEGORIES } from "@/lib/constants";
import type { ContentTypeKey, ResourceCategoryKey } from "@/lib/constants";
import { cn } from "@/lib/utils";

const TYPE_COLORS: Record<ContentTypeKey, string> = {
  definition: "#00d4ff",
  howto: "#10b981",
  comparison: "#f59e0b",
};

export function ResourceTypeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeType = searchParams.get("type");
  const activeCategory = searchParams.get("category");

  function handleTypeFilter(type: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (type) {
      params.set("type", type);
    } else {
      params.delete("type");
    }
    router.push(`/resources?${params.toString()}`);
  }

  function handleCategoryFilter(category: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.push(`/resources?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleTypeFilter(null)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-all",
            !activeType
              ? "bg-brand-cyan text-brand-dark"
              : "bg-brand-navy text-brand-gray hover:text-brand-white hover:bg-brand-navy-light"
          )}
        >
          {"\u0412\u0441\u0438\u0447\u043A\u0438"}
        </button>
        {(Object.entries(CONTENT_TYPES) as [ContentTypeKey, (typeof CONTENT_TYPES)[ContentTypeKey]][]).map(
          ([key, type]) => (
            <button
              key={key}
              onClick={() => handleTypeFilter(key)}
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
            </button>
          )
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryFilter(null)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
            !activeCategory
              ? "bg-brand-cyan/20 text-brand-cyan"
              : "bg-brand-navy text-brand-gray hover:text-brand-white hover:bg-brand-navy-light"
          )}
        >
          {"\u0412\u0441\u0438\u0447\u043A\u0438 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438"}
        </button>
        {(Object.entries(RESOURCE_CATEGORIES) as [ResourceCategoryKey, (typeof RESOURCE_CATEGORIES)[ResourceCategoryKey]][]).map(
          ([key, cat]) => (
            <button
              key={key}
              onClick={() => handleCategoryFilter(key)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                activeCategory === key
                  ? "bg-brand-cyan/20 text-brand-cyan"
                  : "bg-brand-navy text-brand-gray hover:text-brand-white hover:bg-brand-navy-light"
              )}
            >
              {cat.name}
            </button>
          )
        )}
      </div>
    </div>
  );
}
