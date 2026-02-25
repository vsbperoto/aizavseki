"use client";

import { motion } from "framer-motion";
import { CountUp } from "@/components/ui/CountUp";
import { cn } from "@/lib/utils";
import { Book, Layers, GitCompare } from "lucide-react";
import Link from "next/link";

interface ResourceStatsProps {
  counts: { definition: number; howto: number; comparison: number };
  activeType: string | null;
}

const STAT_ITEMS = [
  {
    key: "definition",
    label: "\u0414\u0435\u0444\u0438\u043D\u0438\u0446\u0438\u0438",
    icon: Book,
    color: "text-white",
    iconColor: "text-blue-400",
    bg: "bg-white/[0.02]",
    border: "border-white/10",
    hoverBg: "hover:bg-white/[0.05]",
  },
  {
    key: "howto",
    label: "\u0420\u044A\u043A\u043E\u0432\u043E\u0434\u0441\u0442\u0432\u0430",
    icon: Layers,
    color: "text-white",
    iconColor: "text-emerald-400",
    bg: "bg-white/[0.02]",
    border: "border-white/10",
    hoverBg: "hover:bg-white/[0.05]",
  },
  {
    key: "comparison",
    label: "\u0421\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u044F",
    icon: GitCompare,
    color: "text-white",
    iconColor: "text-amber-400",
    bg: "bg-white/[0.02]",
    border: "border-white/10",
    hoverBg: "hover:bg-white/[0.05]",
  },
] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export function ResourceStats({ counts, activeType }: ResourceStatsProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
      {STAT_ITEMS.map((stat) => {
        const isActive = activeType === stat.key;
        return (
          <motion.div key={stat.key} variants={item}>
            <Link
              href={isActive ? "/resources" : `/resources?type=${stat.key}`}
              className={cn(
                "group relative flex items-center justify-between p-4 rounded-xl border backdrop-blur-md transition-all duration-300",
                stat.bg,
                stat.border,
                stat.hoverBg,
                isActive
                  ? "ring-1 ring-white/20 scale-[1.02] bg-white/[0.05]"
                  : "hover:-translate-y-1"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg bg-black/40 border border-white/5", stat.iconColor)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm text-zinc-400 font-medium group-hover:text-zinc-300 transition-colors">
                    {stat.label}
                  </span>
                  <span
                    className={cn(
                      "text-2xl font-bold font-sans",
                      stat.color
                    )}
                  >
                    <CountUp
                      end={counts[stat.key as keyof typeof counts]}
                      duration={2000}
                    />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
