"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useCallback, useEffect, useState } from "react";
import { Search, X } from "lucide-react";

export function ResourceSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQ = searchParams.get("q") || "";
  const [value, setValue] = useState(currentQ);
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
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gray/50" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={"\u0422\u044A\u0440\u0441\u0438 \u0440\u0435\u0441\u0443\u0440\u0441\u0438..."}
        className="w-full rounded-xl border border-brand-cyan/10 bg-brand-navy/50 py-3 pl-10 pr-10 text-brand-white placeholder:text-brand-gray/40 focus:border-brand-cyan/30 focus:outline-none focus:ring-1 focus:ring-brand-cyan/20 transition-colors"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray/50 hover:text-brand-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
