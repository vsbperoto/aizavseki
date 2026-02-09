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
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-brand-white sm:text-4xl">
              Как работи?
            </h2>
            <p className="mt-4 text-brand-gray text-lg">
              От идея до знание — в 3 стъпки
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {HOW_IT_WORKS.map((step, index) => {
            const Icon = ICONS[step.icon];
            return (
              <ScrollReveal key={step.step} delay={index * 0.15}>
                <div className="relative text-center">
                  {/* Connector line (desktop) */}
                  {index < HOW_IT_WORKS.length - 1 && (
                    <div className="absolute right-0 top-10 hidden h-[2px] w-full translate-x-1/2 md:block">
                      <div className="h-full w-full border-t-2 border-dashed border-brand-cyan/20" />
                    </div>
                  )}

                  <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-cyan/10 ring-1 ring-brand-cyan/20">
                    <Icon className="h-9 w-9 text-brand-cyan" />
                    <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-cyan text-sm font-bold text-brand-dark">
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
