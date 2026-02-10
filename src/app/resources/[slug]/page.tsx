import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FaqSection } from "@/components/blog/FaqSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ArrowLeft, Eye, Clock } from "lucide-react";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CONTENT_TYPES, RESOURCE_CATEGORIES } from "@/lib/constants";
import type { Resource, FaqItem } from "@/lib/supabase/types";
import type { ContentTypeKey, ResourceCategoryKey } from "@/lib/constants";

interface ResourcePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("resources")
    .select("*")
    .eq("slug", slug)
    .single();

  const resource = data as Resource | null;
  if (!resource) return { title: "\u0420\u0435\u0441\u0443\u0440\u0441\u044A\u0442 \u043D\u0435 \u0435 \u043D\u0430\u043C\u0435\u0440\u0435\u043D" };

  return {
    title: resource.meta_title || resource.title,
    description: resource.meta_description || resource.key_takeaway || undefined,
    alternates: { canonical: `https://aizavseki.eu/resources/${slug}` },
    openGraph: {
      title: resource.meta_title || resource.title,
      description: resource.meta_description || resource.key_takeaway || undefined,
      type: "article",
      publishedTime: resource.published_at,
      images: resource.image_url ? [resource.image_url] : undefined,
    },
  };
}

export const revalidate = 3600;

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("resources")
    .select("*")
    .eq("slug", slug)
    .single();

  const resource = data as Resource | null;
  if (!resource) notFound();

  const faqItems = (resource.faq_items || []) as FaqItem[];
  const readingTime = Math.max(1, Math.ceil((resource.word_count || 0) / 200));
  const typeConfig = CONTENT_TYPES[resource.content_type as ContentTypeKey];
  const categoryConfig = RESOURCE_CATEGORIES[resource.category as ResourceCategoryKey];

  // Fetch related resources
  let relatedResources: Resource[] = [];
  if (resource.related_resources?.length) {
    const { data: related } = await supabase
      .from("resources")
      .select("*")
      .in("slug", resource.related_resources)
      .limit(3);
    relatedResources = (related || []) as Resource[];
  }

  // Article JSON-LD (type-specific)
  const isDefinition = resource.content_type === "definition";
  const articleType = isDefinition ? "DefinedTerm" : resource.content_type === "howto" ? "HowTo" : "Article";
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": articleType,
    ...(isDefinition
      ? {
          name: resource.title,
          description: resource.meta_description || resource.key_takeaway || undefined,
          inDefinedTermSet: {
            "@type": "DefinedTermSet",
            name: "AI \u0420\u0435\u0441\u0443\u0440\u0441\u0438 \u2014 \u0414\u0435\u0444\u0438\u043D\u0438\u0446\u0438\u0438",
            url: "https://aizavseki.eu/resources?type=definition",
          },
        }
      : {
          headline: resource.title,
          description: resource.meta_description || resource.key_takeaway || undefined,
        }),
    image: resource.image_url || undefined,
    datePublished: resource.published_at,
    dateModified: resource.updated_at,
    inLanguage: "bg",
    author: {
      "@type": "Organization",
      name: "AiZaVseki",
      url: "https://aizavseki.eu",
    },
    publisher: {
      "@type": "Organization",
      name: "AiZaVseki",
      logo: {
        "@type": "ImageObject",
        url: "https://aizavseki.eu/opengraph-image",
      },
    },
    mainEntityOfPage: `https://aizavseki.eu/resources/${slug}`,
    isPartOf: {
      "@type": "CollectionPage",
      name: "AI \u0420\u0435\u0441\u0443\u0440\u0441\u0438",
      url: "https://aizavseki.eu/resources",
    },
    ...(resource.content_type === "comparison" && { articleSection: "\u0421\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u044F" }),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["article h1", "article h2", ".key-takeaway"],
    },
  };

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "\u041D\u0430\u0447\u0430\u043B\u043E", item: "https://aizavseki.eu" },
      { "@type": "ListItem", position: 2, name: "\u0420\u0435\u0441\u0443\u0440\u0441\u0438", item: "https://aizavseki.eu/resources" },
      { "@type": "ListItem", position: 3, name: typeConfig?.label || resource.content_type, item: `https://aizavseki.eu/resources?type=${resource.content_type}` },
      { "@type": "ListItem", position: 4, name: resource.title },
    ],
  };

  // FAQPage JSON-LD
  const faqJsonLd = faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  } : null;

  const TYPE_COLORS: Record<string, string> = {
    definition: "#00d4ff",
    howto: "#10b981",
    comparison: "#f59e0b",
  };
  const typeColor = TYPE_COLORS[resource.content_type] || "#00d4ff";

  return (
    <div className="pt-24 pb-16 sm:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <article className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href="/resources"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-brand-gray hover:text-brand-cyan transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {"\u041E\u0431\u0440\u0430\u0442\u043D\u043E \u043A\u044A\u043C \u0440\u0435\u0441\u0443\u0440\u0441\u0438\u0442\u0435"}
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: `${typeColor}15`,
                color: typeColor,
                border: `1px solid ${typeColor}30`,
              }}
            >
              {typeConfig?.label || resource.content_type}
            </span>
            {categoryConfig && (
              <span className="text-sm text-brand-gray/60">
                {categoryConfig.name}
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl font-bold text-brand-white sm:text-4xl lg:text-5xl leading-tight">
            {resource.title}
          </h1>

          <div className="mt-6 flex items-center gap-4 text-sm text-brand-gray/60">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {readingTime} {"\u043C\u0438\u043D \u0447\u0435\u0442\u0435\u043D\u0435"}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {resource.views} {"\u043F\u0440\u0435\u0433\u043B\u0435\u0434\u0430"}
            </span>
          </div>
        </header>

        {resource.key_takeaway && (
          <div className="key-takeaway mb-10 rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-cyan mb-2">
              {"\u041A\u043B\u044E\u0447\u043E\u0432 \u0438\u0437\u0432\u043E\u0434"}
            </p>
            <p className="text-lg text-brand-white leading-relaxed">
              {resource.key_takeaway}
            </p>
          </div>
        )}

        <div className="text-brand-gray-light leading-relaxed text-lg [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-brand-white [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-brand-white [&_h3]:mt-8 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-brand-cyan [&_a]:underline [&_strong]:font-bold [&_strong]:text-brand-white [&_p]:mb-4 [&_li]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-brand-cyan/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-brand-gray [&_table]:w-full [&_th]:text-left [&_th]:text-brand-white [&_th]:font-semibold [&_th]:pb-2 [&_th]:border-b [&_th]:border-brand-cyan/20 [&_td]:py-2 [&_td]:border-b [&_td]:border-brand-navy-light">
          <Markdown remarkPlugins={[remarkGfm]}>
            {resource.content}
          </Markdown>
        </div>

        {faqItems.length > 0 && <FaqSection items={faqItems} />}

        {relatedResources.length > 0 && (
          <section className="mt-12">
            <h2 className="font-heading text-2xl font-bold text-brand-white mb-6">
              {"\u0421\u0432\u044A\u0440\u0437\u0430\u043D\u0438 \u0440\u0435\u0441\u0443\u0440\u0441\u0438"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedResources.map((r) => (
                <Link
                  key={r.id}
                  href={`/resources/${r.slug}`}
                  className="rounded-xl border border-brand-cyan/10 bg-brand-navy/30 p-4 hover:bg-brand-navy/50 transition-colors"
                >
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold mb-2"
                    style={{
                      backgroundColor: `${TYPE_COLORS[r.content_type] || "#00d4ff"}15`,
                      color: TYPE_COLORS[r.content_type] || "#00d4ff",
                    }}
                  >
                    {CONTENT_TYPES[r.content_type as ContentTypeKey]?.label || r.content_type}
                  </span>
                  <h3 className="font-heading text-sm font-semibold text-brand-white line-clamp-2">
                    {r.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 border-t border-brand-cyan/10 pt-6">
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 text-sm text-brand-gray hover:text-brand-cyan transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {"\u0412\u0441\u0438\u0447\u043A\u0438 \u0440\u0435\u0441\u0443\u0440\u0441\u0438"}
          </Link>
        </div>
      </article>
    </div>
  );
}
