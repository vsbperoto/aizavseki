"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  SlidersHorizontal,
  Eye,
  Star,
  Calendar,
  ArrowDownAZ,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "newest", label: "\u041D\u0430\u0439-\u043D\u043E\u0432\u0438", icon: Calendar },
  { value: "views", label: "\u041D\u0430\u0439-\u0447\u0435\u0442\u0435\u043D\u0438", icon: Eye },
  { value: "quality", label: "\u0422\u043E\u043F \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u043E", icon: Star },
  { value: "title", label: "\u0410\u0437\u0431\u0443\u0447\u0435\u043D \u0440\u0435\u0434", icon: ArrowDownAZ },
] as const;

export function ResourceSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeIndex = SORT_OPTIONS.findIndex((o) => o.value === currentSort);
  const activeOption = SORT_OPTIONS[activeIndex >= 0 ? activeIndex : 0];
  const [focusedIndex, setFocusedIndex] = useState(-1);

  function handleSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    params.delete("page");
    const qs = params.toString();
    router.push(`/resources${qs ? `?${qs}` : ""}`);
    setIsOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-20" ref={containerRef}>
      <button
        onClick={() => { setIsOpen(!isOpen); setFocusedIndex(activeIndex >= 0 ? activeIndex : 0); }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(true);
            setFocusedIndex(activeIndex >= 0 ? activeIndex : 0);
          } else if (e.key === "Escape") {
            setIsOpen(false);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center gap-2 px-4 py-2.5 bg-brand-navy border border-brand-white/10 rounded-md text-brand-white hover:text-brand-white hover:bg-brand-navy-light transition-all duration-200 min-w-[180px] justify-between group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-cyan/50"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-gray/60 group-hover:text-brand-gray/80 transition-colors" />
          <span className="text-sm font-medium">{activeOption.label}</span>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-brand-gray/60 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 rounded-md border border-brand-white/10 bg-brand-navy shadow-xl shadow-black/50 overflow-hidden"
          >
            <div
              className="p-1"
              role="listbox"
              aria-activedescendant={focusedIndex >= 0 ? `sort-option-${SORT_OPTIONS[focusedIndex].value}` : undefined}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setFocusedIndex((prev) => Math.min(prev + 1, SORT_OPTIONS.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setFocusedIndex((prev) => Math.max(prev - 1, 0));
                } else if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (focusedIndex >= 0) handleSort(SORT_OPTIONS[focusedIndex].value);
                } else if (e.key === "Escape") {
                  setIsOpen(false);
                }
              }}
            >
              {SORT_OPTIONS.map((option, idx) => (
                <button
                  key={option.value}
                  id={`sort-option-${option.value}`}
                  role="option"
                  aria-selected={currentSort === option.value}
                  onClick={() => handleSort(option.value)}
                  onMouseEnter={() => setFocusedIndex(idx)}
                  ref={(el) => { if (idx === focusedIndex && el) el.focus(); }}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-all focus-visible:outline-none",
                    currentSort === option.value
                      ? "bg-brand-navy-light text-brand-white"
                      : "text-brand-gray/80 hover:bg-brand-navy-light hover:text-brand-white",
                    focusedIndex === idx && currentSort !== option.value && "bg-brand-navy-light text-brand-white"
                  )}
                >
                  <option.icon className="w-4 h-4" />
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
