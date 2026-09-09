import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Modal } from '../ui/Modal';
import { CryptoAsset } from '../../types';
import { ArrowUpRight, ArrowDownRight, RefreshCw, Zap } from 'lucide-react';

interface QuickTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAction?: 'BUY' | 'SELL';
}

export const QuickTradeModal: React.FC<QuickTradeModalProps> = ({
  isOpen,
  onClose,
  defaultAction = 'BUY',
}) => {
  const { assets, holdings, cashBalanceUSD, executeTrade } = useTrading();
  const [action, setAction] = useState<'BUY' | 'SELL'>(defaultAction);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC');
  const [amount, setAmount] = useState<string>('0.05');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedAsset = assets.find((a) => a.symbol === selectedSymbol) || assets[0];
  const price = selectedAsset?.price || 0;
  const numAmount = parseFloat(amount) || 0;
  const total = numAmount * price;
  const fee = total * 0.001;
  const grandTotal = action === 'BUY' ? total + fee : total - fee;

  const currentHolding = holdings[selectedSymbol] || 0;

  const handlePercentage = (pct: number) => {
    if (action === 'BUY') {
      const budget = cashBalanceUSD * (pct / 100);
      if (price > 0) {
        const calculatedQty = budget / price;
        setAmount(calculatedQty.toFixed(4));
      }
    } else {
      const qty = currentHolding * (pct / 100);
      setAmount(qty.toFixed(4));
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) return;

    setIsSubmitting(true);
    try {
      const res = await executeTrade({
        type: action,
        orderType: 'MARKET',
        symbol: selectedSymbol,
        amount: numAmount,
        price,
      });
      if (res.success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Instant Trade"
      subtitle="Execute simulated market orders with zero latency"
      maxWidth="md"
    >
      <form onSubmit={handleConfirm} className="space-y-4">
        {/* Buy / Sell Tab Switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setAction('BUY')}
            className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              action === 'BUY'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Buy Crypto</span>
          </button>
          <button
            type="button"
            onClick={() => setAction('SELL')}
            className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              action === 'SELL'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Sell Crypto</span>
          </button>
        </div>

        {/* Asset Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Select Asset
          </label>
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
          >
            {assets.map((asset) => (
              <option key={asset.symbol} value={asset.symbol} className="bg-[#0b1220] text-slate-200">
                {asset.name} ({asset.symbol}) — ${asset.price.toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Input */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1.5">
            <span>Amount ({selectedSymbol})</span>
            <span>
              Available: {action === 'BUY' ? `$${cashBalanceUSD.toLocaleString()}` : `${currentHolding} ${selectedSymbol}`}
            </span>
          </div>
          <div className="relative">
            <input
              type="number"
              step="any"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm font-mono font-bold"
            />
            <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">
              {selectedSymbol}
            </span>
          </div>

          {/* Quick percentage buttons */}
          <div className="grid grid-cols-4 gap-1.5 mt-2">
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handlePercentage(pct)}
                className="py-1 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-[11px] font-semibold text-slate-300 transition-colors"
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Summary Box */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Market Price:</span>
            <span className="font-mono text-slate-200">${price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Estimated Fee (0.1%):</span>
            <span className="font-mono text-slate-200">${fee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-slate-200 pt-1.5 border-t border-slate-800">
            <span>Estimated Total:</span>
            <span className="font-mono text-emerald-400">${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || numAmount <= 0}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            action === 'BUY'
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
          }`}
        >
          {isSubmitting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Confirm Instant {action === 'BUY' ? 'Buy' : 'Sell'}</span>
            </>
          )}
        </button>
      </form>
    </Modal>
  );
};
