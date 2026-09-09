import React, { useState, useMemo } from 'react';
import { useTrading } from '../../context/TradingContext';
import { CryptoAsset } from '../../types';
import { 
  Search, 
  Star, 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight,
  Filter,
  Info
} from 'lucide-react';

export const MarketView: React.FC = () => {
  const { 
    assets, 
    watchlist, 
    toggleWatchlist, 
    setSelectedAsset, 
    setCurrentPage, 
    recentPriceChanges 
  } = useTrading();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<'marketCap' | 'price' | 'change24h' | 'volume24h'>('marketCap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const categories = [
    { id: 'all', label: 'All Assets' },
    { id: 'watchlist', label: 'Starred' },
    { id: 'layer1', label: 'Layer 1' },
    { id: 'defi', label: 'DeFi' },
    { id: 'infrastructure', label: 'Infrastructure' },
    { id: 'gainers', label: 'Top Gainers' },
  ];

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedCategory === 'watchlist') {
        return watchlist.includes(asset.symbol);
      }
      if (selectedCategory === 'gainers') {
        return asset.change24h > 2.0;
      }
      if (selectedCategory !== 'all') {
        return asset.category === selectedCategory;
      }

      return true;
    }).sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [assets, searchQuery, selectedCategory, watchlist, sortField, sortDirection]);

  const handleSort = (field: 'marketCap' | 'price' | 'change24h' | 'volume24h') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleTradeAsset = (asset: CryptoAsset) => {
    setSelectedAsset(asset);
    setCurrentPage('trade');
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* Header & Simulation Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/60 shadow-lg relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
              Cryptocurrency Markets
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-extrabold text-emerald-400">
              SIMULATED DEMO DATA
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Real-time simulated pricing, market capitalization, 24-hour volume, and order-routing liquidity pools.
          </p>
        </div>

        {/* Global Market Stats */}
        <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4 text-xs font-semibold bg-slate-900/80 p-2.5 sm:p-3 rounded-xl border border-slate-800 w-full md:w-auto">
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Total Cap</div>
            <div className="text-emerald-400 font-mono font-bold">$2.84T</div>
          </div>
          <div className="w-[1px] h-6 bg-slate-800" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase">24h Vol</div>
            <div className="text-slate-200 font-mono font-bold">$124.8B</div>
          </div>
          <div className="w-[1px] h-6 bg-slate-800" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase">BTC Dom</div>
            <div className="text-slate-200 font-mono font-bold">58.4%</div>
          </div>
        </div>
      </div>

      {/* Controls: Search & Category Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            id="market-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coin, symbol..."
            className="glass-input w-full pl-10 pr-4 py-2 rounded-xl text-xs font-medium placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Markets Display */}
      <div className="glass-panel rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden">
        {/* Mobile Native Asset List (<sm) */}
        <div className="sm:hidden divide-y divide-slate-800/60">
          {filteredAssets.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No cryptocurrency assets matched your search query.
            </div>
          ) : (
            filteredAssets.map((asset) => {
              const isPositive = asset.change24h >= 0;
              const isStarred = watchlist.includes(asset.symbol);
              const tick = recentPriceChanges[asset.symbol];

              return (
                <div
                  key={asset.symbol}
                  onClick={() => handleTradeAsset(asset)}
                  className="p-3.5 flex items-center justify-between active:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(asset.symbol);
                      }}
                      className="text-slate-500 p-1 -ml-1 cursor-pointer"
                      aria-label={`Toggle watchlist for ${asset.symbol}`}
                    >
                      <Star className={`w-4 h-4 ${isStarred ? 'text-amber-400 fill-amber-400' : ''}`} />
                    </button>

                    <div 
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-slate-100 shadow-sm border border-slate-700/80 shrink-0"
                      style={{ backgroundColor: `${asset.color}22`, borderColor: `${asset.color}55` }}
                    >
                      <span style={{ color: asset.color }}>{asset.symbol.slice(0, 3)}</span>
                    </div>

                    <div>
                      <div className="font-extrabold text-xs text-slate-100">
                        {asset.name}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {asset.symbol} &bull; ${(asset.marketCap / 1e9).toFixed(1)}B
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-xs font-mono font-black transition-colors duration-300 ${
                        tick === 'up'
                          ? 'text-emerald-400'
                          : tick === 'down'
                          ? 'text-rose-400'
                          : 'text-slate-100'
                      }`}
                    >
                      ${asset.price.toLocaleString('en-US', { minimumFractionDigits: asset.price > 10 ? 2 : 4 })}
                    </div>
                    <div className="mt-0.5">
                      <span
                        className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          isPositive
                            ? 'text-emerald-400 bg-emerald-500/15'
                            : 'text-rose-400 bg-rose-500/15'
                        }`}
                      >
                        {isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Markets Table (sm+) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900/40">
                <th className="py-4 px-4 w-10"></th>
                <th className="py-4 px-4">Asset</th>
                <th 
                  className="py-4 px-4 text-right cursor-pointer hover:text-slate-200 transition-colors"
                  onClick={() => handleSort('price')}
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th 
                  className="py-4 px-4 text-right cursor-pointer hover:text-slate-200 transition-colors"
                  onClick={() => handleSort('change24h')}
                >
                  <div className="inline-flex items-center gap-1">
                    <span>24h Change</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th 
                  className="py-4 px-4 text-right hidden sm:table-cell cursor-pointer hover:text-slate-200 transition-colors"
                  onClick={() => handleSort('volume24h')}
                >
                  <div className="inline-flex items-center gap-1">
                    <span>24h Volume</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th 
                  className="py-4 px-4 text-right hidden md:table-cell cursor-pointer hover:text-slate-200 transition-colors"
                  onClick={() => handleSort('marketCap')}
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Market Cap</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-4 px-4 text-center hidden lg:table-cell">
                  7-Day Trend
                </th>
                <th className="py-4 px-4 text-center">
                  Trade
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No cryptocurrency assets matched your search query.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  const isPositive = asset.change24h >= 0;
                  const isStarred = watchlist.includes(asset.symbol);
                  const tick = recentPriceChanges[asset.symbol];

                  return (
                    <tr 
                      key={asset.symbol}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => handleTradeAsset(asset)}
                    >
                      {/* Star Watchlist */}
                      <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => toggleWatchlist(asset.symbol)}
                          className="text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
                          aria-label={`Toggle watchlist for ${asset.symbol}`}
                        >
                          <Star className={`w-4 h-4 ${isStarred ? 'text-amber-400 fill-amber-400' : ''}`} />
                        </button>
                      </td>

                      {/* Name & Symbol */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-slate-100 shadow-sm border border-slate-700/80"
                            style={{ backgroundColor: `${asset.color}22`, borderColor: `${asset.color}55` }}
                          >
                            <span style={{ color: asset.color }}>{asset.symbol.slice(0, 3)}</span>
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-100 group-hover:text-emerald-400 transition-colors">
                              {asset.name}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">
                              {asset.symbol} &bull; <span className="capitalize">{asset.category}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Current Price */}
                      <td className="py-4 px-4 text-right font-mono font-extrabold text-sm">
                        <span
                          className={`transition-colors duration-300 ${
                            tick === 'up'
                              ? 'text-emerald-400 font-black'
                              : tick === 'down'
                              ? 'text-rose-400 font-black'
                              : 'text-slate-100'
                          }`}
                        >
                          ${asset.price.toLocaleString('en-US', { minimumFractionDigits: asset.price > 10 ? 2 : 4 })}
                        </span>
                      </td>

                      {/* 24h Change */}
                      <td className="py-4 px-4 text-right">
                        <span
                          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-xs font-bold ${
                            isPositive
                              ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30'
                              : 'text-rose-400 bg-rose-500/15 border border-rose-500/30'
                          }`}
                        >
                          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span>{isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%</span>
                        </span>
                      </td>

                      {/* 24h Volume */}
                      <td className="py-4 px-4 text-right font-mono text-slate-300 hidden sm:table-cell font-semibold">
                        ${(asset.volume24h / 1e9).toFixed(2)}B
                      </td>

                      {/* Market Cap */}
                      <td className="py-4 px-4 text-right font-mono text-slate-300 hidden md:table-cell font-semibold">
                        ${(asset.marketCap / 1e9).toFixed(2)}B
                      </td>

                      {/* Sparkline mini svg */}
                      <td className="py-4 px-4 text-center hidden lg:table-cell">
                        <div className="w-24 h-7 mx-auto flex items-center">
                          <svg className="w-full h-full" viewBox="0 0 100 30">
                            {(() => {
                              const min = Math.min(...asset.sparkline7d);
                              const max = Math.max(...asset.sparkline7d);
                              const range = max - min || 1;
                              const points = asset.sparkline7d
                                .map((val, idx) => {
                                  const x = (idx / (asset.sparkline7d.length - 1)) * 100;
                                  const y = 30 - ((val - min) / range) * 26 - 2;
                                  return `${x},${y}`;
                                })
                                .join(' ');

                              return (
                                <polyline
                                  fill="none"
                                  stroke={isPositive ? '#10B981' : '#F43F5E'}
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  points={points}
                                />
                              );
                            })()}
                          </svg>
                        </div>
                      </td>

                      {/* Trade Button */}
                      <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleTradeAsset(asset)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
                        >
                          Trade
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
