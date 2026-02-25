import Link from "next/link";
import { truncate } from "@/lib/utils";
import { BookOpen, FileText, ArrowRightLeft, FileCode2 } from "lucide-react";
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

const TYPE_ICONS: Record<ContentTypeKey, React.ElementType> = {
  definition: BookOpen,
  howto: FileText,
  comparison: ArrowRightLeft,
};

export function ResourceCard({ resource, priority = false }: ResourceCardProps) {
  const typeKey = resource.content_type as ContentTypeKey;
  const IconComponent = TYPE_ICONS[typeKey] || FileCode2;

  return (
    <Link
      href={`/resources/${resource.slug}`}
      className="block p-6 rounded-xl border border-brand-white/5 bg-gradient-to-br from-brand-navy/40 to-brand-navy/10 hover:border-brand-white/20 hover:from-brand-navy/60 hover:to-brand-navy/20 transition-all duration-300 hover:-translate-y-1 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50 backdrop-blur-sm"
    >
      <div className="w-10 h-10 rounded-lg bg-brand-navy border border-brand-white/10 flex items-center justify-center mb-4 group-hover:bg-brand-white/10 transition-colors duration-300">
        <IconComponent className="w-5 h-5 text-brand-gray/80 group-hover:text-brand-white transition-colors" />
      </div>

      <h3 className="text-lg font-semibold text-brand-white mb-2">
        {resource.title}
      </h3>

      {resource.key_takeaway && (
        <p className="text-brand-gray/60 text-sm leading-relaxed line-clamp-2">
          {truncate(resource.key_takeaway.replace(/\*\*/g, ""), 120)}
        </p>
      )}
    </Link>
  );
}
