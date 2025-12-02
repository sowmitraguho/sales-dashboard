import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2, TrendingUp } from "lucide-react";

export const SalesChart = ({
  chartData,
  loading,
}: {
  chartData: any;
  loading: boolean;
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <TrendingUp className="text-cyan-400" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Sales Over Time</h2>
              <p className="text-sm text-slate-400 mt-1">
                Daily total sales in your selected date range
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading && chartData.length === 0 ? (
          <div className="h-64 md:h-80 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-cyan-400" size={24} />
              <span className="text-slate-400">Loading chart...</span>
            </div>
          </div>
        ) : chartData.length > 0 ? (
          <div className="w-full h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 40,
                }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#475569"
                  opacity={0.3}
                />

                <XAxis
                  dataKey="date"
                  tickFormatter={(tick: string) => {
                    const time = new Date(tick)
                      .toISOString()
                      .split("T")[1]
                      .replace("Z", "")
                      .slice(0, 5);
                    return time;
                  }}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  interval="preserveStartEnd"
                  angle={-45}
                  textAnchor="end"
                />

                <YAxis 
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  stroke="#475569"
                />

                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toFixed(2)}`,
                    "Total Sales",
                  ]}
                  labelFormatter={(label: string) =>
                    new Date(label).toLocaleString()
                  }
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                  }}
                  labelStyle={{ color: "#e2e8f0" }}
                  itemStyle={{ color: "#06b6d4" }}
                  cursor={{ stroke: "#06b6d4", strokeWidth: 2 }}
                />

                <Legend 
                  wrapperStyle={{ fontSize: 12, paddingTop: "20px" }}
                  iconType="line"
                />

                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{
                    fill: "#06b6d4",
                    r: 4,
                    strokeWidth: 2,
                    stroke: "#164e63",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#06b6d4",
                  }}
                  isAnimationActive={true}
                  name="Total Sales"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 md:h-80 flex items-center justify-center text-slate-400">
            No data available for the selected filters
          </div>
        )}
      </div>
    </div>
  );
};