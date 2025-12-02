'use client';
import React, { useState, useCallback, useEffect } from 'react';

import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Calendar, Loader2 } from 'lucide-react';
import { useDashboard } from './context';
import { SalesChart } from '@/components/SalesChart/SalesChart';
import { DataTable } from '@/components/DataTable/DataTable';
import { Pagination } from '@/components/Pagination/Pagination';
//import { SalesChart } from '../components/SalesChart/SalesChart';

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
    const [hasNextPage, setHasNextPage] = useState<number>(1);
    const [hasPrevPage, setHasPrevPage] = useState<number>(0);
    const [page, setPage] = useState<number>(1);

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
                console.log('fetchSalesData',result.pagination);
                setTableData(result.results.Sales);
                let totalSalesNumber : number = result.results.Sales.length;
                console.log(totalSalesNumber);
                setHasNextPage(totalSalesNumber == 50 ? 1 : 0);
                //setHasPrevPage(page > 1 ? 1 : 0);
                setAfterToken(result.pagination.after || '');
                setBeforeToken(result.pagination.before || '' );

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
                  //console.log(chartDataArray);
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
            setHasPrevPage(page-2);
            fetchSalesData('', beforeToken);
            setPage(page - 1);
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
            {sortBy !== column && <ChevronUp size={16} className="opacity-70 hover:opacity-100" />}
        </button>
    );

    return (
        <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8">
  <div className="max-w-7xl mx-auto space-y-6">

    {/* Header */}
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
        Sales Dashboard
      </h1>
      <p className="text-slate-600 mt-1 md:mt-2 text-sm md:text-base">
        Monitor and filter your sales data in real-time
      </p>
    </div>

    {/* Filters Card */}
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 md:px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
        <p className="text-sm text-slate-600 mt-1">
          Adjust filters to update the dashboard data
        </p>
      </div>

      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

          {/* Start Date */}
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

          {/* End Date */}
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

          {/* Min Price */}
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

          {/* Email */}
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

          {/* Phone */}
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
    <SalesChart chartData={chartData} loading={loading} />

    {/* Table Card */}
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 md:px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Sales Table</h2>
        <p className="text-sm text-slate-600 mt-1">
          Detailed view of all sales transactions
        </p>
      </div>

      <div className="p-4 md:p-6">

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
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