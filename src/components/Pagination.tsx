import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  total?: number;
  current?: number;
  onChange?: (page: number) => void;
}

const Pagination = ({ totalPages, currentPage, onPageChange, total, current, onChange }: PaginationProps) => {
  const pages = Number(totalPages ?? total ?? 1);
  const active = Number(currentPage ?? current ?? 1);
  const change = onPageChange || onChange;

  if (pages <= 1 || !change) return null;

  const handlePageClick = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (page < 1 || page > pages || page === active) return;
    change(page);
  };

  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1).filter((page) => {
    if (pages <= 7) return true;
    return page === 1 || page === pages || Math.abs(page - active) <= 1;
  });

  return (
    <div className="mt-12 mb-4 flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={(e) => handlePageClick(e, active - 1)}
          disabled={active === 1}
          className="rounded-full border border-gray-100 bg-white p-3 text-slate-400 transition-all hover:text-[#C5A059] disabled:opacity-25 dark:border-slate-800 dark:bg-slate-900"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-gray-50 bg-white px-4 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {pageNumbers.map((page, index) => {
            const prev = pageNumbers[index - 1];
            const hasGap = prev && page - prev > 1;
            return (
              <React.Fragment key={page}>
                {hasGap && <span className="px-1 text-xs font-black text-slate-300">...</span>}
                <button
                  type="button"
                  onClick={(e) => handlePageClick(e, page)}
                  className={`relative flex h-10 w-10 items-center justify-center text-[12px] font-black outline-none transition-colors duration-300 ${
                    active === page ? "text-white" : "text-slate-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {active === page && (
                    <motion.div
                      layoutId="activePageCircle"
                      className="absolute inset-0 rounded-full bg-black dark:bg-[#C5A059]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{page}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <button
          type="button"
          onClick={(e) => handlePageClick(e, active + 1)}
          disabled={active === pages}
          className="rounded-full border border-gray-100 bg-white p-3 text-slate-400 transition-all hover:text-[#C5A059] disabled:opacity-25 dark:border-slate-800 dark:bg-slate-900"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
