import type { Metadata } from "next";
import { PillarPage } from "@/components/blog/PillarPage";

export const metadata: Metadata = {
  title: "AI \u0437\u0430 \u0411\u0438\u0437\u043D\u0435\u0441 \u2014 AI \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u0437\u0430 \u0442\u0432\u043E\u044F \u0431\u0438\u0437\u043D\u0435\u0441",
  description: "\u041A\u0430\u043A AI \u043C\u043E\u0436\u0435 \u0434\u0430 \u043F\u043E\u0434\u043E\u0431\u0440\u0438 \u0442\u0432\u043E\u044F \u0431\u0438\u0437\u043D\u0435\u0441? \u0421\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u0438, \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u0438 \u0438 \u043F\u0440\u0438\u043C\u0435\u0440\u0438 \u0437\u0430 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0432\u043D\u0435\u0434\u0440\u044F\u0432\u0430\u043D\u0435 \u043D\u0430 AI.",
  alternates: { canonical: "https://aizavseki.eu/blog/ai-za-biznes" },
};

export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AiZaBiznesPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);
  return <PillarPage pillarKey="AI_BUSINESS" currentPage={currentPage} />;
}
