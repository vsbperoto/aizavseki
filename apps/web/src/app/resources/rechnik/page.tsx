import type { Metadata } from "next";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Речник — Речник на AI термини на български",
  description: "Пълен речник на термините от света на изкуствения интелект, обяснени просто и ясно на български език.",
  alternates: { canonical: "https://aizavseki.eu/resources/rechnik" },
};

interface GlossaryTerm {
  term: string;
  termEn: string;
  slug: string;
  definition: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "Изкуствен интелект",
    termEn: "Artificial Intelligence (AI)",
    slug: "izkustven-intelekt",
    definition: "Технология, която позволява на компютрите да изпълняват задачи, изискващи човешко мислене — разпознаване на образи, разбиране на реч, вземане на решения и превод на езици.",
  },
  {
    term: "Машинно обучение",
    termEn: "Machine Learning (ML)",
    slug: "mashinno-obuchenie",
    definition: "Подход в AI, при който програмите се учат от данни, вместо да бъдат програмирани с точни правила. Колкото повече данни виждат, толкова по-добри стават.",
  },
  {
    term: "Невронна мрежа",
    termEn: "Neural Network",
    slug: "nevronna-mrezha",
    definition: "Модел, вдъхновен от човешкия мозък, състоящ се от слоеве \u201Eневрони\u201C (математически функции), които обработват информация. Основата на съвременното дълбоко обучение.",
  },
  {
    term: "Дълбоко обучение",
    termEn: "Deep Learning",
    slug: "dalboko-obuchenie",
    definition: "Вид машинно обучение с многослойни невронни мрежи. Използва се за разпознаване на изображения, превод, генериране на текст и много други.",
  },
  {
    term: "Генеративен AI",
    termEn: "Generative AI",
    slug: "generativen-ai",
    definition: "AI системи, които създават ново съдържание — текст, изображения, музика, код или видео. Примери: ChatGPT, Midjourney, DALL-E.",
  },
  {
    term: "Голям езиков модел",
    termEn: "Large Language Model (LLM)",
    slug: "golyam-ezikov-model",
    definition: "Огромна невронна мрежа, обучена на милиарди текстове, която може да разбира и генерира текст на естествен език. GPT-4, Claude и Gemini са примери за LLM.",
  },
  {
    term: "Промпт",
    termEn: "Prompt",
    slug: "prompt",
    definition: "Инструкцията или въпросът, който даваш на AI модел. Качеството на промпта директно влияе на качеството на отговора.",
  },
  {
    term: "Промпт инженерство",
    termEn: "Prompt Engineering",
    slug: "prompt-inzhenerstvo",
    definition: "Изкуството и науката за писане на ефективни промптове, за да получиш най-добрите резултати от AI модели.",
  },
  {
    term: "ChatGPT",
    termEn: "ChatGPT",
    slug: "chatgpt",
    definition: "Чатбот от OpenAI, базиран на GPT модели. Може да отговаря на въпроси, пише текстове, код, помага с анализ и много други задачи.",
  },
  {
    term: "Чатбот",
    termEn: "Chatbot",
    slug: "chatbot",
    definition: "Програма, която комуникира с потребители чрез текст или реч. Съвременните AI чатботове използват LLM за по-естествени разговори.",
  },
  {
    term: "Трансформер",
    termEn: "Transformer",
    slug: "transformer",
    definition: "Архитектура на невронна мрежа, създадена от Google през 2017. Основата на GPT, BERT, Claude и почти всички съвременни езикови модели.",
  },
  {
    term: "Токен",
    termEn: "Token",
    slug: "token",
    definition: "Най-малката единица текст, която AI моделът обработва. Може да е дума, част от дума или символ. Моделите имат лимит на токени за вход и изход.",
  },
  {
    term: "Фина настройка",
    termEn: "Fine-tuning",
    slug: "fina-nastroyka",
    definition: "Процес на допълнително обучение на вече обучен AI модел с нови, специализирани данни, за да се подобри представянето му в конкретна област.",
  },
  {
    term: "Халюцинация",
    termEn: "Hallucination",
    slug: "halyutsinatsiya",
    definition: "Когато AI моделът генерира информация, която звучи убедително, но е фактически невярна. Сериозен проблем при LLM, който изисква проверка на фактите.",
  },
  {
    term: "RAG",
    termEn: "Retrieval-Augmented Generation",
    slug: "rag",
    definition: "Техника, при която AI моделът първо търси релевантна информация в база данни, а после генерира отговор на базата на нея. Намалява халюцинациите.",
  },
  {
    term: "Компютърно зрение",
    termEn: "Computer Vision",
    slug: "komputarno-zrenie",
    definition: "Област на AI, занимаваща се с разбирането на изображения и видео от компютри. Използва се за разпознаване на лица, обекти, текст и медицинска диагностика.",
  },
  {
    term: "Обработка на естествен език",
    termEn: "Natural Language Processing (NLP)",
    slug: "obrabotka-na-estestven-ezik",
    definition: "Област на AI, фокусирана върху взаимодействието между компютри и човешки езици — превод, анализ на настроения, обобщаване на текст и чатботове.",
  },
  {
    term: "API",
    termEn: "Application Programming Interface",
    slug: "api",
    definition: "Начин за свързване на различни програми помежду им. AI компании предоставят API-та, за да може всеки да използва техните модели в своите приложения.",
  },
  {
    term: "Отворен код",
    termEn: "Open Source",
    slug: "otvoren-kod",
    definition: "Софтуер, чийто код е публично достъпен и може да бъде използван, модифициран и споделян свободно. Примери за open source AI: LLaMA, Mistral, Stable Diffusion.",
  },
  {
    term: "AGI",
    termEn: "Artificial General Intelligence",
    slug: "agi",
    definition: "Хипотетичен AI, който може да изпълнява всяка интелектуална задача, която човек може. Все още не съществува, но е цел на много AI изследователи.",
  },
  {
    term: "Мултимодален AI",
    termEn: "Multimodal AI",
    slug: "multimodalen-ai",
    definition: "AI модел, който работи с няколко типа данни едновременно — текст, изображения, аудио, видео. GPT-4o и Gemini са примери за мултимодални модели.",
  },
  {
    term: "AI агент",
    termEn: "AI Agent",
    slug: "ai-agent",
    definition: "AI система, която може самостоятелно да планира, взема решения и изпълнява задачи стъпка по стъпка, без постоянна човешка намеса.",
  },
  {
    term: "Дифузионен модел",
    termEn: "Diffusion Model",
    slug: "difuzionen-model",
    definition: "Тип генеративен AI модел, който създава изображения чрез постепенно премахване на шум. Използва се в Stable Diffusion, DALL-E 3 и Midjourney.",
  },
  {
    term: "Етика на AI",
    termEn: "AI Ethics",
    slug: "etika-na-ai",
    definition: "Област, занимаваща се с моралните и социалните въпроси около AI — предразсъдъци, поверителност, влияние върху работни места, отговорно използване.",
  },
];

export default function RechnikPage() {
  const glossaryJsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "AI Речник на български",
    description: "Пълен речник на AI термини, обяснени просто и ясно на български език",
    url: "https://aizavseki.eu/resources/rechnik",
    inLanguage: "bg",
    hasDefinedTerm: GLOSSARY_TERMS.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      alternateName: t.termEn,
      description: t.definition,
      url: `https://aizavseki.eu/resources/rechnik#${t.slug}`,
    })),
  };

  return (
    <div className="pt-24 pb-16 sm:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(glossaryJsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <Link
            href="/resources"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-brand-gray hover:text-brand-cyan transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Ресурси
          </Link>

          <h1 className="font-display text-4xl font-bold text-brand-white sm:text-5xl">
            AI Речник
          </h1>
          <p className="mt-4 text-brand-gray text-lg">
            {GLOSSARY_TERMS.length} термина от света на изкуствения интелект, обяснени просто и ясно на български
          </p>
        </ScrollReveal>

        <nav className="mt-8 flex flex-wrap gap-2">
          {GLOSSARY_TERMS.map((t) => (
            <a
              key={t.slug}
              href={`#${t.slug}`}
              className="text-sm text-brand-cyan/70 hover:text-brand-cyan transition-colors"
            >
              {t.term}
            </a>
          ))}
        </nav>

        <div className="mt-12 space-y-8">
          {GLOSSARY_TERMS.map((t) => (
            <div
              key={t.slug}
              id={t.slug}
              className="scroll-mt-24 rounded-xl border border-brand-cyan/10 bg-brand-navy/30 p-6"
            >
              <h2 className="font-display text-xl font-bold text-brand-white">
                {t.term}
              </h2>
              <p className="mt-1 text-sm text-brand-cyan/60">{t.termEn}</p>
              <p className="mt-3 text-brand-gray-light leading-relaxed">
                {t.definition}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
