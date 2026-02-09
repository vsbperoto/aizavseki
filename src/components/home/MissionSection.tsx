import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { GlowText } from "@/components/ui/GlowText";

export function MissionSection() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <ScrollReveal>
          <h2 className="font-heading text-3xl font-bold text-brand-white sm:text-4xl">
            Какво е AiZaVseki?
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p className="mt-6 text-lg leading-relaxed text-brand-gray sm:text-xl">
            Ние вярваме, че AI не е само за програмисти.{" "}
            <br className="hidden sm:block" />
            AI е за{" "}
            <GlowText className="font-bold text-2xl sm:text-3xl">
              ВСЕКИ
            </GlowText>
            .
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <p className="mt-4 text-base text-brand-gray sm:text-lg">
            Всеки ден ти донасяме полезна информация за изкуствения интелект —
            новини, инструменти, съвети и забавления — на разбираем български
            език.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
