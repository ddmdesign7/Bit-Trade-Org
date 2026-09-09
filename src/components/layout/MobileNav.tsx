import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { 
  LayoutDashboard, 
  TrendingUp, 
  ArrowLeftRight, 
  Wallet, 
  History 
} from 'lucide-react';
import { NavPage } from '../../types';

export const MobileNav: React.FC = () => {
  const { currentPage, setCurrentPage } = useTrading();

  const items: { id: NavPage; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'markets', label: 'Markets', icon: TrendingUp },
    { id: 'trade', label: 'Trade', icon: ArrowLeftRight },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'transactions', label: 'Ledger', icon: History },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070b14]/95 backdrop-blur-2xl border-t border-slate-800/90 px-1 pt-1.5 safe-area-pb shadow-[0_-10px_25px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-tab-${item.id}`}
              onClick={() => setCurrentPage(item.id)}
              className={`flex-1 min-w-[56px] min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all active:scale-95 cursor-pointer select-none relative ${
                isActive
                  ? 'text-emerald-400 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              {/* Active glow background */}
              {isActive && (
                <div className="absolute inset-x-2 top-0.5 bottom-0.5 bg-emerald-500/10 rounded-xl pointer-events-none" />
              )}
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-emerald-400 stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {item.id === 'trade' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 leading-none">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1 rounded-full bg-emerald-400 mt-1 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
