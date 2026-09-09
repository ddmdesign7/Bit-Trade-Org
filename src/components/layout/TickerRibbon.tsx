import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const TickerRibbon: React.FC = () => {
  const { assets, setSelectedAsset, setCurrentPage, recentPriceChanges } = useTrading();

  const handleSelect = (symbol: string) => {
    const asset = assets.find((a) => a.symbol === symbol);
    if (asset) {
      setSelectedAsset(asset);
      setCurrentPage('trade');
    }
  };

  return (
    <div className="w-full bg-[#050811] border-b border-slate-800/80 py-1.5 px-4 overflow-x-auto scrollbar-none select-none">
      <div className="flex items-center gap-6 sm:gap-8 min-w-max text-[11px]">
        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>LIVE</span>
        </div>

        {assets.map((asset) => {
          const isPositive = asset.change24h >= 0;
          const tick = recentPriceChanges[asset.symbol];

          return (
            <div
              key={asset.symbol}
              onClick={() => handleSelect(asset.symbol)}
              className="flex items-center gap-2 hover:bg-slate-800/60 px-2 py-0.5 rounded-lg cursor-pointer transition-colors"
            >
              <span className="font-bold text-slate-300">
                {asset.symbol}
              </span>
              <span
                className={`font-mono font-bold transition-colors duration-300 ${
                  tick === 'up'
                    ? 'text-emerald-400 font-extrabold'
                    : tick === 'down'
                    ? 'text-rose-400 font-extrabold'
                    : 'text-slate-100'
                }`}
              >
                ${asset.price.toLocaleString('en-US', { minimumFractionDigits: asset.price > 10 ? 2 : 4 })}
              </span>
              <span
                className={`flex items-center text-[10px] font-bold ${
                  isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
