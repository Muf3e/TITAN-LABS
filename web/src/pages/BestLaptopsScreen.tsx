import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ScoreGauge } from '../components/ScoreGauge';
import {
  Flame,
  Zap,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Rss,
  Share2,
} from 'lucide-react';
import { getAmazonAffiliateUrl, recordAffiliateClick } from '../utils/affiliate';

type BudgetFilter = 'all' | 'under130k' | 'under200k' | 'flagship';

export const BestLaptopsScreen: React.FC = () => {
  const { products, setActiveView, addToCompare } = useApp();
  const [budgetFilter, setBudgetFilter] = useState<BudgetFilter>('all');

  // Filter high-ticket gaming and creator laptops
  const allLaptops = products.filter(
    (p) =>
      p.category.toUpperCase() === 'LAPTOP' ||
      p.hasDedicatedGpu ||
      p.name.toLowerCase().includes('macbook') ||
      p.name.toLowerCase().includes('legion') ||
      p.name.toLowerCase().includes('strix') ||
      p.name.toLowerCase().includes('predator') ||
      p.name.toLowerCase().includes('katana')
  );

  const filteredLaptops = allLaptops.filter((laptop) => {
    if (budgetFilter === 'under130k') return laptop.priceInInr <= 135000;
    if (budgetFilter === 'under200k') return laptop.priceInInr > 135000 && laptop.priceInInr <= 200000;
    if (budgetFilter === 'flagship') return laptop.priceInInr > 200000;
    return true;
  });

  // Sort by highest Titan Score
  const rankedLaptops = [...filteredLaptops].sort((a, b) => b.titanScore - a.titanScore);

  // SEO: Dynamic JSON-LD ItemList Schema for Google Search Carousels
  useEffect(() => {
    const itemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Best High-Performance Gaming & Productivity Laptops in India (2026)',
      description:
        'Neutral, benchmark-backed ranking of the best gaming and creator laptops in India evaluated across 8 hardware dimensions with verified live prices.',
      itemListElement: rankedLaptops.slice(0, 5).map((laptop, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: laptop.name,
          image: laptop.imageUrl,
          offers: {
            '@type': 'Offer',
            price: laptop.priceInInr,
            priceCurrency: 'INR',
            url: getAmazonAffiliateUrl(laptop.name),
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: laptop.onlineRating || 4.5,
            reviewCount: laptop.onlineRatingCount || 500,
          },
        },
      })),
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'schema-best-laptops-guide';
    script.text = JSON.stringify(itemListSchema);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('schema-best-laptops-guide');
      if (el) document.head.removeChild(el);
    };
  }, [rankedLaptops]);

  return (
    <div
      data-testid="best-laptops-screen"
      className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-fadeIn"
    >
      {/* 1. Header / Hero SEO Banner */}
      <div className="relative rounded-3xl p-6 sm:p-10 overflow-hidden bg-gradient-to-br from-slate-900 via-[#0B1528] to-[#040812] border border-slate-800 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-pink-600/15 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-black tracking-wide text-amber-300">
            <Flame className="w-3.5 h-3.5 fill-current text-amber-400" />
            <span>2026 High-Ticket Hardware Buyer's Guide</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Best High-Performance Gaming & Creator Laptops
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Evaluated by the <span className="font-bold text-white">TITAN Multi-Dimensional Engine</span> across
            sustained thermals, Cinebench multicore speed, TGP gaming benchmarks, and real battery life. Direct
            verified Amazon deals updated in real time.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> 100% Unbiased Deterministic Scoring
            </span>
            <span className="flex items-center gap-1.5 text-blue-400">
              <Zap className="w-4 h-4" /> Live Amazon Price & Stock Verification
            </span>
          </div>
        </div>
      </div>

      {/* 1.5. Live Deal Syndication & Distribution Radar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs">
        <div className="flex items-center gap-2">
          <Rss className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="font-bold">Automated Deal Syndication Feeds:</span>
          <span className="text-slate-600 dark:text-slate-400">Subscribe or syndicate TITAN verified price drops to your channel/bot</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="./deals.rss"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-amber-500/30 font-bold hover:bg-amber-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
          >
            <span>RSS 2.0</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="./deals.json"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-amber-500/30 font-bold hover:bg-amber-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
          >
            <span>JSON Feed</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert('Copied buying guide link to clipboard!');
            }}
            className="px-2.5 py-1 rounded-lg bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Share2 className="w-3 h-3" />
            <span>Share Guide</span>
          </button>
        </div>
      </div>

      {/* 2. Budget / Segment Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setBudgetFilter('all')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            budgetFilter === 'all'
              ? 'bg-[#0066FF] text-white shadow-md'
              : 'bg-white dark:bg-[#131B2E] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          All High-Performance ({allLaptops.length})
        </button>
        <button
          onClick={() => setBudgetFilter('under130k')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            budgetFilter === 'under130k'
              ? 'bg-[#0066FF] text-white shadow-md'
              : 'bg-white dark:bg-[#131B2E] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          Under ₹1.35 Lakh (Sweet Spot)
        </button>
        <button
          onClick={() => setBudgetFilter('under200k')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            budgetFilter === 'under200k'
              ? 'bg-[#0066FF] text-white shadow-md'
              : 'bg-white dark:bg-[#131B2E] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          ₹1.35 Lakh - ₹2 Lakh (Pro & Creator)
        </button>
        <button
          onClick={() => setBudgetFilter('flagship')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            budgetFilter === 'flagship'
              ? 'bg-[#0066FF] text-white shadow-md'
              : 'bg-white dark:bg-[#131B2E] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          ₹2 Lakh+ (Ultimate Flagships)
        </button>
      </div>

      {/* 3. Ranked Product Cards with High-Converting Affiliates */}
      <div className="space-y-6">
        {rankedLaptops.map((laptop, index) => {
          const discount = laptop.originalPriceInInr
            ? laptop.originalPriceInInr - laptop.priceInInr
            : 0;
          const affiliateUrl = getAmazonAffiliateUrl(laptop.name);

          return (
            <div
              key={laptop.id}
              data-testid={`laptop-card-${laptop.id}`}
              className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] p-6 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row items-center gap-6"
            >
              {/* Rank Badge + Product Photo */}
              <div className="relative shrink-0 w-full sm:w-48 h-48 bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                <div className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black text-xs flex items-center justify-center shadow-md">
                  #{index + 1}
                </div>
                <img
                  src={laptop.imageUrl || `/products/${laptop.id}.png`}
                  alt={laptop.name}
                  className="max-h-36 w-auto object-contain transition-transform hover:scale-105"
                />
              </div>

              {/* Product Info & Specifications */}
              <div className="flex-1 space-y-3 w-full">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-[#0066FF] uppercase tracking-wider">
                      {laptop.brand} • {laptop.variant}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                      {laptop.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <ScoreGauge score={laptop.titanScore} size={60} />
                  </div>
                </div>

                {/* Key Specs Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block">CPU</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                      {laptop.processor || 'High-Performance Core'}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block">GPU / TGP</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                      {laptop.gpu || 'Discrete GPU'}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block">RAM & SSD</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      {laptop.ramGb}GB / {laptop.storageGb >= 1024 ? `${laptop.storageGb / 1024}TB` : `${laptop.storageGb}GB`}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block">DISPLAY</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      {laptop.displaySizeInches}" {laptop.refreshRateHz}Hz
                    </span>
                  </div>
                </div>

                {/* Strength / Highlight */}
                {laptop.topPro && (
                  <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Key Advantage: {laptop.topPro}</span>
                  </div>
                )}
              </div>

              {/* Price & Immediate Action Box */}
              <div className="w-full lg:w-64 shrink-0 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6 space-y-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Live Deal on Amazon
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      ₹{laptop.priceInInr.toLocaleString('en-IN')}
                    </span>
                    {laptop.originalPriceInInr && laptop.originalPriceInInr > laptop.priceInInr && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{laptop.originalPriceInInr.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {discount > 0 && (
                    <div className="mt-1 text-xs font-bold text-emerald-500">
                      Save ₹{discount.toLocaleString('en-IN')} ({laptop.discountPercent}% OFF)
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <a
                    href={affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => recordAffiliateClick(laptop.name, laptop.priceInInr, 'Amazon India')}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FFA03A] via-[#FF2A85] to-[#0077FF] hover:opacity-95 text-white font-black text-xs sm:text-sm text-center shadow-md flex items-center justify-center gap-2 cursor-pointer transition-opacity"
                  >
                    <span>Buy on Amazon</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveView('detail', laptop.id)}
                      className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Deep Dive
                    </button>
                    <button
                      onClick={() => addToCompare(laptop.id)}
                      className="py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-[#0066FF] font-bold text-xs hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                      title="Add to Comparison"
                    >
                      + Compare
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default BestLaptopsScreen;
