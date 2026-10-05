import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { PaginationMeta } from "../../types/usersTypes";

interface PaginationProps {
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange}: PaginationProps) {
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
    <div>
      <div>
        Page <span>{page}</span> of{" "}
        <span >{totalPages}</span>{" "}
        <span>({totalItems} total items)</span>
      </div>

      <div >
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage} >
          <FiChevronLeft />
          Previous
        </button>
        <div >
          {pageNumbers.map((item, index) => {
            if (item === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}>
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
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}>
          Next
          <FiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
