"use client";

import { motion } from "framer-motion";
import { PILLARS, type PillarKey } from "@/lib/constants";

interface BlogHeroProps {
  totalPosts: number;
  activePillar: PillarKey | null;
}

export function BlogHero({ totalPosts, activePillar }: BlogHeroProps) {
  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl overflow-hidden pointer-events-none z-0">
        <div
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-brand-cyan/10 rounded-full blur-[100px] opacity-60 animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-accent-purple/10 rounded-full blur-[100px] opacity-50 animate-pulse"
          style={{ animationDuration: "7s" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 backdrop-blur-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan" />
            </span>
            <span className="text-xs font-medium text-brand-cyan uppercase tracking-wider">
              {`AI \u0411\u043B\u043E\u0433 \u2014 \u0415\u0436\u0435\u0434\u043D\u0435\u0432\u043D\u043E`}
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="block text-brand-white">
              {`AI \u0411\u043B\u043E\u0433`}
            </span>
            <span className="block gradient-text mt-2">
              {`\u043D\u0430 \u0411\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438`}
            </span>
          </h1>

          <p className="font-heading text-lg sm:text-xl text-brand-gray max-w-2xl mx-auto mb-12 leading-relaxed">
            {(Object.entries(PILLARS) as [PillarKey, (typeof PILLARS)[PillarKey]][]).map(
              ([key, p], i, arr) => (
                <span key={key}>
                  <span style={{ color: p.color }}>
                    {p.label.toLowerCase().replace("ai ", "")}
                  </span>
                  {i < arr.length - 1 ? (i === arr.length - 2 ? " \u0438 " : ", ") : ""}
                </span>
              )
            )}
          </p>
        </motion.div>

        {/* Total posts stat */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-brand-navy/60 backdrop-blur-md border border-brand-white/5"
        >
          <span className="text-3xl font-bold text-brand-cyan">{totalPosts}</span>
          <span className="text-sm text-brand-gray">{"\u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438"}</span>
        </motion.div>
      </div>
    </section>
  );
}
