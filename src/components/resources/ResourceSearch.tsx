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
    <div className="relative w-full max-w-2xl mx-auto group">
      {/* Glow effect behind input */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r from-brand-cyan via-accent-purple to-brand-cyan rounded-2xl blur transition duration-1000 ${
          isFocused
            ? "opacity-70"
            : "opacity-0 group-hover:opacity-30"
        }`}
      />

      <div className="relative flex items-center">
        <div className="absolute left-4 text-brand-gray transition-colors duration-300 group-focus-within:text-brand-cyan">
          <Search
            className={`w-5 h-5 transition-transform duration-300 ${
              isFocused ? "scale-110" : ""
            }`}
          />
        </div>

        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={"\u0422\u044A\u0440\u0441\u0438 \u0440\u0435\u0441\u0443\u0440\u0441\u0438 (\u043D\u0430\u043F\u0440. \u201E\u043A\u0430\u043A\u0432\u043E \u0435 LLM\u201C, \u201EChatGPT \u0440\u044A\u043A\u043E\u0432\u043E\u0434\u0441\u0442\u0432\u043E\u201C)..."}
          aria-label={"\u0422\u044A\u0440\u0441\u0438 \u0440\u0435\u0441\u0443\u0440\u0441\u0438"}
          className="w-full h-14 pl-12 pr-12 bg-brand-navy/80 backdrop-blur-xl text-brand-white placeholder:text-brand-gray/60 border border-brand-white/10 rounded-xl focus:outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/50 transition-all duration-300 font-heading"
        />

        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              aria-label={"\u0418\u0437\u0447\u0438\u0441\u0442\u0438 \u0442\u044A\u0440\u0441\u0435\u043D\u0435\u0442\u043E"}
              className="absolute right-4 p-1 rounded-full hover:bg-brand-white/10 text-brand-gray hover:text-brand-white transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
