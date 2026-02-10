import type { Metadata } from "next";
import { PillarPage } from "@/components/blog/PillarPage";

export const metadata: Metadata = {
  title: "AI Инструменти — Полезни AI инструменти за теб",
  description: "Открий най-добрите AI инструменти за работа, учене и ежедневие. Прегледи и ръководства на български.",
  alternates: { canonical: "https://aizavseki.eu/blog/ai-instrumenti" },
};

export const revalidate = 3600;

export default function AiInstrumentiPage() {
  return <PillarPage pillarKey="AI_TOOLS" />;
}
