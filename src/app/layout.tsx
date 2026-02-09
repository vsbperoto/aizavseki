import type { Metadata } from "next";
import { Outfit, Sora, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aizavseki.eu"),
  title: {
    default: "AiZaVseki — AI За Всеки | Изкуствен интелект за обикновени хора",
    template: "%s | AiZaVseki",
  },
  description:
    "Научи как изкуственият интелект може да ти помогне в ежедневието. AI новини, инструменти и съвети на български, обяснени на човешки език.",
  keywords: [
    "AI",
    "изкуствен интелект",
    "AI за всеки",
    "AI инструменти",
    "AI новини",
    "AI България",
    "AI съвети",
  ],
  authors: [{ name: "AiZaVseki" }],
  openGraph: {
    type: "website",
    locale: "bg_BG",
    url: "https://aizavseki.eu",
    siteName: "AiZaVseki",
    title: "AiZaVseki — AI За Всеки",
    description: "Изкуственият интелект, обяснен на човешки език",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AiZaVseki — AI За Всеки",
    description: "Изкуственият интелект, обяснен на човешки език",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg">
      <body
        className={`${outfit.variable} ${sora.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
