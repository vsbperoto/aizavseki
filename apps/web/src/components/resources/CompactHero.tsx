"use client";

import { motion } from "framer-motion";

interface CompactHeroProps {
  totalCount: number;
}

export function CompactHero({ totalCount }: CompactHeroProps) {
  return (
    <section className="relative pt-20 pb-8 sm:pt-24 sm:pb-10">
      {/* Single ambient blob — lighter touch than the full hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute top-[5%] left-[30%] w-[400px] h-[300px] bg-brand-cyan/10 rounded-full blur-[120px] opacity-50 animate-pulse"
          style={{ animationDuration: "6s" }}
        />
        <div
          className="absolute top-[20%] right-[20%] w-[300px] h-[200px] bg-accent-purple/10 rounded-full blur-[100px] opacity-40 animate-pulse"
          style={{ animationDuration: "9s" }}
        />
      </div>

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Pulsing badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 backdrop-blur-sm mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan" />
            </span>
            <span className="text-xs font-medium text-brand-cyan uppercase tracking-wider">
              AI {"\u0411\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0430"}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            <span className="text-brand-white">{"AI \u0420\u0435\u0441\u0443\u0440\u0441\u0438 "}</span>
            <span className="gradient-text">{"\u0437\u0430 \u0412\u0441\u0435\u043a\u0438"}</span>
          </h1>

          <p className="font-heading text-base text-brand-gray max-w-xl mx-auto leading-relaxed">
            <span className="text-brand-white font-semibold">{totalCount} {"\u0441\u0442\u0430\u0442\u0438\u0438"}</span>
            {" \u2014 "}
            <span className="text-brand-cyan">{"\u0434\u0435\u0444\u0438\u043d\u0438\u0446\u0438\u0438"}</span>
            {", "}
            <span className="text-accent-green">{"\u0440\u044a\u043a\u043e\u0432\u043e\u0434\u0441\u0442\u0432\u0430"}</span>
            {" \u0438 "}
            <span className="text-accent-amber">{"\u0441\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u044f"}</span>
            {" \u0437\u0430 AI \u043d\u0430 \u0431\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438"}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
