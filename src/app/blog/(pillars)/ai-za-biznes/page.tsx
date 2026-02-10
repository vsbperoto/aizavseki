import type { Metadata } from "next";
import { PillarPage } from "@/components/blog/PillarPage";

export const metadata: Metadata = {
  title: "AI за Бизнес — AI решения за твоя бизнес",
  description: "Как AI може да подобри твоя бизнес? Стратегии, инструменти и примери за успешно внедряване на AI.",
  alternates: { canonical: "https://aizavseki.eu/blog/ai-za-biznes" },
};

export const revalidate = 3600;

export default function AiZaBiznesPage() {
  return <PillarPage pillarKey="AI_BUSINESS" />;
}
