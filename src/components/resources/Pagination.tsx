import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseParams: URLSearchParams;
  basePath?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  baseParams,
  basePath = "/resources",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams(baseParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const qs = params.toString();
    return `${basePath}${qs ? `?${qs}` : ""}`;
  }

  // Build visible page range
  const visiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  const endPage = Math.min(totalPages, startPage + visiblePages - 1);

  if (endPage - startPage + 1 < visiblePages) {
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <nav
      aria-label={"\u041D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0438"}
      className="flex justify-center mt-16"
    >
      <div className="inline-flex items-center p-1.5 rounded-2xl bg-brand-navy/60 backdrop-blur-md border border-brand-white/5 shadow-lg shadow-black/20 gap-1">
        {/* Prev */}
        {currentPage > 1 ? (
          <Link
            href={buildHref(currentPage - 1)}
            className="p-2.5 rounded-xl text-brand-gray hover:text-brand-white hover:bg-brand-white/5 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
        ) : (
          <span className="p-2.5 rounded-xl text-brand-gray/30 cursor-not-allowed">
            <ChevronLeft className="w-5 h-5" />
          </span>
        )}

        {startPage > 1 && (
          <>
            <Link
              href={buildHref(1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium text-brand-gray hover:text-brand-white hover:bg-brand-white/5 transition-all"
            >
              1
            </Link>
            {startPage > 2 && (
              <span className="text-brand-gray/50 px-1">...</span>
            )}
          </>
        )}

        {pages.map((p) =>
          p === currentPage ? (
            <span
              key={p}
              aria-current="page"
              className="w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium text-brand-dark bg-brand-cyan shadow-[0_0_15px_rgba(0,212,255,0.4)] relative overflow-hidden"
            >
              <span className="relative z-10">{p}</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
            </span>
          ) : (
            <Link
              key={p}
              href={buildHref(p)}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium text-brand-gray hover:text-brand-white hover:bg-brand-white/5 transition-all"
            >
              {p}
            </Link>
          )
        )}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-brand-gray/50 px-1">...</span>
            )}
            <Link
              href={buildHref(totalPages)}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium text-brand-gray hover:text-brand-white hover:bg-brand-white/5 transition-all"
            >
              {totalPages}
            </Link>
          </>
        )}

        {/* Next */}
        {currentPage < totalPages ? (
          <Link
            href={buildHref(currentPage + 1)}
            className="p-2.5 rounded-xl text-brand-gray hover:text-brand-white hover:bg-brand-white/5 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
        ) : (
          <span className="p-2.5 rounded-xl text-brand-gray/30 cursor-not-allowed">
            <ChevronRight className="w-5 h-5" />
          </span>
        )}
      </div>
    </nav>
  );
}
