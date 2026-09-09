import React from 'react';
import { Logo } from './Logo';
import { useTrading } from '../../context/TradingContext';
import { ShieldCheck, ExternalLink, Globe, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useTrading();

  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#04070d] py-6 sm:py-10 mt-6 sm:mt-12 text-xs text-slate-400">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Links Header */}
        <div className="hidden md:flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div>
            <Logo size="md" showTagline={true} />
            <p className="text-xs text-slate-400 mt-2 max-w-md leading-relaxed">
              Institutional-grade digital trading infrastructure. Trade Bitcoin, Ethereum, Solana, and 50+ leading liquidity pairs with sub-millisecond execution.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-300">
            <button
              type="button"
              onClick={() => setCurrentPage('dashboard')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('markets')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Markets
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('trade')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Trade
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('wallet')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Wallet
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('transactions')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Ledger
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('settings')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Security
            </button>
          </div>
        </div>

        {/* Regulatory & Simulation Disclosure */}
        <div className="pt-2 md:pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 text-center md:text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 hidden sm:inline" />
            <span>
              &copy; {new Date().getFullYear()} BIT TRADE NET. Simulation Sandbox. Demo Assets Only.
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[10px] sm:text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-mono">Engine: Active (99.99%)</span>
            </div>
            <span>Latency: 2.4ms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
