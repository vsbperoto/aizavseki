import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { truncate } from "@/lib/utils";
import { Clock, Eye, Sparkles } from "lucide-react";
import type { PillarKey } from "@/lib/constants";

interface PostCardProps {
  post: {
    id: string;
    slug: string;
    title: string;
    hook: string | null;
    pillar: string;
    image_urls: string[] | null;
    published_at: string;
    views: number;
    quality_score: number | null;
    word_count: number | null;
  };
}

const PILLAR_STYLES: Record<string, { color: string; gradient: string }> = {
  AI_NEWS: { color: "#00d4ff", gradient: "from-[#00d4ff] to-blue-600" },
  AI_TOOLS: { color: "#7c3aed", gradient: "from-[#7c3aed] to-purple-600" },
  AI_TIPS: { color: "#f59e0b", gradient: "from-[#f59e0b] to-orange-600" },
  AI_BUSINESS: { color: "#10b981", gradient: "from-[#10b981] to-emerald-600" },
  AI_FUN: { color: "#ec4899", gradient: "from-[#ec4899] to-pink-600" },
};

export function PostCard({ post }: PostCardProps) {
  const style = PILLAR_STYLES[post.pillar] || PILLAR_STYLES.AI_NEWS;
  const readingTime = Math.max(1, Math.ceil((post.word_count || 0) / 200));
  const isTopQuality = (post.quality_score || 0) >= 8.5;

  return (
    <Card
      hover={true}
      className="h-full flex flex-col p-0 overflow-hidden group border-brand-white/5 bg-brand-navy/40"
    >
      {/* Top Gradient Border */}
      <div className={`h-1 w-full bg-gradient-to-r ${style.gradient}`} />

      {post.image_urls?.[0] && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={post.image_urls[0]}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-6 flex flex-col flex-1 relative">
        {/* Glow effect on hover */}
        <div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
          style={{ backgroundColor: style.color }}
        />

        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge pillar={post.pillar as PillarKey} />
          {isTopQuality && (
            <div className="flex items-center gap-1 text-xs font-medium text-amber-400">
              <Sparkles className="w-3 h-3" />
              <span>{"\u0422\u043E\u043F"}</span>
            </div>
          )}
        </div>

        <h3 className="font-heading text-lg font-bold text-brand-white mb-3 group-hover:text-brand-cyan transition-colors duration-300 line-clamp-2">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark focus-visible:rounded-2xl"
          >
            {post.title}
          </Link>
        </h3>

        {post.hook && (
          <p className="text-sm text-brand-gray/80 line-clamp-3 mb-6 flex-1 leading-relaxed">
            {truncate(post.hook, 150)}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-brand-white/5 text-xs text-brand-gray group-hover:text-brand-gray-light transition-colors">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {readingTime} {"\u043C\u0438\u043D"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>{post.views}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
