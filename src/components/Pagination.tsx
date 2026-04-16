import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps { 
  totalPages: number; 
  currentPage: number; 
  onPageChange: (page: number) => void; 
}

const Pagination = ({ totalPages, currentPage, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const handlePageClick = (e: React.MouseEvent, page: number) => {
    // 1. Brauzerin standart keçid davranışını tam bloklayırıq
    e.preventDefault(); 
    e.stopPropagation();
    
    // 2. Səhifə nömrəsini dəyişirik
    onPageChange(page);

    // 3. Əgər brauzer avtomatik scroll etməyə çalışarsa, onu cari nöqtədə saxlayırıq
    // Bu, bəzi brauzerlərdəki "auto-focus scroll" problemini həll edir
    const currentScrollY = window.scrollY;
    setTimeout(() => {
      window.scrollTo({
        top: currentScrollY,
        behavior: 'auto'
      });
    }, 0);
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-16 mb-10">
      <div className="flex items-center gap-2">
        <button 
          type="button" 
          onClick={(e) => currentPage > 1 && handlePageClick(e, currentPage - 1)} 
          disabled={currentPage === 1} 
          className="p-3 rounded-full bg-white border border-gray-100 text-slate-400 hover:text-[#C5A059] disabled:opacity-20 transition-all active:scale-95 outline-none"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-50">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button 
              key={page} 
              type="button" 
              onClick={(e) => handlePageClick(e, page)} 
              className={`relative w-10 h-10 flex items-center justify-center text-[12px] font-black transition-colors duration-500 outline-none ${
                currentPage === page ? 'text-white' : 'text-slate-400 hover:text-black'
              }`}
            >
              {currentPage === page && (
                <motion.div 
                  layoutId="activeCircle" 
                  className="absolute inset-0 bg-black rounded-full" 
                  transition={{ type: "spring", stiffness: 300, damping: 30 }} 
                />
              )}
              <span className="relative z-10">{page}</span>
            </button>
          ))}
        </div>

        <button 
          type="button" 
          onClick={(e) => currentPage < totalPages && handlePageClick(e, currentPage + 1)} 
          disabled={currentPage === totalPages} 
          className="p-3 rounded-full bg-white border border-gray-100 text-slate-400 hover:text-[#C5A059] disabled:opacity-20 transition-all active:scale-95 outline-none"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;