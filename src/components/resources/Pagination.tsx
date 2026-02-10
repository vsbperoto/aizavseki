import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseParams: URLSearchParams;
}

export function Pagination({ currentPage, totalPages, baseParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams(baseParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const qs = params.toString();
    return `/resources${qs ? `?${qs}` : ""}`;
  }

  // Build page numbers with ellipsis
  const pages: (number | "ellipsis")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
  }

  return (
    <nav aria-label={"\u041D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0438"} className="flex items-center justify-center gap-1 mt-12">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="rounded-lg px-3 py-2 text-sm font-medium text-brand-gray hover:text-brand-white hover:bg-brand-navy-light transition-colors"
        >
          {"\u2190 \u041D\u0430\u0437\u0430\u0434"}
        </Link>
      )}

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e${i}`} className="px-2 text-brand-gray/40">
            ...
          </span>
        ) : p === currentPage ? (
          <span
            key={p}
            aria-current="page"
            className="rounded-lg px-3.5 py-2 text-sm font-medium bg-brand-cyan text-brand-dark"
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-brand-gray hover:text-brand-white hover:bg-brand-navy-light transition-colors"
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="rounded-lg px-3 py-2 text-sm font-medium text-brand-gray hover:text-brand-white hover:bg-brand-navy-light transition-colors"
        >
          {"\u041D\u0430\u043F\u0440\u0435\u0434 \u2192"}
        </Link>
      )}
    </nav>
  );
}
