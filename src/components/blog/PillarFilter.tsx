"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PILLARS, type PillarKey } from "@/lib/constants";
import { cn } from "@/lib/utils";

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
    router.push(`/blog?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleFilter(null)}
        className={cn(
          "rounded-full px-4 py-2 text-sm font-medium transition-all",
          !activePillar
            ? "bg-brand-cyan text-brand-dark"
            : "bg-brand-navy text-brand-gray hover:text-brand-white hover:bg-brand-navy-light"
        )}
      >
        Всички
      </button>
      {(Object.entries(PILLARS) as [PillarKey, (typeof PILLARS)[PillarKey]][]).map(
        ([key, pillar]) => (
          <button
            key={key}
            onClick={() => handleFilter(key)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              activePillar === key
                ? "text-brand-dark"
                : "bg-brand-navy text-brand-gray hover:text-brand-white hover:bg-brand-navy-light"
            )}
            style={
              activePillar === key
                ? { backgroundColor: pillar.color }
                : undefined
            }
          >
            {pillar.label}
          </button>
        )
      )}
    </div>
  );
}
