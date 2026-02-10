import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PostGrid } from "@/components/blog/PostGrid";
import { PillarFilter } from "@/components/blog/PillarFilter";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogSearch } from "@/components/blog/BlogSearch";
import { BlogSort } from "@/components/blog/BlogSort";
import { Pagination } from "@/components/resources/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import type { PillarKey } from "@/lib/constants";

export const metadata: Metadata = {
  title: "\u0411\u043B\u043E\u0433",
  description: "AI \u043D\u043E\u0432\u0438\u043D\u0438, \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u0438, \u0441\u044A\u0432\u0435\u0442\u0438 \u0438 \u0437\u0430\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u043D\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438. \u041E\u0442\u043A\u0440\u0438\u0439 \u0441\u0432\u0435\u0442\u0430 \u043D\u0430 \u0438\u0437\u043A\u0443\u0441\u0442\u0432\u0435\u043D\u0438\u044F \u0438\u043D\u0442\u0435\u043B\u0435\u043A\u0442.",
  alternates: { canonical: "https://aizavseki.eu/blog" },
};

export const revalidate = 3600;

const PER_PAGE = 12;

const LISTING_COLUMNS =
  "id, slug, title, hook, pillar, image_urls, published_at, views, quality_score, word_count" as const;

interface BlogPageProps {
  searchParams: Promise<{
    pillar?: string;
    page?: string;
    sort?: string;
    q?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { pillar, page: pageParam, sort, q } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const offset = (currentPage - 1) * PER_PAGE;
  const supabase = await createClient();

  // Total count for hero stat
  const { count: totalPostsCount } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true });

  // Build query
  let query = supabase
    .from("posts")
    .select(LISTING_COLUMNS, { count: "exact" });

  // Pillar filter
  if (pillar) {
    query = query.eq("pillar", pillar);
  }

  // Search
  if (q && q.trim()) {
    const searchTerm = `%${q.trim()}%`;
    query = query.or(
      `title.ilike.${searchTerm},hook.ilike.${searchTerm},key_takeaway.ilike.${searchTerm}`
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
  const posts = (data || []) as {
    id: string;
    slug: string;
    title: string;
    hook: string | null;
    pillar: string;
    image_urls: string[] | null;
    published_at: string;
    views: number;
    quality_score: number | null;
    word_count: number | null;
  }[];
  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / PER_PAGE);

  // Base URL params for pagination links
  const baseParams = new URLSearchParams();
  if (pillar) baseParams.set("pillar", pillar);
  if (sort && sort !== "newest") baseParams.set("sort", sort);
  if (q) baseParams.set("q", q);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "\u0411\u043B\u043E\u0433 \u2014 AiZaVseki",
    description: "AI \u043D\u043E\u0432\u0438\u043D\u0438, \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u0438, \u0441\u044A\u0432\u0435\u0442\u0438 \u0438 \u0437\u0430\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u043D\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438",
    url: "https://aizavseki.eu/blog",
    inLanguage: "bg",
    numberOfItems: totalCount,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.slice(0, 20).map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://aizavseki.eu/blog/${post.slug}`,
        name: post.title,
      })),
    },
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
        <BlogHero
          totalPosts={totalPostsCount || 0}
          activePillar={(pillar as PillarKey) || null}
        />

        {/* CONTROLS — sticky toolbar */}
        <div className="sticky top-16 sm:top-20 z-40 bg-brand-dark/80 backdrop-blur-xl border border-brand-white/5 rounded-2xl p-4 shadow-2xl shadow-black/50 mb-10 transition-all">
          <div className="flex flex-col gap-6">
            <Suspense
              fallback={<Skeleton className="h-14 w-full rounded-xl" />}
            >
              <BlogSearch />
            </Suspense>

            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex-1 overflow-x-auto pb-2 lg:pb-0">
                <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                  <PillarFilter />
                </Suspense>
              </div>

              <div className="shrink-0">
                <Suspense fallback={<Skeleton className="h-10 w-40" />}>
                  <BlogSort />
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
            <PostGrid
              posts={posts}
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
          basePath="/blog"
        />
      </div>
    </div>
  );
}
