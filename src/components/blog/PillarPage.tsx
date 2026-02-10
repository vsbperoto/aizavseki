import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { PostGrid } from "@/components/blog/PostGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { PillarKey } from "@/lib/constants";
import { PILLARS, PILLAR_SLUGS } from "@/lib/constants";
import type { Post } from "@/lib/supabase/types";

interface PillarPageProps {
  pillarKey: PillarKey;
}

export async function PillarPage({ pillarKey }: PillarPageProps) {
  const pillar = PILLARS[pillarKey];
  const slug = PILLAR_SLUGS[pillarKey];
  const supabase = await createClient();

  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("pillar", pillarKey)
    .order("published_at", { ascending: false });

  const posts = (data || []) as Post[];

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
      numberOfItems: posts.length,
      itemListElement: posts.slice(0, 10).map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://aizavseki.eu/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <div className="pt-24 pb-16 sm:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-brand-gray hover:text-brand-cyan transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Всички публикации
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
              <PostGrid posts={posts} />
            ) : (
              <p className="text-brand-gray text-lg">
                Все още няма публикации в тази категория. Скоро!
              </p>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
