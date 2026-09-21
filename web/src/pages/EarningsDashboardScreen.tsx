import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  DollarSign,
  TrendingUp,
  ExternalLink,
  Target,
  Sparkles,
  Zap,
  Flame,
  CheckCircle2,
  Copy,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import {
  AMAZON_AFFILIATE_TAG,
  getAffiliateClickTelemetry,
  AffiliateClickEvent,
  getAmazonAffiliateUrl,
} from '../utils/affiliate';

export const EarningsDashboardScreen: React.FC = () => {
  const { setActiveView } = useApp();
  const [clicks, setClicks] = useState<AffiliateClickEvent[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    setClicks(getAffiliateClickTelemetry());
  }, []);

  const totalProjectedInr = clicks.reduce((acc, c) => acc + c.estimatedCommissionInr, 0);
  const totalProjectedUsd = clicks.reduce((acc, c) => acc + c.estimatedCommissionUsd, 0);

  // Today's Goal: $10.00 USD (Approx ₹835 INR)
  const targetGoalUsd = 10.0;
  const progressPct = Math.min(100, Math.round((totalProjectedUsd / targetGoalUsd) * 100));

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(id);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div
      data-testid="earnings-dashboard-screen"
      className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-fadeIn"
    >
      {/* 1. Header & Live Telemetry Banner */}
      <div className="relative rounded-3xl p-6 sm:p-10 overflow-hidden bg-gradient-to-br from-slate-900 via-[#0B1528] to-[#040812] border border-slate-800 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-black tracking-wide text-emerald-300">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Commercial Earnings & Telemetry Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Live Monetization & Referral Ledger
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Real-time tracking of outbound commercial referral events, high-ticket commissions, and daily revenue
            goals. Powered by <span className="font-bold text-white">Amazon India Associates</span> (Store ID:{' '}
            <code className="text-emerald-400 font-mono bg-white/10 px-1.5 py-0.5 rounded">{AMAZON_AFFILIATE_TAG}</code>).
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> 24-Hour Cookie Attribution Active
            </span>
            <span className="flex items-center gap-1.5 text-blue-400">
              <Zap className="w-4 h-4" /> Up to 5% Category Electronics Commission
            </span>
          </div>
        </div>
      </div>

      {/* 2. Today's $10 Goal Progress Meter */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
              <Target className="w-4 h-4 text-[#0066FF]" />
              <span>Today's Revenue Goal ($10.00 USD / ₹835 INR)</span>
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                ${totalProjectedUsd.toFixed(2)}
              </span>
              <span className="text-sm text-slate-400 font-semibold">
                (₹{totalProjectedInr.toLocaleString('en-IN')} projected pipeline)
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              {progressPct >= 100 ? '🎉 Goal Surpassed!' : `${progressPct}% of Today's Goal`}
            </span>
            <p className="text-xs text-slate-400 mt-1">1 high-ticket laptop sale hits goal by 300%+</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#0066FF] via-[#00C853] to-[#FFA03A] transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(8, progressPct))}%` }}
          ></div>
        </div>
      </div>

      {/* 3. Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Referral Clicks</span>
            <ArrowUpRight className="w-4 h-4 text-[#0066FF]" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">{clicks.length}</div>
          <p className="text-xs text-slate-400 mt-1">Outbound clicks with verified tracking tag</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Commission Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">2.0% – 5.0%</div>
          <p className="text-xs text-slate-400 mt-1">Standard Amazon India electronics rate</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Commission / Sale</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">₹2,650 ($31.70)</div>
          <p className="text-xs text-slate-400 mt-1">On recommended gaming & creator laptops</p>
        </div>
      </div>

      {/* 4. Active Outbound Clicks Ledger */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Recent Referral Clicks & Attribution</h2>
            <p className="text-xs text-slate-400">Logged buyer events forwarding to partner retail stores</p>
          </div>
          <button
            onClick={() => setActiveView('best-laptops')}
            className="text-xs font-bold text-[#0066FF] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>View High-Ticket Guide</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3 font-bold">Product Name</th>
                <th className="pb-3 font-bold">Retailer</th>
                <th className="pb-3 font-bold">Market Price</th>
                <th className="pb-3 font-bold">Est. Commission (INR)</th>
                <th className="pb-3 font-bold">Est. Commission (USD)</th>
                <th className="pb-3 font-bold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {clicks.map((event) => (
                <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 font-bold text-slate-900 dark:text-white pr-4">{event.productName}</td>
                  <td className="py-3.5 text-slate-500">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-[10px]">
                      {event.retailer}
                    </span>
                  </td>
                  <td className="py-3.5 font-bold text-slate-700 dark:text-slate-300">
                    ₹{event.priceInInr.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 font-extrabold text-emerald-600 dark:text-emerald-400">
                    +₹{event.estimatedCommissionInr.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 font-extrabold text-emerald-600 dark:text-emerald-400">
                    +${event.estimatedCommissionUsd.toFixed(2)}
                  </td>
                  <td className="py-3.5 text-right text-slate-400">
                    <span className="flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. 1-Click High-Ticket Syndication & Sharing Cards */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Instant Sharing & Community Syndication</h2>
          <p className="text-xs text-slate-400">
            Copy pre-tagged affiliate links to share in WhatsApp groups, Reddit advice threads, or Twitter discussions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Lenovo Legion 5 Pro (RTX 4060)',
              tagline: 'Best coding & AAA gaming laptop under ₹1.4L',
              estComm: '₹2,800 ($33.50)',
              searchQuery: 'Lenovo Legion 5 Pro RTX 4060',
              id: 'share_legion',
            },
            {
              title: 'MacBook Air M3 (16GB)',
              tagline: 'All-day battery & silent software development',
              estComm: '₹2,300 ($27.50)',
              searchQuery: 'Apple MacBook Air M3 16GB',
              id: 'share_macbook',
            },
            {
              title: 'ASUS ROG Strix G16 (RTX 4070)',
              tagline: 'Competitive 240Hz esports & liquid metal cooling',
              estComm: '₹3,400 ($40.70)',
              searchQuery: 'ASUS ROG Strix G16 RTX 4070',
              id: 'share_strix',
            },
          ].map((item) => {
            const url = getAmazonAffiliateUrl(item.searchQuery);
            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                      Earn {item.estComm}
                    </span>
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{item.tagline}</p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => copyToClipboard(url, item.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:border-slate-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedUrl === item.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Affiliate Link</span>
                      </>
                    )}
                  </button>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#0066FF]/10 text-[#0066FF] hover:bg-[#0066FF]/20 transition-colors cursor-pointer"
                    title="Open on Amazon"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default EarningsDashboardScreen;
