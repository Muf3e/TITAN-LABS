import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ProductCategory } from '../types';
import {
  Search,
  X,
  Laptop,
  Smartphone,
  Tablet,
  Headphones,
  Sparkles,
  TrendingDown,
  Bell,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    setFilterState,
    setActiveView,
  } = useApp();

  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Ryzen 7 laptop under 80000',
    'Snapdragon 8 Gen 3',
    'best camera phone under 30000',
  ]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0 && !recentSearches.includes(searchQuery.trim())) {
      setRecentSearches((prev) => [searchQuery.trim(), ...prev.slice(0, 4)]);
    }
    setActiveView('search');
  };

  const handleCategorySelect = (category: string) => {
    if (category === 'ALL') {
      setFilterState((prev) => ({ ...prev, category: 'ALL' }));
    } else if (category === 'LAPTOP') {
      setFilterState((prev) => ({ ...prev, category: 'LAPTOP' as ProductCategory }));
    } else if (category === 'SMARTPHONE') {
      setFilterState((prev) => ({ ...prev, category: 'SMARTPHONE' as ProductCategory }));
    } else {
      setFilterState((prev) => ({ ...prev, category: 'ALL' }));
    }
    setActiveView('search');
  };

  const handlePopularTermClick = (term: string) => {
    setSearchQuery(term);
    if (!recentSearches.includes(term)) {
      setRecentSearches((prev) => [term, ...prev.slice(0, 4)]);
    }
    setActiveView('search');
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Top deals: products sorted by discount or highest TITAN scores
  const topDeals = [...products]
    .filter((p) => (p.discountPercent || 0) > 0)
    .sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0))
    .slice(0, 3);

  // Recommendations: products with high TITAN scores
  const featuredRecommendations = [...products]
    .sort((a, b) => b.titanScore - a.titanScore)
    .slice(0, 3);

  return (
    <div
      data-testid="home-screen"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10"
    >
      {/* Hero Greeting & Value Proposition */}
      <div className="space-y-2 text-left">
        <h1
          data-testid="home-greeting"
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight brand-font text-slate-900 dark:text-white"
        >
          Hello!
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl">
          What are you looking for today? Discover verified hardware truth with deterministic scores and multi-retailer live prices.
        </p>
      </div>

      {/* Real-time Instant Search Bar Form */}
      <form
        onSubmit={handleSearchSubmit}
        data-testid="home-search-form"
        className="relative max-w-3xl"
      >
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-[#0066FF] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for laptops, phones, tablets..."
            data-testid="home-search-input"
            className="w-full py-4 pl-12 pr-28 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF] text-sm sm:text-base shadow-sm hover:border-[#0066FF]/40 transition-all"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              data-testid="home-clear-search-btn"
              aria-label="Clear search input"
              className="absolute right-24 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className="absolute right-3 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00C6FF] to-[#0066FF] hover:from-[#00B4E6] hover:to-[#0055D4] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            Search
          </button>
        </div>
      </form>

      {/* Category Shortcuts Row */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Browse Categories
        </h3>
        <div
          data-testid="category-pills"
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-none"
        >
          {/* Also hook category-shortcuts-row testid for e2e test harness */}
          <div
            data-testid="category-shortcuts-row"
            className="contents"
          >
            {/* All Category Pill */}
            <button
              onClick={() => handleCategorySelect('ALL')}
              data-testid="cat-all"
              className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] hover:border-[#0066FF] text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#0066FF]" />
              <span>All Products</span>
            </button>

            {/* Laptops Pill */}
            <button
              onClick={() => handleCategorySelect('LAPTOP')}
              data-testid="cat-laptops"
              id="cat-laptops"
              className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] hover:border-[#0066FF] text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer group"
            >
              {/* Secondary testid hook for e2e harness */}
              <span className="sr-only" data-testid="category-shortcut-laptops">
                Laptops
              </span>
              <div className="w-6 h-6 rounded-lg bg-[#0066FF]/10 text-[#0066FF] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Laptop className="w-3.5 h-3.5" />
              </div>
              <span>Laptops</span>
            </button>

            {/* Smartphones Pill */}
            <button
              onClick={() => handleCategorySelect('SMARTPHONE')}
              data-testid="cat-mobiles"
              id="cat-mobiles"
              className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] hover:border-[#FF2A85] text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer group"
            >
              {/* Secondary testid hook for e2e harness */}
              <span className="sr-only" data-testid="category-shortcut-mobiles">
                Mobiles
              </span>
              <div className="w-6 h-6 rounded-lg bg-[#FF2A85]/10 text-[#FF2A85] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Smartphone className="w-3.5 h-3.5" />
              </div>
              <span>Smartphones</span>
            </button>

            {/* Tablets Pill */}
            <button
              onClick={() => handleCategorySelect('ALL')}
              data-testid="cat-tablets"
              className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] hover:border-[#00C6FF] text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-lg bg-[#00C6FF]/10 text-[#00C6FF] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Tablet className="w-3.5 h-3.5" />
              </div>
              <span>Tablets</span>
            </button>

            {/* Accessories Pill */}
            <button
              onClick={() => handleCategorySelect('ALL')}
              data-testid="cat-accessories"
              className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] hover:border-[#7B2CBF] text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-lg bg-[#7B2CBF]/10 text-[#7B2CBF] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Headphones className="w-3.5 h-3.5" />
              </div>
              <span>Accessories</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Promo Banner with Vibrant Rainbow Mesh Styling */}
      <div
        data-testid="home-promo-banner"
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        {/* Ambient Gradient Glow Blobs */}
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-[#00C6FF]/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-[#FF2A85]/20 blur-3xl pointer-events-none" />

        <div className="relative space-y-2 z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-white border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00C6FF]" />
            <span>Deterministic Product Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black brand-font tracking-tight leading-tight">
            Smarter Tech, Happier You
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Deterministic benchmarks & multi-retailer live prices with 100% verified hardware truth and zero commercial bias.
          </p>
        </div>

        <button
          onClick={() => setActiveView('search')}
          data-testid="promo-explore-btn"
          className="relative z-10 px-6 py-3 rounded-xl bg-white text-blue-900 font-extrabold text-xs sm:text-sm shadow-lg hover:bg-blue-50 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Popular & Recent Searches Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Popular Searches */}
        <div
          data-testid="popular-searches-section"
          className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] space-y-3 shadow-xs"
        >
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Popular Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'RTX 4060 Laptop', testId: 'popular-term-rtx-4060-laptop' },
              { label: 'Snapdragon 8 Gen 3', testId: 'popular-term-snapdragon-8-gen-3' },
              { label: 'iPhone 15', testId: 'popular-term-iphone-15' },
              { label: 'MacBook Pro', testId: 'popular-term-macbook-pro' },
            ].map((item) => (
              <button
                key={item.label}
                data-testid={item.testId}
                onClick={() => handlePopularTermClick(item.label)}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-[#0066FF]/15 hover:border-[#0066FF]/40 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Searches */}
        <div
          data-testid="recent-searches"
          className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] space-y-3 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Recent Searches</span>
            </h3>
            {recentSearches.length > 0 && (
              <button
                onClick={clearRecentSearches}
                className="text-xs text-[#0066FF] hover:underline font-semibold"
              >
                Clear History
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {recentSearches.length === 0 ? (
              <p className="text-xs text-slate-400">No recent searches yet.</p>
            ) : (
              recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handlePopularTermClick(term)}
                  className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{term}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Deals Section Carousel */}
      <section data-testid="top-deals-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFA03A]/10 text-[#FFA03A] flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold brand-font text-slate-900 dark:text-white">
                Top Hardware Deals
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Highest live discounts verified across official retailers
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveView('search')}
            className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1"
          >
            <span>View All Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topDeals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Price Alert Teaser Card */}
      <div
        data-testid="price-alert-teaser"
        className="p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-pink-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#FFA03A] to-[#FF2A85] text-white flex items-center justify-center shrink-0 shadow-md">
            <Bell className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-lg brand-font text-slate-900 dark:text-white">
              Never Miss a Price Drop
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg">
              Set target price alerts for laptops and smartphones. Receive real-time simulated notifications the moment live retailer offers cross your threshold.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('alerts')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFA03A] to-[#FF2A85] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
        >
          <span>Manage Price Alerts</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Featured Recommendations Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00C6FF]/10 text-[#00C6FF] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold brand-font text-slate-900 dark:text-white">
                Featured Product Intelligence
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pinnacle devices achieving exceptional TITAN scores
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveView('search')}
            className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1"
          >
            <span>Browse All ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRecommendations.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
export default HomeScreen;
