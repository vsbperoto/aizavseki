"use client";

import dynamic from "next/dynamic";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const ParticleBackground = dynamic(
  () =>
    import("@/components/ui/ParticleBackground").then(
      (mod) => mod.ParticleBackground
    ),
  { ssr: false }
);

export function HeroSection() {
  const [subtitleVisible, setSubtitleVisible] = useState(false);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <ParticleBackground />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/50 via-transparent to-brand-dark z-[1]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Main Heading */}
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            <TypewriterText
              text="AI ЗА ВСЕКИ"
              className="gradient-text"
              speed={100}
              onComplete={() => setSubtitleVisible(true)}
            />
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: subtitleVisible ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            className="mt-6 font-heading text-lg text-brand-gray-light sm:text-xl md:text-2xl"
          >
            Изкуственият интелект, обяснен на човешки език
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: subtitleVisible ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-4 max-w-2xl text-base text-brand-gray sm:text-lg"
          >
            Научи как AI може да ти помогне в ежедневието — без техническа
            подготовка
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: subtitleVisible ? 1 : 0, y: subtitleVisible ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link href="/blog">
              <Button size="lg">Разгледай</Button>
            </Link>
            <Link href="/newsletter">
              <Button variant="secondary" size="lg">
                Абонирай се
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="h-6 w-6 text-brand-cyan/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
