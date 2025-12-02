
import {  Loader2 } from 'lucide-react';

interface DataTableProps {
    tableData: SalesItem[];
    loading: boolean;
    SortIcon: React.FC<{ column: 'date' | 'price' }>;
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
        <div>
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
                            Price
                            <SortIcon column="price" />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {loading && tableData.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                <Loader2 className="animate-spin inline-block mr-2" size={18} />
                                Loading data...
                            </td>
                        </tr>
                    ) : tableData.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                No sales data found
                            </td>
                        </tr>
                    ) : (
                        tableData.map((item) => (
                            <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    {tableData.indexOf(item) + 1 + (page - 1) * 50}
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
    );
}