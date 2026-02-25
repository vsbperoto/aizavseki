import { Suspense } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { ResourceSort } from "./ResourceSort";
import { Skeleton } from "@/components/ui/Skeleton";
import { RESOURCE_CATEGORIES, CONTENT_TYPES } from "@/lib/constants";
import type { ResourceCategoryKey, ContentTypeKey } from "@/lib/constants";

interface ResultsHeaderProps {
  totalCount: number;
  currentPage: number;
  perPage: number;
  searchQuery?: string | null;
  activeType?: string | null;
  activeCategory?: string | null;
  clearTypeHref: string;
  clearCategoryHref: string;
}

export function ResultsHeader({
  totalCount,
  currentPage,
  perPage,
  searchQuery,
  activeType,
  activeCategory,
  clearTypeHref,
  clearCategoryHref,
}: ResultsHeaderProps) {
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalCount);

  const countText = searchQuery?.trim()
    ? `${totalCount} \u0440\u0435\u0437\u0443\u043b\u0442\u0430\u0442\u0430 \u0437\u0430 \u201e${searchQuery.trim()}\u201c`
    : totalCount === 0
    ? "\u041d\u044f\u043c\u0430 \u043d\u0430\u043c\u0435\u0440\u0435\u043d\u0438 \u0440\u0435\u0441\u0443\u0440\u0441\u0438"
    : `\u041f\u043e\u043a\u0430\u0437\u0430\u043d\u0438 ${start}\u2013${end} \u043e\u0442 ${totalCount} \u0440\u0435\u0441\u0443\u0440\u0441\u0430`;

  const typeLabel =
    activeType && activeType in CONTENT_TYPES
      ? CONTENT_TYPES[activeType as ContentTypeKey].label
      : null;

  const categoryLabel =
    activeCategory && activeCategory in RESOURCE_CATEGORIES
      ? RESOURCE_CATEGORIES[activeCategory as ResourceCategoryKey].name
      : null;

  return (
    <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-brand-white/5 flex-wrap">
      <div className="flex items-center gap-3 flex-wrap min-w-0">
        <p className="text-sm text-brand-gray/70 shrink-0">{countText}</p>

        {typeLabel && (
          <Link
            href={clearTypeHref}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-navy border border-brand-cyan/20 text-brand-cyan hover:border-brand-cyan/40 hover:bg-brand-cyan/5 transition-all"
          >
            {typeLabel}
            <X className="w-3 h-3" />
          </Link>
        )}

        {categoryLabel && (
          <Link
            href={clearCategoryHref}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-navy border border-brand-white/10 text-brand-gray hover:border-brand-white/20 hover:text-brand-white transition-all"
          >
            {categoryLabel}
            <X className="w-3 h-3" />
          </Link>
        )}
      </div>

      <div className="shrink-0">
        <Suspense fallback={<Skeleton className="h-10 w-40 rounded-xl" />}>
          <ResourceSort />
        </Suspense>
      </div>
    </div>
  );
}
