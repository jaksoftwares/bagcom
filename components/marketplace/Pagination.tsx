'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const handlePageChange = (page: number | string) => {
    if (page === '...' || page === currentPage) return;
    
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('page', page.toString());
    
    router.push(`?${current.toString()}`);
  };

  return (
    <div className="pt-16 flex justify-center">
      <div className="flex items-center gap-2 bg-muted/5 p-1.5 rounded-xl border border-border/40 shadow-sm">
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-10 px-4 rounded-lg flex items-center gap-2 text-[10px] font-bold text-muted-foreground hover:bg-white hover:text-foreground hover:shadow-sm transition-all uppercase tracking-widest disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none"
        >
          <ChevronLeft className="h-3 w-3" /> Prev
        </button>
        
        <div className="flex items-center gap-1">
           {getPageNumbers().map((p, i) => (
             <button 
               key={i}
               onClick={() => handlePageChange(p)}
               disabled={p === '...'}
               className={`h-10 w-10 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                 p === currentPage 
                   ? 'bg-primary text-white shadow-md' 
                   : p === '...' 
                     ? 'text-muted-foreground/40 cursor-default'
                     : 'text-muted-foreground hover:bg-white hover:text-foreground hover:shadow-sm'
               }`}
             >
                {p}
             </button>
           ))}
        </div>

        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-10 px-4 rounded-lg flex items-center gap-2 text-[10px] font-bold text-muted-foreground hover:bg-white hover:text-foreground hover:shadow-sm transition-all uppercase tracking-widest disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none"
        >
          Next <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
