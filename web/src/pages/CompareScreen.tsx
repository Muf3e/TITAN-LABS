import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Scale,
  X,
  ChevronRight,
  SlidersHorizontal,
  Trophy,
} from 'lucide-react';

export const CompareScreen: React.FC = () => {
  const { compareProductIds, products, removeFromCompare, clearCompare, setActiveView } = useApp();
  const [diffHighlight, setDiffHighlight] = useState(false);

  const selectedProducts = useMemo(() => {
    return products.filter((p) => compareProductIds.includes(p.id));
  }, [products, compareProductIds]);

  // Handle Empty State (0 devices)
  if (selectedProducts.length === 0) {
    return (
      <div
        data-testid="compare-screen"
        className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6 animate-fadeIn"
      >
        <div data-testid="vp-compare-view" className="sr-only">
          VP Compare View
        </div>
        <div data-testid="compare-empty-state" className="space-y-4">
          <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-[#0066FF]">
            <Scale className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            No devices selected for comparison
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Select 2 to 4 devices from the catalog to compare specifications, benchmarks, and verdicts side-by-side.
          </p>
          <button
            onClick={() => setActiveView('search')}
            data-testid="compare-browse-catalog-btn"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00C6FF] to-[#0066FF] text-white font-bold text-xs sm:text-sm shadow-md hover:opacity-95 transition-opacity cursor-pointer inline-flex items-center gap-2"
          >
            <span>Browse Catalog</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Spec helper for row diff calculation
  const isRowDifferent = (accessor: (p: any) => any) => {
    if (selectedProducts.length < 2) return false;
    const first = accessor(selectedProducts[0]);
    return selectedProducts.some((p) => accessor(p) !== first);
  };

  // Best score / winner finder
  const bestScoreProdId = selectedProducts.reduce(
    (max, p) => (p.titanScore > max.titanScore ? p : max),
    selectedProducts[0]
  ).id;

  const lowestPriceProdId = selectedProducts.reduce(
    (min, p) => (p.priceInInr < min.priceInInr ? p : min),
    selectedProducts[0]
  ).id;

  return (
    <div
      data-testid="compare-screen"
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fadeIn"
    >
      <div data-testid="vp-compare-view" className="sr-only">
        VP Compare View
      </div>

      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1
            data-testid="compare-title"
            className="text-2xl sm:text-3xl font-black brand-font text-slate-900 dark:text-white"
          >
            Compare ({selectedProducts.length})
          </h1>
          <span data-testid="vp-compare-title" className="sr-only">
            Compare ({selectedProducts.length})
          </span>
          <p className="text-xs text-slate-400 mt-0.5">
            Side-by-side technical evaluation (2 to 4 devices supported)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Difference Highlight Toggle */}
          <button
            onClick={() => setDiffHighlight((prev) => !prev)}
            data-testid="diff-highlight-toggle"
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              diffHighlight
                ? 'border-[#0066FF] bg-[#0066FF]/10 text-[#0066FF]'
                : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Highlight Differences</span>
          </button>

          {/* Clear All */}
          <button
            onClick={clearCompare}
            data-testid="compare-clear-all-btn"
            id="compare-clear-btn"
            className="text-xs font-bold text-red-500 hover:text-red-600 px-3 py-1.5 rounded-xl border border-red-500/20 hover:bg-red-500/10 cursor-pointer flex items-center gap-1"
          >
            <span data-testid="compare-clear-btn" className="sr-only">
              Clear All
            </span>
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Warning banner when only 1 device is selected */}
      {selectedProducts.length === 1 && (
        <div
          data-testid="compare-single-warning"
          className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs sm:text-sm font-semibold flex items-center justify-between gap-4"
        >
          <span>Select at least 1 more device (2 to 4 devices total) to enable full side-by-side matrix comparison.</span>
          <button
            onClick={() => setActiveView('search')}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-900 font-bold text-xs cursor-pointer shrink-0"
          >
            + Add Device
          </button>
        </div>
      )}

      {/* Comparison Matrix Table */}
      <div
        data-testid="vp-compare-table-wrapper"
        className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] shadow-sm"
      >
        <table
          data-testid="compare-matrix-table"
          className="w-full text-left border-collapse"
        >
          <caption data-testid="vp-compare-table" className="sr-only">
            Comparison Table
          </caption>
          {/* Sticky Device Headers */}
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
              <th className="p-4 w-44 font-bold text-xs text-slate-400 uppercase tracking-wider sticky left-0 bg-slate-50 dark:bg-slate-900/90 z-10">
                Device Details
              </th>
              {selectedProducts.map((p) => (
                <th
                  key={p.id}
                  data-testid={`compare-col-${p.id}`}
                  className="p-4 border-l border-slate-200 dark:border-slate-800 min-w-[220px] max-w-[280px] align-top"
                >
                  <div data-testid={`vp-cmp-header-${p.id}`} className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0066FF]/10 text-[#0066FF] uppercase">
                        {p.category}
                      </span>
                      <button
                        onClick={() => removeFromCompare(p.id)}
                        data-testid={`remove-compare-${p.id}`}
                        id={`compare-remove-btn-${p.id}`}
                        aria-label={`Remove ${p.name}`}
                        className="p-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-500/10 cursor-pointer transition-colors"
                      >
                        <span data-testid={`compare-remove-btn-${p.id}`} className="sr-only">✕</span>
                        <span data-testid={`vp-cmp-remove-${p.id}`} className="sr-only">✕</span>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-2">
                      {p.name}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{p.variant}</p>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        ₹{p.priceInInr.toLocaleString('en-IN')}
                      </span>
                      {p.id === lowestPriceProdId && selectedProducts.length > 1 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#00C853] border border-emerald-500/20">
                          Best Price
                        </span>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
            {/* Row 1: TITAN Score */}
            <tr
              data-testid="compare-row-score"
              className={diffHighlight && isRowDifferent((p) => p.titanScore) ? 'bg-[#0066FF]/5' : ''}
            >
              <td className="p-4 font-bold text-slate-500 sticky left-0 bg-white dark:bg-[#131B2E]">
                TITAN Score
              </td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 border-l border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-[#00C6FF]">{p.titanScore}/100</span>
                    {p.id === bestScoreProdId && selectedProducts.length > 1 && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-[#FFA000] font-black text-[10px] flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        <span>Winner</span>
                      </span>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Row 2: Price */}
            <tr
              data-testid="compare-row-price"
              className={diffHighlight && isRowDifferent((p) => p.priceInInr) ? 'bg-[#0066FF]/5' : ''}
            >
              <td className="p-4 font-bold text-slate-500 sticky left-0 bg-white dark:bg-[#131B2E]">
                Market Price
              </td>
              {selectedProducts.map((p) => (
                <td
                  key={p.id}
                  className="p-4 border-l border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200"
                >
                  ₹{p.priceInInr.toLocaleString('en-IN')}
                </td>
              ))}
            </tr>

            {/* Row 3: Processor */}
            <tr
              data-testid="compare-row-processor"
              className={diffHighlight && isRowDifferent((p) => p.processor) ? 'bg-[#0066FF]/5' : ''}
            >
              <td className="p-4 font-bold text-slate-500 sticky left-0 bg-white dark:bg-[#131B2E]">
                Processor
              </td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 border-l border-slate-200 dark:border-slate-800 font-semibold">
                  {p.processor}
                </td>
              ))}
            </tr>

            {/* Row 4: RAM */}
            <tr
              data-testid="compare-row-ram"
              className={diffHighlight && isRowDifferent((p) => p.ramGb) ? 'bg-[#0066FF]/5' : ''}
            >
              <td className="p-4 font-bold text-slate-500 sticky left-0 bg-white dark:bg-[#131B2E]">
                RAM
              </td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 border-l border-slate-200 dark:border-slate-800 font-semibold">
                  {p.ramGb} GB
                </td>
              ))}
            </tr>

            {/* Row 5: Storage */}
            <tr
              data-testid="compare-row-storage"
              className={diffHighlight && isRowDifferent((p) => p.storageGb) ? 'bg-[#0066FF]/5' : ''}
            >
              <td className="p-4 font-bold text-slate-500 sticky left-0 bg-white dark:bg-[#131B2E]">
                Storage
              </td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 border-l border-slate-200 dark:border-slate-800 font-semibold">
                  {p.storageGb >= 1024 ? `${p.storageGb / 1024} TB` : `${p.storageGb} GB`}
                </td>
              ))}
            </tr>

            {/* Row 6: GPU */}
            <tr
              data-testid="compare-row-gpu"
              className={diffHighlight && isRowDifferent((p) => p.gpu) ? 'bg-[#0066FF]/5' : ''}
            >
              <td className="p-4 font-bold text-slate-500 sticky left-0 bg-white dark:bg-[#131B2E]">
                Graphics
              </td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 border-l border-slate-200 dark:border-slate-800 font-semibold">
                  {p.gpu || (p.hasDedicatedGpu ? 'Dedicated GPU' : 'Integrated')}
                </td>
              ))}
            </tr>

            {/* Row 7: Display */}
            <tr
              data-testid="compare-row-display"
              className={diffHighlight && isRowDifferent((p) => p.refreshRateHz) ? 'bg-[#0066FF]/5' : ''}
            >
              <td className="p-4 font-bold text-slate-500 sticky left-0 bg-white dark:bg-[#131B2E]">
                Display & Hz
              </td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 border-l border-slate-200 dark:border-slate-800 font-semibold">
                  {p.displaySizeInches}" • {p.refreshRateHz}Hz
                </td>
              ))}
            </tr>

            {/* Row 8: Battery */}
            <tr
              data-testid="compare-row-battery"
              className={diffHighlight && isRowDifferent((p) => p.batteryCapacity) ? 'bg-[#0066FF]/5' : ''}
            >
              <td className="p-4 font-bold text-slate-500 sticky left-0 bg-white dark:bg-[#131B2E]">
                Battery
              </td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 border-l border-slate-200 dark:border-slate-800 font-semibold">
                  {p.batteryCapacity}
                </td>
              ))}
            </tr>

            {/* Row 9: User Fit Verdict */}
            <tr className="bg-slate-50/50 dark:bg-slate-900/30">
              <td className="p-4 font-bold text-slate-500 sticky left-0 bg-slate-50/90 dark:bg-slate-900/90">
                User Fit Verdict
              </td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 border-l border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-[#0066FF] leading-tight block">
                    {p.hasDedicatedGpu
                      ? 'Best for Gaming & 3D Creators'
                      : p.category === 'Laptop'
                      ? 'Best for Productivity & Battery'
                      : 'Best for Daily Mobility'}
                  </span>
                </td>
              ))}
            </tr>

            {/* Row 10: Actions */}
            <tr data-testid="compare-row-actions">
              <td className="p-4 font-bold text-slate-500 sticky left-0 bg-white dark:bg-[#131B2E]">
                Actions
              </td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 border-l border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setActiveView('detail', p.id)}
                    data-testid={`compare-view-detail-${p.id}`}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00C6FF] to-[#0066FF] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-sm text-center"
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
};
export default CompareScreen;
