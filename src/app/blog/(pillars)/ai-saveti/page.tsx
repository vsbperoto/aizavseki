import type { Metadata } from "next";
import { PillarPage } from "@/components/blog/PillarPage";

export const metadata: Metadata = {
  title: "AI Съвети — Практични съвети за AI в ежедневието",
  description: "Научи как да използваш изкуствения интелект по-ефективно. Стъпка по стъпка ръководства и съвети на български.",
  alternates: { canonical: "https://aizavseki.eu/blog/ai-saveti" },
};

export const revalidate = 3600;

export default function AiSavetiPage() {
  return <PillarPage pillarKey="AI_TIPS" />;
}
