import type { Metadata } from "next";
import { PillarPage } from "@/components/blog/PillarPage";

export const metadata: Metadata = {
  title: "AI \u0418\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u0438 \u2014 \u041F\u043E\u043B\u0435\u0437\u043D\u0438 AI \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u0438 \u0437\u0430 \u0442\u0435\u0431",
  description: "\u041E\u0442\u043A\u0440\u0438\u0439 \u043D\u0430\u0439-\u0434\u043E\u0431\u0440\u0438\u0442\u0435 AI \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u0438 \u0437\u0430 \u0440\u0430\u0431\u043E\u0442\u0430, \u0443\u0447\u0435\u043D\u0435 \u0438 \u0435\u0436\u0435\u0434\u043D\u0435\u0432\u0438\u0435. \u041F\u0440\u0435\u0433\u043B\u0435\u0434\u0438 \u0438 \u0440\u044A\u043A\u043E\u0432\u043E\u0434\u0441\u0442\u0432\u0430 \u043D\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438.",
  alternates: { canonical: "https://aizavseki.eu/blog/ai-instrumenti" },
};

export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AiInstrumentiPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);
  return <PillarPage pillarKey="AI_TOOLS" currentPage={currentPage} />;
}
