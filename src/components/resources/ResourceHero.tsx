"use client";

import { motion } from "framer-motion";
import { ResourceStats } from "./ResourceStats";

interface ResourceHeroProps {
  counts: { definition: number; howto: number; comparison: number };
  activeType: string | null;
}

export function ResourceHero({ counts, activeType }: ResourceHeroProps) {
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
              AI {"\u0411\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430"}
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="block text-brand-white">
              AI {"\u0420\u0435\u0441\u0443\u0440\u0441\u0438"}
            </span>
            <span className="block gradient-text mt-2">
              {"\u0437\u0430 \u0412\u0441\u0438\u0447\u043A\u0438"}
            </span>
          </h1>

          <p className="font-heading text-lg sm:text-xl text-brand-gray max-w-2xl mx-auto mb-12 leading-relaxed">
            {"\u041D\u0430\u0439-\u0433\u043E\u043B\u044F\u043C\u0430\u0442\u0430 \u043A\u043E\u043B\u0435\u043A\u0446\u0438\u044F \u043E\u0442 "}
            <span className="text-brand-cyan">{"\u0434\u0435\u0444\u0438\u043D\u0438\u0446\u0438\u0438"}</span>
            {", "}
            <span className="text-accent-green">{"\u0440\u044A\u043A\u043E\u0432\u043E\u0434\u0441\u0442\u0432\u0430"}</span>
            {" \u0438 "}
            <span className="text-accent-amber">{"\u0441\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u044F"}</span>
            {" \u0437\u0430 \u0438\u0437\u043A\u0443\u0441\u0442\u0432\u0435\u043D \u0438\u043D\u0442\u0435\u043B\u0435\u043A\u0442 \u043D\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438 \u0435\u0437\u0438\u043A."}
          </p>
        </motion.div>

        {/* Integrated Stats */}
        <div className="mt-8">
          <ResourceStats counts={counts} activeType={activeType} />
        </div>
      </div>
    </section>
  );
}
