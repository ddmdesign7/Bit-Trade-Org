import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  id?: string;
  label: string;
  value: string;
  subValue?: string;
  change?: number;
  changeLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  actionButton?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  label,
  value,
  subValue,
  change,
  changeLabel = 'vs yesterday',
  icon: Icon,
  iconColor = 'text-emerald-400',
  actionButton,
}) => {
  const isPositive = change !== undefined ? change >= 0 : true;

  return (
    <div
      id={id}
      className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-700/60 shadow-lg relative overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100 mt-1.5 tracking-tight">
            {value}
          </div>
          {subValue && (
            <div className="text-xs text-slate-400 mt-0.5 font-medium">
              {subValue}
            </div>
          )}
        </div>

        <div className={`p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Change indicator and optional action */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/60">
        {change !== undefined ? (
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-xs font-bold ${
                isPositive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>
                {isPositive ? '+' : ''}
                {change.toFixed(2)}%
              </span>
            </span>
            <span className="text-[11px] text-slate-400">
              {changeLabel}
            </span>
          </div>
        ) : (
          <div className="text-[11px] text-slate-400">
            Real-time institutional ledger
          </div>
        )}

        {actionButton}
      </div>
    </div>
  );
};
