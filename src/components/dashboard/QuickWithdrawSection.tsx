import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { 
  Wallet, 
  ArrowUpRight, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  ClipboardPaste, 
  Check, 
  DollarSign, 
  Coins, 
  HelpCircle 
} from 'lucide-react';

export const QuickWithdrawSection: React.FC = () => {
  const { 
    cashBalanceUSD, 
    executeWithdraw, 
    addToast,
    showInvestmentNotice 
  } = useTrading();

  const [walletAddress, setWalletAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState(cashBalanceUSD.toString());
  const [selectedNetwork, setSelectedNetwork] = useState('TRC20');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pasted, setPasted] = useState(false);

  const networks = [
    { id: 'TRC20', name: 'USDT (TRC20 - Tron)', fee: '$1.00', speed: '~2 mins' },
    { id: 'ERC20', name: 'USDT (ERC20 - Ethereum)', fee: '$4.50', speed: '~5 mins' },
    { id: 'BTC', name: 'Bitcoin Network (Native SegWit)', fee: '$3.20', speed: '~15 mins' },
    { id: 'BEP20', name: 'USDT (BEP20 - BNB Chain)', fee: '$0.80', speed: '~1 min' },
  ];

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setWalletAddress(text);
        setPasted(true);
        setTimeout(() => setPasted(false), 2000);
      }
    } catch {
      // Clipboard access may be restricted in some iframes; prompt fallback
      addToast({
        type: 'info',
        title: 'Paste Wallet Address',
        message: 'Please paste your wallet address directly into the field.',
      });
    }
  };

  const handleQuickPercent = (percent: number) => {
    const val = ((cashBalanceUSD * percent) / 100).toFixed(2);
    setWithdrawAmount(val);
  };

  const handleProcessWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!walletAddress.trim()) {
      addToast({
        type: 'error',
        title: 'Wallet Address Required',
        message: 'Please input your destination wallet address to withdraw.',
      });
      return;
    }

    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      addToast({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Please enter a valid withdrawal amount.',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Processing withdrawal attempt on ledger
      await executeWithdraw('USDT', amountNum, walletAddress.trim(), selectedNetwork);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div 
      id="section-quick-withdraw"
      className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/60 shadow-xl relative overflow-hidden"
    >
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sky-500 via-emerald-400 to-amber-500" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-emerald-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 shadow-inner">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-lg font-black text-slate-100 tracking-tight">
                Withdraw From Available Balance
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[9px] sm:text-[10px] font-bold text-emerald-400">
                Instant Payout
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Input destination wallet address to disburse funds from your available balance.
            </p>
          </div>
        </div>

        {/* Current Available Balance Highlight */}
        <div className="flex items-center justify-between sm:justify-start gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2 w-full sm:w-auto shrink-0">
          <div className="text-left sm:text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Available Balance
            </div>
            <div className="text-base sm:text-lg font-mono font-black text-emerald-400">
              ${cashBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleProcessWithdrawal} className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
          {/* Input Wallet Address */}
          <div className="lg:col-span-6 space-y-1.5">
            <div className="flex items-center justify-between">
              <label 
                htmlFor="input-withdraw-wallet"
                className="text-xs font-bold text-slate-300 flex items-center gap-1.5"
              >
                <span>Destination Wallet Address</span>
                <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                Supports TRC20, ERC20, BTC
              </span>
            </div>
            <div className="relative">
              <input
                id="input-withdraw-wallet"
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Paste wallet address (0x... or T...)"
                required
                className="glass-input w-full pl-3.5 pr-20 py-2.5 rounded-xl text-xs sm:text-sm font-mono placeholder:text-slate-500 transition-all focus:border-sky-400"
              />
              <button
                type="button"
                id="btn-paste-wallet"
                onClick={handlePaste}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                {pasted ? <Check className="w-3 h-3 text-emerald-400" /> : <ClipboardPaste className="w-3 h-3" />}
                <span>{pasted ? 'Pasted' : 'Paste'}</span>
              </button>
            </div>
          </div>

          {/* Network Selection */}
          <div className="lg:col-span-3 space-y-1.5">
            <label 
              htmlFor="select-withdraw-network"
              className="text-xs font-bold text-slate-300 block"
            >
              Transfer Network
            </label>
            <select
              id="select-withdraw-network"
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
              className="glass-input w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-900 cursor-pointer"
            >
              {networks.map((net) => (
                <option key={net.id} value={net.id} className="bg-slate-900 text-slate-200">
                  {net.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input */}
          <div className="lg:col-span-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <label 
                htmlFor="input-withdraw-amount"
                className="text-xs font-bold text-slate-300"
              >
                Withdraw Amount (USD)
              </label>
              <button
                type="button"
                onClick={() => handleQuickPercent(100)}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
              >
                Max
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                id="input-withdraw-amount"
                type="number"
                step="any"
                min="1"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0.00"
                required
                className="glass-input w-full pl-8 pr-3 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold placeholder:text-slate-500 transition-all focus:border-emerald-400"
              />
            </div>
          </div>
        </div>

        {/* Quick Percent Selectors & Submission Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <span className="text-[11px] text-slate-400 font-medium mr-1 hidden sm:inline">
              Quick Select:
            </span>
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handleQuickPercent(pct)}
                className={`flex-1 sm:flex-initial px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  withdrawAmount === ((cashBalanceUSD * pct) / 100).toFixed(2)
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                {pct === 100 ? 'Max (100%)' : `${pct}%`}
              </button>
            ))}
          </div>

          {/* Process Withdrawal Action */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="submit"
              id="btn-process-withdrawal"
              disabled={isProcessing}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs sm:text-sm font-black transition-all shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Withdrawal...</span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Process Withdrawal</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Informational Compliance Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 gap-1.5">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Encrypted Ledger Gateway • Cold-storage security verification active</span>
          </div>
          <button
            type="button"
            onClick={() => showInvestmentNotice(parseFloat(withdrawAmount) || cashBalanceUSD, walletAddress)}
            className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer text-left sm:text-right"
          >
            Review Investment Rules Notice
          </button>
        </div>
      </form>
    </div>
  );
};
