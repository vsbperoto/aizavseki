import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { GlowText } from "@/components/ui/GlowText";

export function MissionSection() {
  return (
    <section className="relative py-24 sm:py-32">
      {/* Ambient blob */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[400px] w-[400px] rounded-full bg-brand-cyan/5 blur-[120px] animate-pulse" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <ScrollReveal>
          <h2 className="font-heading text-3xl font-bold text-brand-white sm:text-4xl">
            {"\u041A\u0430\u043A\u0432\u043E \u0435 AiZaVseki?"}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p className="mt-6 text-lg leading-relaxed text-brand-gray sm:text-xl">
            {"\u041D\u0438\u0435 \u0432\u044F\u0440\u0432\u0430\u043C\u0435, \u0447\u0435 AI \u043D\u0435 \u0435 \u0441\u0430\u043C\u043E \u0437\u0430 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u0438\u0441\u0442\u0438."}{" "}
            <br className="hidden sm:block" />
            {"AI \u0435 \u0437\u0430 "}{" "}
            <GlowText className="font-bold text-2xl sm:text-3xl">
              {"\u0412\u0421\u0415\u041A\u0418"}
            </GlowText>
            .
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <p className="mt-4 text-base text-brand-gray sm:text-lg">
            {"\u0412\u0441\u0435\u043A\u0438 \u0434\u0435\u043D \u0442\u0438 \u0434\u043E\u043D\u0430\u0441\u044F\u043C\u0435 \u043F\u043E\u043B\u0435\u0437\u043D\u0430 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u0437\u0430 \u0438\u0437\u043A\u0443\u0441\u0442\u0432\u0435\u043D\u0438\u044F \u0438\u043D\u0442\u0435\u043B\u0435\u043A\u0442 \u2014 \u043D\u043E\u0432\u0438\u043D\u0438, \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u0438, \u0441\u044A\u0432\u0435\u0442\u0438 \u0438 \u0437\u0430\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u2014 \u043D\u0430 \u0440\u0430\u0437\u0431\u0438\u0440\u0430\u0435\u043C \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438 \u0435\u0437\u0438\u043A."}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
