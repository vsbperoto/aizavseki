"use client";

import { Card } from "@/components/ui/Card";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PILLARS, type PillarKey } from "@/lib/constants";
import {
  Newspaper,
  Wrench,
  Lightbulb,
  Briefcase,
  Gamepad2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Newspaper,
  Wrench,
  Lightbulb,
  Briefcase,
  Gamepad2,
};

export function PillarsShowcase() {
  const pillars = Object.entries(PILLARS) as [PillarKey, (typeof PILLARS)[PillarKey]][];

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-brand-white sm:text-4xl">
              5 теми, безкрайно знание
            </h2>
            <p className="mt-4 text-brand-gray text-lg">
              Открий света на AI през нашите съдържателни стълбове
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {pillars.map(([key, pillar], index) => {
            const Icon = ICONS[pillar.icon];
            return (
              <ScrollReveal key={key} delay={index * 0.1}>
                <Card className="group text-center h-full">
                  <div
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${pillar.color}15` }}
                  >
                    <Icon
                      className="h-7 w-7"
                      style={{ color: pillar.color }}
                    />
                  </div>
                  <h3
                    className="font-heading text-lg font-semibold"
                    style={{ color: pillar.color }}
                  >
                    {pillar.label}
                  </h3>
                  <p className="mt-2 text-sm text-brand-gray">
                    {pillar.description}
                  </p>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
