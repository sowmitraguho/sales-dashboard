"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

const customCss = `
    @property --angle {
      syntax: '<angle>';
      initial-value: 0deg;
      inherits: false;
    }

    @keyframes shimmer-spin {
      to {
        --angle: 360deg;
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-20px);
      }
    }

    @keyframes fade-in {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-float {
      animation: float 3s ease-in-out infinite;
    }

    .animate-fade-in {
      animation: fade-in 0.8s ease-out;
    }
`;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
    });

    if (res.ok) {
      window.location.href = "/dashboard";
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <style>{customCss}</style>
      
      {/* Animated background orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "2s" }}></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mb-6 mx-auto shadow-lg">
            <Lock className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-lg text-slate-300">
            Access your dashboard with one click
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700 shadow-2xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {/* Decorative element */}
          <div className="mb-8 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent rounded-full"></div>

          <p className="text-slate-300 text-center mb-8">
            Click below to securely authenticate and enter your dashboard
          </p>

          {/* Login Button */}
          <button
            className="w-full relative inline-flex items-center justify-center p-[1.5px] bg-gradient-to-r from-gray-300 to-gray-400 dark:from-slate-600 dark:to-slate-700 rounded-xl overflow-hidden group transition-transform duration-300 hover:scale-105"
            onClick={handleLogin}
            disabled={loading}
          >
            <div
              className="absolute inset-0"
              style={{
                background: 'conic-gradient(from var(--angle), transparent 25%, #06b6d4, transparent 50%)',
                animation: 'shimmer-spin 2.5s linear infinite',
              }}
            />
            <span className="relative z-10 inline-flex items-center justify-center w-full h-full px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl group-hover:from-slate-700 group-hover:to-slate-600 transition-all duration-300">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Enter Dashboard
                </div>
              )}
            </span>
          </button>

          {/* Footer Text */}
          <p className="text-center text-slate-400 text-sm mt-6">
            Secure authentication powered by token verification
          </p>
        </div>

        {/* Bottom accent */}
        <div className="mt-8 text-center text-slate-500 text-xs animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <p>Your data is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
}