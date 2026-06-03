import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const EventPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 0) return null;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-12 text-sm text-gray-500 font-medium">
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`}>...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${currentPage === page ? 'text-blue-600 font-bold' : 'hover:text-blue-600'}`}
          >
            {page}
          </button>
        )
      ))}

      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default EventPagination;