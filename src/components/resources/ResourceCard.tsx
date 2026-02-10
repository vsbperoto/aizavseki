import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { truncate } from "@/lib/utils";
import { Clock, Eye, Sparkles } from "lucide-react";
import { CONTENT_TYPES } from "@/lib/constants";
import type { ContentTypeKey } from "@/lib/constants";

interface ResourceCardProps {
  resource: {
    id: string;
    slug: string;
    title: string;
    content_type: string;
    category: string;
    key_takeaway: string | null;
    word_count: number;
    quality_score: number | null;
    views: number;
    published_at: string;
  };
  priority?: boolean;
}

const TYPE_STYLES: Record<
  ContentTypeKey,
  { color: string; gradient: string }
> = {
  definition: {
    color: "#00d4ff",
    gradient: "from-[#00d4ff] to-blue-600",
  },
  howto: {
    color: "#10b981",
    gradient: "from-[#10b981] to-emerald-600",
  },
  comparison: {
    color: "#f59e0b",
    gradient: "from-[#f59e0b] to-orange-600",
  },
};

export function ResourceCard({ resource, priority = false }: ResourceCardProps) {
  const typeKey = resource.content_type as ContentTypeKey;
  const style = TYPE_STYLES[typeKey] || TYPE_STYLES.definition;
  const typeConfig = CONTENT_TYPES[typeKey];
  const readingTime = Math.max(1, Math.ceil((resource.word_count || 0) / 200));
  const isTopQuality = (resource.quality_score || 0) >= 8.5;

  return (
    <Card
      hover={true}
      className="h-full flex flex-col p-0 overflow-hidden group border-brand-white/5 bg-brand-navy/40"
    >
      {/* Top Gradient Border */}
      <div className={`h-1 w-full bg-gradient-to-r ${style.gradient}`} />

      <div className="p-6 flex flex-col flex-1 relative">
        {/* Glow effect on hover */}
        <div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
          style={{ backgroundColor: style.color }}
        />

        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider"
            style={{
              backgroundColor: `${style.color}15`,
              color: style.color,
              boxShadow: `0 0 10px ${style.color}20`,
            }}
          >
            {typeConfig?.label || resource.content_type}
          </span>
          {isTopQuality && (
            <div className="flex items-center gap-1 text-xs font-medium text-amber-400">
              <Sparkles className="w-3 h-3" />
              <span>{"\u0422\u043E\u043F"}</span>
            </div>
          )}
        </div>

        <h3
          className={`font-heading font-bold text-brand-white mb-3 group-hover:text-brand-cyan transition-colors duration-300 ${
            priority ? "text-2xl" : "text-lg"
          }`}
        >
          <Link
            href={`/resources/${resource.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark focus-visible:rounded-2xl"
          >
            {resource.title}
          </Link>
        </h3>

        {resource.key_takeaway && (
          <p className="text-sm text-brand-gray/80 line-clamp-3 mb-6 flex-1 leading-relaxed">
            {truncate(
              resource.key_takeaway.replace(/\*\*/g, ""),
              priority ? 200 : 120
            )}
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
            <span>{resource.views}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
