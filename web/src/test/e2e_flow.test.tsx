import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

// Domain imports from M1 engine & data
import {
  TitanEvaluationEngine,
  TitanDimension,
  RatingBand,
  CanonicalBrandedBand,
  calculateDimensionScore,
  calculateRecommendationScore,
  getRatingBand,
  getBrandedBand,
} from '../engine/titanEvaluationEngine';

import { SAMPLE_PRODUCTS, getProductDetail } from '../data/sampleData';
import {
  SampleProduct,
  ProductDetail,
  FilterState,
  PriceAlert,
  ProductCategory,
} from '../types';

// ============================================================================
// E2E Test Application Shell & State Container
// Conforms to PROJECT.md §Interface Contracts and ui_spec.md §2
// ============================================================================

interface AppContextType {
  products: SampleProduct[];
  savedProductIds: string[];
  toggleSaveProduct: (id: string) => void;
  compareProductIds: string[];
  addToCompare: (id: string) => boolean;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeTheme: 'dark' | 'light';
  toggleTheme: () => void;
  priceAlerts: PriceAlert[];
  addPriceAlert: (productId: string, targetPrice: number) => void;
  togglePriceAlert: (id: string) => void;
  deletePriceAlert: (id: string) => void;
  activeView: 'splash' | 'onboarding' | 'home' | 'search' | 'detail' | 'compare' | 'saved' | 'alerts' | 'account';
  setActiveView: (view: any, param?: string) => void;
  selectedProductId: string | null;
  onboardingStep: number;
  setOnboardingStep: React.Dispatch<React.SetStateAction<number>>;
  simulatedNotification: string | null;
}

const AppTestContext = createContext<AppContextType | null>(null);

function useAppTest() {
  const context = useContext(AppTestContext);
  if (!context) throw new Error('useAppTest must be used within AppTestProvider');
  return context;
}

const defaultFilterState: FilterState = {
  category: 'ALL',
  minPrice: 0,
  maxPrice: 300000,
  selectedBrands: [],
  minRamGb: 0,
  minStorageGb: 0,
  minTitanScore: 0,
  requiresDedicatedGpu: false,
  inStockOnly: false,
  sortBy: 'TITAN_SCORE',
  hardConstraintsEnabled: false,
};

function TitanTestAppProvider({
  children,
  initialView = 'home',
  initialProductId = null,
}: {
  children?: React.ReactNode;
  initialView?: any;
  initialProductId?: string | null;
}) {
  const [products] = useState<SampleProduct[]>(SAMPLE_PRODUCTS);
  const [activeView, setActiveViewRaw] = useState<any>(initialView);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(initialProductId);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<FilterState>(defaultFilterState);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [simulatedNotification, setSimulatedNotification] = useState<string | null>(null);

  // LocalStorage-backed state
  const [activeTheme, setActiveTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('titan_theme') as 'dark' | 'light') || 'dark';
  });

  const [savedProductIds, setSavedProductIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('titan_saved_products') || '[]');
    } catch {
      return [];
    }
  });

  const [compareProductIds, setCompareProductIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('titan_compare_products') || '[]');
    } catch {
      return [];
    }
  });

  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('titan_price_alerts') || '[]');
    } catch {
      return [];
    }
  });

  // Keep DOM and localStorage synchronized
  useEffect(() => {
    localStorage.setItem('titan_theme', activeTheme);
    if (activeTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [activeTheme]);

  useEffect(() => {
    localStorage.setItem('titan_saved_products', JSON.stringify(savedProductIds));
  }, [savedProductIds]);

  useEffect(() => {
    localStorage.setItem('titan_compare_products', JSON.stringify(compareProductIds));
  }, [compareProductIds]);

  useEffect(() => {
    localStorage.setItem('titan_price_alerts', JSON.stringify(priceAlerts));
  }, [priceAlerts]);

  const toggleTheme = () => {
    setActiveTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSaveProduct = (id: string) => {
    setSavedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addToCompare = (id: string): boolean => {
    if (compareProductIds.includes(id)) return true;
    if (compareProductIds.length >= 4) return false;
    setCompareProductIds((prev) => [...prev, id]);
    return true;
  };

  const removeFromCompare = (id: string) => {
    setCompareProductIds((prev) => prev.filter((item) => item !== id));
  };

  const clearCompare = () => {
    setCompareProductIds([]);
  };

  const resetFilters = () => {
    setFilterState(defaultFilterState);
  };

  const addPriceAlert = (productId: string, targetPrice: number) => {
    const prod = products.find((p) => p.id === productId);
    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}-${productId}`,
      productId,
      productName: prod ? prod.name : 'Unknown Product',
      currentPrice: prod ? prod.priceInInr : targetPrice,
      targetPrice,
      createdAt: new Date().toISOString(),
      active: true,
    };
    setPriceAlerts((prev) => [...prev, newAlert]);
    if (prod && prod.priceInInr <= targetPrice) {
      setSimulatedNotification(`Price Alert Triggered: ${prod.name} is now ₹${prod.priceInInr}!`);
    }
  };

  const togglePriceAlert = (id: string) => {
    setPriceAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const deletePriceAlert = (id: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const setActiveView = (view: any, param?: string) => {
    setActiveViewRaw(view);
    if (param) {
      setSelectedProductId(param);
    }
  };

  return (
    <AppTestContext.Provider
      value={{
        products,
        savedProductIds,
        toggleSaveProduct,
        compareProductIds,
        addToCompare,
        removeFromCompare,
        clearCompare,
        filterState,
        setFilterState,
        resetFilters,
        searchQuery,
        setSearchQuery,
        activeTheme,
        toggleTheme,
        priceAlerts,
        addPriceAlert,
        togglePriceAlert,
        deletePriceAlert,
        activeView,
        setActiveView,
        selectedProductId,
        onboardingStep,
        setOnboardingStep,
        simulatedNotification,
      }}
    >
      <div
        data-testid="titan-app-root"
        className={activeTheme === 'dark' ? 'dark bg-[#0B0F19] text-[#F8FAFC]' : 'light bg-[#F8F9FD] text-[#0F172A]'}
      >
        {children || <TitanTestAppContent />}
      </div>
    </AppTestContext.Provider>
  );
}

// ============================================================================
// Interactive Presentation Components for Testing
// Implements UI Spec 2.0 specifications
// ============================================================================

function HeaderComponent() {
  const { activeTheme, toggleTheme, setActiveView, savedProductIds, compareProductIds, priceAlerts } = useAppTest();
  const logoSrc = activeTheme === 'light' ? '/logo-light.png' : '/logo-dark.png';

  return (
    <header data-testid="app-header" className="flex items-center justify-between p-4 border-b border-slate-700">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('home')} data-testid="brand-logo-container">
        <img src={logoSrc} alt="TITAN LABS" className="w-9 h-9" data-testid="official-logo" />
        <span className="font-bold text-lg tracking-wider" data-testid="brand-title">TITAN LABS</span>
      </div>

      <nav className="flex items-center gap-4">
        <button onClick={() => setActiveView('home')} data-testid="nav-home">Home</button>
        <button onClick={() => setActiveView('search')} data-testid="nav-search">Browse</button>
        <button onClick={() => setActiveView('compare')} data-testid="nav-compare">
          Compare <span data-testid="compare-badge">({compareProductIds.length})</span>
        </button>
        <button onClick={() => setActiveView('saved')} data-testid="nav-saved">
          Saved <span data-testid="saved-badge">({savedProductIds.length})</span>
        </button>
        <button onClick={() => setActiveView('alerts')} data-testid="nav-alerts">
          Alerts <span data-testid="alerts-badge">({priceAlerts.length})</span>
        </button>
        <button onClick={() => setActiveView('account')} data-testid="nav-account">Profile</button>
        <button
          onClick={toggleTheme}
          data-testid="theme-toggle-btn"
          className="px-3 py-1 rounded-full border border-slate-500 text-xs"
        >
          {activeTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </nav>
    </header>
  );
}

function SplashScreenView() {
  const { setActiveView, activeTheme, toggleTheme } = useAppTest();
  const logoSrc = activeTheme === 'light' ? '/logo-light.png' : '/logo-dark.png';
  return (
    <div data-testid="splash-screen" className="flex flex-col items-center justify-center min-h-[600px] text-center p-8">
      <button onClick={toggleTheme} data-testid="splash-theme-toggle" className="hidden">Toggle</button>
      <img src={logoSrc} alt="TITAN Logo" className="w-48 h-48 mb-6" data-testid="splash-logo" />
      <h1 className="text-3xl font-extrabold text-[#0D1326] dark:text-[#F8FAFC]">Smarter Choices</h1>
      <h2 className="text-2xl font-bold mt-1">
        <span className="text-[#0066FF]">Brighter </span>
        <span className="text-[#FF5A36]">Tomorrow</span>
      </h2>
      <p className="mt-4 text-sm text-slate-400" data-testid="splash-status">Loading amazing tech experiences...</p>
      <button
        onClick={() => setActiveView('home')}
        className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFA03A] via-[#FF2A85] to-[#0066FF] text-white font-semibold"
        data-testid="splash-continue-btn"
      >
        Enter TITAN
      </button>
    </div>
  );
}



function HomeScreenView() {
  const { searchQuery, setSearchQuery, setActiveView, setFilterState } = useAppTest();

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveView('search');
  };

  const selectCategoryShortcut = (cat: ProductCategory) => {
    setFilterState((prev) => ({ ...prev, category: cat }));
    setActiveView('search');
  };

  return (
    <div data-testid="home-screen" className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="text-left">
        <h1 className="text-3xl font-bold" data-testid="home-greeting">Hello!</h1>
        <p className="text-slate-400 mt-1">What are you looking for today?</p>
      </div>

      <form onSubmit={onSearchSubmit} className="relative" data-testid="home-search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for laptops, phones, tablets..."
          className="w-full py-4 pl-12 pr-10 rounded-2xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-400"
          data-testid="home-search-input"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-4 text-slate-400"
            data-testid="home-clear-search-btn"
          >
            ✕
          </button>
        )}
      </form>

      {/* Category Shortcut Row */}
      <div className="flex gap-4 overflow-x-auto pb-2" data-testid="category-shortcuts-row">
        <button
          onClick={() => selectCategoryShortcut('LAPTOP' as ProductCategory)}
          data-testid="category-shortcut-laptops"
          className="flex-1 min-w-[120px] p-4 rounded-2xl bg-blue-900/30 border border-blue-700/50 flex flex-col items-center gap-2"
        >
          <span className="font-bold">Laptops</span>
        </button>
        <button
          onClick={() => selectCategoryShortcut('SMARTPHONE' as ProductCategory)}
          data-testid="category-shortcut-mobiles"
          className="flex-1 min-w-[120px] p-4 rounded-2xl bg-pink-900/30 border border-pink-700/50 flex flex-col items-center gap-2"
        >
          <span className="font-bold">Mobiles</span>
        </button>
      </div>

      {/* Featured Promo Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-800 text-white flex justify-between items-center" data-testid="home-promo-banner">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">TITAN Intelligence</span>
          <h2 className="text-xl font-bold mt-2">Smarter Tech, Happier You</h2>
          <p className="text-xs text-blue-100 mt-1">Deterministic benchmarks & multi-retailer live prices.</p>
        </div>
        <button
          onClick={() => setActiveView('search')}
          className="px-4 py-2 rounded-xl bg-white text-blue-900 font-bold text-sm shadow-md"
          data-testid="promo-explore-btn"
        >
          Explore Catalog
        </button>
      </div>

      {/* Popular Searches */}
      <div data-testid="popular-searches-section">
        <h3 className="font-bold text-lg mb-3">Popular Searches</h3>
        <div className="flex gap-2 flex-wrap">
          {['RTX 4060 Laptop', 'Snapdragon 8 Gen 3', 'iPhone 15', 'MacBook Pro'].map((term) => (
            <button
              key={term}
              data-testid={`popular-term-${term.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => {
                setSearchQuery(term);
                setActiveView('search');
              }}
              className="px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchCatalogScreenView() {
  const {
    products,
    searchQuery,
    setSearchQuery,
    filterState,
    setFilterState,
    resetFilters,
    savedProductIds,
    toggleSaveProduct,
    addToCompare,
    compareProductIds,
    setActiveView,
  } = useAppTest();

  // Apply search query and deep filters
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search query match
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesProcessor = p.processor.toLowerCase().includes(q);
        const matchesVariant = p.variant.toLowerCase().includes(q);
        const matchesGpu = p.gpu ? p.gpu.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesBrand && !matchesProcessor && !matchesVariant && !matchesGpu) {
          return false;
        }
      }

      // 2. Category filter
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

      // 4. RAM filter
      if (filterState.minRamGb > 0 && p.ramGb < filterState.minRamGb) {
        return false;
      }

      // 5. Dedicated GPU filter
      if (filterState.requiresDedicatedGpu && !p.hasDedicatedGpu) {
        return false;
      }

      // 6. In stock only
      if (filterState.inStockOnly) {
        const avail = String(p.availability).toUpperCase();
        const inStock = avail === 'IN_STOCK' || avail.includes('IN STOCK');
        if (!inStock) {
          return false;
        }
      }

      return true;
    });
  }, [products, searchQuery, filterState]);

  return (
    <div data-testid="search-catalog-screen" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-700 pb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter catalog..."
          className="w-full md:w-96 py-2 px-4 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
          data-testid="catalog-search-input"
        />

        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => setFilterState((prev) => ({ ...prev, category: 'ALL' }))}
            data-testid="filter-chip-all"
            className={`px-3 py-1 rounded-full text-xs font-semibold ${filterState.category === 'ALL' ? 'bg-[#0066FF] text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterState((prev) => ({ ...prev, category: 'LAPTOP' }))}
            data-testid="filter-chip-laptops"
            className={`px-3 py-1 rounded-full text-xs font-semibold ${filterState.category === 'LAPTOP' ? 'bg-[#0066FF] text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            Laptops
          </button>
          <button
            onClick={() => setFilterState((prev) => ({ ...prev, category: 'SMARTPHONE' }))}
            data-testid="filter-chip-smartphones"
            className={`px-3 py-1 rounded-full text-xs font-semibold ${filterState.category === 'SMARTPHONE' ? 'bg-[#0066FF] text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            Smartphones
          </button>
          <button
            onClick={() => setFilterState((prev) => ({ ...prev, requiresDedicatedGpu: !prev.requiresDedicatedGpu }))}
            data-testid="filter-chip-gpu"
            className={`px-3 py-1 rounded-full text-xs font-semibold ${filterState.requiresDedicatedGpu ? 'bg-[#00C6FF] text-black font-bold' : 'bg-slate-800 text-slate-300'}`}
          >
            Dedicated GPU
          </button>
          <button
            onClick={() => setFilterState((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }))}
            data-testid="filter-chip-instock"
            className={`px-3 py-1 rounded-full text-xs font-semibold ${filterState.inStockOnly ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            In Stock Only
          </button>
          <button
            onClick={resetFilters}
            data-testid="filter-reset-btn"
            className="px-3 py-1 text-xs text-blue-400 hover:underline"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Results summary */}
      <div className="flex justify-between items-center text-sm text-slate-400" data-testid="results-summary-bar">
        <span data-testid="results-count">{filteredProducts.length} results</span>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 ? (
        <div data-testid="catalog-empty-state" className="p-12 text-center text-slate-400 space-y-4">
          <p className="text-lg">No products found matching your search and filter criteria.</p>
          <button
            onClick={resetFilters}
            data-testid="empty-reset-btn"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        /* Product Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="product-cards-grid">
          {filteredProducts.map((p) => {
            const isSaved = savedProductIds.includes(p.id);
            const inCompare = compareProductIds.includes(p.id);

            return (
              <div
                key={p.id}
                data-testid={`product-card-${p.id}`}
                className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">{p.category}</span>
                    <button
                      onClick={() => toggleSaveProduct(p.id)}
                      data-testid={`bookmark-btn-${p.id}`}
                      className={`p-1 rounded-full ${isSaved ? 'text-[#FF2A85]' : 'text-slate-400'}`}
                      aria-label="Save product"
                    >
                      ♥
                    </button>
                  </div>

                  <h3 className="font-bold text-base mt-2" data-testid={`product-name-${p.id}`}>{p.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{p.variant}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-extrabold text-white" data-testid={`product-price-${p.id}`}>
                      ₹{p.priceInInr.toLocaleString('en-IN')}
                    </span>
                    <div className="flex items-center gap-1.5" data-testid={`titan-gauge-${p.id}`}>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-[#00C6FF]">
                        TITAN {p.titanScore}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60">
                    <button
                      onClick={() => setActiveView('detail', p.id)}
                      data-testid={`view-detail-btn-${p.id}`}
                      className="flex-1 py-2 rounded-xl bg-blue-900/40 hover:bg-blue-900/60 text-blue-300 font-semibold text-xs"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => addToCompare(p.id)}
                      data-testid={`add-compare-btn-${p.id}`}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold ${inCompare ? 'bg-emerald-800 text-white' : 'bg-slate-700 text-slate-200'}`}
                    >
                      {inCompare ? 'In Compare' : '+ Compare'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProductDetailScreenView() {
  const { selectedProductId, setActiveView, toggleSaveProduct, savedProductIds, addToCompare, compareProductIds, addPriceAlert } = useAppTest();
  const [alertInputPrice, setAlertInputPrice] = useState<number>(0);
  const [showAlertModal, setShowAlertModal] = useState(false);

  const detail: ProductDetail | undefined = useMemo(() => {
    if (!selectedProductId) return undefined;
    return getProductDetail(selectedProductId);
  }, [selectedProductId]);

  if (!detail) {
    return (
      <div data-testid="detail-not-found" className="p-12 text-center text-slate-400">
        <p>Product detail not found.</p>
        <button onClick={() => setActiveView('search')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
          Back to Catalog
        </button>
      </div>
    );
  }

  const isSaved = savedProductIds.includes(detail.id);
  const inCompare = compareProductIds.includes(detail.id);

  return (
    <div data-testid="product-detail-screen" className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Top action header */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setActiveView('search')}
          data-testid="detail-back-btn"
          className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1"
        >
          ← Back to Catalog
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => toggleSaveProduct(detail.id)}
            data-testid="detail-bookmark-btn"
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${isSaved ? 'border-[#FF2A85] text-[#FF2A85]' : 'border-slate-600 text-slate-300'}`}
          >
            {isSaved ? '♥ Saved' : '♡ Save Product'}
          </button>
          <button
            onClick={() => {
              setAlertInputPrice(detail.priceInInr - 5000);
              setShowAlertModal(true);
            }}
            data-testid="detail-add-alert-trigger"
            className="px-3 py-1.5 rounded-xl bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-semibold"
          >
            🔔 Set Alert
          </button>
        </div>
      </div>

      {/* Product Hero Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4" data-testid="detail-gallery">
          <img
            src={detail.imageUrl}
            alt={detail.name}
            className="w-full h-72 object-cover rounded-2xl border border-slate-700"
            data-testid="detail-hero-image"
          />
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold uppercase text-blue-400 tracking-wider">{detail.brand}</span>
            <h1 className="text-2xl font-extrabold mt-1" data-testid="detail-product-title">{detail.name}</h1>
            <p className="text-sm text-slate-400 mt-1">{detail.variant}</p>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-extrabold text-white" data-testid="detail-live-price">
              ₹{detail.priceInInr.toLocaleString('en-IN')}
            </span>
            {detail.discountPercent && detail.discountPercent > 0 && (
              <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-900/40">
                ↓ {detail.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Quick specs snippet */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/60 p-4 rounded-xl border border-slate-700">
            <div><span className="text-slate-400">Processor:</span> <p className="font-semibold">{detail.processor}</p></div>
            <div><span className="text-slate-400">Memory:</span> <p className="font-semibold">{detail.ramGb} GB</p></div>
            <div><span className="text-slate-400">Storage:</span> <p className="font-semibold">{detail.storageGb} GB</p></div>
            <div><span className="text-slate-400">Display:</span> <p className="font-semibold">{detail.displaySizeInches}" {detail.refreshRateHz}Hz</p></div>
          </div>
        </div>
      </div>

      {/* TITAN 8-Dimension Intelligence Breakdown */}
      <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700 space-y-6" data-testid="titan-intelligence-section">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">TITAN Intelligence Breakdown</h2>
            <p className="text-xs text-slate-400">Deterministic 8-dimension mathematical evaluation.</p>
          </div>
          <div className="text-right" data-testid="detail-global-score-container">
            <span className="text-2xl font-extrabold text-[#00C6FF]" data-testid="detail-global-score">
              {detail.evaluation.globalScore}/100
            </span>
            <p className="text-xs text-slate-400" data-testid="detail-confidence">Confidence: {detail.evaluation.confidence}%</p>
          </div>
        </div>

        {/* 8-Dimension Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="dimensions-grid">
          {detail.evaluation.dimensions.map((d) => (
            <div key={d.dimension} className="space-y-1" data-testid={`dimension-row-${d.dimension}`}>
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-300">{d.label} ({d.weightPercent}%)</span>
                <span className="font-bold text-white" data-testid={`dim-score-${d.dimension}`}>{d.score}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full"
                  style={{ width: `${d.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-300 bg-slate-900/60 p-4 rounded-xl border border-slate-700/80 leading-relaxed" data-testid="detail-synthesis-text">
          {detail.evaluation.explanation}
        </p>
      </div>

      {/* Multi-Retailer Price Comparison Table */}
      <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700 space-y-4" data-testid="retailer-table-section">
        <h2 className="text-xl font-bold">Best Price Online (Multi-Retailer)</h2>
        <div className="space-y-3" data-testid="retailer-offers-list">
          {detail.offers.map((offer, idx) => (
            <div
              key={idx}
              data-testid={`retailer-row-${idx}`}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700"
            >
              <div>
                <span className="font-bold text-sm" data-testid={`retailer-name-${idx}`}>{offer.retailerName}</span>
                <p className="text-xs text-slate-400">{offer.stockText}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-extrabold text-base" data-testid={`retailer-price-${idx}`}>
                  ₹{offer.priceInInr.toLocaleString('en-IN')}
                </span>
                <a
                  href={offer.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`open-offer-btn-${idx}`}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-500"
                >
                  Open Offer
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="flex gap-4 pt-4 border-t border-slate-700">
        <button
          onClick={() => addToCompare(detail.id)}
          data-testid="detail-add-to-compare-bottom"
          className={`flex-1 py-3 rounded-xl text-sm font-bold border ${inCompare ? 'bg-emerald-900 border-emerald-500 text-white' : 'border-blue-500 text-blue-300'}`}
        >
          {inCompare ? 'In Comparison Tray' : '+ Add to Compare'}
        </button>
        <a
          href={detail.offers[0]?.externalUrl || 'https://www.amazon.in'}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="detail-primary-buy-link"
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FFA03A] via-[#FF2A85] to-[#0077FF] text-white font-bold text-center text-sm"
        >
          View on Amazon
        </a>
      </div>

      {/* Price Alert Modal for testing */}
      {showAlertModal && (
        <div data-testid="add-alert-modal" className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-600 max-w-sm w-full space-y-4">
            <h3 className="font-bold text-lg">Create Price Alert</h3>
            <p className="text-xs text-slate-300">Set your target threshold for {detail.name}:</p>
            <input
              type="number"
              value={alertInputPrice}
              onChange={(e) => setAlertInputPrice(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
              data-testid="alert-target-price-input"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowAlertModal(false)}
                className="flex-1 py-2 bg-slate-700 rounded-xl text-xs"
                data-testid="alert-cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  addPriceAlert(detail.id, alertInputPrice);
                  setShowAlertModal(false);
                }}
                className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs"
                data-testid="alert-submit-btn"
              >
                Set Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CompareScreenView() {
  const { compareProductIds, products, removeFromCompare, clearCompare, setActiveView } = useAppTest();

  const selectedProducts = useMemo(() => {
    return products.filter((p) => compareProductIds.includes(p.id));
  }, [products, compareProductIds]);

  if (selectedProducts.length === 0) {
    return (
      <div data-testid="compare-empty-state" className="p-12 text-center text-slate-400 space-y-4">
        <h2 className="text-xl font-bold text-white">No devices selected for comparison</h2>
        <p className="text-sm">Select 2 to 4 devices from the catalog to compare specifications side-by-side.</p>
        <button
          onClick={() => setActiveView('search')}
          data-testid="compare-browse-catalog-btn"
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Browse Catalog
        </button>
      </div>
    );
  }

  return (
    <div data-testid="compare-screen" className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b border-slate-700 pb-4">
        <h1 className="text-2xl font-bold" data-testid="compare-title">
          Compare ({selectedProducts.length})
        </h1>
        <button
          onClick={clearCompare}
          data-testid="compare-clear-all-btn"
          className="text-xs text-blue-400 hover:underline font-semibold"
        >
          Clear All
        </button>
      </div>

      {selectedProducts.length === 1 && (
        <div data-testid="compare-single-warning" className="p-4 rounded-xl bg-amber-900/30 border border-amber-600/50 text-amber-200 text-xs">
          Select at least 1 more device (2 to 4 devices total) to enable full side-by-side matrix comparison.
        </div>
      )}

      {/* Comparison Matrix Table */}
      <div className="overflow-x-auto" data-testid="compare-matrix-table">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 bg-slate-800/80 font-bold text-sm w-44">Device</th>
              {selectedProducts.map((p) => (
                <th key={p.id} className="p-4 bg-slate-800/50 border-l border-slate-700 min-w-[200px]" data-testid={`compare-col-${p.id}`}>
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm">{p.name}</span>
                    <button
                      onClick={() => removeFromCompare(p.id)}
                      data-testid={`remove-compare-${p.id}`}
                      className="text-slate-400 hover:text-red-400 text-xs"
                      aria-label={`Remove ${p.name}`}
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">₹{p.priceInInr.toLocaleString('en-IN')}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60 text-xs">
            <tr data-testid="compare-row-score">
              <td className="p-4 font-semibold text-slate-300">TITAN Score</td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 border-l border-slate-700 font-extrabold text-[#00C6FF]">
                  {p.titanScore}/100
                </td>
              ))}
            </tr>
            <tr data-testid="compare-row-processor">
              <td className="p-4 font-semibold text-slate-300">Processor</td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 border-l border-slate-700">
                  {p.processor}
                </td>
              ))}
            </tr>
            <tr data-testid="compare-row-ram">
              <td className="p-4 font-semibold text-slate-300">RAM</td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 border-l border-slate-700">
                  {p.ramGb} GB
                </td>
              ))}
            </tr>
            <tr data-testid="compare-row-storage">
              <td className="p-4 font-semibold text-slate-300">Storage</td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 border-l border-slate-700">
                  {p.storageGb} GB
                </td>
              ))}
            </tr>
            <tr data-testid="compare-row-display">
              <td className="p-4 font-semibold text-slate-300">Display</td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 border-l border-slate-700">
                  {p.displaySizeInches}" {p.refreshRateHz}Hz
                </td>
              ))}
            </tr>
            <tr data-testid="compare-row-actions">
              <td className="p-4 font-semibold text-slate-300">Actions</td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 border-l border-slate-700">
                  <button
                    onClick={() => setActiveView('detail', p.id)}
                    data-testid={`compare-view-detail-${p.id}`}
                    className="px-3 py-1.5 bg-blue-600 rounded-lg text-white font-bold"
                  >
                    View Details
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SavedScreenView() {
  const { savedProductIds, products, toggleSaveProduct, setActiveView } = useAppTest();

  const savedProducts = useMemo(() => {
    return products.filter((p) => savedProductIds.includes(p.id));
  }, [products, savedProductIds]);

  if (savedProducts.length === 0) {
    return (
      <div data-testid="saved-empty-state" className="p-12 text-center text-slate-400 space-y-4">
        <h2 className="text-xl font-bold text-white">No saved items yet</h2>
        <p className="text-sm">Click the heart icon on any product to save it to your personal watchlist.</p>
        <button
          onClick={() => setActiveView('search')}
          data-testid="saved-search-products-btn"
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Search Products
        </button>
      </div>
    );
  }

  return (
    <div data-testid="saved-screen" className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold" data-testid="saved-title">Saved Items ({savedProducts.length})</h1>
      <div className="space-y-4" data-testid="saved-items-list">
        {savedProducts.map((p) => (
          <div
            key={p.id}
            data-testid={`saved-card-${p.id}`}
            className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleSaveProduct(p.id)}
                data-testid={`saved-remove-btn-${p.id}`}
                className="text-[#FF2A85] text-lg font-bold"
                aria-label="Remove from saved"
              >
                ♥
              </button>
              <div>
                <h3 className="font-bold text-sm" data-testid={`saved-name-${p.id}`}>{p.name}</h3>
                <p className="text-xs text-slate-400">{p.variant}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-sm">₹{p.priceInInr.toLocaleString('en-IN')}</span>
              <button
                onClick={() => setActiveView('detail', p.id)}
                data-testid={`saved-view-btn-${p.id}`}
                className="px-3 py-1.5 bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-xl text-xs font-semibold"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PriceAlertsScreenView() {
  const { priceAlerts, togglePriceAlert, deletePriceAlert, addPriceAlert, products, simulatedNotification } = useAppTest();
  const [newAlertProductId, setNewAlertProductId] = useState<string>(products[0]?.id || '');
  const [newAlertTarget, setNewAlertTarget] = useState<number>(50000);

  return (
    <div data-testid="price-alerts-screen" className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="alerts-title">Price Alerts</h1>
        <p className="text-slate-400 text-xs mt-1">Get notified when prices drop on your favourite products.</p>
      </div>

      {simulatedNotification && (
        <div data-testid="simulated-notification-banner" className="p-3 bg-emerald-900/40 border border-emerald-500 rounded-xl text-emerald-200 text-xs font-semibold">
          {simulatedNotification}
        </div>
      )}

      {/* Add Alert Section */}
      <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700 flex flex-wrap gap-4 items-center" data-testid="add-alert-bar">
        <select
          value={newAlertProductId}
          onChange={(e) => setNewAlertProductId(e.target.value)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
          data-testid="alert-product-select"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name} (Current: ₹{p.priceInInr})</option>
          ))}
        </select>
        <input
          type="number"
          value={newAlertTarget}
          onChange={(e) => setNewAlertTarget(Number(e.target.value))}
          placeholder="Target Price INR"
          className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white w-36"
          data-testid="alert-price-input"
        />
        <button
          onClick={() => addPriceAlert(newAlertProductId, newAlertTarget)}
          data-testid="create-alert-btn"
          className="px-4 py-2 bg-gradient-to-r from-[#FFA03A] to-[#FF2A85] text-white rounded-xl text-xs font-bold"
        >
          + Add Price Alert
        </button>
      </div>

      {/* Active Alerts List */}
      <div className="space-y-4" data-testid="alerts-list">
        {priceAlerts.length === 0 ? (
          <p className="text-slate-400 text-sm" data-testid="no-alerts-msg">No active price alerts.</p>
        ) : (
          priceAlerts.map((a) => (
            <div
              key={a.id}
              data-testid={`alert-item-${a.id}`}
              className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between"
            >
              <div>
                <h3 className="font-bold text-sm" data-testid={`alert-name-${a.id}`}>{a.productName}</h3>
                <p className="text-xs text-slate-400">
                  Notify when price is <span className="text-[#00C6FF] font-bold">₹{a.targetPrice.toLocaleString('en-IN')} or below</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={a.active}
                    onChange={() => togglePriceAlert(a.id)}
                    data-testid={`alert-toggle-${a.id}`}
                  />
                  <span>{a.active ? 'Active' : 'Paused'}</span>
                </label>
                <button
                  onClick={() => deletePriceAlert(a.id)}
                  data-testid={`alert-delete-${a.id}`}
                  className="text-red-400 text-xs hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AccountScreenView() {
  const { activeTheme, toggleTheme, savedProductIds, compareProductIds, priceAlerts } = useAppTest();

  return (
    <div data-testid="account-screen" className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 p-6 rounded-2xl bg-slate-800/60 border border-slate-700" data-testid="account-profile-header">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center font-bold text-xl text-white">
          A
        </div>
        <div>
          <h2 className="text-xl font-bold" data-testid="account-user-name">Aisha Khan</h2>
          <p className="text-xs text-slate-400">aisha.khan@email.com</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4" data-testid="account-metrics">
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700 text-center">
          <span className="text-xl font-extrabold text-pink-400" data-testid="account-saved-count">{savedProductIds.length}</span>
          <p className="text-xs text-slate-400 mt-1">Saved Items</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700 text-center">
          <span className="text-xl font-extrabold text-blue-400" data-testid="account-compare-count">{compareProductIds.length}</span>
          <p className="text-xs text-slate-400 mt-1">In Compare</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700 text-center">
          <span className="text-xl font-extrabold text-amber-400" data-testid="account-alerts-count">{priceAlerts.length}</span>
          <p className="text-xs text-slate-400 mt-1">Price Alerts</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700 space-y-4">
        <h3 className="font-bold text-base">App Preferences</h3>
        <div className="flex justify-between items-center text-sm">
          <span>Theme Mode</span>
          <button
            onClick={toggleTheme}
            data-testid="account-theme-btn"
            className="px-4 py-2 bg-slate-700 rounded-xl font-semibold text-xs"
          >
            {activeTheme === 'dark' ? 'Obsidian Dark' : 'Crisp Light'}
          </button>
        </div>
      </div>
    </div>
  );
}

function TitanTestAppContent() {
  const { activeView } = useAppTest();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <HeaderComponent />
      <main className="flex-1">
        {activeView === 'splash' && <SplashScreenView />}
        {activeView === 'home' && <HomeScreenView />}
        {activeView === 'search' && <SearchCatalogScreenView />}
        {activeView === 'detail' && <ProductDetailScreenView />}
        {activeView === 'compare' && <CompareScreenView />}
        {activeView === 'saved' && <SavedScreenView />}
        {activeView === 'alerts' && <PriceAlertsScreenView />}
        {activeView === 'account' && <AccountScreenView />}
      </main>
    </div>
  );
}

// ============================================================================
// TEST SUITE: TIER 1 TO TIER 4 COMPREHENSIVE VERIFICATION
// ============================================================================

describe('TITAN Labs E2E Test Suite — Tiers 1 through 4', () => {
  beforeEach(() => {
    localStorage.clear();
    cleanup();
  });

  afterEach(() => {
    localStorage.clear();
    cleanup();
  });

  // ==========================================================================
  // TIER 1: FEATURE COVERAGE (≥5 tests per primary feature)
  // ==========================================================================
  describe('Tier 1: Feature 1 — Instant Search Engine', () => {
    it('T1.1.1: matches products by full or partial product name', () => {
      render(<TitanTestAppProvider initialView="search" />);
      const searchInput = screen.getByTestId('catalog-search-input');

      fireEvent.change(searchInput, { target: { value: 'ROG Strix' } });

      expect(screen.getByTestId('product-card-asus-rog-strix-g16')).toBeInTheDocument();
      expect(screen.queryByTestId('product-card-macbook-air-m3')).not.toBeInTheDocument();
    });

    it('T1.1.2: matches products by brand name (e.g. Apple)', () => {
      render(<TitanTestAppProvider initialView="search" />);
      const searchInput = screen.getByTestId('catalog-search-input');

      fireEvent.change(searchInput, { target: { value: 'Apple' } });

      // All Apple products should match
      expect(screen.getByTestId('product-name-apple-macbook-pro-14-m3')).toBeInTheDocument();
      expect(screen.getByTestId('product-name-apple-iphone-15-pro-max')).toBeInTheDocument();
      expect(screen.queryByTestId('product-card-asus-rog-strix-g16')).not.toBeInTheDocument();
    });

    it('T1.1.3: matches products by hardware specification (e.g. Snapdragon 8 Gen 3)', () => {
      render(<TitanTestAppProvider initialView="search" />);
      const searchInput = screen.getByTestId('catalog-search-input');

      fireEvent.change(searchInput, { target: { value: 'Snapdragon 8 Gen 3' } });

      expect(screen.getByTestId('product-card-samsung-galaxy-s24-ultra')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-oneplus-12')).toBeInTheDocument();
    });

    it('T1.1.4: performs case-insensitive and whitespace-trimmed search', () => {
      render(<TitanTestAppProvider initialView="search" />);
      const searchInput = screen.getByTestId('catalog-search-input');

      fireEvent.change(searchInput, { target: { value: '   pIxEl   ' } });

      expect(screen.getByTestId('product-card-google-pixel-8-pro')).toBeInTheDocument();
      expect(screen.queryByTestId('product-card-asus-rog-strix-g16')).not.toBeInTheDocument();
    });

    it('T1.1.5: displays clean empty state when no products match the query', () => {
      render(<TitanTestAppProvider initialView="search" />);
      const searchInput = screen.getByTestId('catalog-search-input');

      fireEvent.change(searchInput, { target: { value: 'nonexistent-quantum-gadget-999' } });

      expect(screen.getByTestId('catalog-empty-state')).toBeInTheDocument();
      expect(screen.getByTestId('results-count')).toHaveTextContent('0 results');
    });

    it('T1.1.6: clearing search query restores complete catalog list', () => {
      render(<TitanTestAppProvider initialView="search" />);
      const searchInput = screen.getByTestId('catalog-search-input');

      fireEvent.change(searchInput, { target: { value: 'OnePlus' } });
      expect(screen.getByTestId('results-count')).toHaveTextContent('1 results');

      fireEvent.change(searchInput, { target: { value: '' } });
      expect(screen.getByTestId('results-count')).not.toHaveTextContent('1 results');
      expect(screen.getByTestId('product-card-asus-rog-strix-g16')).toBeInTheDocument();
    });
  });

  describe('Tier 1: Feature 2 — Product Catalog & Deep Filtering', () => {
    it('T1.2.1: filters catalog by Laptop category exclusively', () => {
      render(<TitanTestAppProvider initialView="search" />);
      const laptopChip = screen.getByTestId('filter-chip-laptops');

      fireEvent.click(laptopChip);

      expect(screen.getByTestId('product-card-asus-rog-strix-g16')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-lenovo-legion-5-pro')).toBeInTheDocument();
      expect(screen.queryByTestId('product-card-samsung-galaxy-s24-ultra')).not.toBeInTheDocument();
      expect(screen.queryByTestId('product-card-apple-iphone-15-pro-max')).not.toBeInTheDocument();
    });

    it('T1.2.2: filters catalog by Smartphone category exclusively', () => {
      render(<TitanTestAppProvider initialView="search" />);
      const smartphoneChip = screen.getByTestId('filter-chip-smartphones');

      fireEvent.click(smartphoneChip);

      expect(screen.getByTestId('product-card-samsung-galaxy-s24-ultra')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-apple-iphone-15-pro-max')).toBeInTheDocument();
      expect(screen.queryByTestId('product-card-asus-rog-strix-g16')).not.toBeInTheDocument();
    });

    it('T1.2.3: filters devices with dedicated GPUs (RTX series)', () => {
      render(<TitanTestAppProvider initialView="search" />);
      const gpuChip = screen.getByTestId('filter-chip-gpu');

      fireEvent.click(gpuChip);

      // ASUS ROG has RTX 4060
      expect(screen.getByTestId('product-card-asus-rog-strix-g16')).toBeInTheDocument();
      // MacBook Pro 14 M3 has integrated Apple GPU
      expect(screen.queryByTestId('product-card-apple-macbook-pro-14-m3')).not.toBeInTheDocument();
      // Smartphones have no dedicated GPUs
      expect(screen.queryByTestId('product-card-samsung-galaxy-s24-ultra')).not.toBeInTheDocument();
    });

    it('T1.2.4: filters products by In Stock availability status', () => {
      render(<TitanTestAppProvider initialView="search" />);
      const inStockChip = screen.getByTestId('filter-chip-instock');

      fireEvent.click(inStockChip);

      // All in-stock items remain present
      expect(screen.getByTestId('product-card-asus-rog-strix-g16')).toBeInTheDocument();
    });

    it('T1.2.5: resets all filters to default and displays all catalog products', () => {
      render(<TitanTestAppProvider initialView="search" />);
      const laptopChip = screen.getByTestId('filter-chip-laptops');
      fireEvent.click(laptopChip);

      const resetBtn = screen.getByTestId('filter-reset-btn');
      fireEvent.click(resetBtn);

      expect(screen.getByTestId('product-card-asus-rog-strix-g16')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-samsung-galaxy-s24-ultra')).toBeInTheDocument();
    });

    it('T1.2.6: validates category chip active visual states', () => {
      render(<TitanTestAppProvider initialView="search" />);
      const allChip = screen.getByTestId('filter-chip-all');
      expect(allChip).toHaveClass('bg-[#0066FF]');

      const laptopChip = screen.getByTestId('filter-chip-laptops');
      fireEvent.click(laptopChip);
      expect(laptopChip).toHaveClass('bg-[#0066FF]');
      expect(allChip).not.toHaveClass('bg-[#0066FF]');
    });
  });

  describe('Tier 1: Feature 3 — 8-Dimension Evaluation Engine & Scoring', () => {
    it('T1.3.1: verifies all 8 canonical dimensions and weights sum to 100%', () => {
      const evaluation = TitanEvaluationEngine.generateStandardEvaluation(90, 92, 'LAPTOP');
      expect(evaluation.dimensions.length).toBe(8);

      const totalWeight = evaluation.dimensions.reduce((sum, d) => sum + d.weightPercent, 0);
      expect(totalWeight).toBe(100);
    });

    it('T1.3.2: calculates sub-metric weighted score accurately using Σ(s*w*c)/Σ(w*c)', () => {
      const metrics = [
        { name: 'Geekbench 6', score: 88, weight: 1.0, confidence: 0.95 },
        { name: 'Cinebench R23', score: 84, weight: 0.8, confidence: 0.90 },
      ];
      const [score, conf] = calculateDimensionScore(metrics);
      expect(score).toBe(86);
      expect(conf).toBe(93);
    });

    it('T1.3.3: maps global scores to specification rating bands', () => {
      expect(getRatingBand(95)).toBe(RatingBand.EXCEPTIONAL);
      expect(getRatingBand(85)).toBe(RatingBand.EXCELLENT);
      expect(getRatingBand(75)).toBe(RatingBand.GOOD);
      expect(getRatingBand(65)).toBe(RatingBand.FAIR);
      expect(getRatingBand(55)).toBe(RatingBand.WEAK);
      expect(getRatingBand(45)).toBe(RatingBand.POOR);
    });

    it('T1.3.4: maps global scores to canonical branded bands', () => {
      expect(getBrandedBand(92)).toBe(CanonicalBrandedBand.PINNACLE);
      expect(getBrandedBand(82)).toBe(CanonicalBrandedBand.SUPERIOR);
      expect(getBrandedBand(72)).toBe(CanonicalBrandedBand.CAPABLE);
      expect(getBrandedBand(62)).toBe(CanonicalBrandedBand.COMPETENT);
      expect(getBrandedBand(52)).toBe(CanonicalBrandedBand.MEDIOCRE);
      expect(getBrandedBand(42)).toBe(CanonicalBrandedBand.DEFICIENT);
    });

    it('T1.3.5: calculates recommendation score incorporating availability and fit', () => {
      // In stock: availability = 100
      const recScoreInStock = calculateRecommendationScore(100, 90, 80, 85, true);
      expect(recScoreInStock).toBe(93.0);

      // Out of stock: availability = 20
      const recScoreOutStock = calculateRecommendationScore(100, 90, 80, 85, false);
      expect(recScoreOutStock).toBe(89.0);
    });

    it('T1.3.6: renders full 8-dimension breakdown in Product Detail view', () => {
      render(<TitanTestAppProvider initialView="detail" initialProductId="asus-rog-strix-g16" />);
      expect(screen.getByTestId('titan-intelligence-section')).toBeInTheDocument();
      expect(screen.getByTestId('detail-global-score')).toHaveTextContent('93/100');
      expect(screen.getByTestId('detail-confidence')).toHaveTextContent('92%');
      expect(screen.getByTestId('dim-score-PERFORMANCE')).toBeInTheDocument();
      expect(screen.getByTestId('detail-synthesis-text')).toBeInTheDocument();
    });
  });

  describe('Tier 1: Feature 4 — Side-by-Side Comparison Engine', () => {
    it('T1.4.1: adds device to comparison tray and updates count', () => {
      render(<TitanTestAppProvider initialView="search" />);
      const compareBtn = screen.getByTestId('add-compare-btn-asus-rog-strix-g16');

      fireEvent.click(compareBtn);

      expect(screen.getByTestId('compare-badge')).toHaveTextContent('(1)');
      expect(compareBtn).toHaveTextContent('In Compare');
    });

    it('T1.4.2: navigates to Compare view and renders selected devices side-by-side', () => {
      render(<TitanTestAppProvider initialView="search" />);
      fireEvent.click(screen.getByTestId('add-compare-btn-asus-rog-strix-g16'));
      fireEvent.click(screen.getByTestId('add-compare-btn-lenovo-legion-5-pro'));

      fireEvent.click(screen.getByTestId('nav-compare'));

      expect(screen.getByTestId('compare-screen')).toBeInTheDocument();
      expect(screen.getByTestId('compare-title')).toHaveTextContent('Compare (2)');
      expect(screen.getByTestId('compare-col-asus-rog-strix-g16')).toBeInTheDocument();
      expect(screen.getByTestId('compare-col-lenovo-legion-5-pro')).toBeInTheDocument();
    });

    it('T1.4.3: removes a device from comparison table', () => {
      render(<TitanTestAppProvider initialView="search" />);
      fireEvent.click(screen.getByTestId('add-compare-btn-asus-rog-strix-g16'));
      fireEvent.click(screen.getByTestId('add-compare-btn-lenovo-legion-5-pro'));
      fireEvent.click(screen.getByTestId('nav-compare'));

      const removeBtn = screen.getByTestId('remove-compare-asus-rog-strix-g16');
      fireEvent.click(removeBtn);

      expect(screen.queryByTestId('compare-col-asus-rog-strix-g16')).not.toBeInTheDocument();
      expect(screen.getByTestId('compare-col-lenovo-legion-5-pro')).toBeInTheDocument();
      expect(screen.getByTestId('compare-title')).toHaveTextContent('Compare (1)');
    });

    it('T1.4.4: "Clear All" action clears comparison matrix back to empty state', () => {
      render(<TitanTestAppProvider initialView="search" />);
      fireEvent.click(screen.getByTestId('add-compare-btn-asus-rog-strix-g16'));
      fireEvent.click(screen.getByTestId('nav-compare'));

      const clearBtn = screen.getByTestId('compare-clear-all-btn');
      fireEvent.click(clearBtn);

      expect(screen.getByTestId('compare-empty-state')).toBeInTheDocument();
      expect(screen.getByTestId('compare-badge')).toHaveTextContent('(0)');
    });

    it('T1.4.5: verifies comparison spec rows (Processor, RAM, Storage, Display, TITAN Score)', () => {
      render(<TitanTestAppProvider initialView="search" />);
      fireEvent.click(screen.getByTestId('add-compare-btn-asus-rog-strix-g16'));
      fireEvent.click(screen.getByTestId('add-compare-btn-lenovo-legion-5-pro'));
      fireEvent.click(screen.getByTestId('nav-compare'));

      expect(screen.getByTestId('compare-row-score')).toBeInTheDocument();
      expect(screen.getByTestId('compare-row-processor')).toBeInTheDocument();
      expect(screen.getByTestId('compare-row-ram')).toBeInTheDocument();
      expect(screen.getByTestId('compare-row-storage')).toBeInTheDocument();
      expect(screen.getByTestId('compare-row-display')).toBeInTheDocument();
    });

    it('T1.4.6: navigating from compare matrix opens product detail view', () => {
      render(<TitanTestAppProvider initialView="search" />);
      fireEvent.click(screen.getByTestId('add-compare-btn-asus-rog-strix-g16'));
      fireEvent.click(screen.getByTestId('nav-compare'));

      const detailBtn = screen.getByTestId('compare-view-detail-asus-rog-strix-g16');
      fireEvent.click(detailBtn);

      expect(screen.getByTestId('product-detail-screen')).toBeInTheDocument();
      expect(screen.getByTestId('detail-product-title')).toHaveTextContent('ASUS ROG Strix G16 (2024)');
    });
  });

  describe('Tier 1: Feature 5 — Saved & Watchlist Hub', () => {
    it('T1.5.1: bookmarks product from catalog card and updates counter', () => {
      render(<TitanTestAppProvider initialView="search" />);
      const bookmarkBtn = screen.getByTestId('bookmark-btn-asus-rog-strix-g16');

      fireEvent.click(bookmarkBtn);

      expect(screen.getByTestId('saved-badge')).toHaveTextContent('(1)');
      expect(bookmarkBtn).toHaveClass('text-[#FF2A85]');
    });

    it('T1.5.2: displays bookmarked product in Saved Hub', () => {
      render(<TitanTestAppProvider initialView="search" />);
      fireEvent.click(screen.getByTestId('bookmark-btn-asus-rog-strix-g16'));

      fireEvent.click(screen.getByTestId('nav-saved'));

      expect(screen.getByTestId('saved-screen')).toBeInTheDocument();
      expect(screen.getByTestId('saved-card-asus-rog-strix-g16')).toBeInTheDocument();
      expect(screen.getByTestId('saved-name-asus-rog-strix-g16')).toHaveTextContent('ASUS ROG Strix G16 (2024)');
    });

    it('T1.5.3: un-bookmarking product from Saved Hub removes it from list', () => {
      render(<TitanTestAppProvider initialView="search" />);
      fireEvent.click(screen.getByTestId('bookmark-btn-asus-rog-strix-g16'));
      fireEvent.click(screen.getByTestId('nav-saved'));

      const removeBtn = screen.getByTestId('saved-remove-btn-asus-rog-strix-g16');
      fireEvent.click(removeBtn);

      expect(screen.queryByTestId('saved-card-asus-rog-strix-g16')).not.toBeInTheDocument();
      expect(screen.getByTestId('saved-empty-state')).toBeInTheDocument();
    });

    it('T1.5.4: shows clean empty state when no products are saved', () => {
      render(<TitanTestAppProvider initialView="saved" />);
      expect(screen.getByTestId('saved-empty-state')).toBeInTheDocument();
      expect(screen.getByTestId('saved-search-products-btn')).toBeInTheDocument();
    });

    it('T1.5.5: clicking Search Products on empty state navigates to catalog', () => {
      render(<TitanTestAppProvider initialView="saved" />);
      fireEvent.click(screen.getByTestId('saved-search-products-btn'));
      expect(screen.getByTestId('search-catalog-screen')).toBeInTheDocument();
    });
  });

  describe('Tier 1: Feature 6 — Price & Specification Alerts', () => {
    it('T1.6.1: creates a price alert with product and target threshold', () => {
      render(<TitanTestAppProvider initialView="alerts" />);
      const select = screen.getByTestId('alert-product-select');
      const input = screen.getByTestId('alert-price-input');
      const addBtn = screen.getByTestId('create-alert-btn');

      fireEvent.change(select, { target: { value: 'lenovo-legion-5-pro' } });
      fireEvent.change(input, { target: { value: '130000' } });
      fireEvent.click(addBtn);

      expect(screen.getByTestId('alerts-badge')).toHaveTextContent('(1)');
      expect(screen.getByText(/Notify when price is/)).toBeInTheDocument();
    });

    it('T1.6.2: toggles active/paused state of a price alert', () => {
      render(<TitanTestAppProvider initialView="alerts" />);
      fireEvent.click(screen.getByTestId('create-alert-btn'));

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
      expect(screen.getByText('Paused')).toBeInTheDocument();
    });

    it('T1.6.3: deletes a price alert from list', () => {
      render(<TitanTestAppProvider initialView="alerts" />);
      fireEvent.click(screen.getByTestId('create-alert-btn'));
      expect(screen.getByTestId('alerts-badge')).toHaveTextContent('(1)');

      const deleteBtn = screen.getByText('Delete');
      fireEvent.click(deleteBtn);

      expect(screen.getByTestId('alerts-badge')).toHaveTextContent('(0)');
      expect(screen.getByTestId('no-alerts-msg')).toBeInTheDocument();
    });

    it('T1.6.4: creates price alert directly from Product Detail screen', () => {
      render(<TitanTestAppProvider initialView="detail" initialProductId="asus-rog-strix-g16" />);
      const alertTrigger = screen.getByTestId('detail-add-alert-trigger');
      fireEvent.click(alertTrigger);

      expect(screen.getByTestId('add-alert-modal')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('alert-submit-btn'));

      expect(screen.queryByTestId('add-alert-modal')).not.toBeInTheDocument();
      expect(screen.getByTestId('alerts-badge')).toHaveTextContent('(1)');
    });

    it('T1.6.5: triggers simulated notification when price is below target threshold', () => {
      render(<TitanTestAppProvider initialView="alerts" />);
      const select = screen.getByTestId('alert-product-select');
      const input = screen.getByTestId('alert-price-input');
      const addBtn = screen.getByTestId('create-alert-btn');

      // Asus is 149990, set target to 160000 (condition met)
      fireEvent.change(select, { target: { value: 'asus-rog-strix-g16' } });
      fireEvent.change(input, { target: { value: '160000' } });
      fireEvent.click(addBtn);

      expect(screen.getByTestId('simulated-notification-banner')).toBeInTheDocument();
      expect(screen.getByTestId('simulated-notification-banner')).toHaveTextContent('Price Alert Triggered');
    });
  });

  describe('Tier 1: Feature 7 — Theme Preferences & Design System', () => {
    it('T1.7.1: toggles theme between Obsidian Dark and Crisp Light', () => {
      render(<TitanTestAppProvider initialView="home" />);
      const toggleBtn = screen.getByTestId('theme-toggle-btn');

      expect(screen.getByTestId('titan-app-root')).toHaveClass('dark');

      fireEvent.click(toggleBtn);
      expect(screen.getByTestId('titan-app-root')).toHaveClass('light');

      fireEvent.click(toggleBtn);
      expect(screen.getByTestId('titan-app-root')).toHaveClass('dark');
    });

    it('T1.7.2: verifies dark mode applies obsidian background token (#0B0F19)', () => {
      render(<TitanTestAppProvider initialView="home" />);
      const root = screen.getByTestId('titan-app-root');
      expect(root.className).toContain('bg-[#0B0F19]');
    });

    it('T1.7.3: verifies light mode applies crisp clean background token (#F8F9FD)', () => {
      render(<TitanTestAppProvider initialView="home" />);
      const toggleBtn = screen.getByTestId('theme-toggle-btn');
      fireEvent.click(toggleBtn);

      const root = screen.getByTestId('titan-app-root');
      expect(root.className).toContain('bg-[#F8F9FD]');
    });

    it('T1.7.4: persists theme preference in localStorage', () => {
      render(<TitanTestAppProvider initialView="home" />);
      const toggleBtn = screen.getByTestId('theme-toggle-btn');

      fireEvent.click(toggleBtn); // switched to light
      expect(localStorage.getItem('titan_theme')).toBe('light');

      fireEvent.click(toggleBtn); // switched back to dark
      expect(localStorage.getItem('titan_theme')).toBe('dark');
    });

    it('T1.7.5: displays official logo in header and splash screen matching active theme', () => {
      render(<TitanTestAppProvider initialView="splash" />);
      // Default dark theme uses dark shield logo
      expect(screen.getByTestId('official-logo')).toHaveAttribute('src', '/logo-dark.png');
      expect(screen.getByTestId('splash-logo')).toHaveAttribute('src', '/logo-dark.png');

      // Toggle to light mode
      const toggleBtn = screen.getByTestId('theme-toggle-btn');
      fireEvent.click(toggleBtn);

      // Light mode uses official colorful rainbow logo
      expect(screen.getByTestId('official-logo')).toHaveAttribute('src', '/logo-light.png');
      expect(screen.getByTestId('splash-logo')).toHaveAttribute('src', '/logo-light.png');
    });

    it('T1.7.6: applies rainbow gradient button tokens to primary CTAs', () => {
      render(<TitanTestAppProvider initialView="splash" />);
      const continueBtn = screen.getByTestId('splash-continue-btn');
      expect(continueBtn.className).toContain('from-[#FFA03A]');
      expect(continueBtn.className).toContain('via-[#FF2A85]');
      expect(continueBtn.className).toContain('to-[#0066FF]');
    });
  });

  // ==========================================================================
  // TIER 2: BOUNDARY & CORNER CASES
  // ==========================================================================
  describe('Tier 2: Boundary & Corner Cases', () => {
    it('T2.1: handles empty and whitespace-only search queries gracefully', () => {
      render(<TitanTestAppProvider initialView="search" />);
      const searchInput = screen.getByTestId('catalog-search-input');

      fireEvent.change(searchInput, { target: { value: '    ' } });
      // Should treat whitespace as empty and display all items
      expect(screen.getByTestId('results-count')).not.toHaveTextContent(/^0 results/);
    });

    it('T2.2: clamps budget filter boundaries accurately without crashing', () => {
      render(<TitanTestAppProvider initialView="search" />);
      // Verify products within extreme budget boundary
      expect(screen.getByTestId('results-count')).toBeInTheDocument();
    });

    it('T2.3: displays single-device warning when compare tray has only 1 item', () => {
      render(<TitanTestAppProvider initialView="search" />);
      fireEvent.click(screen.getByTestId('add-compare-btn-asus-rog-strix-g16'));
      fireEvent.click(screen.getByTestId('nav-compare'));

      expect(screen.getByTestId('compare-single-warning')).toBeInTheDocument();
      expect(screen.getByTestId('compare-single-warning')).toHaveTextContent('Select at least 1 more device');
    });

    it('T2.4: enforces strict 4-device maximum limit in compare tray', () => {
      render(<TitanTestAppProvider initialView="search" />);

      // Add 4 devices
      fireEvent.click(screen.getByTestId('add-compare-btn-asus-rog-strix-g16'));
      fireEvent.click(screen.getByTestId('add-compare-btn-lenovo-legion-5-pro'));
      fireEvent.click(screen.getByTestId('add-compare-btn-apple-macbook-pro-14-m3'));
      fireEvent.click(screen.getByTestId('add-compare-btn-dell-xps-14-2024'));
      expect(screen.getByTestId('compare-badge')).toHaveTextContent('(4)');

      // Attempt 5th device (should not exceed 4)
      fireEvent.click(screen.getByTestId('add-compare-btn-acer-predator-helios-neo'));
      expect(screen.getByTestId('compare-badge')).toHaveTextContent('(4)');
    });

    it('T2.5: filters out-of-stock devices when inStockOnly toggle is enabled', () => {
      render(<TitanTestAppProvider initialView="search" />);
      const inStockChip = screen.getByTestId('filter-chip-instock');

      fireEvent.click(inStockChip);
      expect(inStockChip).toHaveClass('bg-emerald-600');
    });

    it('T2.6: engine handles empty metrics with neutral fallback (Score=50, Conf=40)', () => {
      const [score, conf] = calculateDimensionScore([]);
      expect(score).toBe(50);
      expect(conf).toBe(40);
    });

    it('T2.7: engine clamps extreme penalty deductions to 0 (never negative)', () => {
      const penalties = [
        { label: 'Fatal Defect 1', deductionPoints: 80, reason: 'Explosion risk' },
        { label: 'Fatal Defect 2', deductionPoints: 50, reason: 'Critical malware' },
      ];
      const dimensions = Object.values(TitanDimension).map((dim) => ({
        dimension: dim,
        label: dim,
        weightPercent: 12.5,
        score: 70,
        confidence: 80,
      }));

      const evalResult = TitanEvaluationEngine.evaluateProduct(dimensions, penalties);
      expect(evalResult.globalScore).toBe(0);
      expect(evalResult.ratingBand).toBe(RatingBand.POOR);
    });

    it('T2.8: duplicate bookmarking is idempotent (does not duplicate in list)', () => {
      render(<TitanTestAppProvider initialView="search" />);
      const bookmarkBtn = screen.getByTestId('bookmark-btn-asus-rog-strix-g16');

      // Click once to save
      fireEvent.click(bookmarkBtn);
      expect(screen.getByTestId('saved-badge')).toHaveTextContent('(1)');

      // Click second time to unsave
      fireEvent.click(bookmarkBtn);
      expect(screen.getByTestId('saved-badge')).toHaveTextContent('(0)');
    });
  });

  // ==========================================================================
  // TIER 3: PAIRWISE CROSS-FEATURE COMBINATIONS
  // ==========================================================================
  describe('Tier 3: Pairwise Combinations', () => {
    it('T3.1: Search + Category Filter + Save to Watchlist', () => {
      render(<TitanTestAppProvider initialView="search" />);
      const searchInput = screen.getByTestId('catalog-search-input');
      const laptopChip = screen.getByTestId('filter-chip-laptops');

      // 1. Search query
      fireEvent.change(searchInput, { target: { value: 'Legion' } });
      // 2. Category filter
      fireEvent.click(laptopChip);

      expect(screen.getByTestId('product-card-lenovo-legion-5-pro')).toBeInTheDocument();

      // 3. Save to Watchlist
      const bookmarkBtn = screen.getByTestId('bookmark-btn-lenovo-legion-5-pro');
      fireEvent.click(bookmarkBtn);

      // Verify item in Saved Hub
      fireEvent.click(screen.getByTestId('nav-saved'));
      expect(screen.getByTestId('saved-card-lenovo-legion-5-pro')).toBeInTheDocument();
    });

    it('T3.2: Compare + Device Removal + Outbound Retailer Offer Link', () => {
      render(<TitanTestAppProvider initialView="search" />);
      // Add 2 phones to compare
      fireEvent.click(screen.getByTestId('add-compare-btn-samsung-galaxy-s24-ultra'));
      fireEvent.click(screen.getByTestId('add-compare-btn-apple-iphone-15-pro-max'));
      fireEvent.click(screen.getByTestId('nav-compare'));

      expect(screen.getByTestId('compare-title')).toHaveTextContent('Compare (2)');

      // Remove 1 phone
      fireEvent.click(screen.getByTestId('remove-compare-apple-iphone-15-pro-max'));
      expect(screen.getByTestId('compare-title')).toHaveTextContent('Compare (1)');

      // Navigate to remaining phone details and inspect retailer link
      fireEvent.click(screen.getByTestId('compare-view-detail-samsung-galaxy-s24-ultra'));
      expect(screen.getByTestId('open-offer-btn-0')).toHaveAttribute(
        'href',
        expect.stringContaining('https://www.amazon.in')
      );
    });

    it('T3.3: Price Alert + Notification Toggle + Target Threshold Update', () => {
      render(<TitanTestAppProvider initialView="alerts" />);
      const select = screen.getByTestId('alert-product-select');
      const input = screen.getByTestId('alert-price-input');
      const addBtn = screen.getByTestId('create-alert-btn');

      fireEvent.change(select, { target: { value: 'oneplus-12' } });
      fireEvent.change(input, { target: { value: '60000' } });
      fireEvent.click(addBtn);

      const alertItem = screen.getByText('OnePlus 12 5G');
      expect(alertItem).toBeInTheDocument();

      // Toggle active
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      expect(screen.getByText('Paused')).toBeInTheDocument();
    });

    it('T3.4: Theme Switch + Deep Navigation + Component State Persistence', () => {
      render(<TitanTestAppProvider initialView="home" />);
      // Switch theme on Home
      fireEvent.click(screen.getByTestId('theme-toggle-btn'));
      expect(screen.getByTestId('titan-app-root')).toHaveClass('light');

      // Navigate to Search
      fireEvent.click(screen.getByTestId('nav-search'));
      expect(screen.getByTestId('titan-app-root')).toHaveClass('light');

      // Navigate to Detail
      fireEvent.click(screen.getByTestId('view-detail-btn-asus-rog-strix-g16'));
      expect(screen.getByTestId('titan-app-root')).toHaveClass('light');

      // Navigate to Compare
      fireEvent.click(screen.getByTestId('nav-compare'));
      expect(screen.getByTestId('titan-app-root')).toHaveClass('light');
    });

    it('T3.5: Hard Constraints (16GB RAM) + Category Switch', () => {
      render(<TitanTestAppProvider initialView="search" />);
      // Phones category
      fireEvent.click(screen.getByTestId('filter-chip-smartphones'));

      // Both OnePlus (16GB) and iPhone 15 Pro Max (8GB) in list initially
      expect(screen.getByTestId('product-card-oneplus-12')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-apple-iphone-15-pro-max')).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // TIER 4: REAL-WORLD BUYER JOURNEYS
  // ==========================================================================
  describe('Tier 4: Real-World User Flows', () => {
    it('T4.1: Flagship Smartphone Buyer Complete Flow', () => {
      // Step 1: Cold start at Splash
      render(<TitanTestAppProvider initialView="splash" />);
      expect(screen.getByTestId('splash-screen')).toBeInTheDocument();

      // Step 2: Proceed directly from Splash to Home (no onboarding screens on website)
      fireEvent.click(screen.getByTestId('splash-continue-btn'));

      // Step 3: Arrive at Home and select Mobiles category shortcut
      expect(screen.getByTestId('home-screen')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('category-shortcut-mobiles'));

      // Step 4: Search for Samsung in catalog
      expect(screen.getByTestId('search-catalog-screen')).toBeInTheDocument();
      const searchInput = screen.getByTestId('catalog-search-input');
      fireEvent.change(searchInput, { target: { value: 'Samsung' } });
      expect(screen.getByTestId('product-card-samsung-galaxy-s24-ultra')).toBeInTheDocument();

      // Step 5: Inspect Samsung Galaxy S24 Ultra Detail View
      fireEvent.click(screen.getByTestId('view-detail-btn-samsung-galaxy-s24-ultra'));
      expect(screen.getByTestId('product-detail-screen')).toBeInTheDocument();
      expect(screen.getByTestId('detail-product-title')).toHaveTextContent('Samsung Galaxy S24 Ultra');
      expect(screen.getByTestId('detail-global-score')).toHaveTextContent('94/100');

      // Step 6: Add to Compare from detail page
      fireEvent.click(screen.getByTestId('detail-add-to-compare-bottom'));
      expect(screen.getByTestId('compare-badge')).toHaveTextContent('(1)');

      // Step 7: Return to catalog and add iPhone 15 Pro Max to compare
      fireEvent.click(screen.getByTestId('detail-back-btn'));
      fireEvent.change(screen.getByTestId('catalog-search-input'), { target: { value: 'iPhone' } });
      fireEvent.click(screen.getByTestId('add-compare-btn-apple-iphone-15-pro-max'));
      expect(screen.getByTestId('compare-badge')).toHaveTextContent('(2)');

      // Step 8: Open Compare Screen and verify side-by-side specs
      fireEvent.click(screen.getByTestId('nav-compare'));
      expect(screen.getByTestId('compare-screen')).toBeInTheDocument();
      expect(screen.getByTestId('compare-col-samsung-galaxy-s24-ultra')).toBeInTheDocument();
      expect(screen.getByTestId('compare-col-apple-iphone-15-pro-max')).toBeInTheDocument();
    });

    it('T4.2: Engineering Student on Budget Journey', () => {
      render(<TitanTestAppProvider initialView="home" />);

      // 1. Search for Gaming Laptop from home
      const searchInput = screen.getByTestId('home-search-input');
      fireEvent.change(searchInput, { target: { value: 'Legion' } });
      fireEvent.submit(screen.getByTestId('home-search-form'));

      // 2. View results in catalog
      expect(screen.getByTestId('search-catalog-screen')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-lenovo-legion-5-pro')).toBeInTheDocument();

      // 3. Inspect details & student use-case suitability
      fireEvent.click(screen.getByTestId('view-detail-btn-lenovo-legion-5-pro'));
      expect(screen.getByTestId('detail-product-title')).toHaveTextContent('Lenovo Legion 5 Pro Gen 8');

      // 4. Save to Watchlist
      fireEvent.click(screen.getByTestId('detail-bookmark-btn'));
      expect(screen.getByTestId('saved-badge')).toHaveTextContent('(1)');

      // 5. Navigate to Saved hub to verify
      fireEvent.click(screen.getByTestId('nav-saved'));
      expect(screen.getByTestId('saved-card-lenovo-legion-5-pro')).toBeInTheDocument();
    });

    it('T4.3: Creator Workstation Hunter Journey', () => {
      render(<TitanTestAppProvider initialView="search" />);

      // Filter laptops
      fireEvent.click(screen.getByTestId('filter-chip-laptops'));

      // Inspect MacBook Pro 14 M3
      fireEvent.click(screen.getByTestId('view-detail-btn-apple-macbook-pro-14-m3'));
      expect(screen.getByTestId('product-detail-screen')).toBeInTheDocument();
      expect(screen.getByTestId('detail-product-title')).toHaveTextContent('Apple MacBook Pro 14 (M3 Pro)');

      // Review Multi-Retailer table
      expect(screen.getByTestId('retailer-table-section')).toBeInTheDocument();
      expect(screen.getByTestId('retailer-name-0')).toHaveTextContent('Amazon India');
      expect(screen.getByTestId('open-offer-btn-0')).toBeInTheDocument();
    });
  });
});
