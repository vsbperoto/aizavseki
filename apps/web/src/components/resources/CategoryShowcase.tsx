"use client";

import Link from "next/link";
import { RESOURCE_CATEGORIES } from "@/lib/constants";
import type { ResourceCategoryKey } from "@/lib/constants";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface CategoryShowcaseProps {
  typeCounts: { definition: number; howto: number; comparison: number };
}

const CATEGORY_COLORS: Record<ResourceCategoryKey, string> = {
  AI_BASICS: "#00d4ff",
  AI_TOOLS: "#7c3aed",
  AI_TIPS: "#f59e0b",
  AI_BUSINESS: "#10b981",
  AI_CREATIVE: "#ec4899",
  AI_DEVELOPMENT: "#00d4ff",
  AI_ETHICS: "#94a3b8",
  AI_TRENDS: "#7c3aed",
};

const TYPE_ENTRIES = [
  {
    key: "definition",
    label: "\u041a\u0430\u043a\u0432\u043e \u0435...?",
    description: "\u0414\u0435\u0444\u0438\u043d\u0438\u0446\u0438\u0438 \u043d\u0430 AI \u043f\u043e\u043d\u044f\u0442\u0438\u044f",
    color: "#00d4ff",
  },
  {
    key: "howto",
    label: "\u041a\u0430\u043a \u0434\u0430...?",
    description: "\u041f\u0440\u0430\u043a\u0442\u0438\u0447\u0435\u0441\u043a\u0438 \u0440\u044a\u043a\u043e\u0432\u043e\u0434\u0441\u0442\u0432\u0430",
    color: "#10b981",
  },
  {
    key: "comparison",
    label: "X vs Y",
    description: "\u0421\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u044f \u043c\u0435\u0436\u0434\u0443 \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u0438",
    color: "#f59e0b",
  },
] as const;

export function CategoryShowcase({ typeCounts }: CategoryShowcaseProps) {
  const categories = Object.entries(RESOURCE_CATEGORIES) as [
    ResourceCategoryKey,
    (typeof RESOURCE_CATEGORIES)[ResourceCategoryKey],
  ][];

  return (
    <div>
      {/* Section header */}
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-brand-white mb-2">
          {"\u0418\u0437\u0441\u043b\u0435\u0434\u0432\u0430\u0439 \u043f\u043e \u0442\u0435\u043c\u0430"}
        </h2>
        <p className="text-sm text-brand-gray">
          {"\u0418\u0437\u0431\u0435\u0440\u0438 \u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u044f, \u0437\u0430 \u0434\u0430 \u0432\u0438\u0434\u0438\u0448 \u0432\u0441\u0438\u0447\u043a\u0438 \u0440\u0435\u0441\u0443\u0440\u0441\u0438 \u0432 \u043d\u0435\u044f"}
        </p>
      </div>

      {/* 2-column category card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map(([key, cat], index) => {
          const color = CATEGORY_COLORS[key];
          return (
            <ScrollReveal key={key} delay={index * 0.06}>
              <Link
                href={`/resources?category=${key}`}
                className="group relative flex items-start gap-4 p-5 rounded-2xl border border-brand-white/5 bg-brand-navy/40 backdrop-blur-sm hover:border-brand-white/10 hover:bg-brand-navy/60 transition-all duration-300 overflow-hidden"
              >
                {/* Left color accent bar */}
                <div
                  className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: color }}
                />

                {/* Icon container */}
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${color}18` }}
                >
                  {cat.icon}
                </div>

                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-heading font-semibold text-brand-white text-base mb-1 transition-colors duration-200"
                    style={{ color: undefined }}
                  >
                    <span className="group-hover:text-brand-cyan transition-colors duration-200">
                      {cat.name}
                    </span>
                  </h3>
                  <p className="text-sm text-brand-gray/70 leading-relaxed">
                    {cat.description}
                  </p>
                  <p className="text-xs text-brand-gray/40 group-hover:text-brand-cyan/70 mt-2 transition-colors duration-200 font-medium">
                    {"\u041f\u0440\u0435\u0433\u043b\u0435\u0434 \u2192"}
                  </p>
                </div>

                {/* Hover glow blob */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[60px] opacity-0 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: color }}
                />
              </Link>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Content type links */}
      <div className="mt-10 pt-8 border-t border-brand-white/5">
        <p className="text-xs font-semibold text-brand-gray/50 uppercase tracking-widest mb-4">
          {"\u0418\u043b\u0438 \u0440\u0430\u0437\u0433\u043b\u0435\u0434\u0430\u0439 \u043f\u043e \u0442\u0438\u043f"}
        </p>
        <div className="flex flex-wrap gap-3">
          {TYPE_ENTRIES.map((t) => {
            const count = typeCounts[t.key as keyof typeof typeCounts];
            return (
              <Link
                key={t.key}
                href={`/resources?type=${t.key}`}
                className="group flex flex-col gap-0.5 px-4 py-3 rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  backgroundColor: `${t.color}0d`,
                  borderColor: `${t.color}25`,
                }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: t.color }}
                >
                  {t.label}
                </span>
                <span className="text-xs" style={{ color: `${t.color}80` }}>
                  {t.description}
                </span>
                <span
                  className="text-xs font-bold mt-1"
                  style={{ color: `${t.color}99` }}
                >
                  {count} {"\u0440\u0435\u0441\u0443\u0440\u0441\u0430"}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
