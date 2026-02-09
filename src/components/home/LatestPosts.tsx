import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ArrowRight } from "lucide-react";
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
            Последни публикации
          </h2>
          <p className="mt-4 text-brand-gray text-lg">
            Скоро тук ще се появят нашите първи публикации!
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
                Последни публикации
              </h2>
              <p className="mt-4 text-brand-gray text-lg">
                Най-новото от света на AI
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden items-center gap-1 text-brand-cyan transition-colors hover:text-brand-cyan-bright sm:flex"
            >
              Виж всички
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 6).map((post, index) => (
            <ScrollReveal key={post.id} delay={index * 0.1}>
              <Link href={`/blog/${post.slug}`}>
                <Card className="group h-full flex flex-col">
                  {/* Image */}
                  {post.image_urls?.[0] && (
                    <div className="relative mb-4 aspect-video overflow-hidden rounded-xl">
                      <img
                        src={post.image_urls[0]}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
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

                  <p className="mt-4 text-xs text-brand-gray/60">
                    {formatDate(post.published_at)}
                  </p>
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-brand-cyan"
          >
            Виж всички
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
