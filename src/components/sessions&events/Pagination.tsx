import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  return (
    <div className="flex justify-end mt-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md border disabled:opacity-50"
        >
          <FiChevronLeft />
        </button>
        
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }
          
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-10 h-10 rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'border'}`}
            >
              {pageNum}
            </button>
          );
        })}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md border disabled:opacity-50"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;