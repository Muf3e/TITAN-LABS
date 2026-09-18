import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Trash2,
  Plus,
  Zap,
} from 'lucide-react';

export const PriceAlertsScreen: React.FC = () => {
  const {
    priceAlerts,
    addPriceAlert,
    togglePriceAlert,
    deletePriceAlert,
    products,
    simulatedNotification,
    clearNotification,
  } = useApp();

  const [selectedProduct, setSelectedProduct] = useState<string>(
    products[0] ? products[0].id : 'asus-rog-strix-g16'
  );
  const [targetPriceInput, setTargetPriceInput] = useState<string>('130000');

  const handleCreateAlert = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const numPrice = Number(targetPriceInput);
    if (!selectedProduct || isNaN(numPrice) || numPrice <= 0) return;
    addPriceAlert(selectedProduct, numPrice);
  };

  const handleSimulateDrop = () => {
    const prod = products.find((p) => p.id === selectedProduct) || products[0];
    if (prod) {
      addPriceAlert(prod.id, prod.priceInInr + 1000);
    }
  };

  return (
    <div
      data-testid="price-alerts-screen"
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn"
    >
      {/* 1. Header & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1
            data-testid="alerts-title"
            className="text-2xl sm:text-3xl font-black brand-font text-slate-900 dark:text-white"
          >
            Price Alerts
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Get notified when prices drop on your favourite hardware products.
          </p>
        </div>

        {/* Simulation Action Button */}
        <button
          onClick={handleSimulateDrop}
          data-testid="simulate-alert-btn"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FFA03A] to-[#FF2A85] text-white font-bold text-xs shadow-md hover:opacity-95 transition-opacity cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>⚡ Simulate Price Drop Alert</span>
        </button>
      </div>

      {/* 2. Simulated Notification Banner */}
      {simulatedNotification && (
        <div
          data-testid="simulated-notification-banner"
          className="p-4 rounded-2xl bg-gradient-to-r from-[#FFA03A]/20 via-[#FF2A85]/20 to-[#7B2CBF]/20 border border-[#FFA03A]/50 text-slate-900 dark:text-white flex items-center justify-between shadow-md"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[#FFA03A] animate-bounce shrink-0" />
            <span className="font-bold text-xs sm:text-sm">{simulatedNotification}</span>
          </div>
          <button
            onClick={clearNotification}
            className="text-xs font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded bg-black/10 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. Add Price Alert Form Bar */}
      <div
        data-testid="add-alert-bar"
        className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] shadow-sm space-y-4"
      >
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#0066FF]" />
          <span>Track New Product</span>
        </h3>

        <form onSubmit={handleCreateAlert} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          {/* Product Select */}
          <div className="sm:col-span-6 space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Select Product
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              data-testid="alert-product-select"
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#0066FF]"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — Current: ₹{p.priceInInr.toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          </div>

          {/* Target Price */}
          <div className="sm:col-span-3 space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Target Price (₹)
            </label>
            <input
              type="number"
              value={targetPriceInput}
              onChange={(e) => setTargetPriceInput(e.target.value)}
              placeholder="e.g. 130000"
              data-testid="alert-price-input"
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-[#0066FF]"
            />
          </div>

          {/* Submit CTA */}
          <div className="sm:col-span-3">
            <button
              type="submit"
              data-testid="create-alert-btn"
              className="w-full p-3 rounded-xl bg-gradient-to-r from-[#00C6FF] to-[#0066FF] text-white font-bold text-xs sm:text-sm shadow-md hover:opacity-95 transition-opacity cursor-pointer text-center"
            >
              + Add Price Alert
            </button>
          </div>
        </form>
      </div>

      {/* 4. Active Alerts List */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
          Active Price Tracking ({priceAlerts.length})
        </h3>

        {priceAlerts.length === 0 ? (
          <div
            data-testid="no-alerts-msg"
            className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-400"
          >
            <Bell className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="font-medium text-sm">No active price alerts.</p>
          </div>
        ) : (
          <div data-testid="alerts-list" className="space-y-3">
            {priceAlerts.map((a) => {
              const prod = products.find((p) => p.id === a.productId);
              return (
                <div
                  key={a.id}
                  data-testid={`alert-item-${a.id}`}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <h3
                      data-testid={`alert-name-${a.id}`}
                      className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white"
                    >
                      {a.productName || prod?.name || 'Device'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      <span>Notify when price is </span>
                      <span className="text-[#00C6FF] font-bold">
                        ₹{a.targetPrice.toLocaleString('en-IN')} or below
                      </span>
                      {prod && (
                        <span className="ml-2 text-slate-400">
                          (Current: ₹{prod.priceInInr.toLocaleString('en-IN')})
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    {/* Toggle Active / Paused switch */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        role="checkbox"
                        checked={a.active}
                        onChange={() => togglePriceAlert(a.id)}
                        data-testid={`alert-toggle-${a.id}`}
                        className="w-4 h-4 rounded text-[#0066FF] focus:ring-[#0066FF] cursor-pointer"
                      />
                      <span
                        className={`text-xs font-bold ${
                          a.active ? 'text-[#00C853]' : 'text-slate-400'
                        }`}
                      >
                        {a.active ? 'Active' : 'Paused'}
                      </span>
                    </label>

                    {/* Delete button */}
                    <button
                      onClick={() => deletePriceAlert(a.id)}
                      data-testid={`alert-delete-${a.id}`}
                      className="px-3 py-1.5 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default PriceAlertsScreen;
