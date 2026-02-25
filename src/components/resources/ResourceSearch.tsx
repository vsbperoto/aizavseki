"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ResourceSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQ = searchParams.get("q") || "";
  const [value, setValue] = useState(currentQ);
  const [isFocused, setIsFocused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    setValue(currentQ);
  }, [currentQ]);

  const pushSearch = useCallback(
    (q: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (q.trim()) {
        params.set("q", q.trim());
      } else {
        params.delete("q");
      }
      params.delete("page");
      const qs = params.toString();
      router.push(`/resources${qs ? `?${qs}` : ""}`);
    },
    [router, searchParams]
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setValue(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => pushSearch(v), 300);
  }

  function handleClear() {
    setValue("");
    pushSearch("");
  }

  return (
    <div className="relative w-full max-w-2xl group">
      <div className="relative flex items-center">
        <div className="absolute left-3 text-brand-gray/60 transition-colors duration-300 group-focus-within:text-brand-cyan">
          <Search className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={"Търси ресурси..."}
          aria-label={"Търси ресурси"}
          className="w-full bg-brand-navy border border-brand-white/10 text-sm rounded-md pl-10 pr-10 py-2.5 text-brand-white focus:outline-none focus:border-brand-cyan/30 focus:ring-1 focus:ring-brand-cyan/30 transition-all placeholder:text-brand-gray/60"
        />

        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              aria-label={"Изчисти търсенето"}
              className="absolute right-3 p-1 rounded-sm hover:bg-brand-white/5 text-brand-gray/60 hover:text-brand-cyan transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
