import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sun,
  Moon,
  Bookmark,
  Scale,
  Bell,
  Search,
  Trash2,
  ShieldCheck,
  Zap,
  ChevronRight,
} from 'lucide-react';

export const AccountScreen: React.FC = () => {
  const {
    savedProductIds,
    compareProductIds,
    priceAlerts,
    activeTheme,
    toggleTheme,
    setActiveView,
    setSearchQuery,
  } = useApp();

  const [history, setHistory] = useState<string[]>([
    'ASUS ROG Strix G16',
    'MacBook Air M3 16GB',
    'Gaming laptop RTX 4060 under 140000',
    'Lenovo Legion 5 Pro Gen 8',
    'Sony WH-1000XM5 ANC',
  ]);

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleRunSearch = (query: string) => {
    setSearchQuery(query);
    setActiveView('search');
  };

  return (
    <div
      data-testid="account-screen"
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn"
    >
      {/* 1. User Profile Header */}
      <div
        data-testid="account-profile-header"
        className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6"
      >
        <div className="flex items-center gap-5">
          {/* Avatar with spectral gradient border */}
          <div className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-[#FFA03A] via-[#FF2A85] to-[#0066FF] shrink-0 shadow-lg">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-2xl">
              AK
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#00C853] border-2 border-white dark:border-slate-900 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2
                data-testid="account-user-name"
                className="text-2xl font-black text-slate-900 dark:text-white"
              >
                Aisha Khan
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#0066FF]/10 text-[#0066FF] text-[10px] font-extrabold uppercase tracking-wider">
                TITAN Member
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">aisha.khan@email.com</p>
            <p className="text-[11px] text-slate-500 mt-2 font-medium">
              Zero commercial bias preference enabled • Evidence certainty high
            </p>
          </div>
        </div>

        {/* Theme Preference Action */}
        <div className="flex sm:flex-col items-center sm:items-end gap-3">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Active Theme: {activeTheme === 'dark' ? 'Obsidian Dark' : 'Crisp Light'}
          </span>
          <button
            onClick={toggleTheme}
            data-testid="account-theme-btn"
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs hover:border-[#0066FF] transition-all cursor-pointer flex items-center gap-2"
          >
            {activeTheme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Crisp Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[#0066FF]" />
                <span>Obsidian Dark</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Activity Metrics Cards */}
      <div
        data-testid="account-metrics"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {/* Saved Items */}
        <div
          onClick={() => setActiveView('saved')}
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] shadow-sm hover:border-[#FF2A85]/50 transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Saved Items
            </span>
            <div
              data-testid="account-saved-count"
              className="text-3xl font-black text-slate-900 dark:text-white mt-1"
            >
              {savedProductIds.length}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-[#FF2A85] flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
        </div>

        {/* Comparisons */}
        <div
          onClick={() => setActiveView('compare')}
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] shadow-sm hover:border-[#0066FF]/50 transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              In Compare Tray
            </span>
            <div
              data-testid="account-compare-count"
              className="text-3xl font-black text-slate-900 dark:text-white mt-1"
            >
              {compareProductIds.length}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-[#0066FF] flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
        </div>

        {/* Price Alerts */}
        <div
          onClick={() => setActiveView('alerts')}
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] shadow-sm hover:border-amber-500/50 transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Alerts
            </span>
            <div
              data-testid="account-alerts-count"
              className="text-3xl font-black text-slate-900 dark:text-white mt-1"
            >
              {priceAlerts.length}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Search History & Activity Audit Trail */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent Search History
            </h3>
            <p className="text-xs text-slate-400">Past product discovery and filter sessions</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-xs font-bold text-red-500 hover:text-red-600 px-3 py-1.5 rounded-xl border border-red-500/20 hover:bg-red-500/10 cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            Search history is clear.
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Search className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                  <span className="font-semibold truncate text-slate-700 dark:text-slate-300">
                    {item}
                  </span>
                </div>
                <button
                  onClick={() => handleRunSearch(item)}
                  className="px-3 py-1 rounded-lg bg-[#0066FF]/10 text-[#0066FF] hover:bg-[#0066FF]/20 font-bold text-[11px] flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>Search</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Methodology & Transparency Info */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] space-y-3 shadow-sm text-xs">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#00C6FF]" />
          <span>TITAN Intelligence Engine Transparency</span>
        </h3>
        <p className="text-slate-500 leading-relaxed">
          The 8-dimension evaluation engine operates on strict deterministic mathematical weighting: Performance (20%), UX & Display (15%), Battery (15%), Thermals & Build (15%), Features (10%), Camera/Creator (10%), Software (5%), and Value (10%). All scores are invariant and independent of sponsored affiliate placement.
        </p>
      </div>
    </div>
  );
};
export default AccountScreen;
