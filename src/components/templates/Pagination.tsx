import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { PaginationMeta } from "../../types/usersTypes";

interface PaginationProps {
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ meta, onPageChange, className = "" }: PaginationProps) {
  if (!meta || meta.totalPages <= 1) return null;

  const { page, totalPages, totalItems, hasPrevPage, hasNextPage } = meta;

  // الگوریتم ساخت آرایه صفحات و سه‌نقطه
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // تعداد صفحات قابل مشاهده

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
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 ${className}`}>
      {/* آمار کلی */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Page <span className="font-semibold text-gray-800 dark:text-gray-200">{page}</span> of{" "}
        <span className="font-semibold text-gray-800 dark:text-gray-200">{totalPages}</span>{" "}
        <span>({totalItems} total items)</span>
      </div>

      {/* دکمه‌های ناوبری و شماره صفحات */}
      <div className="flex items-center gap-1.5">
        {/* Previous */}
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <FiChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {/* شماره صفحات */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((item, index) => {
            if (item === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1 text-sm text-gray-400 select-none"
                >
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
                className={`min-w-[34px] h-[34px] flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                    : "border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <FiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
