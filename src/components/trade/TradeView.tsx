import React, { useState, useMemo } from 'react';
import { useTrading } from '../../context/TradingContext';
import { CryptoAsset } from '../../types';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar 
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  ChevronDown, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Zap,
  Sliders
} from 'lucide-react';

export const TradeView: React.FC = () => {
  const { 
    assets, 
    selectedAsset, 
    setSelectedAsset, 
    holdings, 
    cashBalanceUSD, 
    orders, 
    executeTrade, 
    cancelOrder,
    recentPriceChanges
  } = useTrading();

  // Trading panel states
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [limitPrice, setLimitPrice] = useState<string>(selectedAsset.price.toString());
  const [amount, setAmount] = useState<string>('0.1');
  const [chartInterval, setChartInterval] = useState<'1m' | '5m' | '15m' | '1H' | '1D'>('15m');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assetDropdownOpen, setAssetDropdownOpen] = useState(false);
  const [assetSearch, setAssetSearch] = useState('');
  const [activeBottomTab, setActiveBottomTab] = useState<'open' | 'history'>('open');
  const [mobileViewTab, setMobileViewTab] = useState<'chart' | 'book' | 'trade'>('chart');

  // Keep limit price in sync if asset changes and orderType is limit
  const activePrice = orderType === 'MARKET' ? selectedAsset.price : (parseFloat(limitPrice) || selectedAsset.price);
  const numAmount = parseFloat(amount) || 0;
  const totalValue = numAmount * activePrice;
  const estimatedFee = totalValue * 0.001; // 0.1%
  const grandTotal = side === 'BUY' ? totalValue + estimatedFee : totalValue - estimatedFee;

  const currentAssetHolding = holdings[selectedAsset.symbol] || 0;

  // Percentage quick selector
  const handleQuickPercent = (pct: number) => {
    if (side === 'BUY') {
      const budget = cashBalanceUSD * (pct / 100);
      if (activePrice > 0) {
        setAmount((budget / activePrice).toFixed(4));
      }
    } else {
      const qty = currentAssetHolding * (pct / 100);
      setAmount(qty.toFixed(4));
    }
  };

  // Submit Trade
  const handleTradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) return;

    setIsSubmitting(true);
    try {
      await executeTrade({
        type: side,
        orderType,
        symbol: selectedAsset.symbol,
        amount: numAmount,
        price: activePrice,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate simulated chart data for selected asset and timeframe
  const chartData = useMemo(() => {
    const base = selectedAsset.price;
    const pointsCount = 30;
    const data = [];
    let current = base * 0.96;

    for (let i = 0; i < pointsCount; i++) {
      const variation = (Math.sin(i / 3) + (Math.random() - 0.48)) * (base * 0.015);
      current = Math.max(0.01, current + variation);
      const timeLabel = `${10 + Math.floor(i / 2)}:${(i % 2) * 30 === 0 ? '00' : '30'}`;
      data.push({
        time: timeLabel,
        price: Number(current.toFixed(base > 10 ? 2 : 4)),
        volume: Math.floor(Math.random() * 400 + 100),
      });
    }

    // Set last point to live price
    if (data.length > 0) {
      data[data.length - 1].price = selectedAsset.price;
    }
    return data;
  }, [selectedAsset.symbol, selectedAsset.price, chartInterval]);

  // Realistic Order Book Generator
  const orderBook = useMemo(() => {
    const p = selectedAsset.price;
    const asks = [];
    const bids = [];

    // 6 Asks (Selling - above current price)
    for (let i = 6; i >= 1; i--) {
      const askPrice = p * (1 + i * 0.0008);
      const size = (Math.random() * 1.5 + 0.2).toFixed(3);
      asks.push({
        price: Number(askPrice.toFixed(p > 10 ? 2 : 4)),
        size: parseFloat(size),
        total: Number((askPrice * parseFloat(size)).toFixed(2)),
        depth: Math.min(100, Math.floor(i * 14 + Math.random() * 15)),
      });
    }

    // 6 Bids (Buying - below current price)
    for (let i = 1; i <= 6; i++) {
      const bidPrice = p * (1 - i * 0.0008);
      const size = (Math.random() * 1.8 + 0.3).toFixed(3);
      bids.push({
        price: Number(bidPrice.toFixed(p > 10 ? 2 : 4)),
        size: parseFloat(size),
        total: Number((bidPrice * parseFloat(size)).toFixed(2)),
        depth: Math.min(100, Math.floor(i * 14 + Math.random() * 15)),
      });
    }

    return { asks, bids };
  }, [selectedAsset.price]);

  const filteredAssets = assets.filter((a) =>
    a.symbol.toLowerCase().includes(assetSearch.toLowerCase()) ||
    a.name.toLowerCase().includes(assetSearch.toLowerCase())
  );

  const isPricePositive = selectedAsset.change24h >= 0;
  const tick = recentPriceChanges[selectedAsset.symbol];

  return (
    <div className="space-y-4 pb-12">
      {/* Top Asset Stats Header */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-700/60 shadow-lg flex flex-wrap items-center justify-between gap-4">
        {/* Asset Selector dropdown */}
        <div className="relative">
          <button
            type="button"
            id="btn-asset-dropdown"
            onClick={() => setAssetDropdownOpen(!assetDropdownOpen)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer"
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
              style={{ backgroundColor: `${selectedAsset.color}22`, color: selectedAsset.color }}
            >
              {selectedAsset.symbol.slice(0, 3)}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5 font-black text-slate-100 text-sm">
                <span>{selectedAsset.name}</span>
                <span className="text-xs text-slate-400 font-mono">({selectedAsset.symbol}/USD)</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold">
                Simulated Liquidity Pool
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
          </button>

          {/* Dropdown Menu */}
          {assetDropdownOpen && (
            <div 
              className="absolute left-0 mt-2 w-72 rounded-2xl bg-[#0b1220] border border-slate-700 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150"
              style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}
            >
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={assetSearch}
                  onChange={(e) => setAssetSearch(e.target.value)}
                  placeholder="Search assets..."
                  className="glass-input w-full pl-8 pr-3 py-1.5 rounded-lg text-xs"
                  autoFocus
                />
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.symbol}
                    onClick={() => {
                      setSelectedAsset(asset);
                      setLimitPrice(asset.price.toString());
                      setAssetDropdownOpen(false);
                    }}
                    className="py-2 px-2 flex items-center justify-between hover:bg-slate-800/60 rounded-lg cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200">
                        {asset.symbol}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {asset.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-slate-100">
                        ${asset.price.toLocaleString()}
                      </div>
                      <div className={`text-[10px] font-bold ${asset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Ticker Metrics */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Mark Price
            </div>
            <div
              className={`text-lg sm:text-xl font-extrabold font-mono transition-colors duration-300 ${
                tick === 'up'
                  ? 'text-emerald-400'
                  : tick === 'down'
                  ? 'text-rose-400'
                  : 'text-slate-100'
              }`}
            >
              ${selectedAsset.price.toLocaleString('en-US', { minimumFractionDigits: selectedAsset.price > 10 ? 2 : 4 })}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              24h Change
            </div>
            <div className={`text-sm font-bold font-mono flex items-center gap-0.5 ${isPricePositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPricePositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{isPricePositive ? '+' : ''}{selectedAsset.change24h.toFixed(2)}%</span>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              24h High
            </div>
            <div className="text-sm font-mono font-bold text-slate-200">
              ${selectedAsset.high24h.toLocaleString()}
            </div>
          </div>

          <div className="hidden md:block">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              24h Low
            </div>
            <div className="text-sm font-mono font-bold text-slate-200">
              ${selectedAsset.low24h.toLocaleString()}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              24h Volume
            </div>
            <div className="text-sm font-mono font-bold text-slate-200">
              ${(selectedAsset.volume24h / 1e9).toFixed(2)}B
            </div>
          </div>
        </div>

        {/* Demo Disclaimer Pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
          <Zap className="w-3 h-3 text-emerald-400" />
          <span>SIMULATED MATCHING ENGINE</span>
        </div>
      </div>

      {/* Mobile Segmented Workspace Tabs (lg:hidden) */}
      <div className="lg:hidden grid grid-cols-3 gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={() => setMobileViewTab('chart')}
          className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            mobileViewTab === 'chart'
              ? 'bg-slate-800 text-slate-100 shadow-md border border-slate-700/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Live Chart
        </button>
        <button
          type="button"
          onClick={() => setMobileViewTab('book')}
          className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            mobileViewTab === 'book'
              ? 'bg-slate-800 text-slate-100 shadow-md border border-slate-700/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Order Book
        </button>
        <button
          type="button"
          onClick={() => setMobileViewTab('trade')}
          className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
            mobileViewTab === 'trade'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
              : 'text-emerald-400 hover:text-emerald-300'
          }`}
        >
          <span>Order ({side})</span>
        </button>
      </div>

      {/* Main Trading Workspace Grid (Chart + Order Book + Order Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
        {/* Center: Trading Chart (7 Cols) */}
        <div className={`lg:col-span-7 glass-panel rounded-2xl p-3.5 sm:p-5 border border-slate-700/60 shadow-xl flex flex-col ${mobileViewTab === 'chart' ? 'flex' : 'hidden lg:flex'}`}>
          {/* Chart Header with Timeframe Pills */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                {selectedAsset.symbol} / USD
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {chartInterval}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 overflow-x-auto">
              {(['1m', '5m', '15m', '1H', '1D'] as const).map((interval) => (
                <button
                  key={interval}
                  type="button"
                  onClick={() => setChartInterval(interval)}
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                    chartInterval === interval
                      ? 'bg-emerald-500 text-slate-950 font-extrabold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {interval}
                </button>
              ))}
            </div>
          </div>

          {/* Area Chart */}
          <div className="h-64 sm:h-80 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tradeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={selectedAsset.color || '#10B981'} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={selectedAsset.color || '#10B981'} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  domain={['dataMin - 50', 'dataMax + 50']}
                  tickFormatter={(val) => `$${val.toLocaleString()}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#0b1220] border border-slate-700 rounded-xl p-2.5 shadow-xl">
                          <div className="text-[10px] text-slate-400">{label}</div>
                          <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                            ${(payload[0].value as number).toLocaleString()}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={selectedAsset.color || '#10B981'}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#tradeGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Mini Volume Bar Chart underneath */}
          <div className="h-14 sm:h-16 w-full mt-1 pt-1 border-t border-slate-800/60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <Bar dataKey="volume" fill="rgba(16, 185, 129, 0.25)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Middle: Order Book (2.5 Cols / 3 on desktop) */}
        <div className={`lg:col-span-2 glass-panel rounded-2xl p-3.5 sm:p-4 border border-slate-700/60 shadow-xl flex flex-col justify-between ${mobileViewTab === 'book' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="pb-2 border-b border-slate-800">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Order Book
            </h4>
            <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-1">
              <span>Price (USD)</span>
              <span>Size ({selectedAsset.symbol})</span>
            </div>
          </div>

          {/* Asks (Sell Orders - Red) */}
          <div className="space-y-1 my-1">
            {orderBook.asks.map((ask, idx) => (
              <div key={`ask-${idx}`} className="relative flex justify-between text-xs font-mono py-0.5 px-1 overflow-hidden">
                <div 
                  className="absolute right-0 top-0 bottom-0 bg-rose-500/10 pointer-events-none" 
                  style={{ width: `${ask.depth}%` }}
                />
                <span className="text-rose-400 font-bold z-10">${ask.price.toLocaleString()}</span>
                <span className="text-slate-300 z-10">{ask.size}</span>
              </div>
            ))}
          </div>

          {/* Spread / Mid-Market Price Indicator */}
          <div className="py-2 px-2 my-1 bg-slate-900/90 rounded-lg text-center border border-slate-800 flex items-center justify-between">
            <div className="text-xs font-mono font-black text-emerald-400">
              ${selectedAsset.price.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">
              Spread 0.01%
            </div>
          </div>

          {/* Bids (Buy Orders - Green) */}
          <div className="space-y-1 my-1">
            {orderBook.bids.map((bid, idx) => (
              <div key={`bid-${idx}`} className="relative flex justify-between text-xs font-mono py-0.5 px-1 overflow-hidden">
                <div 
                  className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 pointer-events-none" 
                  style={{ width: `${bid.depth}%` }}
                />
                <span className="text-emerald-400 font-bold z-10">${bid.price.toLocaleString()}</span>
                <span className="text-slate-300 z-10">{bid.size}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Trading Panel (3 Cols) */}
        <div className={`lg:col-span-3 glass-panel rounded-2xl p-4 sm:p-5 border border-slate-700/60 shadow-xl flex flex-col justify-between ${mobileViewTab === 'trade' ? 'flex' : 'hidden lg:flex'}`}>
          <form onSubmit={handleTradeSubmit} className="space-y-3.5">
            {/* Buy / Sell Tab Switcher */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
              <button
                type="button"
                id="btn-trade-tab-buy"
                onClick={() => setSide('BUY')}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  side === 'BUY'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Buy {selectedAsset.symbol}
              </button>
              <button
                type="button"
                id="btn-trade-tab-sell"
                onClick={() => setSide('SELL')}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  side === 'SELL'
                    ? 'bg-rose-500 text-white font-black shadow-md shadow-rose-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sell {selectedAsset.symbol}
              </button>
            </div>

            {/* Order Type: Market / Limit */}
            <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-lg border border-slate-800/80">
              {(['MARKET', 'LIMIT'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setOrderType(type)}
                  className={`flex-1 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    orderType === type
                      ? 'bg-slate-800 text-slate-100'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {type === 'MARKET' ? 'Market Order' : 'Limit Order'}
                </button>
              ))}
            </div>

            {/* Price Input (if Limit) */}
            {orderType === 'LIMIT' ? (
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Limit Price (USD)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="0.0001"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    className="glass-input w-full px-3 py-2 rounded-xl text-xs font-mono font-bold"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">
                    USD
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <span className="text-slate-400">Execution Price:</span>
                <span className="font-mono font-bold text-slate-200">
                  Market (~${selectedAsset.price.toLocaleString()})
                </span>
              </div>
            )}

            {/* Amount Input */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
                <span>Amount</span>
                <span>
                  Avail: {side === 'BUY' ? `$${cashBalanceUSD.toLocaleString()}` : `${currentAssetHolding} ${selectedAsset.symbol}`}
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0.000001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs font-mono font-bold"
                />
                <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">
                  {selectedAsset.symbol}
                </span>
              </div>

              {/* Percentage Quick Selector */}
              <div className="grid grid-cols-4 gap-1 mt-1.5">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleQuickPercent(pct)}
                    className="py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-[10px] font-bold text-slate-300 transition-colors cursor-pointer"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Calculations and Breakdown */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Order Value:</span>
                <span className="font-mono text-slate-200">${totalValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Taker Fee (0.1%):</span>
                <span className="font-mono text-slate-200">${estimatedFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-100 pt-1.5 border-t border-slate-800">
                <span>Total:</span>
                <span className={`font-mono ${side === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Confirm Trade Button */}
            <button
              type="submit"
              id="btn-confirm-trade"
              disabled={isSubmitting || numAmount <= 0}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                side === 'BUY'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
              }`}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Confirm {side} {selectedAsset.symbol}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Quick Trade Floating Bar (when not on trade tab) */}
      {mobileViewTab !== 'trade' && (
        <div className="lg:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSide('BUY');
              setMobileViewTab('trade');
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Buy {selectedAsset.symbol}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSide('SELL');
              setMobileViewTab('trade');
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs shadow-lg shadow-rose-500/25 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Sell {selectedAsset.symbol}</span>
          </button>
        </div>
      )}

      {/* Bottom Tabs: Open Orders & Order History */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-700/60 shadow-xl">
        <div className="flex items-center gap-4 pb-3 border-b border-slate-800">
          <button
            type="button"
            onClick={() => setActiveBottomTab('open')}
            className={`text-xs font-bold pb-1 transition-colors cursor-pointer relative ${
              activeBottomTab === 'open'
                ? 'text-emerald-400 font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Open Orders ({orders.filter((o) => o.status === 'OPEN').length})
            {activeBottomTab === 'open' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveBottomTab('history')}
            className={`text-xs font-bold pb-1 transition-colors cursor-pointer relative ${
              activeBottomTab === 'history'
                ? 'text-emerald-400 font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Filled & Cancelled Orders ({orders.filter((o) => o.status !== 'OPEN').length})
            {activeBottomTab === 'history' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" />
            )}
          </button>
        </div>

        {/* Mobile Native Orders Card List */}
        <div className="sm:hidden divide-y divide-slate-800/60 mt-2">
          {orders
            .filter((o) => (activeBottomTab === 'open' ? o.status === 'OPEN' : o.status !== 'OPEN'))
            .map((ord) => {
              const isBuy = ord.type === 'BUY';
              return (
                <div key={ord.id} className="py-3 px-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${isBuy ? 'text-emerald-400 bg-emerald-500/15' : 'text-rose-400 bg-rose-500/15'}`}>
                        {ord.type} {ord.orderType}
                      </span>
                      <span className="font-bold text-xs text-slate-200">
                        {ord.symbol}/USD
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.status === 'FILLED'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : ord.status === 'OPEN'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {ord.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 font-sans text-[10px]">{ord.timestamp}</span>
                    <div className="text-right">
                      <span className="text-slate-300 font-bold">${ord.price.toLocaleString()}</span>
                      <span className="text-slate-500 mx-1">×</span>
                      <span className="text-slate-300">{ord.amount}</span>
                      <span className="text-slate-500 mx-1">=</span>
                      <span className="font-bold text-emerald-400">${ord.total.toLocaleString()}</span>
                    </div>
                  </div>

                  {activeBottomTab === 'open' && (
                    <div className="pt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => cancelOrder(ord.id)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 text-xs font-semibold border border-slate-700/60"
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          {orders.filter((o) => (activeBottomTab === 'open' ? o.status === 'OPEN' : o.status !== 'OPEN')).length === 0 && (
            <div className="py-8 text-center text-slate-500 text-xs font-sans">
              No {activeBottomTab === 'open' ? 'open orders' : 'order history'} found.
            </div>
          )}
        </div>

        {/* Desktop Orders Table */}
        <div className="hidden sm:block overflow-x-auto mt-2">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-2">Time</th>
                <th className="py-2.5 px-2">Type</th>
                <th className="py-2.5 px-2">Pair</th>
                <th className="py-2.5 px-2 text-right">Price</th>
                <th className="py-2.5 px-2 text-right">Amount</th>
                <th className="py-2.5 px-2 text-right">Total</th>
                <th className="py-2.5 px-2 text-center">Status</th>
                {activeBottomTab === 'open' && <th className="py-2.5 px-2 text-center">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {orders
                .filter((o) => (activeBottomTab === 'open' ? o.status === 'OPEN' : o.status !== 'OPEN'))
                .map((ord) => {
                  const isBuy = ord.type === 'BUY';
                  return (
                    <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-2 text-slate-400 font-sans text-[11px]">
                        {ord.timestamp}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${isBuy ? 'text-emerald-400 bg-emerald-500/15' : 'text-rose-400 bg-rose-500/15'}`}>
                          {ord.type} {ord.orderType}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-sans font-bold text-slate-200">
                        {ord.symbol}/USD
                      </td>
                      <td className="py-3 px-2 text-right text-slate-200">
                        ${ord.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-right text-slate-200">
                        {ord.amount}
                      </td>
                      <td className="py-3 px-2 text-right text-emerald-400 font-bold">
                        ${ord.total.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-center font-sans">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === 'FILLED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : ord.status === 'OPEN'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      {activeBottomTab === 'open' && (
                        <td className="py-3 px-2 text-center font-sans">
                          <button
                            type="button"
                            onClick={() => cancelOrder(ord.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 text-[11px] font-semibold border border-slate-700/60 cursor-pointer transition-colors"
                          >
                            Cancel
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              {orders.filter((o) => (activeBottomTab === 'open' ? o.status === 'OPEN' : o.status !== 'OPEN')).length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                    No {activeBottomTab === 'open' ? 'open orders' : 'order history'} found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
