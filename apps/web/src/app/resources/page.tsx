import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ResourceGrid } from "@/components/resources/ResourceGrid";
import { CompactHero } from "@/components/resources/CompactHero";
import { LearningHubLayout } from "@/components/resources/LearningHubLayout";
import { ResourcesSidebar } from "@/components/resources/ResourcesSidebar";
import { CategoryShowcase } from "@/components/resources/CategoryShowcase";
import { ResultsHeader } from "@/components/resources/ResultsHeader";
import { Pagination } from "@/components/resources/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "AI \u0420\u0435\u0441\u0443\u0440\u0441\u0438 \u2014 333 \u0441\u0442\u0430\u0442\u0438\u0438 \u0437\u0430 \u0438\u0437\u043a\u0443\u0441\u0442\u0432\u0435\u043d \u0438\u043d\u0442\u0435\u043b\u0435\u043a\u0442",
  description:
    "\u0414\u0435\u0444\u0438\u043d\u0438\u0446\u0438\u0438, \u0440\u044a\u043a\u043e\u0432\u043e\u0434\u0441\u0442\u0432\u0430 \u0438 \u0441\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u044f \u0437\u0430 AI \u043d\u0430 \u0431\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438. \u041f\u044a\u043b\u043d\u0430 \u0440\u0435\u0444\u0435\u0440\u0435\u043d\u0442\u043d\u0430 \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0430 \u0437\u0430 \u0438\u0437\u043a\u0443\u0441\u0442\u0432\u0435\u043d \u0438\u043d\u0442\u0435\u043b\u0435\u043a\u0442.",
  alternates: { canonical: "https://aizavseki.eu/resources" },
};

export const revalidate = 3600;

const PER_PAGE = 24;

interface ResourcesPageProps {
  searchParams: Promise<{
    type?: string;
    category?: string;
    page?: string;
    sort?: string;
    q?: string;
  }>;
}

const LISTING_COLUMNS =
  "id, slug, title, content_type, category, key_takeaway, word_count, quality_score, views, published_at" as const;

// Build a clear-param href on the server (no useSearchParams needed)
function buildClearHref(
  params: { type?: string; category?: string; sort?: string; q?: string },
  removeKey: string
): string {
  const p = new URLSearchParams();
  if (params.type && removeKey !== "type") p.set("type", params.type);
  if (params.category && removeKey !== "category") p.set("category", params.category);
  if (params.sort && params.sort !== "newest") p.set("sort", params.sort);
  if (params.q && removeKey !== "q") p.set("q", params.q);
  const qs = p.toString();
  return `/resources${qs ? `?${qs}` : ""}`;
}

function SidebarSkeleton() {
  return (
    <div className="w-full lg:w-72 shrink-0">
      <div className="glass rounded-2xl p-4 space-y-3">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-3 w-24 rounded" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-xl" />
        ))}
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-3 w-24 rounded" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default async function ResourcesPage({
  searchParams,
}: ResourcesPageProps) {
  const { type, category, page: pageParam, sort, q } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const offset = (currentPage - 1) * PER_PAGE;
  const supabase = await createClient();

  // Determine if any filter is active (gates CategoryShowcase vs grid)
  const isFiltered = !!(type || category || (q && q.trim()));

  // Build base query
  let query = supabase
    .from("resources")
    .select(LISTING_COLUMNS, { count: "exact" });

  // Filters
  if (type) query = query.eq("content_type", type);
  if (category) query = query.eq("category", category);

  // Search
  if (q && q.trim()) {
    const searchTerm = `%${q.trim()}%`;
    query = query.or(
      `title.ilike.${searchTerm},key_takeaway.ilike.${searchTerm}`
    );
  }

  // Sort
  switch (sort) {
    case "views":
      query = query.order("views", { ascending: false });
      break;
    case "quality":
      query = query.order("quality_score", {
        ascending: false,
        nullsFirst: false,
      });
      break;
    case "title":
      query = query.order("title", { ascending: true });
      break;
    default:
      query = query.order("published_at", { ascending: false });
  }

  // Pagination
  query = query.range(offset, offset + PER_PAGE - 1);

  const { data, count } = await query;
  const resources = (data || []) as {
    id: string;
    slug: string;
    title: string;
    content_type: string;
    category: string;
    key_takeaway: string | null;
    word_count: number;
    quality_score: number | null;
    views: number;
    published_at: string;
  }[];
  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / PER_PAGE);

  // Count per type (exact when category/search active, ~111 approximation otherwise)
  let typeCounts = { definition: 111, howto: 111, comparison: 111 };
  if (category || q) {
    const buildCountQuery = (ct: string) => {
      let cq = supabase
        .from("resources")
        .select("id", { count: "exact", head: true })
        .eq("content_type", ct);
      if (category) cq = cq.eq("category", category);
      if (q && q.trim()) {
        const searchTerm = `%${q.trim()}%`;
        cq = cq.or(
          `title.ilike.${searchTerm},key_takeaway.ilike.${searchTerm}`
        );
      }
      return cq;
    };
    const [defRes, howRes, compRes] = await Promise.all([
      buildCountQuery("definition"),
      buildCountQuery("howto"),
      buildCountQuery("comparison"),
    ]);
    typeCounts = {
      definition: defRes.count || 0,
      howto: howRes.count || 0,
      comparison: compRes.count || 0,
    };
  }

  // Pre-build clear hrefs for ResultsHeader (server-side, no useSearchParams needed)
  const clearTypeHref = buildClearHref({ type, category, sort, q }, "type");
  const clearCategoryHref = buildClearHref({ type, category, sort, q }, "category");

  // Base URL params for pagination links
  const baseParams = new URLSearchParams();
  if (type) baseParams.set("type", type);
  if (category) baseParams.set("category", category);
  if (sort && sort !== "newest") baseParams.set("sort", sort);
  if (q) baseParams.set("q", q);

  // Active filters count for mobile toggle badge
  const activeFiltersCount = [type, category, q?.trim()].filter(Boolean).length;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI \u0420\u0435\u0441\u0443\u0440\u0441\u0438",
    description:
      "\u0414\u0435\u0444\u0438\u043d\u0438\u0446\u0438\u0438, \u0440\u044a\u043a\u043e\u0432\u043e\u0434\u0441\u0442\u0432\u0430 \u0438 \u0441\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u044f \u0437\u0430 AI \u043d\u0430 \u0431\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438",
    url: "https://aizavseki.eu/resources",
    numberOfItems: totalCount,
    inLanguage: "bg",
  };

  return (
    <div className="min-h-screen bg-brand-dark text-brand-gray/90 font-sans selection:bg-brand-cyan selection:text-brand-dark">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      {/* Global Glow Effect */}
      <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(2,191,223,0.12),rgba(0,0,0,0))] z-0 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">

        {/* COMPACT HERO */}
        <CompactHero totalCount={totalCount || 333} />

        {/* TWO-COLUMN LEARNING HUB */}
        <LearningHubLayout
          activeFiltersCount={activeFiltersCount}
          sidebar={
            <Suspense fallback={<SidebarSkeleton />}>
              <ResourcesSidebar counts={typeCounts} />
            </Suspense>
          }
        >
          {isFiltered ? (
            <>
              {/* Results header with active filter badges + sort */}
              <ResultsHeader
                totalCount={totalCount}
                currentPage={currentPage}
                perPage={PER_PAGE}
                searchQuery={q}
                activeType={type}
                activeCategory={category}
                clearTypeHref={clearTypeHref}
                clearCategoryHref={clearCategoryHref}
              />

              {/* Resource grid */}
              <div className="min-h-[400px]">
                <Suspense
                  fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton
                          key={i}
                          className="h-80 w-full rounded-2xl bg-brand-navy/50"
                        />
                      ))}
                    </div>
                  }
                >
                  <ResourceGrid
                    resources={resources}
                    totalCount={totalCount}
                    currentPage={currentPage}
                    perPage={PER_PAGE}
                    searchQuery={q || undefined}
                  />
                </Suspense>
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseParams={baseParams}
              />
            </>
          ) : (
            /* Default landing state — category showcase */
            <CategoryShowcase typeCounts={typeCounts} />
          )}
        </LearningHubLayout>
      </div>
    </div>
  );
}
