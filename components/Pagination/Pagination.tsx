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
        mt-6 
        flex flex-col gap-4 
        md:flex-row md:items-center md:justify-between
      "
    >
      {/* Info */}
      <div className="text-sm text-slate-600 text-center md:text-left">
        Page {page} • Showing {tableData.length} items
      </div>

      {/* Buttons */}
      <div
        className="
          flex gap-2 
          justify-center 
          md:justify-end
          w-full md:w-auto
        "
      >
        <button
          onClick={handlePrevPage}
          disabled={!hasPrevPage || loading}
          className="
            inline-flex items-center justify-center gap-1 
            px-4 py-2 w-full md:w-auto
            border border-slate-300 rounded-md 
            text-sm font-medium text-slate-700 
            bg-white hover:bg-slate-50 
            disabled:opacity-50 disabled:cursor-not-allowed 
            transition-colors
          "
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        <button
          onClick={handleNextPage}
          disabled={!hasNextPage || loading}
          className="
            inline-flex items-center justify-center gap-1 
            px-4 py-2 w-full md:w-auto
            border border-slate-300 rounded-md 
            text-sm font-medium text-slate-700 
            bg-white hover:bg-slate-50 
            disabled:opacity-50 disabled:cursor-not-allowed 
            transition-colors
          "
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
