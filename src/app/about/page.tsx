import type { Metadata } from "next";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { GlowText } from "@/components/ui/GlowText";
import { Sparkles, Zap, Heart, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "\u0417\u0430 \u043D\u0430\u0441",
  description: "AiZaVseki \u2014 \u043C\u0438\u0441\u0438\u044F\u0442\u0430 \u043D\u0438 \u0435 \u0434\u0430 \u043D\u0430\u043F\u0440\u0430\u0432\u0438\u043C \u0438\u0437\u043A\u0443\u0441\u0442\u0432\u0435\u043D\u0438\u044F \u0438\u043D\u0442\u0435\u043B\u0435\u043A\u0442 \u0434\u043E\u0441\u0442\u044A\u043F\u0435\u043D \u0437\u0430 \u0432\u0441\u0435\u043A\u0438 \u0431\u044A\u043B\u0433\u0430\u0440\u0438\u043D.",
  alternates: { canonical: "https://aizavseki.eu/about" },
};

const values = [
  {
    icon: Sparkles,
    title: "\u0418\u043D\u043E\u0432\u0430\u0446\u0438\u044F",
    description: "\u0418\u0437\u043F\u043E\u043B\u0437\u0432\u0430\u043C\u0435 \u043D\u0430\u0439-\u043D\u043E\u0432\u0438\u0442\u0435 AI \u0442\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0438\u0438, \u0437\u0430 \u0434\u0430 \u0441\u044A\u0437\u0434\u0430\u0432\u0430\u043C\u0435 \u043F\u043E\u043B\u0435\u0437\u043D\u043E \u0441\u044A\u0434\u044A\u0440\u0436\u0430\u043D\u0438\u0435 \u0432\u0441\u0435\u043A\u0438 \u0434\u0435\u043D.",
    color: "brand-cyan",
  },
  {
    icon: Heart,
    title: "\u0414\u043E\u0441\u0442\u044A\u043F\u043D\u043E\u0441\u0442",
    description: "AI \u043D\u0435 \u0435 \u0441\u0430\u043C\u043E \u0437\u0430 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u0438\u0441\u0442\u0438. \u041E\u0431\u044F\u0441\u043D\u044F\u0432\u0430\u043C\u0435 \u0441\u043B\u043E\u0436\u043D\u0438 \u0442\u0435\u043C\u0438 \u043D\u0430 \u0440\u0430\u0437\u0431\u0438\u0440\u0430\u0435\u043C \u0435\u0437\u0438\u043A.",
    color: "accent-pink",
  },
  {
    icon: Zap,
    title: "\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0437\u0430\u0446\u0438\u044F",
    description: "\u041D\u0430\u0448\u0430\u0442\u0430 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430 \u0435 100% \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0437\u0438\u0440\u0430\u043D\u0430 \u2014 \u043E\u0442 \u0438\u0437\u0441\u043B\u0435\u0434\u0432\u0430\u043D\u0435 \u0434\u043E \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u044F.",
    color: "accent-yellow",
  },
  {
    icon: Globe,
    title: "\u0411\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u043E",
    description: "\u0421\u044A\u0434\u044A\u0440\u0436\u0430\u043D\u0438\u0435 \u043D\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438, \u0430\u0434\u0430\u043F\u0442\u0438\u0440\u0430\u043D\u043E \u0437\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0430\u0442\u0430 \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u044F.",
    color: "accent-green",
  },
];

const processSteps = [
  "\u0421\u043A\u0430\u043D\u0438\u0440\u0430 \u0433\u043B\u043E\u0431\u0430\u043B\u043D\u0438 AI \u043D\u043E\u0432\u0438\u043D\u0438 \u0438 \u0442\u0435\u043D\u0434\u0435\u043D\u0446\u0438\u0438",
  "\u0410\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0430 \u0438 \u0438\u0437\u0431\u0438\u0440\u0430 \u043D\u0430\u0439-\u0432\u0430\u0436\u043D\u0438\u0442\u0435 \u0442\u0435\u043C\u0438 \u0437\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0430\u0442\u0430 \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u044F",
  "\u0413\u0435\u043D\u0435\u0440\u0438\u0440\u0430 \u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u043D\u043E \u0441\u044A\u0434\u044A\u0440\u0436\u0430\u043D\u0438\u0435 \u043D\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438",
  "\u0421\u044A\u0437\u0434\u0430\u0432\u0430 \u0432\u0438\u0437\u0443\u0430\u043B\u043D\u0438 \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u0438 \u0438 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F",
  "\u041F\u0443\u0431\u043B\u0438\u043A\u0443\u0432\u0430 \u0432 Instagram, Facebook \u0438 \u043D\u0430 \u0443\u0435\u0431\u0441\u0430\u0439\u0442\u0430",
];

export default function AboutPage() {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "\u0417\u0430 AiZaVseki",
    description: "AiZaVseki \u2014 \u043C\u0438\u0441\u0438\u044F\u0442\u0430 \u043D\u0438 \u0435 \u0434\u0430 \u043D\u0430\u043F\u0440\u0430\u0432\u0438\u043C \u0438\u0437\u043A\u0443\u0441\u0442\u0432\u0435\u043D\u0438\u044F \u0438\u043D\u0442\u0435\u043B\u0435\u043A\u0442 \u0434\u043E\u0441\u0442\u044A\u043F\u0435\u043D \u0437\u0430 \u0432\u0441\u0435\u043A\u0438 \u0431\u044A\u043B\u0433\u0430\u0440\u0438\u043D.",
    url: "https://aizavseki.eu/about",
    inLanguage: "bg",
    mainEntity: {
      "@type": "Organization",
      name: "AiZaVseki",
      url: "https://aizavseki.eu",
      description: "\u0411\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0430 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430 \u0437\u0430 AI \u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u0435",
    },
  };

  return (
    <div className="relative pt-24 pb-16 sm:pt-32">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/4 left-1/3 h-[500px] w-[500px] rounded-full bg-brand-cyan/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-accent-purple/5 blur-[100px] animate-pulse [animation-delay:1s]" />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Hero heading */}
        <ScrollReveal>
          <div className="glass rounded-2xl p-8 sm:p-12 text-center mb-12">
            <h1 className="font-display text-4xl font-bold sm:text-5xl">
              {"\u0417\u0430 "}<GlowText>AiZaVseki</GlowText>
            </h1>
            <p className="mt-4 text-brand-gray text-lg max-w-2xl mx-auto">
              {"\u041C\u0438\u0441\u0438\u044F\u0442\u0430 \u043D\u0438 \u0435 \u0434\u0430 \u043D\u0430\u043F\u0440\u0430\u0432\u0438\u043C \u0438\u0437\u043A\u0443\u0441\u0442\u0432\u0435\u043D\u0438\u044F \u0438\u043D\u0442\u0435\u043B\u0435\u043A\u0442 \u0434\u043E\u0441\u0442\u044A\u043F\u0435\u043D \u0437\u0430 \u0432\u0441\u0435\u043A\u0438 \u0431\u044A\u043B\u0433\u0430\u0440\u0438\u043D."}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="space-y-6 text-lg text-brand-gray leading-relaxed">
            <p>
              <strong className="text-brand-white">AiZaVseki</strong> {"(\u0410\u0418 \u0417\u0430 \u0412\u0441\u0435\u043A\u0438) \u0435 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0430 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430 \u0437\u0430 AI \u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u0435, \u0441\u044A\u0437\u0434\u0430\u0434\u0435\u043D\u0430 \u0441 \u043C\u0438\u0441\u0438\u044F\u0442\u0430 \u0434\u0430 \u043D\u0430\u043F\u0440\u0430\u0432\u0438 \u0438\u0437\u043A\u0443\u0441\u0442\u0432\u0435\u043D\u0438\u044F \u0438\u043D\u0442\u0435\u043B\u0435\u043A\u0442 \u0434\u043E\u0441\u0442\u044A\u043F\u0435\u043D \u0437\u0430 \u043E\u0431\u0438\u043A\u043D\u043E\u0432\u0435\u043D\u0438\u0442\u0435 \u0445\u043E\u0440\u0430."}
            </p>
            <p>
              {"\u041D\u0438\u0435 \u0432\u044F\u0440\u0432\u0430\u043C\u0435, \u0447\u0435 \u0432\u0441\u0435\u043A\u0438 \u043C\u043E\u0436\u0435 \u0434\u0430 \u0441\u0435 \u0432\u044A\u0437\u043F\u043E\u043B\u0437\u0432\u0430 \u043E\u0442 AI \u2014 \u043D\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E \u0434\u0430\u043B\u0438 \u0441\u0438 \u0441\u0442\u0443\u0434\u0435\u043D\u0442, \u043F\u0440\u0435\u0434\u043F\u0440\u0438\u0435\u043C\u0430\u0447, \u043F\u0435\u043D\u0441\u0438\u043E\u043D\u0435\u0440 \u0438\u043B\u0438 \u043F\u0440\u043E\u0441\u0442\u043E \u043B\u044E\u0431\u043E\u043F\u0438\u0442\u0435\u043D. \u041D\u0430\u0448\u0435\u0442\u043E \u0441\u044A\u0434\u044A\u0440\u0436\u0430\u043D\u0438\u0435 \u0435 \u043D\u0430\u043F\u0438\u0441\u0430\u043D\u043E \u043D\u0430 "}<span className="text-brand-cyan">{"\u0440\u0430\u0437\u0431\u0438\u0440\u0430\u0435\u043C \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438 \u0435\u0437\u0438\u043A"}</span>{", \u0431\u0435\u0437 \u0438\u0437\u043B\u0438\u0448\u0435\u043D \u0436\u0430\u0440\u0433\u043E\u043D \u0438 \u0442\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u0438 \u0441\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u0438."}
            </p>
            <p>
              {"\u0412\u0441\u0435\u043A\u0438 \u0434\u0435\u043D \u043D\u0430\u0448\u0430\u0442\u0430 \u043D\u0430\u043F\u044A\u043B\u043D\u043E \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0437\u0438\u0440\u0430\u043D\u0430 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430 \u0438\u0437\u0441\u043B\u0435\u0434\u0432\u0430 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0442\u0435 \u043D\u043E\u0432\u0438\u043D\u0438 \u0438 \u0442\u0435\u043D\u0434\u0435\u043D\u0446\u0438\u0438 \u0432 AI, \u0441\u044A\u0437\u0434\u0430\u0432\u0430 \u043F\u043E\u043B\u0435\u0437\u043D\u043E \u0438 \u0438\u043D\u0442\u0435\u0440\u0435\u0441\u043D\u043E \u0441\u044A\u0434\u044A\u0440\u0436\u0430\u043D\u0438\u0435, \u0438 \u0433\u043E \u043F\u0443\u0431\u043B\u0438\u043A\u0443\u0432\u0430 \u0432 \u0441\u043E\u0446\u0438\u0430\u043B\u043D\u0438\u0442\u0435 \u043C\u0440\u0435\u0436\u0438 \u0438 \u043D\u0430 \u043D\u0430\u0448\u0438\u044F \u0443\u0435\u0431\u0441\u0430\u0439\u0442."}
            </p>
          </div>
        </ScrollReveal>

        {/* Values */}
        <div className="mt-16">
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold text-brand-white sm:text-3xl">
              {"\u041D\u0430\u0448\u0438\u0442\u0435 \u0446\u0435\u043D\u043D\u043E\u0441\u0442\u0438"}
            </h2>
          </ScrollReveal>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {values.map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 0.1}>
                <div className="group relative h-full">
                  {/* Hover glow */}
                  <div className="pointer-events-none absolute -inset-px rounded-2xl bg-brand-cyan/0 blur-[40px] transition-all duration-500 opacity-0 group-hover:opacity-15 group-hover:bg-brand-cyan/10" />
                  {/* Gradient top border */}
                  <div className="relative h-full rounded-2xl bg-brand-navy/40 border border-brand-cyan/10 p-6 transition-all duration-300 group-hover:border-brand-cyan/20 overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/40 to-transparent" />
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-cyan/10 ring-1 ring-brand-cyan/20">
                      <value.icon className="h-6 w-6 text-brand-cyan" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-brand-white">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm text-brand-gray">
                      {value.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* How content is made */}
        <div className="mt-16">
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold text-brand-white sm:text-3xl">
              {"\u041A\u0430\u043A \u0441\u0435 \u0441\u044A\u0437\u0434\u0430\u0432\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430\u043D\u0438\u0435\u0442\u043E?"}
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="mt-6 glass rounded-2xl p-6 sm:p-8">
              <p className="text-brand-gray leading-relaxed mb-6">
                AiZaVseki {"\u0438\u0437\u043F\u043E\u043B\u0437\u0432\u0430 \u0443\u0441\u044A\u0432\u044A\u0440\u0448\u0435\u043D\u0441\u0442\u0432\u0430\u043D\u0430 AI \u0441\u0438\u0441\u0442\u0435\u043C\u0430, \u043A\u043E\u044F\u0442\u043E \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E:"}
              </p>
              <div className="space-y-4">
                {processSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-cyan/10 ring-1 ring-brand-cyan/20 text-sm font-bold text-brand-cyan">
                      {i + 1}
                    </div>
                    {i < processSteps.length - 1 ? (
                      <div className="flex-1 border-l-2 border-dashed border-brand-cyan/10 pb-4 pl-4">
                        <p className="text-brand-gray">{step}</p>
                      </div>
                    ) : (
                      <div className="flex-1 pl-4">
                        <p className="text-brand-gray">{step}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-6 text-brand-gray leading-relaxed">
                {"\u0426\u0435\u043B\u0438\u044F\u0442 \u043F\u0440\u043E\u0446\u0435\u0441 \u0435 \u043D\u0430\u043F\u044A\u043B\u043D\u043E \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0437\u0438\u0440\u0430\u043D \u2014 \u043E\u0442 \u0438\u0437\u0441\u043B\u0435\u0434\u0432\u0430\u043D\u0435 \u0434\u043E \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u044F. \u0422\u043E\u0432\u0430 \u043D\u0438 \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0432\u0430 \u0434\u0430 \u0434\u043E\u0441\u0442\u0430\u0432\u044F\u043C\u0435 \u0441\u0432\u0435\u0436\u043E, \u0430\u043A\u0442\u0443\u0430\u043B\u043D\u043E \u0441\u044A\u0434\u044A\u0440\u0436\u0430\u043D\u0438\u0435 \u0432\u0441\u0435\u043A\u0438 \u0434\u0435\u043D."}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
