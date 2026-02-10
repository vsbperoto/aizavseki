import Link from "next/link";
import { cn } from "@/lib/utils";

interface ResourceStatsProps {
  activeType: string | null;
  counts: { definition: number; howto: number; comparison: number };
}

const TYPE_STATS = [
  { key: "definition", label: "\u0434\u0435\u0444\u0438\u043D\u0438\u0446\u0438\u0438", emoji: "\ud83d\udd35" },
  { key: "howto", label: "\u0440\u044A\u043A\u043E\u0432\u043E\u0434\u0441\u0442\u0432\u0430", emoji: "\ud83d\udfe2" },
  { key: "comparison", label: "\u0441\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u044F", emoji: "\ud83d\udfe1" },
] as const;

export function ResourceStats({ activeType, counts }: ResourceStatsProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      {TYPE_STATS.map((t) => (
        <Link
          key={t.key}
          href={activeType === t.key ? "/resources" : `/resources?type=${t.key}`}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-colors",
            activeType === t.key
              ? "bg-brand-navy-light text-brand-white"
              : "text-brand-gray hover:text-brand-white"
          )}
        >
          <span>{t.emoji}</span>
          <span className="font-medium">
            {counts[t.key as keyof typeof counts]}
          </span>
          <span>{t.label}</span>
        </Link>
      ))}
    </div>
  );
}
