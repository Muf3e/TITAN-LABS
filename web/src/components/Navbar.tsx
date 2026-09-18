import React from "react";
import {
  Search,
  Scale,
  Bookmark,
  Bell,
  User,
  Sun,
  Moon,
  Home,
  Layers
} from "lucide-react";

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  savedCount: number;
  compareCount: number;
  alertsCount: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  savedCount,
  compareCount,
  alertsCount,
  isDarkMode,
  onToggleTheme
}) => {
  const logoSrc = isDarkMode ? '/logo-dark.png' : '/logo-light.png';
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "search", label: "Search & Filter", icon: Search },
    { id: "compare", label: "Compare", icon: Scale, count: compareCount },
    { id: "saved", label: "Saved", icon: Bookmark, count: savedCount },
    { id: "alerts", label: "Alerts", icon: Bell, count: alertsCount },
    { id: "account", label: "Account", icon: User }
  ];

  return (
    <>
      {/* Desktop Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-slate-800/80 bg-slate-950/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onSelectTab("home")}
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl p-1 bg-slate-900 border border-slate-700/60 shadow-lg group-hover:border-cyan-500/50 transition-all">
              <img
                src={logoSrc}
                alt="TITAN Logo"
                className="w-full h-full object-contain rounded-lg filter drop-shadow(0 0 8px rgba(0, 198, 255, 0.4))"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-wider titan-rainbow-text brand-font">
                  TITAN
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  WEB v1.0
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 tracking-tight hidden sm:block">
                Product Intelligence Engine
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : ""}`} />
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-gradient-to-r from-[#FFA03A] to-[#FF2A85] text-white">
                      {item.count}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-[#00C6FF] via-[#7B2CBF] to-[#FF2A85] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={onToggleTheme}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Header Compare Pill */}
            {compareCount > 0 && (
              <button
                onClick={() => onSelectTab("compare")}
                className="hidden sm:flex titan-rainbow-btn px-3.5 py-1.5 text-xs font-bold shadow-md items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Compare ({compareCount})</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sticky Bottom Navigation Bar (Matching Android App Bottom Nav) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800 py-2 px-3">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 relative transition-all ${
                  isActive ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.count !== undefined && item.count > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-pink-500 text-white">
                      {item.count}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium mt-1 tracking-tight">
                  {item.label.split(" ")[0]}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
