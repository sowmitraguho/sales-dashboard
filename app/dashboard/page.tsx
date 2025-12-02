'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Calendar, Loader2 } from 'lucide-react';
import { useDashboard } from './context';

interface SalesItem {
    id: string;
    date: string;
    customerEmail: string;
    customerPhone: string;
    price: number;
}
interface ApiResponse { 
    results: {
        Sales: SalesItem[];
        TotalSales: {
            totalSale: number;
            day: string;
        }
    };
    pagination: pagination;
}
interface pagination {
    after?: string;
    before?: string;
}

//curl --location 'https://autobizz-425913.uc.r.appspot.com/sales?startDate=2025-01-01&endDate=2025-01-31&priceMin=10&email=&phone=&sortBy=date&sortOrder=asc&after=&before=' \


export default function SalesDashboard() {
    // Filter State
    const [startDate, setStartDate] = useState('2025-01-01');
    const [endDate, setEndDate] = useState('2025-01-01');
    const [minPrice, setMinPrice] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Data State
    const [chartData, setChartData] = useState<{ date: string; total: number }[]>([]);
    const [tableData, setTableData] = useState<SalesItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Pagination State
    const [afterToken, setAfterToken] = useState<string>('');
    const [beforeToken, setBeforeToken] = useState<string>('');
    const [hasNextPage, setHasNextPage] = useState(true);
    const [hasPrevPage, setHasPrevPage] = useState(true);
    const [pageStack, setPageStack] = useState<string[]>(['']);

    // Sorting State
    const [sortBy, setSortBy] = useState<'date' | 'price'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Fetch sales data from API
    const { token } = useDashboard();
    const fetchSalesData = useCallback(
        async (after: string = '', before: string = '') => {
            setLoading(true);
            setError('');

            try {
                const params = new URLSearchParams({
                    startDate,
                    endDate,
                    priceMin: minPrice || '',
                    email: email || '',
                    phone: phone || '',
                    sortBy,
                    sortOrder,
                    after: after || '',
                    before: before || '',
                });

                const url = `https://autobizz-425913.uc.r.appspot.com/sales?${params.toString()}`;

                const res = await fetch(url, {
                    headers: {
                        "X-AUTOBIZZ-TOKEN": token,
                    },
                    cache: "no-store",
                });
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const result: ApiResponse = await res.json();
                console.log(result);
                setTableData(result.results.Sales);
                let totalSales = result.results.TotalSales.totalSale;
                setAfterToken(result.pagination.after || '');
                setBeforeToken(result.pagination.before || '');
                // setHasNextPage(result.pagination.hasNextPage);
                // setHasPrevPage(result.pagination.hasPrevPage);

                // Generate chart data from fetched data
                // const dailyTotals: { [key: string]: number } = {};
                // result.data.forEach((item) => {
                //   if (!dailyTotals[item.date]) {
                //     dailyTotals[item.date] = 0;
                //   }
                //   dailyTotals[item.date] += item.price;
                // });

                // const chartDataArray = Object.entries(dailyTotals)
                //   .map(([date, total]) => ({
                //     date,
                //     total: parseFloat(total.toFixed(2)),
                //   }))
                //   .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                // setChartData(chartDataArray);
            } catch (err) {
                console.error('Error fetching sales data:', err);
                setError('Failed to fetch sales data. Please try again.');
            } finally {
                setLoading(false);
            }
        },
        [startDate, endDate, minPrice, email, phone, sortBy, sortOrder]
    );

    // Reset pagination and fetch when filters change
    useEffect(() => {
        setPageStack(['']);
        setAfterToken('');
        setBeforeToken('');
        fetchSalesData('', '');
    }, [startDate, endDate, minPrice, email, phone, sortBy, sortOrder, fetchSalesData]);

    // Handle next page
    const handleNextPage = () => {
        if (afterToken) {
            setPageStack([...pageStack, afterToken]);
            fetchSalesData(afterToken, '');
        }
    };

    // Handle previous page
    const handlePrevPage = () => {
        if (pageStack.length > 1) {
            const newStack = pageStack.slice(0, -1);
            setPageStack(newStack);
            const previousToken = newStack[newStack.length - 1];
            fetchSalesData('', previousToken);
        }
    };

    // Handle sorting
    const handleSort = (column: 'date' | 'price') => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const SortIcon = ({ column }: { column: 'date' | 'price' }) => (
        <button
            onClick={() => handleSort(column)}
            className="inline-flex items-center ml-2 cursor-pointer hover:text-blue-600 transition-colors"
            title={`Sort by ${column}`}
        >
            {sortBy === column && sortOrder === 'asc' && <ChevronUp size={16} />}
            {sortBy === column && sortOrder === 'desc' && <ChevronDown size={16} />}
            {sortBy !== column && <ChevronUp size={16} className="opacity-30 hover:opacity-100" />}
        </button>
    );

    return (
        <div className="w-full min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Sales Dashboard</h1>
                    <p className="text-slate-600 mt-2">Monitor and filter your sales data in real-time</p>
                </div>

                {/* Filters Card */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
                        <p className="text-sm text-slate-600 mt-1">
                            Adjust filters to update the dashboard data
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Start Date Filter */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Start Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* End Date Filter */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    End Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Min Price Filter */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Min Price ($)
                                </label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Email Filter */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="Filter by email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Phone Filter */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    placeholder="Filter by phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>


                {/* Chart Card */}
                {/* <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Sales Over Time</h2>
            <p className="text-sm text-slate-600 mt-1">
              Daily total sales in your selected date range
            </p>
          </div>
          <div className="p-6">
            {loading && chartData.length === 0 ? (
              <div className="h-80 flex items-center justify-center text-slate-500">
                <Loader2 className="animate-spin mr-2" size={20} />
                Loading chart...
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    name="Total Sales"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-slate-500">
                No data available for the selected filters
              </div>
            )}
          </div>
        </div> */}

                {/* Table Card */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900">Sales Table</h2>
                        <p className="text-sm text-slate-600 mt-1">
                            Detailed view of all sales transactions
                        </p>
                    </div>
                    <div className="p-6">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
                                {error}
                            </div>
                        )}

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                                            Date
                                            <SortIcon column="date" />
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

                        {/* Pagination */}
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-slate-600">
                                Page {pageStack.length} • Showing {tableData.length} items
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
                    </div>
                </div>
            </div>
        </div>
    );
}