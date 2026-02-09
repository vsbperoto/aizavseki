import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate, truncate } from "@/lib/utils";
import type { Post } from "@/lib/supabase/types";
import type { PillarKey } from "@/lib/constants";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="group h-full flex flex-col">
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
          <p className="mt-2 text-sm text-brand-gray line-clamp-3 flex-1">
            {truncate(post.hook, 150)}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between text-xs text-brand-gray/60">
          <span>{formatDate(post.published_at)}</span>
          <span>{post.views} прегледа</span>
        </div>
      </Card>
    </Link>
  );
}
