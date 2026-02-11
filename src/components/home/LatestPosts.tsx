import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ArrowRight, Clock } from "lucide-react";
import { formatDate, truncate } from "@/lib/utils";
import type { Post } from "@/lib/supabase/types";
import type { PillarKey } from "@/lib/constants";

interface LatestPostsProps {
  posts: Post[];
}

export function LatestPosts({ posts }: LatestPostsProps) {
  if (!posts || posts.length === 0) {
    return (
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl font-bold text-brand-white sm:text-4xl">
            {"\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438"}
          </h2>
          <p className="mt-4 text-brand-gray text-lg">
            {"\u0421\u043A\u043E\u0440\u043E \u0442\u0443\u043A \u0449\u0435 \u0441\u0435 \u043F\u043E\u044F\u0432\u044F\u0442 \u043D\u0430\u0448\u0438\u0442\u0435 \u043F\u044A\u0440\u0432\u0438 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438!"}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-heading text-3xl font-bold text-brand-white sm:text-4xl">
                {"\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438"}
              </h2>
              <p className="mt-4 text-brand-gray text-lg">
                {"\u041D\u0430\u0439-\u043D\u043E\u0432\u043E\u0442\u043E \u043E\u0442 \u0441\u0432\u0435\u0442\u0430 \u043D\u0430 AI"}
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden items-center gap-1 text-brand-cyan transition-all hover:text-brand-cyan-bright hover:shadow-[0_0_15px_rgba(0,212,255,0.15)] sm:flex px-3 py-1.5 rounded-lg"
            >
              {"\u0412\u0438\u0436 \u0432\u0441\u0438\u0447\u043A\u0438"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 6).map((post, index) => (
            <ScrollReveal key={post.id} delay={index * 0.1}>
              <Link href={`/blog/${post.slug}`}>
                <div className="group relative h-full">
                  {/* Hover glow */}
                  <div className="pointer-events-none absolute -inset-px rounded-2xl bg-brand-cyan/0 blur-[30px] transition-all duration-500 opacity-0 group-hover:opacity-10 group-hover:bg-brand-cyan/10" />
                  <Card className="relative h-full flex flex-col overflow-hidden">
                    {/* Gradient top border */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/40 to-transparent" />

                    {/* Image */}
                    {post.image_urls?.[0] && (
                      <div className="relative mb-4 aspect-video overflow-hidden rounded-xl">
                        <img
                          src={post.image_urls[0]}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}

                    <Badge pillar={post.pillar as PillarKey} className="mb-3" />

                    <h3 className="font-heading text-lg font-semibold text-brand-white line-clamp-2 group-hover:text-brand-cyan transition-colors">
                      {post.title}
                    </h3>

                    {post.hook && (
                      <p className="mt-2 text-sm text-brand-gray line-clamp-2 flex-1">
                        {truncate(post.hook, 120)}
                      </p>
                    )}

                    <div className="mt-4 flex items-center gap-3 text-xs text-brand-gray/60">
                      <span>{formatDate(post.published_at)}</span>
                      {post.word_count && (
                        <>
                          <span className="text-brand-cyan/20">{"\u2022"}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {Math.ceil(post.word_count / 200)} {"\u043C\u0438\u043D"}
                          </span>
                        </>
                      )}
                    </div>
                  </Card>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-brand-cyan"
          >
            {"\u0412\u0438\u0436 \u0432\u0441\u0438\u0447\u043A\u0438"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
