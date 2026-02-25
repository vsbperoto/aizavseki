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
    <div className="min-h-screen bg-brand-dark text-brand-gray/90 font-sans selection:bg-brand-cyan selection:text-brand-dark">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      {/* Global Glow Effect */}
      <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(2,191,223,0.12),rgba(0,0,0,0))] z-0 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1400px] flex w-full pt-16 sm:pt-20">
        {/* Sidebar Navigation */}
        <aside className="w-64 flex-shrink-0 hidden lg:block sticky top-[4rem] sm:top-[5rem] h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] overflow-y-auto py-8 pr-6 border-r border-brand-white/5 scrollbar-hide">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <ResourceTypeFilter />
          </Suspense>

          <div className="mt-8 border-t border-brand-white/5 pt-8">
            <Link
              href="/resources/rechnik"
              className="group flex items-center justify-between px-2 py-1.5 text-sm text-brand-gray/80 hover:text-brand-cyan rounded-md hover:bg-brand-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>AI Речник</span>
              </div>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-12 max-w-5xl">
          <div className="mb-4 text-sm text-brand-gray/40 flex items-center gap-2">
            <Link href="/" className="hover:text-brand-cyan transition-colors">Начало</Link>
            <span className="text-brand-white/10">/</span>
            <span className="text-brand-gray/60">Ресурси</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-brand-white via-brand-white to-brand-cyan/60 mb-6 leading-[1.1] font-display">
            AI Ресурси
          </h1>
          <p className="text-lg text-brand-white/70 mb-12 max-w-2xl leading-relaxed">
            Най-голямата колекция от дефиниции, ръководства и сравнения за изкуствен интелект на български език.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <div className="flex-1 w-full">
              <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                <ResourceSearch />
              </Suspense>
            </div>
            <div className="w-full sm:w-auto">
              <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                <ResourceSort />
              </Suspense>
            </div>
            {/* Mobile Category Dropdown - rendered only on small screens */}
            <div className="w-full lg:hidden">
              <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                <ResourceTypeFilter />
              </Suspense>
            </div>
          </div>

          <div className="min-h-[400px]">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className="h-80 w-full rounded-2xl bg-brand-white/5"
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseParams={baseParams}
          />
        </main>
      </div>
    </div>
  );
}
