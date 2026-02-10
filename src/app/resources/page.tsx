import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ResourceGrid } from "@/components/resources/ResourceGrid";
import { ResourceTypeFilter } from "@/components/resources/ResourceTypeFilter";
import { ResourceSearch } from "@/components/resources/ResourceSearch";
import { ResourceSort } from "@/components/resources/ResourceSort";
import { ResourceStats } from "@/components/resources/ResourceStats";
import { Pagination } from "@/components/resources/Pagination";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Skeleton } from "@/components/ui/Skeleton";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "AI \u0420\u0435\u0441\u0443\u0440\u0441\u0438 \u2014 333 \u0441\u0442\u0430\u0442\u0438\u0438 \u0437\u0430 \u0438\u0437\u043A\u0443\u0441\u0442\u0432\u0435\u043D \u0438\u043D\u0442\u0435\u043B\u0435\u043A\u0442",
  description: "\u0414\u0435\u0444\u0438\u043D\u0438\u0446\u0438\u0438, \u0440\u044A\u043A\u043E\u0432\u043E\u0434\u0441\u0442\u0432\u0430 \u0438 \u0441\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u044F \u0437\u0430 AI \u043D\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438. \u041F\u044A\u043B\u043D\u0430 \u0440\u0435\u0444\u0435\u0440\u0435\u043D\u0442\u043D\u0430 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430 \u0437\u0430 \u0438\u0437\u043A\u0443\u0441\u0442\u0432\u0435\u043D \u0438\u043D\u0442\u0435\u043B\u0435\u043A\u0442.",
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

// Listing columns — no need for full `content` on the listing page
const LISTING_COLUMNS = "id, slug, title, content_type, category, key_takeaway, word_count, quality_score, views, published_at" as const;

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
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

  // Search — use ilike since textSearch with 'simple' config may not be available
  if (q && q.trim()) {
    const searchTerm = `%${q.trim()}%`;
    query = query.or(`title.ilike.${searchTerm},key_takeaway.ilike.${searchTerm}`);
  }

  // Sort
  switch (sort) {
    case "views":
      query = query.order("views", { ascending: false });
      break;
    case "quality":
      query = query.order("quality_score", { ascending: false, nullsFirst: false });
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

  // Count per type (use known totals unless filtered by category or search)
  let typeCounts = { definition: 111, howto: 111, comparison: 111 };
  if (category || q) {
    const { data: countData } = await supabase.rpc("get_resource_type_counts" as never);
    // Fallback: run 3 count queries
    if (!countData) {
      const buildCountQuery = (ct: string) => {
        let cq = supabase.from("resources").select("id", { count: "exact", head: true }).eq("content_type", ct);
        if (category) cq = cq.eq("category", category);
        if (q && q.trim()) {
          const searchTerm = `%${q.trim()}%`;
          cq = cq.or(`title.ilike.${searchTerm},key_takeaway.ilike.${searchTerm}`);
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
  }

  // Build base URL params for pagination links
  const baseParams = new URLSearchParams();
  if (type) baseParams.set("type", type);
  if (category) baseParams.set("category", category);
  if (sort && sort !== "newest") baseParams.set("sort", sort);
  if (q) baseParams.set("q", q);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI \u0420\u0435\u0441\u0443\u0440\u0441\u0438",
    description: "\u0414\u0435\u0444\u0438\u043D\u0438\u0446\u0438\u0438, \u0440\u044A\u043A\u043E\u0432\u043E\u0434\u0441\u0442\u0432\u0430 \u0438 \u0441\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u044F \u0437\u0430 AI \u043D\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438",
    url: "https://aizavseki.eu/resources",
    numberOfItems: totalCount,
    inLanguage: "bg",
  };

  return (
    <div className="pt-24 pb-16 sm:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h1 className="font-display text-4xl font-bold text-brand-white sm:text-5xl">
            AI {"\u0420\u0435\u0441\u0443\u0440\u0441\u0438"}
          </h1>
          <p className="mt-4 text-brand-gray text-lg max-w-2xl">
            {"\u0414\u0435\u0444\u0438\u043D\u0438\u0446\u0438\u0438, \u0440\u044A\u043A\u043E\u0432\u043E\u0434\u0441\u0442\u0432\u0430 \u0438 \u0441\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u044F \u2014 \u0432\u0441\u0438\u0447\u043A\u043E \u0437\u0430 AI \u043D\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438"}
          </p>
        </ScrollReveal>

        <div className="mt-6">
          <Link
            href="/resources/rechnik"
            className="inline-flex items-center gap-2 rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 px-4 py-2.5 text-sm text-brand-cyan hover:bg-brand-cyan/10 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            {"AI \u0420\u0435\u0447\u043D\u0438\u043A \u2014 \u0422\u0435\u0440\u043C\u0438\u043D\u0438 \u043D\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438"}
          </Link>
        </div>

        {/* Search */}
        <div className="mt-8">
          <Suspense fallback={<Skeleton className="h-12 w-full" />}>
            <ResourceSearch />
          </Suspense>
        </div>

        {/* Stats bar + sort */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <ResourceStats activeType={type || null} counts={typeCounts} />
          <Suspense fallback={<Skeleton className="h-10 w-40" />}>
            <ResourceSort />
          </Suspense>
        </div>

        {/* Type + category filters */}
        <div className="mt-6">
          <Suspense fallback={<div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-8 w-full" /></div>}>
            <ResourceTypeFilter />
          </Suspense>
        </div>

        {/* Grid */}
        <div className="mt-10">
          <Suspense
            fallback={
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-64" />
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
      </div>
    </div>
  );
}
