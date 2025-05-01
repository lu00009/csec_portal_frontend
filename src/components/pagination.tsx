import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    // Show all pages if <= 5, else show sliding window
    if (
      totalPages <= 5 ||
      i === 1 ||
      i === totalPages ||
      Math.abs(i - currentPage) <= 1
    ) {
      pages.push(i);
    } else if (
      i === currentPage - 2 ||
      i === currentPage + 2
    ) {
      pages.push('...');
    }
  }

  const uniquePages = Array.from(new Set(pages));

  return (
    <div className="flex justify-center items-center mt-6 gap-2 text-sm">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 px-3 py-1 rounded-md border ${
          currentPage === 1
            ? 'text-muted border-border cursor-not-allowed'
            : 'hover:bg-accent hover:text-accent-foreground border-input'
        }`}
      >
        <FiChevronLeft />
        Prev
      </button>

      {uniquePages.map((page, index) =>
        page === '...' ? (
          <span key={index} className="px-2 text-muted-foreground">
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(Number(page))}
            className={`px-3 py-1 rounded-md border ${
              currentPage === page
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-input hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 px-3 py-1 rounded-md border ${
          currentPage === totalPages
            ? 'text-muted border-border cursor-not-allowed'
            : 'hover:bg-accent hover:text-accent-foreground border-input'
        }`}
      >
        Next
        <FiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
