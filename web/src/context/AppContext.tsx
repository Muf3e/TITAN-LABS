import React, { createContext, useContext, useState, useEffect } from 'react';
import { SAMPLE_PRODUCTS, SampleProduct } from '../data/mockProducts';
import {
  FilterState,
  PriceAlert,
} from '../types';

export type ActiveView =
  | 'splash'
  | 'onboarding'
  | 'home'
  | 'search'
  | 'detail'
  | 'compare'
  | 'saved'
  | 'alerts'
  | 'account'
  | 'recommendation'
  | 'architecture';

export type ThemeMode = 'dark' | 'light';

export interface AppContextType {
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
  activeTheme: ThemeMode;
  toggleTheme: () => void;
  priceAlerts: PriceAlert[];
  addPriceAlert: (productId: string, targetPrice: number) => void;
  togglePriceAlert: (id: string) => void;
  deletePriceAlert: (id: string) => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView, productId?: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  onboardingStep: number;
  setOnboardingStep: React.Dispatch<React.SetStateAction<number>>;
  simulatedNotification: string | null;
  clearNotification: () => void;
}

export const defaultFilterState: FilterState = {
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

function safeGetStorage(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    // Graceful fallback for restricted environments
  }
  return null;
}

function safeSetStorage(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // Graceful fallback
  }
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export const useAppContext = useApp;

export interface AppProviderProps {
  children: React.ReactNode;
  initialView?: ActiveView;
  initialProductId?: string | null;
}

export const AppProvider: React.FC<AppProviderProps> = ({
  children,
  initialView = 'splash',
  initialProductId = null,
}) => {
  const [products] = useState<SampleProduct[]>(SAMPLE_PRODUCTS);
  const [activeView, setActiveViewRaw] = useState<ActiveView>(
    (initialView as string) === 'onboarding' ? 'home' : initialView
  );
  const [selectedProductId, setSelectedProductId] = useState<string | null>(initialProductId);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterState, setFilterState] = useState<FilterState>(defaultFilterState);
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [simulatedNotification, setSimulatedNotification] = useState<string | null>(null);

  // Theme state synchronized with localStorage and DOM <html> classes
  const [activeTheme, setActiveTheme] = useState<ThemeMode>(() => {
    const saved = safeGetStorage('titan_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  // Saved items persistence (supports titan_saved_items and titan_saved_products)
  const [savedProductIds, setSavedProductIds] = useState<string[]>(() => {
    const raw = safeGetStorage('titan_saved_items') || safeGetStorage('titan_saved_products');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return [];
      }
    }
    return ['asus-rog-strix-g16', 'macbook-air-m3'];
  });

  // Compare items persistence (supports titan_compare_items and titan_compare_products)
  const [compareProductIds, setCompareProductIds] = useState<string[]>(() => {
    const raw = safeGetStorage('titan_compare_items') || safeGetStorage('titan_compare_products');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return [];
      }
    }
    return ['asus-rog-strix-g16', 'lenovo-legion-5-pro'];
  });

  // Price alerts persistence (titan_price_alerts)
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    const raw = safeGetStorage('titan_price_alerts');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return [];
      }
    }
    return [
      {
        id: 'alert-sample-1',
        productId: 'asus-rog-strix-g16',
        productName: 'ASUS ROG Strix G16 (2024)',
        currentPrice: 149990,
        targetPrice: 140000,
        createdAt: new Date().toISOString(),
        active: true,
      },
      {
        id: 'alert-sample-2',
        productId: 'iphone-15',
        productName: 'iPhone 15',
        currentPrice: 69900,
        targetPrice: 65000,
        createdAt: new Date().toISOString(),
        active: true,
      },
    ];
  });

  // DOM sync for Theme
  useEffect(() => {
    safeSetStorage('titan_theme', activeTheme);
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (activeTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.classList.remove('light-theme');
      } else {
        root.classList.add('light');
        root.classList.add('light-theme');
        root.classList.remove('dark');
      }
    }
  }, [activeTheme]);

  // Storage sync for Saved Items
  useEffect(() => {
    const str = JSON.stringify(savedProductIds);
    safeSetStorage('titan_saved_items', str);
    safeSetStorage('titan_saved_products', str);
  }, [savedProductIds]);

  // Storage sync for Compare Items
  useEffect(() => {
    const str = JSON.stringify(compareProductIds);
    safeSetStorage('titan_compare_items', str);
    safeSetStorage('titan_compare_products', str);
  }, [compareProductIds]);

  // Storage sync for Price Alerts
  useEffect(() => {
    safeSetStorage('titan_price_alerts', JSON.stringify(priceAlerts));
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
    if (compareProductIds.includes(id)) {
      return true;
    }
    if (compareProductIds.length >= 4) {
      return false; // Strict 4-device maximum limit
    }
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
      setSimulatedNotification(
        `Price Alert Triggered: ${prod.name} is now ₹${prod.priceInInr.toLocaleString('en-IN')}!`
      );
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

  const setActiveView = (view: ActiveView, productId?: string) => {
    const target = (view as string) === 'onboarding' ? 'home' : view;
    setActiveViewRaw(target);
    if (productId !== undefined) {
      setSelectedProductId(productId);
    }
  };

  const clearNotification = () => {
    setSimulatedNotification(null);
  };

  return (
    <AppContext.Provider
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
        setSelectedProductId,
        onboardingStep,
        setOnboardingStep,
        simulatedNotification,
        clearNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
