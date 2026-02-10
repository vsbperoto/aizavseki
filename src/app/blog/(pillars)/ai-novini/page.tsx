import type { Metadata } from "next";
import { PillarPage } from "@/components/blog/PillarPage";

export const metadata: Metadata = {
  title: "AI Новини — Последни новини за изкуствения интелект",
  description: "Какво се случва в света на AI? Последни новини, открития и тенденции в изкуствения интелект на български.",
  alternates: { canonical: "https://aizavseki.eu/blog/ai-novini" },
};

export const revalidate = 3600;

export default function AiNoviniPage() {
  return <PillarPage pillarKey="AI_NEWS" />;
}
