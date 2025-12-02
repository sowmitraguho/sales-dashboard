import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  tableData: any[];
  loading: boolean;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  hasNextPage: number;
  hasPrevPage: number;
}

export const Pagination = ({
  page,
  tableData,
  loading,
  handlePrevPage,
  handleNextPage,
  hasNextPage,
  hasPrevPage,
}: PaginationProps) => {
  return (
    <div
      className="
        mt-8 
        flex flex-col gap-4 
        md:flex-row md:items-center md:justify-between
        bg-gradient-to-r from-slate-800 to-slate-900
        border border-slate-700
        rounded-xl
        px-6 py-4
        shadow-lg
      "
    >
      {/* Info */}
      <div className="text-sm font-medium text-slate-300 text-center md:text-left">
        <span className="text-cyan-400 font-semibold">Page {page}</span>
        <span className="text-slate-500 mx-2">•</span>
        <span>Showing <span className="text-emerald-400 font-semibold">{tableData.length}</span> items</span>
      </div>

      {/* Buttons */}
      <div
        className="
          flex gap-3 
          justify-center 
          md:justify-end
          w-full md:w-auto
        "
      >
        <button
          onClick={handlePrevPage}
          disabled={!hasPrevPage || loading}
          className="
            group
            inline-flex items-center justify-center gap-2 
            px-5 py-2.5 w-full md:w-auto
            border border-slate-600 rounded-lg 
            text-sm font-medium text-slate-300
            bg-slate-700/50 hover:bg-slate-600/50
            disabled:opacity-40 disabled:cursor-not-allowed 
            transition-all duration-200
            hover:border-cyan-400 hover:text-cyan-400
            disabled:hover:border-slate-600 disabled:hover:text-slate-300
          "
        >
          <ChevronLeft size={18} className="group-hover:translate-x-0.5 transition-transform" />
          Previous
        </button>

        <button
          onClick={handleNextPage}
          disabled={!hasNextPage || loading}
          className="
            group
            inline-flex items-center justify-center gap-2 
            px-5 py-2.5 w-full md:w-auto
            border border-slate-600 rounded-lg 
            text-sm font-medium text-slate-300
            bg-slate-700/50 hover:bg-slate-600/50
            disabled:opacity-40 disabled:cursor-not-allowed 
            transition-all duration-200
            hover:border-emerald-400 hover:text-emerald-400
            disabled:hover:border-slate-600 disabled:hover:text-slate-300
          "
        >
          Next
          <ChevronRight size={18} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};