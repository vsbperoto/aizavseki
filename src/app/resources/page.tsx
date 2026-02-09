import type { Metadata } from "next";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Card } from "@/components/ui/Card";
import {
  MessageSquare,
  Image,
  FileText,
  Code,
  Music,
  Video,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Ресурси",
  description: "Полезни AI инструменти и ресурси за всеки. Открий най-добрите AI приложения за работа и ежедневие.",
};

const tools = [
  {
    name: "ChatGPT",
    category: "Чатбот",
    description: "AI асистент за разговори, писане и решаване на задачи. Идеален за начинаещи.",
    icon: MessageSquare,
    color: "#10b981",
  },
  {
    name: "Midjourney",
    category: "Изображения",
    description: "Създавай впечатляващи изображения с помощта на AI. Просто опиши какво искаш.",
    icon: Image,
    color: "#7c3aed",
  },
  {
    name: "Claude",
    category: "Чатбот",
    description: "Мощен AI асистент за анализ, писане и програмиране. Отличен за дълги документи.",
    icon: MessageSquare,
    color: "#00d4ff",
  },
  {
    name: "Canva AI",
    category: "Дизайн",
    description: "AI функции за бърз дизайн на постове, презентации и визуални материали.",
    icon: FileText,
    color: "#ec4899",
  },
  {
    name: "GitHub Copilot",
    category: "Програмиране",
    description: "AI помощник за програмисти. Пише код и предлага решения автоматично.",
    icon: Code,
    color: "#f59e0b",
  },
  {
    name: "Suno AI",
    category: "Музика",
    description: "Създавай музика с AI. Опиши стила и настроението — AI ще направи останалото.",
    icon: Music,
    color: "#ef4444",
  },
  {
    name: "Runway",
    category: "Видео",
    description: "AI инструменти за редактиране и създаване на видео. Генерирай видео от текст.",
    icon: Video,
    color: "#8b5cf6",
  },
  {
    name: "Perplexity",
    category: "Търсене",
    description: "AI търсачка, която дава точни отговори с източници. Заместник на Google.",
    icon: MessageSquare,
    color: "#06b6d4",
  },
];

export default function ResourcesPage() {
  return (
    <div className="pt-24 pb-16 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h1 className="font-display text-4xl font-bold text-brand-white sm:text-5xl">
            AI Ресурси
          </h1>
          <p className="mt-4 text-brand-gray text-lg max-w-2xl">
            Полезни AI инструменти, които можеш да започнеш да използваш
            веднага. Подбрани и описани на български.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool, i) => (
            <ScrollReveal key={tool.name} delay={i * 0.05}>
              <Card className="h-full">
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${tool.color}15` }}
                >
                  <tool.icon
                    className="h-6 w-6"
                    style={{ color: tool.color }}
                  />
                </div>
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: tool.color }}
                >
                  {tool.category}
                </span>
                <h3 className="mt-1 font-heading text-lg font-semibold text-brand-white">
                  {tool.name}
                </h3>
                <p className="mt-2 text-sm text-brand-gray leading-relaxed">
                  {tool.description}
                </p>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
