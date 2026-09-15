import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Logo } from './Logo';
import { 
  LayoutDashboard, 
  TrendingUp, 
  ArrowLeftRight, 
  Wallet, 
  History, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  Shield, 
  PlusCircle,
  ExternalLink,
  Check,
  ChevronDown,
  Moon,
  Sparkles
} from 'lucide-react';
import { NavPage } from '../../types';

interface NavbarProps {
  onOpenDeposit?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDeposit }) => {
  const { 
    user, 
    currentPage, 
    setCurrentPage, 
    logout, 
    cashBalanceUSD, 
    totalPortfolioValue,
    theme,
    setTheme 
  } = useTrading();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navItems: { id: NavPage; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'markets', label: 'Markets', icon: TrendingUp },
    { id: 'trade', label: 'Trade', icon: ArrowLeftRight },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'transactions', label: 'Transactions', icon: History },
  ];

  const handleNavClick = (page: NavPage) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
    setNotificationsOpen(false);
  };

  const sampleNotifications = [
    {
      id: 1,
      title: 'Limit Order Filled',
      desc: 'Bought 0.75 ETH at $3,340.80',
      time: '12m ago',
      read: false,
    },
    {
      id: 2,
      title: 'Security Alert',
      desc: 'New login detected from Zurich (M3 MacBook Pro)',
      time: '1h ago',
      read: false,
    },
    {
      id: 3,
      title: 'Deposit Received',
      desc: 'Confirmed +15,000 USDT via TRC20 network',
      time: 'Yesterday',
      read: true,
    },
  ];

  return (
    <div className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#060a12]/95 backdrop-blur-xl safe-area-pt">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('dashboard')} 
            className="cursor-pointer shrink-0"
          >
            <Logo size="sm" showTagline={false} />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 ml-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                      : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1 sm:gap-2.5">
            {/* Live Trading Status Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE TRADING</span>
            </div>

            {/* Quick Deposit Button */}
            {onOpenDeposit && (
              <button
                type="button"
                id="btn-nav-deposit"
                onClick={onOpenDeposit}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Deposit</span>
              </button>
            )}

            {/* Quick OLED Theme Toggle */}
            <button
              type="button"
              id="btn-nav-theme-toggle"
              onClick={() => setTheme(theme === 'dim' ? 'true-black' : 'dim')}
              className={`relative p-2 rounded-xl border transition-colors cursor-pointer ${
                theme === 'true-black'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/70 border-transparent hover:border-slate-700/60'
              }`}
              title={theme === 'true-black' ? 'Theme: OLED True Black (Click for Dim)' : 'Theme: Dim (Click for OLED True Black)'}
              aria-label="Toggle display theme"
            >
              {theme === 'true-black' ? (
                <Sparkles className="w-4 h-4 text-emerald-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-300" />
              )}
            </button>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                type="button"
                id="btn-nav-notifications"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileMenuOpen(false);
                }}
                className="relative p-2 rounded-xl text-slate-300 hover:text-slate-100 hover:bg-slate-800/70 border border-transparent hover:border-slate-700/60 transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#060a12]" />
              </button>

              {notificationsOpen && (
                <div 
                  className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-xs sm:w-80 rounded-2xl bg-[#0b1220] border border-slate-700/70 shadow-2xl p-3 sm:p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
                  style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Notifications
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-400 cursor-pointer hover:underline">
                      Mark all read
                    </span>
                  </div>
                  <div className="divide-y divide-slate-800/60 max-h-64 overflow-y-auto mt-2">
                    {sampleNotifications.map((n) => (
                      <div key={n.id} className="py-2.5 px-1 hover:bg-slate-800/40 rounded-lg transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <h6 className="text-xs font-semibold text-slate-200">
                            {n.title}
                          </h6>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {n.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2.5 mt-1 border-t border-slate-800 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setNotificationsOpen(false);
                        handleNavClick('transactions');
                      }}
                      className="text-xs text-emerald-400 font-semibold hover:underline"
                    >
                      View All Activity Logs
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  id="btn-nav-profile"
                  onClick={() => {
                    setProfileMenuOpen(!profileMenuOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/60 hover:border-slate-600 transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-bold text-xs text-slate-950">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[100px]">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono leading-none">
                      ${cashBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {profileMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-xs sm:w-64 rounded-2xl bg-[#0b1220] border border-slate-700/70 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                    style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}
                  >
                    {/* User Info */}
                    <div className="p-2 border-b border-slate-800">
                      <div className="text-sm font-bold text-slate-100">
                        {user.name}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-500/30 text-[10px] font-semibold text-emerald-400">
                          {user.kycTier}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-semibold text-slate-300">
                          2FA Active
                        </span>
                      </div>
                    </div>

                    {/* Quick Portfolio Stats */}
                    <div className="p-2 my-1 bg-slate-900/60 rounded-xl">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                        Net Portfolio Value
                      </div>
                      <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                        ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-1 mt-1">
                      {/* Theme Toggle in Profile Menu */}
                      <button
                        type="button"
                        id="btn-profile-toggle-theme"
                        onClick={() => setTheme(theme === 'dim' ? 'true-black' : 'dim')}
                        className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          {theme === 'true-black' ? (
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Moon className="w-4 h-4 text-sky-400" />
                          )}
                          <span>Theme</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          theme === 'true-black'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {theme === 'true-black' ? 'True Black' : 'Dim'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('settings')}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 transition-colors text-left cursor-pointer"
                      >
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span>Security & Settings</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('wallet')}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 transition-colors text-left cursor-pointer"
                      >
                        <Wallet className="w-4 h-4 text-sky-400" />
                        <span>Manage Wallet</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleNavClick('login')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              id="btn-nav-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#070b14]/98 px-4 pt-3 pb-6 space-y-2 backdrop-blur-2xl">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300 mb-3">
            <span className="font-medium">Portfolio Balance</span>
            <span className="font-mono font-bold">${totalPortfolioValue.toLocaleString()}</span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => handleNavClick('settings')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800/60 transition-colors text-left cursor-pointer"
          >
            <Shield className="w-5 h-5 text-slate-400" />
            <span>Security & Settings</span>
          </button>

          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={() => setTheme(theme === 'dim' ? 'true-black' : 'dim')}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800/60 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {theme === 'true-black' ? (
                <Sparkles className="w-5 h-5 text-emerald-400" />
              ) : (
                <Moon className="w-5 h-5 text-sky-400" />
              )}
              <span>Display Theme</span>
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
              theme === 'true-black'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}>
              {theme === 'true-black' ? 'True Black (OLED)' : 'Dim'}
            </span>
          </button>

          {user && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-950/30 transition-colors text-left cursor-pointer mt-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
