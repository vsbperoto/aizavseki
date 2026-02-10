import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ResourceGrid } from "@/components/resources/ResourceGrid";
import { ResourceTypeFilter } from "@/components/resources/ResourceTypeFilter";
import { ResourceSearch } from "@/components/resources/ResourceSearch";
import { ResourceSort } from "@/components/resources/ResourceSort";
import { ResourceHero } from "@/components/resources/ResourceHero";
import { Pagination } from "@/components/resources/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "AI \u0420\u0435\u0441\u0443\u0440\u0441\u0438 \u2014 333 \u0441\u0442\u0430\u0442\u0438\u0438 \u0437\u0430 \u0438\u0437\u043A\u0443\u0441\u0442\u0432\u0435\u043D \u0438\u043D\u0442\u0435\u043B\u0435\u043A\u0442",
  description:
    "\u0414\u0435\u0444\u0438\u043D\u0438\u0446\u0438\u0438, \u0440\u044A\u043A\u043E\u0432\u043E\u0434\u0441\u0442\u0432\u0430 \u0438 \u0441\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u044F \u0437\u0430 AI \u043D\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438. \u041F\u044A\u043B\u043D\u0430 \u0440\u0435\u0444\u0435\u0440\u0435\u043D\u0442\u043D\u0430 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430 \u0437\u0430 \u0438\u0437\u043A\u0443\u0441\u0442\u0432\u0435\u043D \u0438\u043D\u0442\u0435\u043B\u0435\u043A\u0442.",
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

export default async function ResourcesPage({
  searchParams,
}: ResourcesPageProps) {
  const { type, category, page: pageParam, sort, q } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const offset = (currentPage - 1) * PER_PAGE;
  const supabase = await createClient();

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

  // Count per type
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

  // Base URL params for pagination links
  const baseParams = new URLSearchParams();
  if (type) baseParams.set("type", type);
  if (category) baseParams.set("category", category);
  if (sort && sort !== "newest") baseParams.set("sort", sort);
  if (q) baseParams.set("q", q);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI \u0420\u0435\u0441\u0443\u0440\u0441\u0438",
    description:
      "\u0414\u0435\u0444\u0438\u043D\u0438\u0446\u0438\u0438, \u0440\u044A\u043A\u043E\u0432\u043E\u0434\u0441\u0442\u0432\u0430 \u0438 \u0441\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u044F \u0437\u0430 AI \u043D\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438",
    url: "https://aizavseki.eu/resources",
    numberOfItems: totalCount,
    inLanguage: "bg",
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      {/* Background Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-navy-light/20 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        {/* HERO */}
        <ResourceHero counts={typeCounts} activeType={type || null} />

        {/* AI Rechnik link */}
        <div className="mb-8 flex justify-center">
          <Link
            href="/resources/rechnik"
            className="inline-flex items-center gap-2 rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 px-4 py-2.5 text-sm text-brand-cyan hover:bg-brand-cyan/10 hover:border-brand-cyan/30 transition-all backdrop-blur-sm"
          >
            <BookOpen className="h-4 w-4" />
            {"AI \u0420\u0435\u0447\u043D\u0438\u043A \u2014 \u0422\u0435\u0440\u043C\u0438\u043D\u0438 \u043D\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438"}
          </Link>
        </div>

        {/* CONTROLS — sticky toolbar */}
        <div className="sticky top-16 sm:top-20 z-40 bg-brand-dark/80 backdrop-blur-xl border border-brand-white/5 rounded-2xl p-4 shadow-2xl shadow-black/50 mb-10 transition-all">
          <div className="flex flex-col gap-6">
            <Suspense
              fallback={<Skeleton className="h-14 w-full rounded-xl" />}
            >
              <ResourceSearch />
            </Suspense>

            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex-1 overflow-x-auto pb-2 lg:pb-0">
                <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                  <ResourceTypeFilter />
                </Suspense>
              </div>

              <div className="shrink-0">
                <Suspense fallback={<Skeleton className="h-10 w-40" />}>
                  <ResourceSort />
                </Suspense>
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS GRID */}
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

        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseParams={baseParams}
        />
      </div>
    </div>
  );
}
