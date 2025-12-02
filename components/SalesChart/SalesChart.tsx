import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
export const SalesChart = ({ chartData, loading }: { chartData: any; loading: boolean }) => {
    return (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
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
                  <XAxis
      dataKey="date"
      tickFormatter={(tick: string) => {
        // tick is item.date from your chartData
        return new Date(tick).toISOString().split("T")[1].split("Z")[0]; // HH:MM:SS
      }}
      tick={{ fontSize: 12, fill: "#334155" }}
      interval="preserveStartEnd"
      angle={-45}
      textAnchor="end"
    />
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
        </div>
    );
}