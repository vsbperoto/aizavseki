import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { PostGrid } from "@/components/blog/PostGrid";
import { Pagination } from "@/components/resources/Pagination";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { PillarKey } from "@/lib/constants";
import { PILLARS, PILLAR_SLUGS } from "@/lib/constants";

interface PillarPageProps {
  pillarKey: PillarKey;
  currentPage?: number;
}

const PER_PAGE = 12;

const LISTING_COLUMNS =
  "id, slug, title, hook, pillar, image_urls, published_at, views, quality_score, word_count" as const;

export async function PillarPage({ pillarKey, currentPage = 1 }: PillarPageProps) {
  const pillar = PILLARS[pillarKey];
  const slug = PILLAR_SLUGS[pillarKey];
  const supabase = await createClient();
  const offset = (currentPage - 1) * PER_PAGE;

  const { data, count } = await supabase
    .from("posts")
    .select(LISTING_COLUMNS, { count: "exact" })
    .eq("pillar", pillarKey)
    .order("published_at", { ascending: false })
    .range(offset, offset + PER_PAGE - 1);

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

  const baseParams = new URLSearchParams();

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pillar.label,
    description: pillar.description,
    url: `https://aizavseki.eu/blog/${slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "AiZaVseki",
      url: "https://aizavseki.eu",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalCount,
      itemListElement: posts.slice(0, 10).map((post, i) => ({
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

      {/* Background Gradient + Pillar Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-navy-light/20 to-transparent" />
        <div
          className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[100px] opacity-20"
          style={{ backgroundColor: pillar.color }}
        />
      </div>

      <div className="relative z-10 pt-24 pb-16 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <Link
              href="/blog"
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-brand-gray hover:text-brand-cyan hover:gap-2 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              {"\u0412\u0441\u0438\u0447\u043A\u0438 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438"}
            </Link>

            <div className="flex items-center gap-3 mb-2">
              <Badge pillar={pillarKey} />
            </div>

            <h1 className="font-display text-4xl font-bold text-brand-white sm:text-5xl">
              {pillar.label}
            </h1>
            <p className="mt-4 text-brand-gray text-lg">
              {pillar.description}
            </p>

            {/* Post count stat */}
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-navy/30 backdrop-blur-sm border border-brand-white/5">
              <span className="text-xl font-bold" style={{ color: pillar.color }}>
                {totalCount}
              </span>
              <span className="text-sm text-brand-gray">
                {"\u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438"}
              </span>
            </div>
          </ScrollReveal>

          <div className="mt-12">
            <Suspense
              fallback={
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-80" />
                  ))}
                </div>
              }
            >
              {posts.length > 0 ? (
                <PostGrid
                  posts={posts}
                  totalCount={totalCount}
                  currentPage={currentPage}
                  perPage={PER_PAGE}
                />
              ) : (
                <p className="text-brand-gray text-lg">
                  {"\u0412\u0441\u0435 \u043E\u0449\u0435 \u043D\u044F\u043C\u0430 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438 \u0432 \u0442\u0430\u0437\u0438 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F. \u0421\u043A\u043E\u0440\u043E!"}
                </p>
              )}
            </Suspense>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseParams={baseParams}
            basePath={`/blog/${slug}`}
          />
        </div>
      </div>
    </div>
  );
}
