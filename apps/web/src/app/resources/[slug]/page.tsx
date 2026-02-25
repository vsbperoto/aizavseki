import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FaqSection } from "@/components/blog/FaqSection";
import {
  Clock, Eye, BookOpen, FileText, ArrowRightLeft,
  FileCode2, Sparkles, ArrowRight, ArrowLeft, Calendar,
} from "lucide-react";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CONTENT_TYPES, RESOURCE_CATEGORIES } from "@/lib/constants";
import type { ContentTypeKey, ResourceCategoryKey } from "@/lib/constants";
import type { Resource, FaqItem } from "@/lib/supabase/types";
import { BackButton } from "@/components/resources/BackButton";
import { ReadingProgress } from "@/components/resources/ReadingProgress";

interface ResourcePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: resource } = await supabase
    .from("resources")
    .select("title, key_takeaway")
    .eq("slug", slug)
    .single();

  if (!resource) return {};

  return {
    title: `${resource.title} | AiZaVseki`,
    description: resource.key_takeaway || "AI ресурс от AiZaVseki",
  };
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("resources")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!data) notFound();

  const resource = data as Resource;

  let relatedResources: Resource[] = [];
  if (resource.related_resources?.length) {
    const { data: related } = await supabase
      .from("resources")
      .select("*")
      .in("slug", resource.related_resources)
      .limit(3);
    relatedResources = (related || []) as Resource[];
  }

  const faqItems = (resource.faq_items || []) as FaqItem[];
  const readingTime = Math.max(1, Math.ceil((resource.word_count || 0) / 200));
  const typeConfig = CONTENT_TYPES[resource.content_type as ContentTypeKey];
  const categoryConfig = RESOURCE_CATEGORIES[resource.category as ResourceCategoryKey];

  const TYPE_ICONS: Record<string, React.ElementType> = {
    definition: BookOpen,
    howto: FileText,
    comparison: ArrowRightLeft,
  };
  const IconComponent = TYPE_ICONS[resource.content_type] || FileCode2;

  return (
    <>
      <ReadingProgress />

      <div className="min-h-screen bg-brand-dark text-brand-gray font-body selection:bg-brand-cyan/20 selection:text-brand-white">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <header className="relative pt-28 pb-14 border-b border-brand-white/5">
          {/* Single, subtle ambient light — no more blob chaos */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(0,212,255,0.05),transparent)] pointer-events-none" />

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

            {/* Breadcrumb row */}
            <nav className="flex items-center gap-2 mb-10 text-xs text-brand-gray/40 font-medium">
              <BackButton />
              <span className="mx-1 text-brand-gray/20">·</span>
              <Link href="/resources" className="hover:text-brand-cyan transition-colors">
                Ресурси
              </Link>
              {categoryConfig && (
                <>
                  <span className="text-brand-gray/20">/</span>
                  <span className="text-brand-gray/60">{categoryConfig.name}</span>
                </>
              )}
            </nav>

            {/* Type badge */}
            <div className="flex items-center gap-2.5 mb-5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-brand-cyan border border-brand-cyan/25 rounded px-2.5 py-1 bg-brand-cyan/5">
                <IconComponent className="w-3.5 h-3.5" />
                {typeConfig?.label || resource.content_type}
              </span>
            </div>

            {/* Title — strong, clean, no gradient */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.2rem] font-bold text-white font-display leading-[1.1] tracking-tight mb-7 max-w-3xl">
              {resource.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-brand-gray/45">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-cyan/50" />
                {readingTime} мин четене
              </span>
              <span className="w-px h-3.5 bg-brand-white/10 hidden sm:block" />
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-brand-cyan/50" />
                {resource.views || 0} прегледа
              </span>
              {resource.published_at && (
                <>
                  <span className="w-px h-3.5 bg-brand-white/10 hidden sm:block" />
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-cyan/50" />
                    {new Date(resource.published_at).toLocaleDateString("bg-BG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ── Body ─────────────────────────────────────────────────── */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-14 pb-32 flex flex-col lg:flex-row gap-14 xl:gap-20 items-start">

          {/* ── Main article ─────────────────────────────────────── */}
          <main className="flex-1 min-w-0 max-w-[680px]">

            {/* Key Takeaway — editorial pull-quote */}
            {resource.key_takeaway && (
              <div className="mb-14 pl-5 border-l-2 border-brand-cyan/60">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-cyan/70 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Ключов извод
                </p>
                <p className="text-lg sm:text-xl text-white/85 leading-[1.7] font-body font-normal">
                  {resource.key_takeaway.replace(/\*\*/g, "")}
                </p>
              </div>
            )}

            {/* Article content */}
            <div
              className="
                text-brand-gray-light/85 leading-[1.9] text-[1.05rem] font-body

                [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-bold [&_h2]:text-white
                [&_h2]:mt-16 [&_h2]:mb-6 [&_h2]:font-display [&_h2]:tracking-tight
                [&_h2]:pb-4 [&_h2]:border-b [&_h2]:border-brand-white/5

                [&_h3]:text-xl [&_h3]:sm:text-2xl [&_h3]:font-semibold [&_h3]:text-white/90
                [&_h3]:mt-12 [&_h3]:mb-5 [&_h3]:font-display

                [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-white/80
                [&_h4]:mt-8 [&_h4]:mb-4 [&_h4]:font-display

                [&_p]:mb-7

                [&_ul]:list-none [&_ul]:pl-0 [&_ul]:mb-8 [&_ul]:space-y-3
                [&_ul_li]:relative [&_ul_li]:pl-6
                [&_ul_li::before]:content-[''] [&_ul_li::before]:absolute [&_ul_li::before]:left-0
                [&_ul_li::before]:top-[0.65em] [&_ul_li::before]:w-1.5 [&_ul_li::before]:h-1.5
                [&_ul_li::before]:bg-brand-cyan/50 [&_ul_li::before]:rounded-full

                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-8 [&_ol]:space-y-3
                [&_ol_li]:pl-2 [&_ol_li]:marker:text-brand-cyan/60 [&_ol_li]:marker:font-semibold

                [&_a]:text-brand-cyan [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-brand-cyan/30
                [&_a:hover]:text-brand-cyan-bright [&_a:hover]:decoration-brand-cyan [&_a]:transition-colors

                [&_strong]:font-semibold [&_strong]:text-white/95

                [&_em]:text-brand-gray-light/70 [&_em]:italic

                [&_blockquote]:border-l-2 [&_blockquote]:border-accent-purple/60
                [&_blockquote]:pl-6 [&_blockquote]:ml-0 [&_blockquote]:my-10
                [&_blockquote]:text-brand-gray-light/70 [&_blockquote]:italic
                [&_blockquote_p]:mb-0

                [&_table]:w-full [&_table]:mb-10 [&_table]:text-sm
                [&_table]:border [&_table]:border-brand-white/8 [&_table]:rounded-xl [&_table]:overflow-hidden
                [&_th]:text-left [&_th]:text-white/80 [&_th]:font-semibold
                [&_th]:px-4 [&_th]:py-3 [&_th]:bg-brand-navy/60
                [&_th]:border-b [&_th]:border-brand-white/8
                [&_td]:px-4 [&_td]:py-3 [&_td]:border-b [&_td]:border-brand-white/5
                [&_tr:last-child_td]:border-b-0
                [&_tr:hover_td]:bg-brand-white/[0.02]

                [&_code]:bg-brand-navy-light [&_code]:text-brand-cyan-bright
                [&_code]:px-2 [&_code]:py-0.5 [&_code]:rounded-md
                [&_code]:text-[0.88em] [&_code]:font-mono
                [&_code]:border [&_code]:border-brand-white/8

                [&_pre]:bg-[#0c1017] [&_pre]:p-6 [&_pre]:rounded-xl
                [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-brand-white/8
                [&_pre]:mb-8 [&_pre]:text-sm
                [&_pre_code]:bg-transparent [&_pre_code]:text-brand-gray-light/80
                [&_pre_code]:p-0 [&_pre_code]:border-none

                [&_hr]:border-brand-white/8 [&_hr]:my-12
              "
            >
              <Markdown remarkPlugins={[remarkGfm]}>
                {resource.content}
              </Markdown>
            </div>

            <FaqSection items={faqItems} />

            {/* Article footer */}
            <footer className="mt-16 pt-8 border-t border-brand-white/5">
              <div className="flex flex-wrap items-center justify-between gap-5">
                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-gray/30">Тагове</span>
                  <span className="text-[11px] border border-brand-white/8 rounded px-2.5 py-1 text-brand-gray/50 bg-brand-white/[0.02]">
                    {typeConfig?.name || resource.content_type}
                  </span>
                  {categoryConfig && (
                    <span className="text-[11px] border border-brand-white/8 rounded px-2.5 py-1 text-brand-gray/50 bg-brand-white/[0.02]">
                      {categoryConfig.name}
                    </span>
                  )}
                </div>

                {/* Back link */}
                <Link
                  href="/resources"
                  className="inline-flex items-center gap-2 text-sm text-brand-gray/40 hover:text-brand-cyan transition-colors group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  Към всички ресурси
                </Link>
              </div>
            </footer>
          </main>

          {/* ── Sidebar ──────────────────────────────────────────── */}
          <aside className="w-full lg:w-60 xl:w-64 shrink-0 lg:sticky lg:top-28 space-y-10">

            {/* Related resources */}
            {relatedResources.length > 0 && (
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gray/35 mb-5">
                  Свързани ресурси
                </h3>
                <div className="space-y-px">
                  {relatedResources.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/resources/${rel.slug}`}
                      className="flex items-start gap-3 py-3 px-2 rounded-lg hover:bg-brand-white/[0.03] transition-colors group -mx-2"
                    >
                      <ArrowRight className="w-3.5 h-3.5 mt-0.5 text-brand-gray/20 group-hover:text-brand-cyan/60 shrink-0 transition-colors" />
                      <div>
                        <h4 className="text-sm text-brand-gray/60 group-hover:text-white transition-colors leading-snug mb-1 line-clamp-2">
                          {rel.title}
                        </h4>
                        <span className="text-[10px] uppercase tracking-[0.12em] text-brand-gray/30 font-medium">
                          {CONTENT_TYPES[rel.content_type as ContentTypeKey]?.label}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            {relatedResources.length > 0 && (
              <div className="border-t border-brand-white/5" />
            )}

            {/* Newsletter — minimal */}
            <div>
              <div className="w-7 h-7 rounded-md bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center mb-4">
                <Sparkles className="w-3.5 h-3.5 text-brand-cyan/70" />
              </div>
              <h4 className="text-sm font-semibold text-white/80 mb-2 leading-snug">
                Седмичен AI бюлетин
              </h4>
              <p className="text-xs text-brand-gray/40 mb-5 leading-relaxed">
                Най-важните AI новини и ресурси, директно в пощата ти.
              </p>
              <Link
                href="/newsletter"
                className="inline-flex items-center gap-2 w-full justify-center py-2 px-4 rounded-lg border border-brand-cyan/20 bg-brand-cyan/5 text-brand-cyan text-xs font-semibold hover:bg-brand-cyan/10 hover:border-brand-cyan/40 transition-all"
              >
                Абонирай се
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

          </aside>
        </div>
      </div>
    </>
  );
}
