import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Контакт",
  description: "Свържете се с AiZaVseki. Имате въпрос или предложение? Пишете ни!",
  alternates: { canonical: "https://aizavseki.eu/contact" },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
