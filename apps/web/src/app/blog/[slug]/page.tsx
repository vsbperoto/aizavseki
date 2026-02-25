import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { PostContent } from "@/components/blog/PostContent";
import { FaqSection } from "@/components/blog/FaqSection";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Eye, Clock } from "lucide-react";
import Link from "next/link";
import type { PillarKey } from "@/lib/constants";
import type { Post, PostContent as PostContentType, FaqItem } from "@/lib/supabase/types";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  const post = data as Post | null;
  if (!post) return { title: "\u041F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u044F \u043D\u0435 \u0435 \u043D\u0430\u043C\u0435\u0440\u0435\u043D\u0430" };

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.hook || undefined,
    keywords: post.keywords || undefined,
    alternates: { canonical: `https://aizavseki.eu/blog/${slug}` },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.hook || undefined,
      type: "article",
      publishedTime: post.published_at,
      images: post.image_urls?.[0]
        ? [{ url: post.image_urls[0], width: 1200, height: 630 }]
        : undefined,
    },
    twitter: post.image_urls?.[0]
      ? { card: "summary_large_image", images: [post.image_urls[0]] }
      : undefined,
  };
}

export const revalidate = 3600;

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  const post = data as Post | null;
  if (!post) notFound();

  const faqItems = (post.faq_items || []) as FaqItem[];

  const content = post.content as unknown as PostContentType;
  const readingTime = Math.max(1, Math.ceil((post.word_count || 0) / 200));

  // Article JSON-LD
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description || post.hook || undefined,
    image: post.image_urls?.[0] || undefined,
    datePublished: post.published_at,
    dateModified: post.published_at,
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
    mainEntityOfPage: `https://aizavseki.eu/blog/${slug}`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["article h1", "article h2", ".key-takeaway"],
    },
  };

  // HowTo JSON-LD (only for AI_TIPS pillar)
  const howToJsonLd = post.pillar === "AI_TIPS" && content.slide_titles?.length ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: post.title,
    description: post.meta_description || post.hook || undefined,
    step: content.slide_titles.map((title, i) => ({
      "@type": "HowToStep",
      name: title,
      text: content.slide_texts?.[i] || "",
    })),
  } : null;

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "\u041D\u0430\u0447\u0430\u043B\u043E", item: "https://aizavseki.eu" },
      { "@type": "ListItem", position: 2, name: "\u0411\u043B\u043E\u0433", item: "https://aizavseki.eu/blog" },
      { "@type": "ListItem", position: 3, name: post.title },
    ],
  };

  // FAQPage JSON-LD (only when FAQ items exist)
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

  return (
    <div className="min-h-screen">
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
      {howToJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
        />
      )}

      {/* Background Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-brand-navy-light/20 to-transparent" />
      </div>

      <article className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 pt-24 pb-16 sm:pt-32">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-brand-gray hover:text-brand-cyan hover:gap-2 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          {"\u041E\u0431\u0440\u0430\u0442\u043D\u043E \u043A\u044A\u043C \u0431\u043B\u043E\u0433\u0430"}
        </Link>

        <ScrollReveal>
          <header className="mb-10">
            <Badge pillar={post.pillar as PillarKey} className="mb-4" />

            <h1 className="font-display text-3xl font-bold text-brand-white sm:text-4xl lg:text-5xl leading-tight">
              {post.title}
            </h1>

            {post.hook && (
              <p className="mt-4 text-lg text-brand-gray-light">
                {post.hook}
              </p>
            )}

            <div className="mt-6 inline-flex items-center gap-4 text-sm text-brand-gray/60 bg-brand-navy/30 backdrop-blur-sm rounded-xl px-4 py-3 border border-brand-white/5">
              <time dateTime={post.published_at}>
                {formatDate(post.published_at)}
              </time>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {post.views} {"\u043F\u0440\u0435\u0433\u043B\u0435\u0434\u0430"}
              </span>
              {post.word_count ? (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {readingTime} {"\u043C\u0438\u043D \u0447\u0435\u0442\u0435\u043D\u0435"}
                </span>
              ) : null}
            </div>
          </header>
        </ScrollReveal>

        {post.image_urls?.[0] && (
          <div className="relative mb-10 aspect-video overflow-hidden rounded-2xl">
            <Image
              src={post.image_urls[0]}
              alt={post.image_alt_text || post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {post.key_takeaway && (
          <ScrollReveal>
            <div className="relative mb-10 rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 p-6 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-cyan/10 rounded-full blur-[60px] pointer-events-none" />
              <p className="relative text-sm font-semibold uppercase tracking-wider text-brand-cyan mb-2">
                {"\u041A\u043B\u044E\u0447\u043E\u0432 \u0438\u0437\u0432\u043E\u0434"}
              </p>
              <p className="relative text-lg text-brand-white leading-relaxed">
                {post.key_takeaway}
              </p>
            </div>
          </ScrollReveal>
        )}

        <PostContent
          content={content}
          imageUrls={post.image_urls}
          imageAltText={post.image_alt_text}
        />

        {faqItems.length > 0 && (
          <ScrollReveal>
            <FaqSection items={faqItems} />
          </ScrollReveal>
        )}

        {post.caption && (
          <div className="mt-10 rounded-xl bg-brand-navy/50 p-6 border border-brand-cyan/10">
            <p className="text-brand-gray-light italic">{post.caption}</p>
          </div>
        )}

        {post.hashtags && (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.hashtags.split(/\s+/).map((tag: string) => (
              <span key={tag} className="text-sm text-brand-cyan/60">
                {tag}
              </span>
            ))}
          </div>
        )}

        <ScrollReveal>
          <div className="mt-10 border-t border-brand-cyan/10 pt-6">
            <ShareButtons title={post.title} slug={post.slug} />
          </div>
        </ScrollReveal>
      </article>
    </div>
  );
}
