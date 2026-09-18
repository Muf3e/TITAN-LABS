import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Cpu, BarChart2, Layers } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, activeTheme } = useApp();
  const logoSrc = activeTheme === 'light' ? '/logo-light.png' : '/logo-dark.png';

  return (
    <footer
      data-testid="app-footer"
      className="w-full mt-auto border-t border-[#334155]/40 bg-[#0B0F19] text-[#94A3B8] dark:border-[#334155]/40 dark:bg-[#0B0F19] dark:text-[#94A3B8] light:border-[#E2E8F0] light:bg-white light:text-[#64748B] transition-colors duration-200"
    >
      {/* 5-Stop Signature Rainbow Gradient Accent Bar */}
      <div
        data-testid="rainbow-accent-bar"
        className="h-1.5 w-full bg-gradient-to-r from-[#FFA03A] via-[#FF2A85] via-[#7B2CBF] via-[#00C6FF] to-[#0066FF]"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src={logoSrc}
                alt="TITAN LABS"
                className="w-9 h-9 object-contain"
              />
              <span className="font-extrabold text-lg brand-font text-white dark:text-white light:text-[#0F172A]">
                TITAN LABS
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              <span className="font-semibold text-white dark:text-white light:text-[#0F172A] block mb-1">
                Unbiased Hardware Truth
              </span>
              Deterministic 8-dimension mathematical evaluations, verified multi-retailer live prices, and transparent specifications for laptops and smartphones.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-[#00C6FF] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#00C853]" />
              <span>100% Zero-Sponsor Evaluations</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-white dark:text-white light:text-[#0F172A] mb-3">
              Product Intelligence
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveView('home')}
                  className="hover:text-white transition-colors"
                >
                  Discovery Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('search')}
                  className="hover:text-white transition-colors"
                >
                  All Verified Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('compare')}
                  className="hover:text-white transition-colors"
                >
                  Side-by-Side Comparison
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('alerts')}
                  className="hover:text-white transition-colors"
                >
                  Price Drop Watchlist
                </button>
              </li>
            </ul>
          </div>

          {/* Methodology & Dimensions */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-white dark:text-white light:text-[#0F172A] mb-3">
              8-Dimension Engine
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#00C6FF]" />
                <span>Performance (20%)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#7B2CBF]" />
                <span>UX & Display (15%)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-[#FF2A85]" />
                <span>Battery & Thermals (30%)</span>
              </li>
              <li className="text-[11px] text-slate-500 pt-1">
                Mathematical formula: Σ(s · w · c) / Σ(w · c)
              </li>
            </ul>
          </div>

          {/* Retailer Independence Disclaimer */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-white dark:text-white light:text-[#0F172A] mb-3">
              Transparency Mandate
            </h4>
            <p className="text-xs leading-relaxed text-slate-400">
              TITAN Labs does not accept paid rankings, review units, or promotional score inflation. All street prices from Amazon, Flipkart, and Croma are tracked independently.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-700/40 text-[11px] text-slate-500">
              <span>Smarter Choices, Brighter Tomorrow</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} TITAN Labs Product Intelligence. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Deterministic Scoring v2.0</span>
            <span>Privacy & Integrity Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
