import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bookmark,
  Search,
  Trash2,
  ChevronRight,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const SavedScreen: React.FC = () => {
  const { savedProductIds, products, toggleSaveProduct, setActiveView, setSearchQuery } = useApp();
  const [activeTab, setActiveTab] = useState<'products' | 'searches'>('products');
  const [savedSearches, setSavedSearches] = useState<string[]>([
    'Ryzen 7 laptop under 80000',
    'RTX 4060 Gaming Laptop',
    'iPhone 15 under 70000',
  ]);

  const savedProducts = useMemo(() => {
    return products.filter((p) => savedProductIds.includes(p.id));
  }, [products, savedProductIds]);

  const handleRunSearch = (query: string) => {
    setSearchQuery(query);
    setActiveView('search');
  };

  const handleRemoveSearch = (query: string) => {
    setSavedSearches((prev) => prev.filter((q) => q !== query));
  };

  return (
    <div
      data-testid="saved-screen"
      className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn"
    >
      <div data-testid="vp-saved-view" className="sr-only">
        VP Saved View
      </div>

      {/* Header & Segmented Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1
            data-testid="saved-title"
            className="text-2xl sm:text-3xl font-black brand-font text-slate-900 dark:text-white"
          >
            Saved Items ({savedProducts.length})
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Bookmarked hardware and recorded search queries
          </p>
        </div>

        {/* Segmented Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-white dark:bg-[#131B2E] text-[#0066FF] shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Products ({savedProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('searches')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'searches'
                ? 'bg-white dark:bg-[#131B2E] text-[#0066FF] shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Searches ({savedSearches.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Products */}
      {activeTab === 'products' && (
        <>
          {savedProducts.length === 0 ? (
            <div data-testid="saved-empty-state" className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto text-[#FF2A85]">
                <Bookmark className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                No saved items yet
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our evidence-backed catalog and bookmark products to monitor price drops and compare specs.
              </p>
              <button
                onClick={() => setActiveView('search')}
                data-testid="saved-search-products-btn"
                id="saved-search-cta"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFA03A] to-[#FF2A85] text-white font-bold text-xs shadow-md hover:opacity-95 transition-opacity cursor-pointer inline-flex items-center gap-1.5"
              >
                <span data-testid="saved-search-cta" className="sr-only">Search Products</span>
                <span>Search Products</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              data-testid="saved-items-list"
              className="space-y-4"
            >
              <div data-testid="saved-products-grid" className="sr-only">
                Saved Products Grid
              </div>
              {savedProducts.map((p) => (
                <div
                  key={p.id}
                  data-testid={`saved-card-${p.id}`}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-[#0066FF]/40 transition-colors"
                >
                  <div
                    data-testid={`vp-saved-item-${p.id}`}
                    className="flex items-center gap-4 min-w-0"
                  >
                    <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
                      ) : (
                        <Layers className="w-6 h-6 text-slate-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0066FF]/10 text-[#0066FF] uppercase">
                          {p.category}
                        </span>
                        <span className="text-[10px] font-bold text-[#00C6FF]">
                          TITAN {p.titanScore}
                        </span>
                      </div>
                      <h3
                        data-testid={`saved-name-${p.id}`}
                        className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate mt-1"
                      >
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-400 truncate">{p.variant}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="text-right">
                      <div className="text-base font-black text-slate-900 dark:text-white">
                        ₹{p.priceInInr.toLocaleString('en-IN')}
                      </div>
                      {p.discountPercent && (
                        <span className="text-[10px] font-bold text-[#00C853]">
                          ↓ {p.discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveView('detail', p.id)}
                        data-testid={`saved-view-btn-${p.id}`}
                        className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0055D4] text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        onClick={() => toggleSaveProduct(p.id)}
                        data-testid={`saved-remove-btn-${p.id}`}
                        aria-label="Remove from saved"
                        className="p-2 rounded-xl border border-pink-500/30 bg-pink-500/10 text-[#FF2A85] hover:bg-pink-500/20 transition-colors cursor-pointer"
                      >
                        <span data-testid={`vp-saved-remove-${p.id}`} className="sr-only">
                          Remove
                        </span>
                        ♥
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Tab 2: Saved Searches */}
      {activeTab === 'searches' && (
        <div className="space-y-4">
          {savedSearches.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p>No saved searches.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedSearches.map((query, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] flex items-center justify-between gap-3 shadow-sm"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Search className="w-4 h-4 text-[#0066FF] shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold truncate">{query}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleRunSearch(query)}
                      className="px-3 py-1.5 rounded-lg bg-[#0066FF]/10 text-[#0066FF] hover:bg-[#0066FF]/20 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Run</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleRemoveSearch(query)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default SavedScreen;
