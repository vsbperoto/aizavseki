import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PostGrid } from "@/components/blog/PostGrid";
import { PillarFilter } from "@/components/blog/PillarFilter";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Post } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Блог",
  description: "AI новини, инструменти, съвети и забавления на български. Открий света на изкуствения интелект.",
  alternates: { canonical: "https://aizavseki.eu/blog" },
};

interface BlogPageProps {
  searchParams: Promise<{ pillar?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { pillar } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false });

  if (pillar) {
    query = query.eq("pillar", pillar);
  }

  const { data } = await query;
  const posts = (data || []) as Post[];

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "\u0411\u043B\u043E\u0433 \u2014 AiZaVseki",
    description: "AI \u043D\u043E\u0432\u0438\u043D\u0438, \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u0438, \u0441\u044A\u0432\u0435\u0442\u0438 \u0438 \u0437\u0430\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u043D\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438",
    url: "https://aizavseki.eu/blog",
    inLanguage: "bg",
    numberOfItems: posts.length,
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
    <div className="pt-24 pb-16 sm:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h1 className="font-display text-4xl font-bold text-brand-white sm:text-5xl">
            Блог
          </h1>
          <p className="mt-4 text-brand-gray text-lg">
            AI новини, инструменти и съвети — всичко на български
          </p>
        </ScrollReveal>

        <div className="mt-8">
          <Suspense fallback={null}>
            <PillarFilter />
          </Suspense>
        </div>

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
            <PostGrid posts={posts} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
