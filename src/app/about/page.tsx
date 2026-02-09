import type { Metadata } from "next";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { GlowText } from "@/components/ui/GlowText";
import { Sparkles, Zap, Heart, Globe } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "За нас",
  description: "AiZaVseki — мисията ни е да направим изкуствения интелект достъпен за всеки българин.",
  alternates: { canonical: "https://aizavseki.eu/about" },
};

const values = [
  {
    icon: Sparkles,
    title: "Иновация",
    description: "Използваме най-новите AI технологии, за да създаваме полезно съдържание всеки ден.",
  },
  {
    icon: Heart,
    title: "Достъпност",
    description: "AI не е само за програмисти. Обясняваме сложни теми на разбираем език.",
  },
  {
    icon: Zap,
    title: "Автоматизация",
    description: "Нашата платформа е 100% автоматизирана — от изследване до публикация.",
  },
  {
    icon: Globe,
    title: "Българско",
    description: "Съдържание на български, адаптирано за българската аудитория.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16 sm:pt-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h1 className="font-display text-4xl font-bold text-brand-white sm:text-5xl">
            За <GlowText>AiZaVseki</GlowText>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mt-8 space-y-6 text-lg text-brand-gray leading-relaxed">
            <p>
              <strong className="text-brand-white">AiZaVseki</strong> (АИ За Всеки) е
              българска платформа за AI образование, създадена с мисията да
              направи изкуствения интелект достъпен за обикновените хора.
            </p>
            <p>
              Ние вярваме, че всеки може да се възползва от AI — независимо дали
              си студент, предприемач, пенсионер или просто любопитен. Нашето
              съдържание е написано на{" "}
              <span className="text-brand-cyan">разбираем български език</span>,
              без излишен жаргон и технически сложности.
            </p>
            <p>
              Всеки ден нашата напълно автоматизирана платформа изследва
              последните новини и тенденции в AI, създава полезно и интересно
              съдържание, и го публикува в социалните мрежи и на нашия уебсайт.
            </p>
          </div>
        </ScrollReveal>

        {/* Values */}
        <div className="mt-16">
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold text-brand-white sm:text-3xl">
              Нашите ценности
            </h2>
          </ScrollReveal>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {values.map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 0.1}>
                <Card className="h-full">
                  <value.icon className="h-8 w-8 text-brand-cyan mb-4" />
                  <h3 className="font-heading text-lg font-semibold text-brand-white">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm text-brand-gray">
                    {value.description}
                  </p>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* How content is made */}
        <div className="mt-16">
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold text-brand-white sm:text-3xl">
              Как се създава съдържанието?
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="mt-6 space-y-4 text-brand-gray leading-relaxed">
              <p>
                AiZaVseki използва усъвършенствана AI система, която автоматично:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Сканира глобални AI новини и тенденции</li>
                <li>Анализира и избира най-важните теми за българската аудитория</li>
                <li>Генерира образователно съдържание на български</li>
                <li>Създава визуални материали и изображения</li>
                <li>Публикува в Instagram, Facebook и на уебсайта</li>
              </ul>
              <p>
                Целият процес е напълно автоматизиран — от изследване до
                публикация. Това ни позволява да доставяме свежо, актуално
                съдържание всеки ден.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
