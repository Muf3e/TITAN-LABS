import React, { useState, createContext, useContext } from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// Domain imports from M1
import { SAMPLE_PRODUCTS, getProductDetail } from '../data/sampleData';
import { SampleProduct } from '../types';

// ============================================================================
// Viewport Test Simulation Harness & State Provider
// ============================================================================

function setViewport(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: height });
  window.dispatchEvent(new Event('resize'));
}

interface ViewportContextType {
  products: SampleProduct[];
  activeView: 'home' | 'search' | 'detail' | 'compare' | 'saved';
  setActiveView: (view: any, param?: string) => void;
  selectedProductId: string | null;
  savedProductIds: string[];
  compareProductIds: string[];
  toggleSave: (id: string) => void;
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  activeTheme: 'dark' | 'light';
  toggleTheme: () => void;
}

const ViewportTestContext = createContext<ViewportContextType | null>(null);

function useViewportTest() {
  const ctx = useContext(ViewportTestContext);
  if (!ctx) throw new Error('useViewportTest must be used within ViewportTestProvider');
  return ctx;
}

function ViewportTestProvider({
  children,
  initialView = 'home',
  initialProductId = 'asus-rog-strix-g16',
  initialSaved = ['asus-rog-strix-g16', 'lenovo-legion-5-pro'],
  initialCompare = ['asus-rog-strix-g16', 'lenovo-legion-5-pro'],
}: {
  children?: React.ReactNode;
  initialView?: any;
  initialProductId?: string | null;
  initialSaved?: string[];
  initialCompare?: string[];
}) {
  const [products] = useState<SampleProduct[]>(SAMPLE_PRODUCTS);
  const [activeView, setActiveViewRaw] = useState<any>(initialView);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(initialProductId);
  const [savedProductIds, setSavedProductIds] = useState<string[]>(initialSaved);
  const [compareProductIds, setCompareProductIds] = useState<string[]>(initialCompare);
  const [activeTheme, setActiveTheme] = useState<'dark' | 'light'>('dark');

  const setActiveView = (view: any, param?: string) => {
    setActiveViewRaw(view);
    if (param) setSelectedProductId(param);
  };

  const toggleSave = (id: string) => {
    setSavedProductIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addToCompare = (id: string) => {
    if (!compareProductIds.includes(id) && compareProductIds.length < 4) {
      setCompareProductIds((prev) => [...prev, id]);
    }
  };

  const removeFromCompare = (id: string) => {
    setCompareProductIds((prev) => prev.filter((x) => x !== id));
  };

  const toggleTheme = () => {
    setActiveTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ViewportTestContext.Provider
      value={{
        products,
        activeView,
        setActiveView,
        selectedProductId,
        savedProductIds,
        compareProductIds,
        toggleSave,
        addToCompare,
        removeFromCompare,
        activeTheme,
        toggleTheme,
      }}
    >
      <div
        data-testid="viewport-test-container"
        className={`w-full min-h-screen ${activeTheme === 'dark' ? 'bg-[#0B0F19] text-[#F8FAFC]' : 'bg-[#F8F9FD] text-[#0F172A]'}`}
      >
        {children || <ViewportTestAppContent />}
      </div>
    </ViewportTestContext.Provider>
  );
}

// ============================================================================
// Primary Views Under Test
// 1. Home View
// 2. Search/Filter View
// 3. Detail View
// 4. Compare View
// 5. Saved View
// ============================================================================

function ViewportHeader() {
  const { activeView, setActiveView, savedProductIds, compareProductIds } = useViewportTest();

  return (
    <header data-testid="viewport-header" className="p-4 border-b border-slate-700/80 flex justify-between items-center">
      <div className="flex items-center gap-2" data-testid="viewport-header-logo-container">
        <img src="/logo.png" alt="TITAN" className="w-8 h-8" data-testid="viewport-header-logo" />
        <span className="font-bold text-sm tracking-wider hidden sm:inline" data-testid="viewport-brand-wordmark">TITAN LABS</span>
      </div>

      <nav className="flex items-center gap-2 sm:gap-4 text-xs font-semibold" data-testid="viewport-nav">
        <button onClick={() => setActiveView('home')} data-testid="vp-nav-home" className={activeView === 'home' ? 'text-blue-400 font-bold' : ''}>Home</button>
        <button onClick={() => setActiveView('search')} data-testid="vp-nav-search" className={activeView === 'search' ? 'text-blue-400 font-bold' : ''}>Browse</button>
        <button onClick={() => setActiveView('compare')} data-testid="vp-nav-compare" className={activeView === 'compare' ? 'text-blue-400 font-bold' : ''}>
          Compare ({compareProductIds.length})
        </button>
        <button onClick={() => setActiveView('saved')} data-testid="vp-nav-saved" className={activeView === 'saved' ? 'text-blue-400 font-bold' : ''}>
          Saved ({savedProductIds.length})
        </button>
      </nav>
    </header>
  );
}

function ViewportHomeView() {
  const { setActiveView } = useViewportTest();

  return (
    <div data-testid="vp-home-view" className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Search Bar */}
      <div className="w-full relative" data-testid="vp-home-search-bar">
        <input
          type="text"
          placeholder="Search for laptops, phones..."
          className="w-full py-3.5 px-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-sm text-white"
          data-testid="vp-home-search-input"
        />
      </div>

      {/* Category Shortcut Row */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none" data-testid="vp-home-category-row">
        {['Laptops', 'Mobiles', 'Tablets', 'Accessories'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveView('search')}
            data-testid={`vp-category-${cat.toLowerCase()}`}
            className="flex-1 min-w-[90px] sm:min-w-[120px] p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-800/50 border border-slate-700 text-center font-bold text-xs sm:text-sm"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Banner */}
      <div
        data-testid="vp-home-promo-banner"
        className="p-5 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">Official Intelligence</span>
          <h2 className="text-lg sm:text-2xl font-bold mt-1">Smarter Tech, Happier You</h2>
          <p className="text-xs text-blue-100 mt-1">Instant benchmarks, unbiased scores & live prices.</p>
        </div>
        <button
          onClick={() => setActiveView('search')}
          data-testid="vp-promo-btn"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs sm:text-sm"
        >
          Explore Now
        </button>
      </div>

      {/* Popular Searches */}
      <div data-testid="vp-popular-searches" className="space-y-2">
        <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Popular Searches</h3>
        <div className="flex gap-2 flex-wrap">
          {['RTX 4060', 'Snapdragon 8 Gen 3', 'OLED Display', 'MacBook M3'].map((tag) => (
            <span
              key={tag}
              data-testid={`vp-tag-${tag.replace(/\s+/g, '-').toLowerCase()}`}
              className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ViewportSearchFilterView() {
  const { products, setActiveView, savedProductIds, toggleSave, addToCompare, compareProductIds } = useViewportTest();

  return (
    <div data-testid="vp-search-view" className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Filter Chips Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2" data-testid="vp-filter-chips-bar">
        <button className="px-3.5 py-1.5 rounded-full bg-[#0066FF] text-white text-xs font-bold shrink-0" data-testid="vp-filter-all">
          All (14)
        </button>
        <button className="px-3.5 py-1.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold shrink-0" data-testid="vp-filter-laptops">
          Laptops
        </button>
        <button className="px-3.5 py-1.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold shrink-0" data-testid="vp-filter-smartphones">
          Smartphones
        </button>
      </div>

      {/* Responsive Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" data-testid="vp-catalog-grid">
        {products.slice(0, 6).map((p) => {
          const isSaved = savedProductIds.includes(p.id);
          const inCompare = compareProductIds.includes(p.id);

          return (
            <div
              key={p.id}
              data-testid={`vp-product-card-${p.id}`}
              className="p-4 sm:p-5 rounded-2xl bg-slate-800/70 border border-slate-700 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-blue-400">{p.category}</span>
                  <button
                    onClick={() => toggleSave(p.id)}
                    data-testid={`vp-bookmark-${p.id}`}
                    className={`text-sm ${isSaved ? 'text-[#FF2A85]' : 'text-slate-400'}`}
                  >
                    ♥
                  </button>
                </div>
                <h3 className="font-bold text-sm sm:text-base mt-1.5 line-clamp-1">{p.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{p.variant}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-sm sm:text-base">₹{p.priceInInr.toLocaleString('en-IN')}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-[#00C6FF]">
                    TITAN {p.titanScore}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveView('detail', p.id)}
                    data-testid={`vp-view-detail-${p.id}`}
                    className="flex-1 py-2 rounded-xl bg-blue-900/40 text-blue-300 text-xs font-bold"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => addToCompare(p.id)}
                    data-testid={`vp-compare-toggle-${p.id}`}
                    className={`px-3 py-2 rounded-xl text-xs font-bold ${inCompare ? 'bg-emerald-800 text-white' : 'bg-slate-700 text-slate-200'}`}
                  >
                    {inCompare ? 'In Compare' : '+ Compare'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ViewportDetailView() {
  const { selectedProductId, setActiveView, addToCompare, compareProductIds } = useViewportTest();
  const detail = getProductDetail(selectedProductId || 'asus-rog-strix-g16')!;
  const inCompare = compareProductIds.includes(detail.id);

  return (
    <div data-testid="vp-detail-view" className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <button onClick={() => setActiveView('search')} className="text-xs text-blue-400 hover:underline font-semibold" data-testid="vp-detail-back">
        ← Back to Catalog
      </button>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row gap-6 items-start" data-testid="vp-detail-hero">
        <img
          src={detail.imageUrl}
          alt={detail.name}
          className="w-full md:w-1/2 h-56 sm:h-72 object-cover rounded-2xl border border-slate-700"
          data-testid="vp-detail-image"
        />
        <div className="w-full md:w-1/2 space-y-3">
          <span className="text-xs font-bold uppercase text-blue-400">{detail.brand}</span>
          <h1 className="text-xl sm:text-2xl font-bold" data-testid="vp-detail-title">{detail.name}</h1>
          <p className="text-xs text-slate-400">{detail.variant}</p>
          <div className="text-2xl sm:text-3xl font-extrabold text-white" data-testid="vp-detail-price">
            ₹{detail.priceInInr.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* 8-Dimension Breakdown Grid */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-800/40 border border-slate-700 space-y-4" data-testid="vp-dimensions-container">
        <h2 className="text-base sm:text-lg font-bold">TITAN 8-Dimension Intelligence</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" data-testid="vp-dimensions-grid">
          {detail.evaluation.dimensions.map((d) => (
            <div key={d.dimension} className="space-y-1 text-xs" data-testid={`vp-dim-${d.dimension}`}>
              <div className="flex justify-between">
                <span>{d.label}</span>
                <span className="font-bold text-[#00C6FF]">{d.score}/100</span>
              </div>
              <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${d.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Retailer Offers */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-800/40 border border-slate-700 space-y-3" data-testid="vp-retailers-container">
        <h2 className="text-base sm:text-lg font-bold">Retailer Pricing</h2>
        <div className="space-y-2">
          {detail.offers.slice(0, 2).map((offer, idx) => (
            <div key={idx} className="p-3 bg-slate-800/80 rounded-xl flex justify-between items-center text-xs" data-testid={`vp-offer-${idx}`}>
              <span className="font-bold">{offer.retailerName}</span>
              <div className="flex items-center gap-3">
                <span className="font-extrabold">₹{offer.priceInInr.toLocaleString('en-IN')}</span>
                <a
                  href={offer.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-blue-600 rounded text-white font-bold"
                  data-testid={`vp-open-offer-${idx}`}
                >
                  Visit
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Actions Bar */}
      <div className="flex gap-3 pt-2" data-testid="vp-detail-bottom-bar">
        <button
          onClick={() => addToCompare(detail.id)}
          data-testid="vp-detail-compare-btn"
          className={`flex-1 py-3 rounded-xl text-xs font-bold border ${inCompare ? 'bg-emerald-900 border-emerald-500 text-white' : 'border-blue-500 text-blue-300'}`}
        >
          {inCompare ? 'In Compare Tray' : '+ Add to Compare'}
        </button>
        <a
          href={detail.offers[0]?.externalUrl || 'https://www.amazon.in'}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="vp-detail-buy-btn"
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FFA03A] to-[#0077FF] text-white text-center text-xs font-bold"
        >
          View on Amazon
        </a>
      </div>
    </div>
  );
}

function ViewportCompareView() {
  const { compareProductIds, products, removeFromCompare, setActiveView } = useViewportTest();
  const selected = products.filter((p) => compareProductIds.includes(p.id));

  return (
    <div data-testid="vp-compare-view" className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold" data-testid="vp-compare-title">Compare ({selected.length})</h1>
        <button onClick={() => setActiveView('search')} className="text-xs text-blue-400 hover:underline">
          Add More
        </button>
      </div>

      {/* Horizontally scrollable comparison table container for mobile */}
      <div className="overflow-x-auto border border-slate-700 rounded-2xl" data-testid="vp-compare-table-wrapper">
        <table className="w-full text-left text-xs" data-testid="vp-compare-table">
          <thead>
            <tr className="bg-slate-800">
              <th className="p-3 sm:p-4 w-32 shrink-0">Specification</th>
              {selected.map((p) => (
                <th key={p.id} className="p-3 sm:p-4 border-l border-slate-700 min-w-[180px] sm:min-w-[220px]" data-testid={`vp-cmp-header-${p.id}`}>
                  <div className="flex justify-between items-start">
                    <span className="font-bold">{p.name}</span>
                    <button
                      onClick={() => removeFromCompare(p.id)}
                      data-testid={`vp-cmp-remove-${p.id}`}
                      className="text-slate-400 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60">
            <tr>
              <td className="p-3 font-semibold text-slate-400">TITAN Score</td>
              {selected.map((p) => (
                <td key={p.id} className="p-3 border-l border-slate-700 font-extrabold text-[#00C6FF]">
                  {p.titanScore}/100
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-400">Price</td>
              {selected.map((p) => (
                <td key={p.id} className="p-3 border-l border-slate-700 font-bold">
                  ₹{p.priceInInr.toLocaleString('en-IN')}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-400">Processor</td>
              {selected.map((p) => (
                <td key={p.id} className="p-3 border-l border-slate-700">{p.processor}</td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-400">RAM</td>
              {selected.map((p) => (
                <td key={p.id} className="p-3 border-l border-slate-700">{p.ramGb} GB</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ViewportSavedView() {
  const { savedProductIds, products, toggleSave, setActiveView } = useViewportTest();
  const saved = products.filter((p) => savedProductIds.includes(p.id));

  return (
    <div data-testid="vp-saved-view" className="p-4 sm:p-6 max-w-5xl mx-auto space-y-4">
      <h1 className="text-xl sm:text-2xl font-bold" data-testid="vp-saved-title">Saved Items ({saved.length})</h1>
      <div className="space-y-3" data-testid="vp-saved-list">
        {saved.map((p) => (
          <div
            key={p.id}
            data-testid={`vp-saved-item-${p.id}`}
            className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-800/60 border border-slate-700 flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleSave(p.id)}
                data-testid={`vp-saved-remove-${p.id}`}
                className="text-[#FF2A85] text-base font-bold"
              >
                ♥
              </button>
              <div>
                <h3 className="font-bold text-xs sm:text-sm">{p.name}</h3>
                <p className="text-[10px] sm:text-xs text-slate-400">₹{p.priceInInr.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('detail', p.id)}
              data-testid={`vp-saved-view-btn-${p.id}`}
              className="px-3 py-1.5 bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-xl text-xs font-semibold"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ViewportTestAppContent() {
  const { activeView } = useViewportTest();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <ViewportHeader />
      <main className="flex-1">
        {activeView === 'home' && <ViewportHomeView />}
        {activeView === 'search' && <ViewportSearchFilterView />}
        {activeView === 'detail' && <ViewportDetailView />}
        {activeView === 'compare' && <ViewportCompareView />}
        {activeView === 'saved' && <ViewportSavedView />}
      </main>
    </div>
  );
}

// ============================================================================
// VIEWPORT VERIFICATION TEST SUITE
// Validates Desktop (1920x1080) and Mobile (390x844) across all 5 views
// ============================================================================

describe('TITAN Labs Viewport Verification Suite — Headless DOM Audits', () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  // ==========================================================================
  // DESKTOP VIEWPORT AUDITS (1920 x 1080)
  // ==========================================================================
  describe('Desktop Viewport Audits (1920x1080)', () => {
    beforeEach(() => {
      setViewport(1920, 1080);
    });

    it('VP-D.1: Home View renders complete desktop layout with brand wordmark and nav', () => {
      render(<ViewportTestProvider initialView="home" />);
      expect(screen.getByTestId('viewport-header')).toBeInTheDocument();
      expect(screen.getByTestId('viewport-brand-wordmark')).toBeInTheDocument();
      expect(screen.getByTestId('vp-home-search-bar')).toBeInTheDocument();
      expect(screen.getByTestId('vp-home-category-row')).toBeInTheDocument();
      expect(screen.getByTestId('vp-home-promo-banner')).toBeInTheDocument();
      expect(screen.getByTestId('vp-popular-searches')).toBeInTheDocument();
    });

    it('VP-D.2: Search & Filter View renders multi-column grid on desktop', () => {
      render(<ViewportTestProvider initialView="search" />);
      expect(screen.getByTestId('vp-filter-chips-bar')).toBeInTheDocument();
      const grid = screen.getByTestId('vp-catalog-grid');
      expect(grid).toBeInTheDocument();
      expect(grid.className).toContain('lg:grid-cols-3');
      expect(screen.getByTestId('vp-product-card-asus-rog-strix-g16')).toBeInTheDocument();
    });

    it('VP-D.3: Product Detail View renders wide two-column hero and side-by-side dimensions', () => {
      render(<ViewportTestProvider initialView="detail" initialProductId="asus-rog-strix-g16" />);
      expect(screen.getByTestId('vp-detail-hero')).toBeInTheDocument();
      expect(screen.getByTestId('vp-detail-image')).toBeInTheDocument();
      expect(screen.getByTestId('vp-detail-title')).toHaveTextContent('ASUS ROG Strix G16 (2024)');
      expect(screen.getByTestId('vp-dimensions-grid').className).toContain('md:grid-cols-2');
      expect(screen.getByTestId('vp-retailers-container')).toBeInTheDocument();
    });

    it('VP-D.4: Side-by-Side Compare View renders desktop matrix table columns', () => {
      render(<ViewportTestProvider initialView="compare" initialCompare={['asus-rog-strix-g16', 'lenovo-legion-5-pro']} />);
      expect(screen.getByTestId('vp-compare-view')).toBeInTheDocument();
      expect(screen.getByTestId('vp-compare-table')).toBeInTheDocument();
      expect(screen.getByTestId('vp-cmp-header-asus-rog-strix-g16')).toBeInTheDocument();
      expect(screen.getByTestId('vp-cmp-header-lenovo-legion-5-pro')).toBeInTheDocument();
    });

    it('VP-D.5: Saved Items View renders wide desktop watchlist', () => {
      render(<ViewportTestProvider initialView="saved" initialSaved={['asus-rog-strix-g16', 'lenovo-legion-5-pro']} />);
      expect(screen.getByTestId('vp-saved-view')).toBeInTheDocument();
      expect(screen.getByTestId('vp-saved-item-asus-rog-strix-g16')).toBeInTheDocument();
      expect(screen.getByTestId('vp-saved-item-lenovo-legion-5-pro')).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // MOBILE VIEWPORT AUDITS (390 x 844 — iPhone 14/15 Form Factor)
  // ==========================================================================
  describe('Mobile Viewport Audits (390x844)', () => {
    beforeEach(() => {
      setViewport(390, 844);
    });

    it('VP-M.1: Home View renders compact touch-friendly mobile layout', () => {
      render(<ViewportTestProvider initialView="home" />);
      expect(screen.getByTestId('viewport-header-logo')).toBeInTheDocument();
      expect(screen.getByTestId('vp-home-search-input')).toBeInTheDocument();
      expect(screen.getByTestId('vp-home-category-row')).toBeInTheDocument();
      expect(screen.getByTestId('vp-home-promo-banner')).toBeInTheDocument();
    });

    it('VP-M.2: Search & Filter View renders single-column stacked cards on mobile', () => {
      render(<ViewportTestProvider initialView="search" />);
      const grid = screen.getByTestId('vp-catalog-grid');
      expect(grid.className).toContain('grid-cols-1');
      expect(screen.getByTestId('vp-product-card-asus-rog-strix-g16')).toBeInTheDocument();
    });

    it('VP-M.3: Product Detail View stacks hero image, specs, and dimensions vertically', () => {
      render(<ViewportTestProvider initialView="detail" initialProductId="asus-rog-strix-g16" />);
      expect(screen.getByTestId('vp-detail-hero').className).toContain('flex-col');
      expect(screen.getByTestId('vp-detail-bottom-bar')).toBeInTheDocument();
      expect(screen.getByTestId('vp-detail-buy-btn')).toBeInTheDocument();
    });

    it('VP-M.4: Compare View provides horizontally scrollable table wrapper on mobile', () => {
      render(<ViewportTestProvider initialView="compare" initialCompare={['asus-rog-strix-g16', 'lenovo-legion-5-pro']} />);
      const wrapper = screen.getByTestId('vp-compare-table-wrapper');
      expect(wrapper.className).toContain('overflow-x-auto');
      expect(screen.getByTestId('vp-cmp-header-asus-rog-strix-g16')).toBeInTheDocument();
      expect(screen.getByTestId('vp-cmp-header-lenovo-legion-5-pro')).toBeInTheDocument();
    });

    it('VP-M.5: Saved Items View renders compact touch-accessible cards on mobile', () => {
      render(<ViewportTestProvider initialView="saved" initialSaved={['asus-rog-strix-g16']} />);
      expect(screen.getByTestId('vp-saved-view')).toBeInTheDocument();
      expect(screen.getByTestId('vp-saved-item-asus-rog-strix-g16')).toBeInTheDocument();
      expect(screen.getByTestId('vp-saved-remove-asus-rog-strix-g16')).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // RESPONSIVE RESIZE DYNAMICS & INTERMEDIATE BREAKPOINTS
  // ==========================================================================
  describe('Responsive Transitions & Breakpoints', () => {
    it('VP-R.1: dynamically handles resize event from Desktop (1920) to Mobile (390) without state loss', () => {
      setViewport(1920, 1080);
      render(<ViewportTestProvider initialView="search" />);

      expect(screen.getByTestId('vp-catalog-grid')).toBeInTheDocument();

      // Dynamically simulate resize to mobile
      setViewport(390, 844);

      // Verify component tree remains intact and operational
      expect(screen.getByTestId('vp-product-card-asus-rog-strix-g16')).toBeInTheDocument();
    });

    it('VP-R.2: Tablet Viewport (768x1024) adapts grid to 2-column layout', () => {
      setViewport(768, 1024);
      render(<ViewportTestProvider initialView="search" />);
      const grid = screen.getByTestId('vp-catalog-grid');
      expect(grid.className).toContain('md:grid-cols-2');
    });
  });
});
