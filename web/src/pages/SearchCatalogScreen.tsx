import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ProductCategory } from '../types';
import {
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  ArrowUpDown,
  Laptop,
  Smartphone,
  Check,
  ShieldAlert,
  Zap,
} from 'lucide-react';

export const SearchCatalogScreen: React.FC = () => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    filterState,
    setFilterState,
    resetFilters,
  } = useApp();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available brands in the product catalog with counts
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      if (p.brand) {
        counts[p.brand] = (counts[p.brand] || 0) + 1;
      }
    }
    return counts;
  }, [products]);

  const allBrands = Object.keys(brandCounts).sort();

  // Handlers for deep filter state
  const handleCategoryChange = (category: 'ALL' | ProductCategory) => {
    setFilterState((prev) => ({ ...prev, category }));
  };

  const handleBrandToggle = (brand: string) => {
    setFilterState((prev) => {
      const current = prev.selectedBrands || [];
      const updated = current.includes(brand)
        ? current.filter((b) => b !== brand)
        : [...current, brand];
      return { ...prev, selectedBrands: updated };
    });
  };

  const handlePriceMinChange = (val: number) => {
    setFilterState((prev) => ({
      ...prev,
      minPrice: Math.max(0, val),
    }));
  };

  const handlePriceMaxChange = (val: number) => {
    setFilterState((prev) => ({
      ...prev,
      maxPrice: Math.min(300000, Math.max(prev.minPrice, val)),
    }));
  };

  const handleSortChange = (
    sortBy: 'TITAN_SCORE' | 'PRICE_ASC' | 'PRICE_DESC' | 'ONLINE_RATING' | 'VALUE'
  ) => {
    setFilterState((prev) => ({ ...prev, sortBy }));
  };

  const handleGpuToggle = () => {
    setFilterState((prev) => ({
      ...prev,
      requiresDedicatedGpu: !prev.requiresDedicatedGpu,
    }));
  };

  const handleInStockToggle = () => {
    setFilterState((prev) => ({
      ...prev,
      inStockOnly: !prev.inStockOnly,
    }));
  };

  const handleHardConstraintsToggle = () => {
    setFilterState((prev) => ({
      ...prev,
      hardConstraintsEnabled: !prev.hardConstraintsEnabled,
      // If toggled on, enforce 16GB RAM as default hard constraint threshold
      minRamGb: !prev.hardConstraintsEnabled ? 16 : 0,
    }));
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return products
      .filter((p) => {
        // 1. Search query matching
        if (q.length > 0) {
          const nameMatch = p.name.toLowerCase().includes(q);
          const brandMatch = p.brand.toLowerCase().includes(q);
          const processorMatch = p.processor.toLowerCase().includes(q);
          const variantMatch = p.variant.toLowerCase().includes(q);
          const gpuMatch = p.gpu ? p.gpu.toLowerCase().includes(q) : false;

          if (!nameMatch && !brandMatch && !processorMatch && !variantMatch && !gpuMatch) {
            return false;
          }
        }

        // 2. Category matching
        if (
          filterState.category !== 'ALL' &&
          p.category.toUpperCase() !== filterState.category.toUpperCase()
        ) {
          return false;
        }

        // 3. Price boundary
        if (p.priceInInr < filterState.minPrice || p.priceInInr > filterState.maxPrice) {
          return false;
        }

        // 4. Selected Brands
        if (
          filterState.selectedBrands &&
          filterState.selectedBrands.length > 0 &&
          !filterState.selectedBrands.includes(p.brand)
        ) {
          return false;
        }

        // 5. Dedicated GPU filter
        if (filterState.requiresDedicatedGpu && !p.hasDedicatedGpu) {
          return false;
        }

        // 6. In Stock Only filter
        if (filterState.inStockOnly) {
          const avail = String(p.availability).toUpperCase();
          const inStock = avail === 'IN_STOCK' || avail.includes('IN STOCK');
          if (!inStock) {
            return false;
          }
        }

        // 7. Hard Constraints (e.g. min 16GB RAM)
        if (filterState.hardConstraintsEnabled) {
          if (filterState.minRamGb > 0 && p.ramGb < filterState.minRamGb) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (filterState.sortBy) {
          case 'PRICE_ASC':
            return a.priceInInr - b.priceInInr;
          case 'PRICE_DESC':
            return b.priceInInr - a.priceInInr;
          case 'ONLINE_RATING':
            return b.onlineRating - a.onlineRating;
          case 'VALUE': {
            const valA = (a.titanScore / a.priceInInr) * 100000;
            const valB = (b.titanScore / b.priceInInr) * 100000;
            return valB - valA;
          }
          case 'TITAN_SCORE':
          default:
            return b.titanScore - a.titanScore;
        }
      });
  }, [products, searchQuery, filterState]);

  return (
    <div
      data-testid="search-screen"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
    >
      {/* Invisible test id anchor for e2e test harness */}
      <span className="sr-only" data-testid="search-catalog-screen">
        Catalog Screen
      </span>

      {/* Top Search & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Query input with clear button */}
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog by name, brand, processor, or specs..."
              data-testid="catalog-search-input"
              className="w-full py-3.5 pl-12 pr-10 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF] text-sm sm:text-base shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                data-testid="clear-search-btn"
                aria-label="Clear search input"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Actions / Mobile Filter Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen((v) => !v)}
              className="md:hidden flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] text-xs font-bold flex items-center justify-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#0066FF]" />
              <span>Filters ({filterState.selectedBrands.length + (filterState.requiresDedicatedGpu ? 1 : 0) + (filterState.inStockOnly ? 1 : 0)})</span>
            </button>

            {/* Sort Picker */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400 hidden sm:inline" />
              <select
                value={filterState.sortBy}
                onChange={(e) => handleSortChange(e.target.value as any)}
                data-testid="sort-select"
                aria-label="Sort products by"
                className="py-3 px-4 rounded-xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF] shadow-sm cursor-pointer"
              >
                <option value="TITAN_SCORE">TITAN Score (Highest First)</option>
                <option value="PRICE_ASC">Price: Low to High</option>
                <option value="PRICE_DESC">Price: High to Low</option>
                <option value="ONLINE_RATING">Online Customer Rating</option>
                <option value="VALUE">Best Value for Money</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Horizontal Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-slate-200 dark:border-slate-800/80 pb-4">
          {/* Category Chips with both testids */}
          <button
            onClick={() => handleCategoryChange('ALL')}
            data-testid="filter-category-all"
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterState.category === 'ALL'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-white bg-white dark:bg-[#131B2E]'
            }`}
          >
            <span className="sr-only" data-testid="filter-chip-all">
              All
            </span>
            All
          </button>

          <button
            onClick={() => handleCategoryChange('LAPTOP')}
            data-testid="filter-category-laptop"
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterState.category === 'LAPTOP'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-white bg-white dark:bg-[#131B2E]'
            }`}
          >
            <span className="sr-only" data-testid="filter-chip-laptops">
              Laptops
            </span>
            <Laptop className="w-3.5 h-3.5" />
            <span>Laptops</span>
          </button>

          <button
            onClick={() => handleCategoryChange('SMARTPHONE')}
            data-testid="filter-category-phone"
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterState.category === 'SMARTPHONE'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-white bg-white dark:bg-[#131B2E]'
            }`}
          >
            <span className="sr-only" data-testid="filter-chip-smartphones">
              Smartphones
            </span>
            <Smartphone className="w-3.5 h-3.5" />
            <span>Smartphones</span>
          </button>

          {/* Dedicated GPU Quick Toggle */}
          <button
            onClick={handleGpuToggle}
            data-testid="filter-chip-gpu"
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterState.requiresDedicatedGpu
                ? 'bg-[#00C6FF] text-slate-950 font-extrabold shadow-xs'
                : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-white bg-white dark:bg-[#131B2E]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Dedicated GPU</span>
          </button>

          {/* In-Stock Quick Toggle */}
          <button
            onClick={handleInStockToggle}
            data-testid="filter-chip-instock"
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterState.inStockOnly
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-white bg-white dark:bg-[#131B2E]'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>In Stock Only</span>
          </button>

          {/* Reset Filters Quick Button */}
          <button
            onClick={resetFilters}
            data-testid="filter-reset-btn"
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-500 hover:text-[#0066FF] dark:text-slate-400 dark:hover:text-[#00C6FF] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout: Deep Filter Sidebar + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Deep Filter Sidebar / Drawer */}
        <aside
          data-testid="filter-drawer"
          className={`${
            mobileFilterOpen ? 'block' : 'hidden md:block'
          } p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] space-y-6 shadow-sm sticky top-24`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-base brand-font flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#0066FF]" />
              <span>Deep Filters</span>
            </h3>
            <button
              onClick={resetFilters}
              data-testid="reset-filters-btn"
              className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Dual Price Range Inputs & Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-500 dark:text-slate-400">Budget Range</span>
              <span className="text-[#0066FF] font-mono">
                ₹{filterState.minPrice.toLocaleString('en-IN')} – ₹{filterState.maxPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Min Price (₹)</label>
                <input
                  type="range"
                  min="0"
                  max="300000"
                  step="5000"
                  value={filterState.minPrice}
                  onChange={(e) => handlePriceMinChange(Number(e.target.value))}
                  data-testid="price-slider-min"
                  aria-label="Minimum price filter"
                  className="w-full accent-[#0066FF] cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Max Price (₹)</label>
                <input
                  type="range"
                  min="0"
                  max="300000"
                  step="5000"
                  value={filterState.maxPrice}
                  onChange={(e) => handlePriceMaxChange(Number(e.target.value))}
                  data-testid="price-slider-max"
                  aria-label="Maximum price filter"
                  className="w-full accent-[#0066FF] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Brand Filter with Live Counts */}
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Brands
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {allBrands.map((brand) => {
                const isSelected = filterState.selectedBrands?.includes(brand);
                const count = brandCounts[brand] || 0;

                return (
                  <label
                    key={brand}
                    className="flex items-center justify-between text-xs cursor-pointer hover:text-[#0066FF] transition-colors select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleBrandToggle(brand)}
                        data-testid={`brand-checkbox-${brand.toLowerCase()}`}
                        className="w-4 h-4 rounded text-[#0066FF] focus:ring-[#0066FF] cursor-pointer"
                      />
                      <span className={isSelected ? 'font-bold text-[#0066FF]' : ''}>
                        {brand}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      ({count})
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Toggle Switches: GPU, In-Stock, Hard Constraints */}
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Hardware & Stock Rules
            </h4>

            {/* Dedicated GPU Switch */}
            <label className="flex items-center justify-between text-xs cursor-pointer select-none">
              <span className="font-medium">Dedicated GPU Only</span>
              <input
                type="checkbox"
                checked={filterState.requiresDedicatedGpu}
                onChange={handleGpuToggle}
                data-testid="gpu-filter-toggle"
                className="w-4 h-4 rounded text-[#00C6FF] focus:ring-[#00C6FF] cursor-pointer"
              />
            </label>

            {/* In-Stock Switch */}
            <label className="flex items-center justify-between text-xs cursor-pointer select-none">
              <span className="font-medium">In Stock Only</span>
              <input
                type="checkbox"
                checked={filterState.inStockOnly}
                onChange={handleInStockToggle}
                data-testid="in-stock-toggle"
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-600 cursor-pointer"
              />
            </label>

            {/* Hard Constraints Switch */}
            <label className="flex items-center justify-between text-xs cursor-pointer select-none">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-medium">Hard Constraints</span>
              </div>
              <input
                type="checkbox"
                checked={filterState.hardConstraintsEnabled}
                onChange={handleHardConstraintsToggle}
                data-testid="hard-constraints-toggle"
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
            </label>
            {filterState.hardConstraintsEnabled && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2 rounded-lg leading-tight">
                Hard constraints active: excluding devices under 16GB RAM.
              </p>
            )}
          </div>
        </aside>

        {/* Product Catalog Results Column */}
        <main className="md:col-span-3 space-y-4">
          {/* Results Summary Bar */}
          <div
            data-testid="results-summary-bar"
            className="flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400"
          >
            <span data-testid="results-count" className="font-bold text-slate-900 dark:text-white">
              {filteredProducts.length} results
            </span>
            <span>
              Sorted by:{' '}
              <strong className="text-slate-900 dark:text-white">
                {filterState.sortBy === 'TITAN_SCORE'
                  ? 'TITAN Score'
                  : filterState.sortBy === 'PRICE_ASC'
                  ? 'Price Low to High'
                  : filterState.sortBy === 'PRICE_DESC'
                  ? 'Price High to Low'
                  : filterState.sortBy === 'ONLINE_RATING'
                  ? 'Customer Rating'
                  : 'Best Value'}
              </strong>
            </span>
          </div>

          {/* Empty Search State */}
          {filteredProducts.length === 0 ? (
            <div
              data-testid="empty-search-state"
              className="p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] space-y-4 shadow-sm"
            >
              {/* Secondary testid hook for e2e test harness */}
              <span className="sr-only" data-testid="catalog-empty-state">
                Empty Catalog
              </span>
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No products found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                No devices match your search query and deep filtering rules. Try clearing query or resetting filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  resetFilters();
                }}
                data-testid="empty-reset-btn"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C6FF] to-[#0066FF] text-white font-bold text-xs shadow-md hover:opacity-90 transition-opacity cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Product List Grid */
            <div
              data-testid="product-grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Secondary testid hook for e2e test harness */}
              <span className="sr-only" data-testid="product-cards-grid">
                Product Grid
              </span>

              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default SearchCatalogScreen;
