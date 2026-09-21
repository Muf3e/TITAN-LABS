import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SplashScreen } from './pages/SplashScreen';
import { HomeScreen } from './pages/HomeScreen';
import { SearchCatalogScreen } from './pages/SearchCatalogScreen';
import { ProductDetailScreen } from './pages/ProductDetailScreen';
import { CompareScreen } from './pages/CompareScreen';
import { SavedScreen } from './pages/SavedScreen';
import { PriceAlertsScreen } from './pages/PriceAlertsScreen';
import { AccountScreen } from './pages/AccountScreen';
import { RecommendationScreen } from './pages/RecommendationScreen';
import { ArchitectureScreen } from './pages/ArchitectureScreen';
import { BestLaptopsScreen } from './pages/BestLaptopsScreen';

export const App: React.FC = () => {
  const { activeTheme, activeView } = useApp();

  return (
    <div
      data-testid="titan-app-root"
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        activeTheme === 'dark'
          ? 'dark bg-[#0B0F19] text-[#F8FAFC]'
          : 'light bg-[#F8F9FD] text-[#0F172A]'
      }`}
    >
      {activeView !== 'splash' && <Header />}

      <main className="flex-1">
        {activeView === 'splash' && <SplashScreen />}
        {activeView === 'home' && <HomeScreen />}
        {activeView === 'search' && <SearchCatalogScreen />}
        {activeView === 'detail' && <ProductDetailScreen />}
        {activeView === 'compare' && <CompareScreen />}
        {activeView === 'saved' && <SavedScreen />}
        {activeView === 'alerts' && <PriceAlertsScreen />}
        {activeView === 'account' && <AccountScreen />}
        {activeView === 'recommendation' && <RecommendationScreen />}
        {activeView === 'architecture' && <ArchitectureScreen />}
        {activeView === 'best-laptops' && <BestLaptopsScreen />}
      </main>

      {activeView !== 'splash' && <Footer />}
    </div>
  );
};

export default App;
