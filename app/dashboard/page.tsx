'use client';
import React, { useState, useCallback, useEffect } from 'react';

import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Calendar, Loader2, BarChart3, Filter } from 'lucide-react';
import { useDashboard } from './context';
import { SalesChart } from '@/components/SalesChart/SalesChart';
import { DataTable } from '@/components/DataTable/DataTable';
import { Pagination } from '@/components/Pagination/Pagination';
import { redirect } from 'next/navigation';

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
    const [hasNextPage, setHasNextPage] = useState<number>(1);
    const [hasPrevPage, setHasPrevPage] = useState<number>(0);
    const [page, setPage] = useState<number>(1);

    // Sorting State
    const [sortBy, setSortBy] = useState<'date' | 'price'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Fetch sales data from API
    const { token } = useDashboard();
    if (!token) {
        redirect('/login');
    }
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
                console.log('fetchSalesData', result.pagination);
                setTableData(result.results.Sales);
                let totalSalesNumber: number = result.results.Sales.length;
                console.log(totalSalesNumber);
                setHasNextPage(totalSalesNumber == 50 ? 1 : 0);
                setAfterToken(result.pagination.after || '');
                setBeforeToken(result.pagination.before || '');

                // Generate chart data from fetched data
                const dailyTotals: { [key: string]: number } = {};
                result.results.Sales.forEach((item) => {
                    if (!dailyTotals[item.date]) {
                        dailyTotals[item.date] = 0;
                    }
                    dailyTotals[item.date] += item.price;
                });

                const chartDataArray = Object.entries(dailyTotals)
                    .map(([date, total]) => ({
                        date,
                        total: parseFloat(total.toFixed(2)),
                    }))
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                setChartData(chartDataArray);
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
        setPage(1);
        setAfterToken('');
        setBeforeToken('');
        fetchSalesData('', '');
    }, [startDate, endDate, minPrice, email, phone, sortBy, sortOrder]);

    // Handle next page
    const handleNextPage = () => {
        if (afterToken) {
            setPage(page + 1);
            setHasPrevPage(page);
            fetchSalesData(afterToken, '');
        }
    };

    // Handle previous page
    const handlePrevPage = () => {
        if (page > 1) {
            setHasPrevPage(0);
            fetchSalesData('', beforeToken);
            setPage(1);
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
            className="inline-flex items-center ml-2 cursor-pointer hover:text-cyan-400 transition-colors"
            title={`Sort by ${column}`}
        >
            {sortBy === column && sortOrder === 'asc' && <ChevronUp size={16} className="text-cyan-400" />}
            {sortBy === column && sortOrder === 'desc' && <ChevronDown size={16} className="text-cyan-400" />}
            {sortBy !== column && <ChevronUp size={16} className="opacity-40 hover:opacity-100 text-slate-400" />}
        </button>
    );

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8 relative overflow-hidden">
            {/* Animated background orbs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto space-y-6 relative z-10">

                {/* Header */}
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-cyan-500/20 rounded-lg">
                            <BarChart3 className="text-cyan-400" size={24} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">
                            Sales Dashboard
                        </h1>
                    </div>
                    <p className="text-slate-400 mt-2 text-sm md:text-base pl-12">
                        Monitor and filter your sales data in real-time
                    </p>
                </div>

                {/* Filters Card */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700">
                        <div className="flex items-center gap-3">
                            <Filter className="text-cyan-400" size={20} />
                            <div>
                                <h2 className="text-lg font-bold text-white">Filters</h2>
                                <p className="text-sm text-slate-400 mt-1">
                                    Adjust filters to update the dashboard data
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

                            {/* Start Date */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">
                                    Start Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-cyan-400" size={18} />
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2.5 border border-slate-600 rounded-lg bg-slate-700/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">
                                    End Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-cyan-400" size={18} />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2.5 border border-slate-600 rounded-lg bg-slate-700/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Min Price */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">
                                    Min Price ($)
                                </label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2.5 border border-slate-600 rounded-lg bg-slate-700/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="Filter by email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-slate-600 rounded-lg bg-slate-700/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    placeholder="Filter by phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-slate-600 rounded-lg bg-slate-700/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart Card */}
                <SalesChart chartData={chartData} loading={loading} />

                {/* Table Card */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700">
                        <h2 className="text-lg font-bold text-white">Sales Table</h2>
                        <p className="text-sm text-slate-400 mt-1">
                            Detailed view of all sales transactions
                        </p>
                    </div>

                    <div className="p-6">

                        {error && (
                            <div className="mb-4 p-4 bg-red-500/10 text-red-400 rounded-lg text-sm border border-red-500/30 flex items-start gap-2">
                                <div className="flex-shrink-0 mt-0.5">
                                    <Loader2 size={16} />
                                </div>
                                {error}
                            </div>
                        )}

                        {/* responsive scrollable table */}
                        <div className="overflow-x-auto">
                            <DataTable
                                tableData={tableData}
                                loading={loading}
                                page={page}
                                SortIcon={SortIcon}
                            />
                        </div>

                        {/* Pagination */}
                        <Pagination
                            page={page}
                            tableData={tableData}
                            loading={loading}
                            handlePrevPage={handlePrevPage}
                            handleNextPage={handleNextPage}
                            hasNextPage={hasNextPage}
                            hasPrevPage={hasPrevPage}
                        />
                    </div>
                </div>

            </div>
        </div>

    );
}