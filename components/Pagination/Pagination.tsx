import { ChevronLeft, ChevronRight} from 'lucide-react';
interface PaginationProps {
    page: number;
    tableData: any[];
    loading: boolean;
    handlePrevPage: () => void;
    handleNextPage: () => void;
    hasNextPage: number;
    hasPrevPage: number;
}
export const Pagination = ({ page, tableData, loading, handlePrevPage, handleNextPage, hasNextPage, hasPrevPage }: PaginationProps) => {
    return (
         <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-slate-600">
                                Page {page} • Showing {tableData.length} items
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={!hasPrevPage || loading}
                                    className="inline-flex items-center gap-1 px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={18} />
                                    Previous
                                </button>
                                <button
                                    onClick={handleNextPage}
                                    disabled={!hasNextPage || loading}
                                    className="inline-flex items-center gap-1 px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
    );
}