import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { PORTFOLIO_HISTORY_DATA } from '../../data/mockData';
import { TrendingUp, Maximize2 } from 'lucide-react';

interface PortfolioChartProps {
  currentValue: number;
}

type Timeframe = '24H' | '7D' | '1M' | '1Y' | 'ALL';

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ currentValue }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('7D');

  const rawData = PORTFOLIO_HISTORY_DATA[timeframe] || PORTFOLIO_HISTORY_DATA['7D'];
  
  // Update the latest point to match current live portfolio value
  const chartData = rawData.map((item, idx) => {
    if (idx === rawData.length - 1) {
      return { ...item, value: currentValue };
    }
    return item;
  });

  const timeframes: Timeframe[] = ['24H', '7D', '1M', '1Y', 'ALL'];

  const startValue = chartData[0]?.value || currentValue;
  const diff = currentValue - startValue;
  const diffPercent = startValue > 0 ? (diff / startValue) * 100 : 0;
  const isPositive = diff >= 0;

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-700/60 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Portfolio Performance
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE TICK
            </span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100">
              ${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-xs sm:text-sm font-bold flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{isPositive ? '+' : ''}${Math.abs(diff).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({isPositive ? '+' : ''}{diffPercent.toFixed(2)}%)</span>
            </div>
          </div>
        </div>

        {/* Timeframe selector tabs */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {timeframes.map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
                timeframe === tf
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              domain={['dataMin - 1000', 'dataMax + 1000']}
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value as number;
                  return (
                    <div className="bg-[#0b1220] border border-emerald-500/40 rounded-xl p-3 shadow-2xl backdrop-blur-md">
                      <div className="text-[11px] font-semibold text-slate-400">
                        {label}
                      </div>
                      <div className="text-base font-extrabold font-mono text-emerald-400 mt-0.5">
                        ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Bit Trade Net Simulated Valuation
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#emeraldGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
