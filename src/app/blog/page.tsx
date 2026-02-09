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

  return (
    <div className="pt-24 pb-16 sm:pt-32">
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
