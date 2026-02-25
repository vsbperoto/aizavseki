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
      <div className="relative z-10 mx-auto max-w-4xl text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <span className="text-xs font-medium text-white uppercase tracking-wider">
              AI {"\u0411\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430"}
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="block text-white">
              AI {"\u0420\u0435\u0441\u0443\u0440\u0441\u0438"}
            </span>
            <span className="block text-zinc-400 mt-2">
              {"\u0437\u0430 \u0412\u0441\u0438\u0447\u043A\u0438"}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            {"\u041D\u0430\u0439-\u0433\u043E\u043B\u044F\u043C\u0430\u0442\u0430 \u043A\u043E\u043B\u0435\u043A\u0446\u0438\u044F \u043E\u0442 "}
            <span className="text-white">{"\u0434\u0435\u0444\u0438\u043D\u0438\u0446\u0438\u0438"}</span>
            {", "}
            <span className="text-white">{"\u0440\u044A\u043A\u043E\u0432\u043E\u0434\u0441\u0442\u0432\u0430"}</span>
            {" \u0438 "}
            <span className="text-white">{"\u0441\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u044F"}</span>
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
