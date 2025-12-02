import { Loader2 } from "lucide-react";

interface DataTableProps {
  tableData: SalesItem[];
  loading: boolean;
  SortIcon: React.FC<{ column: "date" | "price" }>;
  page: number;
}

interface SalesItem {
  id: string;
  date: string;
  customerEmail: string;
  customerPhone: string;
  price: number;
}

const customCss = `
  @keyframes shimmer-spin {
    to {
      --angle: 360deg;
    }
  }

  @property --angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }

  .table-gradient-border {
    position: relative;
    background: linear-gradient(to bottom, rgba(226, 232, 240, 0.5), rgba(15, 23, 42, 0.5));
    backdrop-filter: blur(10px);
  }
`;

export const DataTable = ({ tableData, loading, SortIcon, page }: DataTableProps) => {
  return (
    <div className="w-full">
      <style>{customCss}</style>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-700">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  SL No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  Date <SortIcon column="date" />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Customer Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Customer Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  Price <SortIcon column="price" />
                </th>
              </tr>
            </thead>

            <tbody>
              {/* Loading */}
              {loading && tableData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="animate-spin text-cyan-400" size={20} />
                      <span className="text-slate-300">Loading data...</span>
                    </div>
                  </td>
                </tr>
              ) : tableData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No sales data found
                  </td>
                </tr>
              ) : (
                tableData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors duration-200 group"
                  >
                    <td className="px-6 py-4 font-medium text-slate-300 group-hover:text-cyan-400 transition-colors">
                      {index + 1 + (page - 1) * 50}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-300 group-hover:text-cyan-400 transition-colors">
                      {new Date(item.date).toISOString().split("T")[0]}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                      {item.customerEmail}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                      {item.customerPhone}
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-400">
                      ${item.price.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        {loading && tableData.length === 0 && (
          <div className="py-12 text-center">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin text-cyan-400" size={20} />
              <span className="text-slate-300">Loading data...</span>
            </div>
          </div>
        )}

        {!loading && tableData.length === 0 && (
          <div className="py-12 text-center text-slate-400">No sales data found</div>
        )}

        {tableData.map((item, index) => (
          <div
            key={item.id}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-200 hover:border-slate-600"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                SL No
              </span>
              <span className="font-semibold text-slate-200">
                {index + 1 + (page - 1) * 50}
              </span>
            </div>

            <div className="h-px bg-gradient-to-r from-slate-700 to-transparent mb-3" />

            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Date
              </span>
              <span className="font-medium text-slate-300">
                {new Date(item.date).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Email
              </span>
              <span className="font-medium text-slate-300 text-sm">{item.customerEmail}</span>
            </div>

            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Phone
              </span>
              <span className="font-medium text-slate-300">{item.customerPhone}</span>
            </div>

            <div className="h-px bg-gradient-to-r from-slate-700 to-transparent mb-3" />

            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Price
              </span>
              <span className="font-bold text-emerald-400 text-lg">
                ${item.price.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};