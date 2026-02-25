"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PILLARS, type PillarKey } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  Newspaper,
  Wrench,
  Lightbulb,
  Briefcase,
  Gamepad2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const PILLAR_ICONS: Record<PillarKey, LucideIcon> = {
  AI_NEWS: Newspaper,
  AI_TOOLS: Wrench,
  AI_TIPS: Lightbulb,
  AI_BUSINESS: Briefcase,
  AI_FUN: Gamepad2,
};

export function PillarFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activePillar = searchParams.get("pillar");

  function handleFilter(pillar: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (pillar) {
      params.set("pillar", pillar);
    } else {
      params.delete("pillar");
    }
    params.delete("page");
    const qs = params.toString();
    router.push(`/blog${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => handleFilter(null)}
        className={cn(
          "flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 border shrink-0",
          !activePillar
            ? "bg-brand-cyan/15 text-brand-cyan border-brand-cyan/30 shadow-[0_0_15px_rgba(0,212,255,0.15)]"
            : "bg-brand-navy/60 text-brand-gray border-brand-white/10 hover:text-brand-white hover:bg-brand-navy hover:border-brand-white/20"
        )}
      >
        {"\u0412\u0441\u0438\u0447\u043A\u0438"}
      </button>
      {(Object.entries(PILLARS) as [PillarKey, (typeof PILLARS)[PillarKey]][]).map(
        ([key, pillar]) => {
          const Icon = PILLAR_ICONS[key];
          const isActive = activePillar === key;
          return (
            <button
              key={key}
              onClick={() => handleFilter(key)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 border shrink-0",
                isActive
                  ? "border-opacity-30"
                  : "bg-brand-navy/60 text-brand-gray border-brand-white/10 hover:text-brand-white hover:bg-brand-navy hover:border-brand-white/20"
              )}
              style={
                isActive
                  ? {
                      backgroundColor: `${pillar.color}15`,
                      color: pillar.color,
                      borderColor: `${pillar.color}4D`,
                      boxShadow: `0 0 15px ${pillar.color}26`,
                    }
                  : undefined
              }
            >
              <Icon className="w-4 h-4" />
              {pillar.label}
            </button>
          );
        }
      )}
    </div>
  );
}
