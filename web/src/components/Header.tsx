import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sun,
  Moon,
  Menu,
  X,
  Search,
  Scale,
  Bookmark,
  Bell,
  User,
  Home,
  AlertTriangle,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTheme,
    toggleTheme,
    activeView,
    setActiveView,
    savedProductIds,
    compareProductIds,
    priceAlerts,
    simulatedNotification,
    clearNotification,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoSrc = activeTheme === 'light' ? '/logo-light.png' : '/logo-dark.png';

  return (
    <header
      data-testid="app-header"
      className="sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-colors duration-200 border-[#334155]/60 bg-[#0B0F19]/90 text-[#F8FAFC] dark:border-[#334155]/60 dark:bg-[#0B0F19]/90 dark:text-[#F8FAFC] light:border-[#E2E8F0] light:bg-white/90 light:text-[#0F172A]"
      style={{
        backgroundColor: activeTheme === 'dark' ? 'rgba(11, 15, 25, 0.92)' : 'rgba(255, 255, 255, 0.94)',
        borderColor: activeTheme === 'dark' ? 'rgba(51, 65, 85, 0.6)' : 'rgba(226, 232, 240, 0.8)',
        color: activeTheme === 'dark' ? '#F8FAFC' : '#0F172A',
      }}
    >
      {/* Simulated Live Alert Banner */}
      {simulatedNotification && (
        <div
          data-testid="live-notification-banner"
          className="bg-gradient-to-r from-[#FFA03A] via-[#FF2A85] to-[#7B2CBF] text-white px-4 py-2 text-xs md:text-sm font-medium flex items-center justify-between shadow-md"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-white animate-pulse flex-shrink-0" />
            <span>{simulatedNotification}</span>
          </div>
          <button
            onClick={clearNotification}
            data-testid="dismiss-notification-btn"
            className="text-white/80 hover:text-white text-xs px-2 py-0.5 rounded bg-black/20 hover:bg-black/30 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo & Title */}
        <div
          data-testid="brand-logo-container"
          onClick={() => {
            setActiveView('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center">
            <img
              src={logoSrc}
              alt="TITAN LABS"
              data-testid="official-logo"
              className="w-10 h-10 object-contain transform group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#00C6FF]/20 to-[#FF2A85]/20 blur-sm -z-10 group-hover:opacity-100 opacity-60 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span
              data-testid="brand-title"
              className="font-extrabold text-lg md:text-xl tracking-wider brand-font bg-gradient-to-r from-[#00C6FF] via-[#7B2CBF] to-[#FF2A85] bg-clip-text text-transparent"
            >
              TITAN LABS
            </span>
            <span className="text-[10px] tracking-widest uppercase opacity-70 hidden sm:inline -mt-1 font-semibold">
              Hardware Intelligence
            </span>
          </div>
        </div>

        {/* Center/Right: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3">
          <button
            onClick={() => setActiveView('home')}
            data-testid="nav-home"
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'home'
                ? 'bg-[#0066FF]/15 text-[#0066FF] font-semibold'
                : 'hover:bg-slate-500/10 opacity-80 hover:opacity-100'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveView('search')}
            data-testid="nav-search"
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'search'
                ? 'bg-[#0066FF]/15 text-[#0066FF] font-semibold'
                : 'hover:bg-slate-500/10 opacity-80 hover:opacity-100'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Browse</span>
          </button>

          <button
            onClick={() => setActiveView('compare')}
            data-testid="nav-compare"
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 relative ${
              activeView === 'compare'
                ? 'bg-[#0066FF]/15 text-[#0066FF] font-semibold'
                : 'hover:bg-slate-500/10 opacity-80 hover:opacity-100'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Compare</span>
            <span
              data-testid="compare-badge"
              className="text-xs px-1.5 py-0.2 rounded-full font-bold bg-[#0066FF]/20 text-[#0066FF]"
            >
              ({compareProductIds.length})
            </span>
          </button>

          <button
            onClick={() => setActiveView('saved')}
            data-testid="nav-saved"
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 relative ${
              activeView === 'saved'
                ? 'bg-[#FF2A85]/15 text-[#FF2A85] font-semibold'
                : 'hover:bg-slate-500/10 opacity-80 hover:opacity-100'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved</span>
            <span
              data-testid="saved-badge"
              className="text-xs px-1.5 py-0.2 rounded-full font-bold bg-[#FF2A85]/20 text-[#FF2A85]"
            >
              ({savedProductIds.length})
            </span>
          </button>

          <button
            onClick={() => setActiveView('alerts')}
            data-testid="nav-alerts"
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 relative ${
              activeView === 'alerts'
                ? 'bg-[#FFA03A]/15 text-[#FFA03A] font-semibold'
                : 'hover:bg-slate-500/10 opacity-80 hover:opacity-100'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Alerts</span>
            <span
              data-testid="alerts-badge"
              className="text-xs px-1.5 py-0.2 rounded-full font-bold bg-[#FFA03A]/20 text-[#FFA03A]"
            >
              ({priceAlerts.length})
            </span>
          </button>

          <button
            onClick={() => setActiveView('account')}
            data-testid="nav-account"
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'account'
                ? 'bg-[#7B2CBF]/15 text-[#7B2CBF] font-semibold'
                : 'hover:bg-slate-500/10 opacity-80 hover:opacity-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            data-testid="theme-toggle-btn"
            aria-label="Toggle Theme Mode"
            className="ml-2 px-3 py-1.5 rounded-full border border-slate-500/40 text-xs font-semibold flex items-center gap-1.5 hover:border-slate-400 transition-all cursor-pointer bg-slate-800/20 dark:bg-slate-800/40 light:bg-slate-100"
          >
            {activeTheme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#FFA03A]" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#7B2CBF]" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            data-testid="mobile-theme-toggle-btn"
            aria-label="Toggle theme"
            className="p-2 rounded-xl border border-slate-500/40 text-xs"
          >
            {activeTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#FFA03A]" />
            ) : (
              <Moon className="w-4 h-4 text-[#7B2CBF]" />
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-btn"
            aria-label="Open mobile menu"
            className="p-2 rounded-xl border border-slate-500/40 hover:bg-slate-500/10 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          data-testid="mobile-drawer"
          className="md:hidden border-t border-slate-700/50 px-4 pt-3 pb-6 space-y-2 bg-[#0B0F19] dark:bg-[#0B0F19] light:bg-[#F8F9FD] transition-all"
        >
          <button
            onClick={() => {
              setActiveView('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between hover:bg-slate-500/10"
          >
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveView('search');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between hover:bg-slate-500/10"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>Browse Catalog</span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveView('compare');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between hover:bg-slate-500/10"
          >
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              <span>Compare</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#0066FF]/20 text-[#0066FF]">
              {compareProductIds.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveView('saved');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between hover:bg-slate-500/10"
          >
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#FF2A85]" />
              <span>Saved Items</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#FF2A85]/20 text-[#FF2A85]">
              {savedProductIds.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveView('alerts');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between hover:bg-slate-500/10"
          >
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#FFA03A]" />
              <span>Price Alerts</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#FFA03A]/20 text-[#FFA03A]">
              {priceAlerts.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveView('account');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between hover:bg-slate-500/10"
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Profile & Settings</span>
            </div>
          </button>
        </div>
      )}
    </header>
  );
};
