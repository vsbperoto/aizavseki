import type { Metadata } from "next";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CheckCircle, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "\u0411\u044E\u043B\u0435\u0442\u0438\u043D",
  description: "\u0410\u0431\u043E\u043D\u0438\u0440\u0430\u0439 \u0441\u0435 \u0437\u0430 \u0441\u0435\u0434\u043C\u0438\u0447\u043D\u0438\u044F AI \u0431\u044E\u043B\u0435\u0442\u0438\u043D \u043D\u0430 AiZaVseki \u0438 \u043F\u043E\u043B\u0443\u0447\u0430\u0432\u0430\u0439 \u043D\u0430\u0439-\u0432\u0430\u0436\u043D\u043E\u0442\u043E \u043E\u0442 \u0441\u0432\u0435\u0442\u0430 \u043D\u0430 \u0438\u0437\u043A\u0443\u0441\u0442\u0432\u0435\u043D\u0438\u044F \u0438\u043D\u0442\u0435\u043B\u0435\u043A\u0442.",
  alternates: { canonical: "https://aizavseki.eu/newsletter" },
};

const benefits = [
  "\u0421\u0435\u0434\u043C\u0438\u0447\u0435\u043D \u043E\u0431\u0437\u043E\u0440 \u043D\u0430 \u043D\u0430\u0439-\u0432\u0430\u0436\u043D\u0438\u0442\u0435 AI \u043D\u043E\u0432\u0438\u043D\u0438",
  "\u041D\u043E\u0432\u0438 AI \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u0438 \u0438 \u043A\u0430\u043A \u0434\u0430 \u0433\u0438 \u0438\u0437\u043F\u043E\u043B\u0437\u0432\u0430\u0448",
  "\u041F\u0440\u0430\u043A\u0442\u0438\u0447\u043D\u0438 \u0441\u044A\u0432\u0435\u0442\u0438 \u0437\u0430 AI \u0432 \u0435\u0436\u0435\u0434\u043D\u0435\u0432\u0438\u0435\u0442\u043E",
  "\u0415\u043A\u0441\u043A\u043B\u0443\u0437\u0438\u0432\u043D\u043E \u0441\u044A\u0434\u044A\u0440\u0436\u0430\u043D\u0438\u0435 \u0441\u0430\u043C\u043E \u0437\u0430 \u0430\u0431\u043E\u043D\u0430\u0442\u0438",
  "\u0411\u0435\u0437\u043F\u043B\u0430\u0442\u043D\u043E \u2014 \u043C\u043E\u0436\u0435\u0448 \u0434\u0430 \u0441\u0435 \u043E\u0442\u043F\u0438\u0448\u0435\u0448 \u043F\u043E \u0432\u0441\u044F\u043A\u043E \u0432\u0440\u0435\u043C\u0435",
];

export default function NewsletterPage() {
  return (
    <div className="relative pt-24 pb-16 sm:pt-32">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/4 left-1/3 h-[500px] w-[500px] rounded-full bg-brand-cyan/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-accent-purple/5 blur-[100px] animate-pulse [animation-delay:1s]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent-green/10 border border-accent-green/20 px-4 py-1.5 mb-6">
              <Sparkles className="h-4 w-4 text-accent-green" />
              <span className="text-sm font-medium text-accent-green">{"\u0411\u0435\u0437\u043F\u043B\u0430\u0442\u043D\u043E"}</span>
            </div>
            <h1 className="font-display text-4xl font-bold sm:text-5xl">
              <span className="gradient-text">AI {"\u0411\u044E\u043B\u0435\u0442\u0438\u043D"}</span>
            </h1>
            <p className="mt-4 text-brand-gray text-lg max-w-2xl mx-auto">
              {"\u041F\u043E\u043B\u0443\u0447\u0430\u0432\u0430\u0439 \u043D\u0430\u0439-\u0432\u0430\u0436\u043D\u043E\u0442\u043E \u043E\u0442 \u0441\u0432\u0435\u0442\u0430 \u043D\u0430 AI \u0434\u0438\u0440\u0435\u043A\u0442\u043D\u043E \u0432 \u043F\u043E\u0449\u0430\u0442\u0430 \u0441\u0438 \u2014 \u0432\u0441\u044F\u043A\u0430 \u0441\u0435\u0434\u043C\u0438\u0446\u0430, \u043D\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438."}
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 mx-auto max-w-lg">
          <ScrollReveal delay={0.1}>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <h2 className="font-heading text-xl font-semibold text-brand-white mb-6">
                {"\u041A\u0430\u043A\u0432\u043E \u043F\u043E\u043B\u0443\u0447\u0430\u0432\u0430\u0448:"}
              </h2>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0 mt-0.5" />
                    <span className="text-brand-gray">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>

        <div className="mt-12">
          <NewsletterCTA />
        </div>
      </div>
    </div>
  );
}
