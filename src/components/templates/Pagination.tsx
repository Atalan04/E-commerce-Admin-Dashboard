import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { PaginationMeta } from "../../types/usersTypes";

interface PaginationProps {
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  if (!meta || meta.totalPages <= 1) return null;

  const { page, totalPages, totalItems, hasPrevPage, hasNextPage } = meta;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (page > 3) {
        pages.push("...");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
      <div>
        Page <span className="font-semibold text-slate-800">{page}</span> of{" "}
        <span className="font-semibold text-slate-800">{totalPages}</span>{" "}
        <span>({totalItems} total items)</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition"
        >
          <FiChevronLeft />
          Previous
        </button>
        <div className="flex items-center gap-1">
          {pageNumbers.map((item, index) => {
            if (item === "...") {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-slate-400">
                  ...
                </span>
              );
            }

            const pageNum = item as number;
            const isActive = pageNum === page;

            return (
              <button
                key={`page-${pageNum}`}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`min-w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-lg transition-colors${
                  isActive
                    ? "bg-blue-600 text-black shadow-sm hover:bg-blue-700 hover:text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition"
        >
          Next
          <FiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
