import type { Metadata } from "next";
import { PillarPage } from "@/components/blog/PillarPage";

export const metadata: Metadata = {
  title: "AI \u041D\u043E\u0432\u0438\u043D\u0438 \u2014 \u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438 \u043D\u043E\u0432\u0438\u043D\u0438 \u0437\u0430 \u0438\u0437\u043A\u0443\u0441\u0442\u0432\u0435\u043D\u0438\u044F \u0438\u043D\u0442\u0435\u043B\u0435\u043A\u0442",
  description: "\u041A\u0430\u043A\u0432\u043E \u0441\u0435 \u0441\u043B\u0443\u0447\u0432\u0430 \u0432 \u0441\u0432\u0435\u0442\u0430 \u043D\u0430 AI? \u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438 \u043D\u043E\u0432\u0438\u043D\u0438, \u043E\u0442\u043A\u0440\u0438\u0442\u0438\u044F \u0438 \u0442\u0435\u043D\u0434\u0435\u043D\u0446\u0438\u0438 \u0432 \u0438\u0437\u043A\u0443\u0441\u0442\u0432\u0435\u043D\u0438\u044F \u0438\u043D\u0442\u0435\u043B\u0435\u043A\u0442 \u043D\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438.",
  alternates: { canonical: "https://aizavseki.eu/blog/ai-novini" },
};

export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AiNoviniPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);
  return <PillarPage pillarKey="AI_NEWS" currentPage={currentPage} />;
}
