import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { truncate } from "@/lib/utils";
import { CONTENT_TYPES, RESOURCE_CATEGORIES } from "@/lib/constants";
import type { ContentTypeKey, ResourceCategoryKey } from "@/lib/constants";

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
}

const TYPE_COLORS: Record<ContentTypeKey, string> = {
  definition: "#00d4ff",
  howto: "#10b981",
  comparison: "#f59e0b",
};

const BORDER_CLASSES: Record<ContentTypeKey, string> = {
  definition: "border-l-4 border-l-[#00d4ff]",
  howto: "border-l-4 border-l-[#10b981]",
  comparison: "border-l-4 border-l-[#f59e0b]",
};

export function ResourceCard({ resource }: ResourceCardProps) {
  const typeConfig = CONTENT_TYPES[resource.content_type as ContentTypeKey];
  const categoryConfig = RESOURCE_CATEGORIES[resource.category as ResourceCategoryKey];
  const typeColor = TYPE_COLORS[resource.content_type as ContentTypeKey] || "#00d4ff";
  const borderClass = BORDER_CLASSES[resource.content_type as ContentTypeKey] || "";
  const readingTime = Math.max(1, Math.ceil((resource.word_count || 0) / 200));
  const isTopQuality = (resource.quality_score || 0) >= 8.5;

  return (
    <Link href={`/resources/${resource.slug}`}>
      <Card className={`group h-full flex flex-col ${borderClass}`} hover={false}>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{
              backgroundColor: `${typeColor}15`,
              color: typeColor,
              border: `1px solid ${typeColor}30`,
            }}
          >
            {typeConfig?.label || resource.content_type}
          </span>
          {categoryConfig && (
            <span className="text-xs text-brand-gray font-medium">
              &middot; {categoryConfig.icon} {categoryConfig.name}
            </span>
          )}
          {isTopQuality && (
            <span className="ml-auto inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
              {"\u2605 \u0422\u043E\u043F"}
            </span>
          )}
        </div>

        <h3 className="font-heading text-lg font-semibold text-brand-white line-clamp-2 group-hover:text-brand-cyan transition-colors">
          {resource.title}
        </h3>

        {resource.key_takeaway && (
          <p className="mt-2 text-sm text-brand-gray line-clamp-3 flex-1">
            {truncate(resource.key_takeaway.replace(/\*\*/g, ""), 150)}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between text-xs text-brand-gray/60">
          <span>{readingTime} {"\u043C\u0438\u043D \u0447\u0435\u0442\u0435\u043D\u0435"}</span>
          <span>{resource.views} {"\u043F\u0440\u0435\u0433\u043B\u0435\u0434\u0430"}</span>
        </div>
      </Card>
    </Link>
  );
}
