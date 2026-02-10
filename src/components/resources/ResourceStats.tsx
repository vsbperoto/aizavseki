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
    color: "text-brand-cyan",
    bg: "bg-brand-cyan/10",
    border: "border-brand-cyan/20",
    glow: "hover:shadow-[0_0_20px_rgba(0,212,255,0.2)]",
  },
  {
    key: "howto",
    label: "\u0420\u044A\u043A\u043E\u0432\u043E\u0434\u0441\u0442\u0432\u0430",
    icon: Layers,
    color: "text-accent-green",
    bg: "bg-accent-green/10",
    border: "border-accent-green/20",
    glow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]",
  },
  {
    key: "comparison",
    label: "\u0421\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u044F",
    icon: GitCompare,
    color: "text-accent-amber",
    bg: "bg-accent-amber/10",
    border: "border-accent-amber/20",
    glow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]",
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
                stat.glow,
                isActive
                  ? "ring-2 ring-offset-2 ring-offset-brand-dark ring-brand-white/20 scale-[1.02]"
                  : "hover:-translate-y-1"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg bg-brand-dark/40", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm text-brand-gray font-medium">
                    {stat.label}
                  </span>
                  <span
                    className={cn(
                      "text-2xl font-bold font-display",
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
