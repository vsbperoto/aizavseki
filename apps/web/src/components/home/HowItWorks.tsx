"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { HOW_IT_WORKS } from "@/lib/constants";
import { Search, Sparkles, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Search,
  Sparkles,
  GraduationCap,
};

export function HowItWorks() {
  return (
    <section className="relative py-24 sm:py-32">
      {/* Ambient blob */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[300px] w-[500px] rounded-full bg-brand-cyan/3 blur-[120px] animate-pulse" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-brand-white sm:text-4xl">
              {"\u041A\u0430\u043A \u0440\u0430\u0431\u043E\u0442\u0438?"}
            </h2>
            <p className="mt-4 text-brand-gray text-lg">
              {"\u041E\u0442 \u0438\u0434\u0435\u044F \u0434\u043E \u0437\u043D\u0430\u043D\u0438\u0435 \u2014 \u0432 3 \u0441\u0442\u044A\u043F\u043A\u0438"}
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {HOW_IT_WORKS.map((step, index) => {
            const Icon = ICONS[step.icon];
            return (
              <ScrollReveal key={step.step} delay={index * 0.15}>
                <div className="group relative text-center">
                  {/* Connector line (desktop) */}
                  {index < HOW_IT_WORKS.length - 1 && (
                    <div className="absolute right-0 top-10 hidden h-[2px] w-full translate-x-1/2 md:block">
                      <div className="h-full w-full border-t-2 border-dashed border-brand-cyan/20" />
                    </div>
                  )}

                  <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-cyan/10 ring-1 ring-brand-cyan/20 transition-shadow group-hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]">
                    <Icon className="h-9 w-9 text-brand-cyan" />
                    <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-cyan text-sm font-bold text-brand-dark transition-shadow group-hover:shadow-[0_0_15px_rgba(0,212,255,0.4)]">
                      {step.step}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-semibold text-brand-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm text-brand-gray leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
