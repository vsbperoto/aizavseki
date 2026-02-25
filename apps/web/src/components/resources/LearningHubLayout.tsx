"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface LearningHubLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  activeFiltersCount?: number;
}

export function LearningHubLayout({
  sidebar,
  children,
  activeFiltersCount = 0,
}: LearningHubLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="relative">
      {/* Mobile toggle button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-navy/60 border border-brand-white/10 text-sm text-brand-gray hover:text-brand-white hover:border-brand-white/20 transition-all"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{"\u0424\u0438\u043b\u0442\u0440\u0438"}</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-brand-cyan text-brand-dark text-[10px] font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              mobileSidebarOpen && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Mobile sidebar — slides in/out */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden mb-6"
          >
            <div className="pb-2">{sidebar}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop two-column layout */}
      <div className="flex gap-8 items-start">
        {/* Left sidebar — desktop only */}
        <div className="hidden lg:block w-72 shrink-0">
          {sidebar}
        </div>

        {/* Right content panel */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
