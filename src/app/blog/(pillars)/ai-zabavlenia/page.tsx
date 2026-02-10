import type { Metadata } from "next";
import { PillarPage } from "@/components/blog/PillarPage";

export const metadata: Metadata = {
  title: "AI \u0417\u0430\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u2014 \u0417\u0430\u0431\u0430\u0432\u043D\u0430\u0442\u0430 \u0441\u0442\u0440\u0430\u043D\u0430 \u043D\u0430 AI",
  description: "AI \u043D\u0435 \u0435 \u0441\u0430\u043C\u043E \u0437\u0430 \u0440\u0430\u0431\u043E\u0442\u0430! \u0417\u0430\u0431\u0430\u0432\u043D\u0438 AI \u0435\u043A\u0441\u043F\u0435\u0440\u0438\u043C\u0435\u043D\u0442\u0438, \u0433\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440\u0438 \u0438 \u0438\u043D\u0442\u0435\u0440\u0435\u0441\u043D\u0438 \u043F\u0440\u043E\u0435\u043A\u0442\u0438 \u043D\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438.",
  alternates: { canonical: "https://aizavseki.eu/blog/ai-zabavlenia" },
};

export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AiZabavleniaPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);
  return <PillarPage pillarKey="AI_FUN" currentPage={currentPage} />;
}
