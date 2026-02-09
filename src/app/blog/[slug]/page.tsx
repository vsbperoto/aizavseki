import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostContent } from "@/components/blog/PostContent";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import type { PillarKey } from "@/lib/constants";
import type { Post, PostContent as PostContentType } from "@/lib/supabase/types";

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
  if (!post) return { title: "Публикация не е намерена" };

  return {
    title: post.title,
    description: post.hook || undefined,
    openGraph: {
      title: post.title,
      description: post.hook || undefined,
      images: post.image_urls?.[0] ? [post.image_urls[0]] : undefined,
    },
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

  return (
    <div className="pt-24 pb-16 sm:pt-32">
      <article className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-brand-gray hover:text-brand-cyan transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Обратно към блога
        </Link>

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

          <div className="mt-6 flex items-center gap-4 text-sm text-brand-gray/60">
            <time dateTime={post.published_at}>
              {formatDate(post.published_at)}
            </time>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {post.views} прегледа
            </span>
          </div>
        </header>

        {post.image_urls?.[0] && (
          <div className="mb-10 overflow-hidden rounded-2xl">
            <img
              src={post.image_urls[0]}
              alt={post.title}
              className="w-full object-cover"
            />
          </div>
        )}

        <PostContent
          content={post.content as unknown as PostContentType}
          imageUrls={post.image_urls}
        />

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

        <div className="mt-10 border-t border-brand-cyan/10 pt-6">
          <ShareButtons title={post.title} slug={post.slug} />
        </div>
      </article>
    </div>
  );
}
