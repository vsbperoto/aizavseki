import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Контакт",
  description: "Свържете се с AiZaVseki. Имате въпрос или предложение? Пишете ни!",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
