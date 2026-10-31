import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  /** Build an array of page numbers (and "…" placeholders). */
  const getPages = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) pages.push('...');

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push('...');

    pages.push(totalPages);
    return pages;
  };

  const baseBtn =
    'flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 select-none';

  return (
    <nav
      aria-label="Product pagination"
      className="flex items-center justify-center gap-1.5 mt-10"
    >
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${baseBtn} gap-1 px-3.5 py-2.5 border border-gray-300 bg-white text-gray-600
                     hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page numbers */}
      {getPages().map((page, idx) =>
        page === '...' ? (
          <span
            key={`ellipsis-${idx}`}
            className="w-10 h-10 flex items-center justify-center text-gray-400"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${baseBtn} w-10 h-10 ${
              currentPage === page
                ? 'bg-primary-500 text-white shadow-md shadow-primary-200'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${baseBtn} gap-1 px-3.5 py-2.5 border border-gray-300 bg-white text-gray-600
                     hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

