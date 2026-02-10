import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ResourceGrid } from "@/components/resources/ResourceGrid";
import { ResourceTypeFilter } from "@/components/resources/ResourceTypeFilter";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Resource } from "@/lib/supabase/types";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "AI \u0420\u0435\u0441\u0443\u0440\u0441\u0438 \u2014 333 \u0441\u0442\u0430\u0442\u0438\u0438 \u0437\u0430 \u0438\u0437\u043A\u0443\u0441\u0442\u0432\u0435\u043D \u0438\u043D\u0442\u0435\u043B\u0435\u043A\u0442",
  description: "\u0414\u0435\u0444\u0438\u043D\u0438\u0446\u0438\u0438, \u0440\u044A\u043A\u043E\u0432\u043E\u0434\u0441\u0442\u0432\u0430 \u0438 \u0441\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u044F \u0437\u0430 AI \u043D\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438. \u041F\u044A\u043B\u043D\u0430 \u0440\u0435\u0444\u0435\u0440\u0435\u043D\u0442\u043D\u0430 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430 \u0437\u0430 \u0438\u0437\u043A\u0443\u0441\u0442\u0432\u0435\u043D \u0438\u043D\u0442\u0435\u043B\u0435\u043A\u0442.",
  alternates: { canonical: "https://aizavseki.eu/resources" },
};

export const revalidate = 3600;

interface ResourcesPageProps {
  searchParams: Promise<{ type?: string; category?: string }>;
}

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
  const { type, category } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("resources")
    .select("*")
    .order("published_at", { ascending: false });

  if (type) {
    query = query.eq("content_type", type);
  }
  if (category) {
    query = query.eq("category", category);
  }

  const { data } = await query;
  const resources = (data || []) as Resource[];

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI \u0420\u0435\u0441\u0443\u0440\u0441\u0438",
    description: "\u0414\u0435\u0444\u0438\u043D\u0438\u0446\u0438\u0438, \u0440\u044A\u043A\u043E\u0432\u043E\u0434\u0441\u0442\u0432\u0430 \u0438 \u0441\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u044F \u0437\u0430 AI \u043D\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438",
    url: "https://aizavseki.eu/resources",
    numberOfItems: resources.length,
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
            {"AI Речник \u2014 Термини на български"}
          </Link>
        </div>

        <div className="mt-8">
          <Suspense fallback={null}>
            <ResourceTypeFilter />
          </Suspense>
        </div>

        <div className="mt-12">
          <Suspense
            fallback={
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            }
          >
            <ResourceGrid resources={resources} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
