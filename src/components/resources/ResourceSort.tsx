"use client";

import { useRouter, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { value: "newest", label: "\u041D\u0430\u0439-\u043D\u043E\u0432\u0438" },
  { value: "views", label: "\u041D\u0430\u0439-\u0447\u0435\u0442\u0435\u043D\u0438" },
  { value: "quality", label: "\u041D\u0430\u0439-\u043A\u0430\u0447\u0435\u0441\u0442\u0432\u0435\u043D\u0438" },
  { value: "title", label: "\u041F\u043E \u0437\u0430\u0433\u043B\u0430\u0432\u0438\u0435" },
] as const;

export function ResourceSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") || "newest";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    const val = e.target.value;
    if (val === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", val);
    }
    params.delete("page");
    const qs = params.toString();
    router.push(`/resources${qs ? `?${qs}` : ""}`);
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      className="rounded-lg border border-brand-cyan/10 bg-brand-navy/50 px-3 py-2 text-sm text-brand-gray focus:border-brand-cyan/30 focus:outline-none focus:ring-1 focus:ring-brand-cyan/20 transition-colors"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
