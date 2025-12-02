import Image from "next/image";
import { BarChart3, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-sans relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>

      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-between py-16 md:py-32 px-6 md:px-16 relative z-10">
        
        {/* Logo/Brand Section */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/20 rounded-lg">
            <BarChart3 className="text-cyan-400" size={28} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Sales Dashboard</h2>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center gap-8 text-center w-full">
          
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl md:text-5xl font-bold leading-tight tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Welcome to Your Sales Dashboard
            </h1>
            <p className="max-w-2xl text-lg md:text-xl leading-8 text-slate-300">
              Real-time sales analytics, advanced filtering, and comprehensive data visualization. Monitor your business performance with powerful insights.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-6">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4 hover:border-cyan-400/50 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="text-cyan-400" size={20} />
                <h3 className="text-white font-semibold">Analytics</h3>
              </div>
              <p className="text-sm text-slate-400">Track daily sales trends and revenue patterns</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4 hover:border-cyan-400/50 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="text-cyan-400" size={20} />
                <h3 className="text-white font-semibold">Filters</h3>
              </div>
              <p className="text-sm text-slate-400">Advanced filtering by date, price, email & phone</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4 hover:border-cyan-400/50 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="text-cyan-400" size={20} />
                <h3 className="text-white font-semibold">Data</h3>
              </div>
              <p className="text-sm text-slate-400">Detailed transaction data with pagination</p>
            </div>
          </div>

          {/* Description */}
          <div className="max-w-2xl">
            <p className="text-slate-400 text-base md:text-lg leading-7">
              This dashboard provides comprehensive sales insights with interactive charts, sortable tables, and powerful filtering capabilities. Use the controls above to explore your data and make data-driven decisions.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 text-base font-medium w-full md:flex-row justify-center">
          <Link
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 text-white font-semibold transition-all hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105 md:w-[200px]"
            href="/dashboard"
          >
            <BarChart3 size={18} />
            View Dashboard
          </Link>
          
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-slate-500 mt-8 md:mt-0">
          <p>Powered by modern analytics • Built with Next.js & React</p>
        </div>
      </main>
    </div>
  );
}