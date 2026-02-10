import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { truncate } from "@/lib/utils";
import { CONTENT_TYPES, RESOURCE_CATEGORIES } from "@/lib/constants";
import type { Resource } from "@/lib/supabase/types";
import type { ContentTypeKey, ResourceCategoryKey } from "@/lib/constants";

interface ResourceCardProps {
  resource: Resource;
}

const TYPE_COLORS: Record<ContentTypeKey, string> = {
  definition: "#00d4ff",
  howto: "#10b981",
  comparison: "#f59e0b",
};

export function ResourceCard({ resource }: ResourceCardProps) {
  const typeConfig = CONTENT_TYPES[resource.content_type as ContentTypeKey];
  const categoryConfig = RESOURCE_CATEGORIES[resource.category as ResourceCategoryKey];
  const typeColor = TYPE_COLORS[resource.content_type as ContentTypeKey] || "#00d4ff";
  const readingTime = Math.max(1, Math.ceil((resource.word_count || 0) / 200));

  return (
    <Link href={`/resources/${resource.slug}`}>
      <Card className="group h-full flex flex-col">
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
              &middot; {categoryConfig.name}
            </span>
          )}
        </div>

        <h3 className="font-heading text-lg font-semibold text-brand-white line-clamp-2 group-hover:text-brand-cyan transition-colors">
          {resource.title}
        </h3>

        {resource.key_takeaway && (
          <p className="mt-2 text-sm text-brand-gray line-clamp-3 flex-1">
            {truncate(resource.key_takeaway.replace(/\*\*/g, ''), 150)}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between text-xs text-brand-gray/60">
          <span>{readingTime} \u043C\u0438\u043D \u0447\u0435\u0442\u0435\u043D\u0435</span>
          <span>{resource.views} \u043F\u0440\u0435\u0433\u043B\u0435\u0434\u0430</span>
        </div>
      </Card>
    </Link>
  );
}
