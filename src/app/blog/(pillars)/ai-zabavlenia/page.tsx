import type { Metadata } from "next";
import { PillarPage } from "@/components/blog/PillarPage";

export const metadata: Metadata = {
  title: "AI Забавления — Забавната страна на AI",
  description: "AI не е само за работа! Забавни AI експерименти, генератори и интересни проекти на български.",
  alternates: { canonical: "https://aizavseki.eu/blog/ai-zabavlenia" },
};

export const revalidate = 3600;

export default function AiZabavleniaPage() {
  return <PillarPage pillarKey="AI_FUN" />;
}
