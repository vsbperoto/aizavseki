"use client";

import { CountUp } from "@/components/ui/CountUp";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { STATS } from "@/lib/constants";

export function StatsCounter() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="font-display text-4xl font-bold text-brand-cyan sm:text-5xl">
                    <CountUp
                      end={stat.value}
                      suffix={stat.suffix}
                      duration={2000}
                    />
                  </div>
                  <p className="mt-2 text-sm text-brand-gray sm:text-base">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
