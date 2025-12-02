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

export const DataTable = ({ tableData, loading, SortIcon, page }: DataTableProps) => {
  return (
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                SL No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Date <SortIcon column="date" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Customer Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Customer Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Price <SortIcon column="price" />
              </th>
            </tr>
          </thead>

          <tbody>
            {/* Loading */}
            {loading && tableData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  <Loader2 className="animate-spin inline-block mr-2" size={18} />
                  Loading data...
                </td>
              </tr>
            ) : tableData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No sales data found</td>
              </tr>
            ) : (
              tableData.map((item, index) => (
                <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {index + 1 + (page - 1) * 50}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {new Date(item.date).toISOString().split("T")[0]}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.customerEmail}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.customerPhone}</td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    ${item.price.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        {loading && tableData.length === 0 && (
          <div className="py-10 text-center text-slate-500">
            <Loader2 className="animate-spin inline-block mr-2" size={18} />
            Loading data...
          </div>
        )}

        {!loading && tableData.length === 0 && (
          <div className="py-10 text-center text-slate-500">No sales data found</div>
        )}

        {tableData.map((item, index) => (
          <div
            key={item.id}
            className="border border-slate-200 rounded-lg p-4 shadow-sm bg-white"
          >
            <div className="flex justify-between text-sm text-slate-500">
              <span>SL No:</span>
              <span className="font-medium">
                {index + 1 + (page - 1) * 50}
              </span>
            </div>

            <div className="flex justify-between text-sm text-slate-500 mt-1">
              <span>Date:</span>
              <span className="font-medium">
                {new Date(item.date).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-sm text-slate-500 mt-1">
              <span>Email:</span>
              <span className="font-medium">{item.customerEmail}</span>
            </div>

            <div className="flex justify-between text-sm text-slate-500 mt-1">
              <span>Phone:</span>
              <span className="font-medium">{item.customerPhone}</span>
            </div>

            <div className="flex justify-between text-sm mt-2 font-semibold text-green-600">
              <span>Price:</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
