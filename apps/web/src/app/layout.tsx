import type { Metadata } from "next";
import { Outfit, Sora, DM_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://aizavseki.eu"),
  title: {
    default: "AiZaVseki — AI За Всеки | AI на български",
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
  alternates: {
    canonical: "https://aizavseki.eu",
  },
  openGraph: {
    type: "website",
    locale: "bg_BG",
    url: "https://aizavseki.eu",
    siteName: "AiZaVseki",
    title: "AiZaVseki — AI За Всеки",
    description: "Изкуственият интелект, обяснен на човешки език",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AiZaVseki — AI За Всеки",
    description: "Изкуственият интелект, обяснен на човешки език",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
  other: {
    "facebook-domain-verification": "utb6bfaltojn4x2ktexvri8fuxd7l9",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://aizavseki.eu/#organization",
      name: "AiZaVseki",
      alternateName: "АИ За Всеки",
      url: "https://aizavseki.eu",
      logo: "https://aizavseki.eu/opengraph-image",
      sameAs: [
        "https://www.instagram.com/aizavseki",
        "https://www.facebook.com/aizavseki",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        email: "contact@aizavseki.eu",
        contactType: "customer service",
        availableLanguage: "Bulgarian",
      },
      foundingDate: "2025",
      areaServed: "BG",
      inLanguage: "bg",
      knowsAbout: [
        "Artificial Intelligence",
        "Machine Learning",
        "AI Tools",
        "AI News",
        "AI Education",
        "Prompt Engineering",
        "ChatGPT",
        "Generative AI",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://aizavseki.eu/#website",
      url: "https://aizavseki.eu",
      name: "AiZaVseki",
      description: "Изкуственият интелект, обяснен на човешки език",
      publisher: { "@id": "https://aizavseki.eu/#organization" },
      inLanguage: "bg",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg">
      <body
        className={`${outfit.variable} ${sora.variable} ${dmSans.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
