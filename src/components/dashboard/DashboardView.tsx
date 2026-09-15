import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { StatCard } from './StatCard';
import { PortfolioChart } from './PortfolioChart';
import { QuickTradeModal } from './QuickTradeModal';
import { QuickWithdrawSection } from './QuickWithdrawSection';
import { InvestmentNoticeModal } from '../wallet/InvestmentNoticeModal';
import { 
  Wallet, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  Star, 
  ArrowUpRight, 
  ArrowDownRight, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    user, 
    totalPortfolioValue, 
    cashBalanceUSD, 
    todayPnL, 
    holdings, 
    assets, 
    watchlist, 
    toggleWatchlist, 
    transactions, 
    setCurrentPage, 
    setSelectedAsset,
    recentPriceChanges,
    investmentNoticeOpen,
    setInvestmentNoticeOpen
  } = useTrading();

  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [tradeModalAction, setTradeModalAction] = useState<'BUY' | 'SELL'>('BUY');

  const totalAssetsCount = Object.keys(holdings).filter((k) => holdings[k] > 0).length;

  const handleOpenTrade = (action: 'BUY' | 'SELL', assetSymbol?: string) => {
    if (assetSymbol) {
      const asset = assets.find((a) => a.symbol === assetSymbol);
      if (asset) setSelectedAsset(asset);
    }
    setTradeModalAction(action);
    setTradeModalOpen(true);
  };

  const handleGoToTradePage = (assetSymbol: string) => {
    const asset = assets.find((a) => a.symbol === assetSymbol);
    if (asset) setSelectedAsset(asset);
    setCurrentPage('trade');
  };

  const watchlistAssets = assets.filter((a) => watchlist.includes(a.symbol));

  return (
    <div className="space-y-4 sm:space-y-6 pb-6 sm:pb-12 w-full">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/60 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-black text-slate-100 tracking-tight">
              Good day, {user?.name || 'Joshua James Bergin'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[9px] sm:text-[10px] font-bold text-emerald-400">
              {user?.kycTier || 'Tier 2 Verified'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-medium">Profile:</span>
              <strong className="text-slate-200 font-semibold">{user?.name || 'Joshua James Bergin'}</strong>
            </div>
            <span className="hidden sm:inline text-slate-700">•</span>
            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-medium">Email:</span>
              <strong className="text-slate-200 font-mono font-semibold">{user?.email || 'Berginjoshua1@gmail.com'}</strong>
            </div>
            <span className="hidden sm:inline text-slate-700">•</span>
            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-medium">Available:</span>
              <strong className="text-emerald-400 font-mono font-bold">
                ${cashBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 z-10 pt-1 sm:pt-0">
          <button
            type="button"
            id="btn-quick-buy"
            onClick={() => handleOpenTrade('BUY')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Quick Buy</span>
          </button>
          <button
            type="button"
            id="btn-quick-sell"
            onClick={() => handleOpenTrade('SELL')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/70 text-xs font-black transition-all active:scale-95 cursor-pointer"
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Quick Sell</span>
          </button>
        </div>

        {/* Background glow accent */}
        <div className="absolute right-0 top-0 w-72 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
      </div>

      {/* 4 Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Portfolio */}
        <StatCard
          id="stat-total-portfolio"
          label="Total Portfolio"
          value={`$${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subValue="Consolidated Net Worth"
          change={todayPnL.percent}
          changeLabel="24h Change"
          icon={DollarSign}
          iconColor="text-emerald-400"
        />

        {/* Available Balance */}
        <StatCard
          id="stat-available-balance"
          label="Available Balance"
          value={`$${cashBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subValue="Ready for instant withdrawal & trading"
          icon={Wallet}
          iconColor="text-sky-400"
          actionButton={
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('section-quick-withdraw');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Withdraw</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          }
        />

        {/* Today's Profit/Loss */}
        <StatCard
          id="stat-today-pnl"
          label="Today's Profit / Loss"
          value={`${todayPnL.value >= 0 ? '+' : ''}$${Math.abs(todayPnL.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subValue="24H Unrealized PnL"
          change={todayPnL.percent}
          changeLabel="24h PnL"
          icon={TrendingUp}
          iconColor={todayPnL.value >= 0 ? 'text-emerald-400' : 'text-rose-400'}
        />

        {/* Total Assets */}
        <StatCard
          id="stat-total-assets"
          label="Total Assets"
          value={`${totalAssetsCount} Assets`}
          subValue="Diversified holdings"
          icon={Layers}
          iconColor="text-purple-400"
          actionButton={
            <button
              type="button"
              onClick={() => setCurrentPage('markets')}
              className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Explore</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          }
        />
      </div>

      {/* Section directly under Available Balance to input wallet address to withdraw */}
      <QuickWithdrawSection />

      {/* Main Grid: Portfolio Chart + Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Performance Chart */}
        <div className="lg:col-span-2">
          <PortfolioChart currentValue={totalPortfolioValue} />
        </div>

        {/* Right 1 Col: Watchlist */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 shadow-xl flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <h3 className="text-sm font-bold text-slate-100">
                Your Watchlist
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage('markets')}
              className="text-xs font-semibold text-emerald-400 hover:underline cursor-pointer"
            >
              All Markets
            </button>
          </div>

          <div className="divide-y divide-slate-800/60 flex-1 overflow-y-auto max-h-[290px] mt-1">
            {watchlistAssets.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No starred assets in your watchlist yet.
              </div>
            ) : (
              watchlistAssets.map((asset) => {
                const tick = recentPriceChanges[asset.symbol];
                const isPositive = asset.change24h >= 0;
                return (
                  <div
                    key={asset.symbol}
                    onClick={() => handleGoToTradePage(asset.symbol)}
                    className="py-3 px-2 flex items-center justify-between hover:bg-slate-800/40 rounded-xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-200 border border-slate-700/60">
                        {asset.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                          {asset.symbol}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {asset.name}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-xs font-bold font-mono transition-colors duration-300 ${
                          tick === 'up'
                            ? 'text-emerald-400 font-black'
                            : tick === 'down'
                            ? 'text-rose-400 font-black'
                            : 'text-slate-100'
                        }`}
                      >
                        ${asset.price.toLocaleString('en-US', { minimumFractionDigits: asset.price > 10 ? 2 : 4 })}
                      </div>
                      <div className={`text-[10px] font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage('markets')}
            className="w-full mt-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-colors cursor-pointer text-center"
          >
            + Add Assets to Watchlist
          </button>
        </div>
      </div>

      {/* Lower Section: Market Overview Table & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Market Overview (2 Cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/60 shadow-xl">
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-100">
                Market Overview
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                Top liquidity pairs available for live digital asset trading
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage('markets')}
              className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Native Asset List */}
          <div className="sm:hidden divide-y divide-slate-800/60 mt-1">
            {assets.slice(0, 5).map((asset) => {
              const isPositive = asset.change24h >= 0;
              const tick = recentPriceChanges[asset.symbol];

              return (
                <div 
                  key={asset.symbol}
                  onClick={() => handleGoToTradePage(asset.symbol)}
                  className="py-3 px-1 flex items-center justify-between hover:bg-slate-800/30 active:bg-slate-800/50 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(asset.symbol);
                      }}
                      className="text-slate-500 hover:text-amber-400 p-1 cursor-pointer"
                      aria-label="Toggle watchlist"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          watchlist.includes(asset.symbol)
                            ? 'text-amber-400 fill-amber-400'
                            : ''
                        }`}
                      />
                    </button>
                    <div>
                      <div className="font-bold text-slate-100 text-xs">
                        {asset.symbol}
                        <span className="ml-1 text-[10px] text-slate-400 font-normal">/USD</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {asset.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div
                        className={`text-xs font-mono font-bold transition-colors duration-300 ${
                          tick === 'up'
                            ? 'text-emerald-400'
                            : tick === 'down'
                            ? 'text-rose-400'
                            : 'text-slate-100'
                        }`}
                      >
                        ${asset.price.toLocaleString('en-US', { minimumFractionDigits: asset.price > 10 ? 2 : 4 })}
                      </div>
                      <div className={`text-[10px] font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGoToTradePage(asset.symbol);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 font-bold text-[11px] border border-emerald-500/30 cursor-pointer"
                    >
                      Trade
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto mt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-2">Asset</th>
                  <th className="py-3 px-2 text-right">Price</th>
                  <th className="py-3 px-2 text-right">24h Change</th>
                  <th className="py-3 px-2 text-right hidden sm:table-cell">24h Volume</th>
                  <th className="py-3 px-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {assets.slice(0, 5).map((asset) => {
                  const isPositive = asset.change24h >= 0;
                  const tick = recentPriceChanges[asset.symbol];

                  return (
                    <tr key={asset.symbol} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-2">
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWatchlist(asset.symbol);
                            }}
                            className="text-slate-500 hover:text-amber-400 cursor-pointer"
                            aria-label="Toggle watchlist"
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                watchlist.includes(asset.symbol)
                                  ? 'text-amber-400 fill-amber-400'
                                  : ''
                              }`}
                            />
                          </button>
                          <div>
                            <span className="font-bold text-slate-100">
                              {asset.name}
                            </span>
                            <span className="ml-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                              {asset.symbol}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-2 text-right font-mono font-bold">
                        <span
                          className={`transition-colors duration-300 ${
                            tick === 'up'
                              ? 'text-emerald-400'
                              : tick === 'down'
                              ? 'text-rose-400'
                              : 'text-slate-100'
                          }`}
                        >
                          ${asset.price.toLocaleString('en-US', { minimumFractionDigits: asset.price > 10 ? 2 : 4 })}
                        </span>
                      </td>

                      <td className="py-3.5 px-2 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            isPositive
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-rose-400 bg-rose-500/10'
                          }`}
                        >
                          {isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%
                        </span>
                      </td>

                      <td className="py-3.5 px-2 text-right font-mono text-slate-400 hidden sm:table-cell">
                        ${(asset.volume24h / 1e9).toFixed(2)}B
                      </td>

                      <td className="py-3.5 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleGoToTradePage(asset.symbol)}
                          className="px-3 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold text-xs transition-all border border-emerald-500/30 cursor-pointer"
                        >
                          Trade
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions (1 Col) */}
        <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/60 shadow-xl flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-slate-100">
              Recent Activity
            </h3>
            <button
              type="button"
              onClick={() => setCurrentPage('transactions')}
              className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
            >
              Full History
            </button>
          </div>

          <div className="divide-y divide-slate-800/60 flex-1 overflow-y-auto mt-2 space-y-1">
            {transactions.slice(0, 5).map((tx) => {
              const isBuy = tx.type === 'BUY' || tx.type === 'DEPOSIT';
              return (
                <div key={tx.id} className="py-3 px-1 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isBuy ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {tx.type === 'BUY' ? 'B' : tx.type === 'SELL' ? 'S' : 'D'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">
                        {tx.type} {tx.assetSymbol}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {tx.timestamp.slice(11, 19)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-slate-100">
                      {isBuy ? '+' : '-'}{tx.amount} {tx.assetSymbol}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      ${tx.total.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 mt-2 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={() => setCurrentPage('transactions')}
              className="text-xs text-slate-400 hover:text-slate-200 font-semibold cursor-pointer"
            >
              Export statements & logs &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Quick Trade Modal */}
      <QuickTradeModal
        isOpen={tradeModalOpen}
        onClose={() => setTradeModalOpen(false)}
        defaultAction={tradeModalAction}
      />

      {/* Investment Rules Compliance Notice Modal */}
      <InvestmentNoticeModal
        isOpen={investmentNoticeOpen}
        onClose={() => setInvestmentNoticeOpen(false)}
        onOpenDeposit={() => setCurrentPage('wallet')}
      />
    </div>
  );
};
