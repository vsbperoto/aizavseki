import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Изтриване на данни",
  description: "Поискайте изтриване на вашите лични данни от AiZaVseki. Проверете статуса на вашата заявка за изтриване.",
  alternates: { canonical: "https://aizavseki.eu/data-deletion" },
};

export default function DataDeletionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
