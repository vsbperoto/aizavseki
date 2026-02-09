import type { Metadata } from "next";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Бюлетин",
  description: "Абонирай се за седмичния AI бюлетин на AiZaVseki и получавай най-важното от света на изкуствения интелект.",
};

const benefits = [
  "Седмичен обзор на най-важните AI новини",
  "Нови AI инструменти и как да ги използваш",
  "Практични съвети за AI в ежедневието",
  "Ексклузивно съдържание само за абонати",
  "Безплатно — можеш да се отпишеш по всяко време",
];

export default function NewsletterPage() {
  return (
    <div className="pt-24 pb-16 sm:pt-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold text-brand-white sm:text-5xl">
              AI Бюлетин
            </h1>
            <p className="mt-4 text-brand-gray text-lg max-w-2xl mx-auto">
              Получавай най-важното от света на AI директно в пощата си — всяка
              седмица, на български.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mt-12 mx-auto max-w-md">
            <h2 className="font-heading text-xl font-semibold text-brand-white mb-4">
              Какво получаваш:
            </h2>
            <ul className="space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0 mt-0.5" />
                  <span className="text-brand-gray">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        <div className="mt-12">
          <NewsletterCTA />
        </div>
      </div>
    </div>
  );
}
