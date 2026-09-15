import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Modal } from '../ui/Modal';
import { InvestmentNoticeModal } from './InvestmentNoticeModal';
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Send, 
  QrCode, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink,
  Lock,
  RefreshCw
} from 'lucide-react';

export const WalletView: React.FC = () => {
  const { 
    assets, 
    holdings, 
    cashBalanceUSD, 
    totalPortfolioValue, 
    executeDeposit, 
    executeWithdraw,
    investmentNoticeOpen,
    setInvestmentNoticeOpen,
    addToast,
    setCurrentPage,
    setSelectedAsset
  } = useTrading();

  // Dialog states
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);

  // Deposit Form State
  const [depAsset, setDepAsset] = useState<string>('USDT');
  const [depNetwork, setDepNetwork] = useState<string>('TRC20');
  const [depAmount, setDepAmount] = useState<string>('1000');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Withdraw Form State
  const [withAsset, setWithAsset] = useState<string>('USDT');
  const [withAddress, setWithAddress] = useState<string>('');
  const [withNetwork, setWithNetwork] = useState<string>('TRC20');
  const [withAmount, setWithAmount] = useState<string>('500');
  const [with2FACode, setWith2FACode] = useState<string>('');
  const [confirmStep, setConfirmStep] = useState(false);

  // Send State
  const [sendRecipient, setSendRecipient] = useState('');
  const [sendAsset, setSendAsset] = useState('USDT');
  const [sendAmount, setSendAmount] = useState('100');

  // Static vault deposit addresses
  const vaultAddresses: Record<string, string> = {
    BTC: 'bc1q9v8t3z7k8x5n2m4p6r1y0w9e8u7i6o5p4a3s2d',
    ETH: '0x71C...49A2d1B3C5E7F9A0b2D4e6A8c1F3d7E9a1B5c8',
    SOL: '9xQeW...8mKpL1vB3cD5fG7hJ9kL2mN4pQ6rS8tU0vW2x',
    USDT: 'TYDzsxdSpGs61CX82km62fEdPwtzNJe2oo',
    XRP: 'rEb8TK3gBgk5auZyySm56aWCqbiWBPrUyb',
    BNB: 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2',
  };

  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast({
      type: 'info',
      title: 'Address Copied',
      message: 'Wallet address copied to clipboard.',
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Submit simulated deposit
  const handleConfirmDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(depAmount) || 0;
    if (amountNum <= 0) return;

    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      await executeDeposit(depAsset, amountNum, depNetwork);
      setDepositOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // Submit simulated withdrawal
  const handleConfirmWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withAmount) || 0;
    if (amountNum <= 0 || !withAddress.trim()) {
      addToast({
        type: 'error',
        title: 'Missing Fields',
        message: 'Please provide destination address and valid amount.',
      });
      return;
    }

    if (!confirmStep) {
      setConfirmStep(true);
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      await executeWithdraw(withAsset, amountNum, withAddress, withNetwork);
      setWithdrawOpen(false);
      setConfirmStep(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // Send handler
  const handleConfirmSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(sendAmount) || 0;
    if (amountNum <= 0 || !sendRecipient.trim()) return;

    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      const success = await executeWithdraw(sendAsset, amountNum, sendRecipient, 'Internal Transfer');
      if (success) {
        setSendOpen(false);
        setSendRecipient('');
        addToast({
          type: 'success',
          title: 'Direct Transfer Executed',
          message: `Transferred ${amountNum} ${sendAsset} to ${sendRecipient}. Zero network fees.`,
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* Wallet Overview Hero Card */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 sm:p-8 border border-slate-700/60 shadow-2xl relative overflow-hidden">
        {/* Background glow accent */}
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-emerald-500/10 via-teal-500/5 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Consolidated Balance
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                MULTI-ASSET VAULT
              </span>
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-mono text-slate-100 mt-1 tracking-tight">
              ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-400 mt-2 font-medium flex-wrap">
              <span>Cash Available: <strong className="text-emerald-400 font-mono">${cashBalanceUSD.toLocaleString()}</strong></span>
              <span>&bull;</span>
              <span>Cold Storage Protected</span>
            </div>
          </div>

          {/* 4 Action Buttons: Deposit, Withdraw, Send, Receive */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
            {/* Deposit */}
            <button
              type="button"
              id="btn-wallet-deposit"
              onClick={() => setDepositOpen(true)}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 sm:px-5 sm:py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <ArrowDownLeft className="w-5 h-5" />
              <span>Deposit</span>
            </button>

            {/* Withdraw */}
            <button
              type="button"
              id="btn-wallet-withdraw"
              onClick={() => {
                setConfirmStep(false);
                setWithdrawOpen(true);
              }}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 sm:px-5 sm:py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700/80 font-bold text-xs transition-all active:scale-95 cursor-pointer"
            >
              <ArrowUpRight className="w-5 h-5 text-rose-400" />
              <span>Withdraw</span>
            </button>

            {/* Send */}
            <button
              type="button"
              id="btn-wallet-send"
              onClick={() => setSendOpen(true)}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 sm:px-5 sm:py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700/80 font-bold text-xs transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-5 h-5 text-sky-400" />
              <span>Send</span>
            </button>

            {/* Receive */}
            <button
              type="button"
              id="btn-wallet-receive"
              onClick={() => setReceiveOpen(true)}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 sm:px-5 sm:py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700/80 font-bold text-xs transition-all active:scale-95 cursor-pointer"
            >
              <QrCode className="w-5 h-5 text-amber-400" />
              <span>Receive</span>
            </button>
          </div>
        </div>
      </div>

      {/* Asset Balances Table & Mobile Cards */}
      <div className="glass-panel rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100">
              Asset Allocation & Vault Balances
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Encrypted crypto and stablecoin ledger balances
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Total: {assets.length}
          </span>
        </div>

        {/* Mobile Native Asset Card List (<sm) */}
        <div className="sm:hidden divide-y divide-slate-800/60">
          {assets.map((asset) => {
            const balance = holdings[asset.symbol] || 0;
            const valueUSD = balance * asset.price;

            return (
              <div key={asset.symbol} className="p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0"
                      style={{ backgroundColor: `${asset.color}22`, color: asset.color }}
                    >
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-100">
                        {asset.name}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {asset.symbol} &bull; ${asset.price.toLocaleString('en-US', { minimumFractionDigits: asset.price > 10 ? 2 : 4 })}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-xs text-emerald-400">
                      ${valueUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {asset.symbol}
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setDepAsset(asset.symbol);
                      setDepositOpen(true);
                    }}
                    className="py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-950/40 text-emerald-400 border border-slate-700 font-semibold text-[11px] cursor-pointer text-center"
                  >
                    Deposit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWithAsset(asset.symbol);
                      setConfirmStep(false);
                      setWithdrawOpen(true);
                    }}
                    className="py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-rose-400 border border-slate-700 font-semibold text-[11px] cursor-pointer text-center"
                  >
                    Withdraw
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAsset(asset);
                      setCurrentPage('trade');
                    }}
                    className="py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] cursor-pointer text-center"
                  >
                    Trade
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table (sm+) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900/40">
                <th className="py-3.5 px-4">Asset</th>
                <th className="py-3.5 px-4 text-right">Balance</th>
                <th className="py-3.5 px-4 text-right">Available</th>
                <th className="py-3.5 px-4 text-right">Current Price</th>
                <th className="py-3.5 px-4 text-right">Estimated USD</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {assets.map((asset) => {
                const balance = holdings[asset.symbol] || 0;
                const valueUSD = balance * asset.price;

                return (
                  <tr key={asset.symbol} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs"
                          style={{ backgroundColor: `${asset.color}22`, color: asset.color }}
                        >
                          {asset.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-100">
                            {asset.name}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {asset.symbol}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right font-mono font-bold text-slate-200">
                      {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })} {asset.symbol}
                    </td>

                    <td className="py-4 px-4 text-right font-mono text-slate-300">
                      {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                    </td>

                    <td className="py-4 px-4 text-right font-mono text-slate-300">
                      ${asset.price.toLocaleString('en-US', { minimumFractionDigits: asset.price > 10 ? 2 : 4 })}
                    </td>

                    <td className="py-4 px-4 text-right font-mono font-bold text-emerald-400">
                      ${valueUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setDepAsset(asset.symbol);
                            setDepositOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-950/40 text-emerald-400 border border-slate-700 font-semibold text-[11px] cursor-pointer transition-colors"
                        >
                          Deposit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setWithAsset(asset.symbol);
                            setConfirmStep(false);
                            setWithdrawOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-rose-400 border border-slate-700 font-semibold text-[11px] cursor-pointer transition-colors"
                        >
                          Withdraw
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAsset(asset);
                            setCurrentPage('trade');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] cursor-pointer transition-colors"
                        >
                          Trade
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: DEPOSIT */}
      <Modal
        isOpen={depositOpen}
        onClose={() => setDepositOpen(false)}
        title="Deposit Digital Assets"
        subtitle="Fund your Bit Trade Net wallet"
        maxWidth="md"
      >
        <form onSubmit={handleConfirmDeposit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Select Currency
            </label>
            <select
              value={depAsset}
              onChange={(e) => setDepAsset(e.target.value)}
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-bold"
            >
              {assets.map((a) => (
                <option key={a.symbol} value={a.symbol} className="bg-[#0b1220]">
                  {a.name} ({a.symbol})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Select Network
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['TRC20', 'ERC20', 'BEP20'].map((net) => (
                <button
                  key={net}
                  type="button"
                  onClick={() => setDepNetwork(net)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    depNetwork === net
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-400'
                  }`}
                >
                  {net}
                </button>
              ))}
            </div>
          </div>

          {/* QR Code & Address Box */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-3">
            {/* Visual QR Code Generator */}
            <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-inner">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect width="100" height="100" fill="#ffffff" />
                <rect x="10" y="10" width="30" height="30" fill="#060a12" />
                <rect x="15" y="15" width="20" height="20" fill="#ffffff" />
                <rect x="20" y="20" width="10" height="10" fill="#060a12" />
                <rect x="60" y="10" width="30" height="30" fill="#060a12" />
                <rect x="65" y="15" width="20" height="20" fill="#ffffff" />
                <rect x="70" y="20" width="10" height="10" fill="#060a12" />
                <rect x="10" y="60" width="30" height="30" fill="#060a12" />
                <rect x="15" y="65" width="20" height="20" fill="#ffffff" />
                <rect x="20" y="70" width="10" height="10" fill="#060a12" />
                <circle cx="50" cy="50" r="8" fill="#10B981" />
                <rect x="45" y="15" width="5" height="15" fill="#060a12" />
                <rect x="50" y="75" width="25" height="5" fill="#060a12" />
                <rect x="75" y="50" width="15" height="15" fill="#060a12" />
              </svg>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                Your Assigned Vault Address
              </span>
              <div className="flex items-center justify-between gap-2 p-2 mt-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400">
                <span className="truncate">{vaultAddresses[depAsset] || '0x71C...49A2'}</span>
                <button
                  type="button"
                  onClick={() => handleCopyAddress(vaultAddresses[depAsset] || '0x71C...49A2')}
                  className="shrink-0 p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-slate-100 transition-colors cursor-pointer"
                  title="Copy address"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Deposit Amount
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="1"
                value={depAmount}
                onChange={(e) => setDepAmount(e.target.value)}
                required
                className="glass-input w-full px-3.5 py-2 rounded-xl text-xs font-mono font-bold"
              />
              <span className="absolute right-3.5 top-2 text-xs font-bold text-slate-400">
                {depAsset}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ArrowDownLeft className="w-4 h-4" />
                <span>Confirm & Credit Deposit</span>
              </>
            )}
          </button>
        </form>
      </Modal>

      {/* MODAL 2: WITHDRAWAL WITH 2FA CONFIRMATION */}
      <Modal
        isOpen={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        title={confirmStep ? "Confirm Security Authorization" : "Withdraw Digital Assets"}
        subtitle={confirmStep ? "Two-Factor Verification Required" : "Safely transfer funds to an external destination"}
        maxWidth="md"
      >
        <form onSubmit={handleConfirmWithdraw} className="space-y-4">
          {!confirmStep ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Asset to Withdraw
                </label>
                <select
                  value={withAsset}
                  onChange={(e) => setWithAsset(e.target.value)}
                  className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-bold"
                >
                  {assets.map((a) => (
                    <option key={a.symbol} value={a.symbol} className="bg-[#0b1220]">
                      {a.name} ({a.symbol}) — Avail: {holdings[a.symbol] || 0}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Destination Wallet Address
                </label>
                <input
                  type="text"
                  value={withAddress}
                  onChange={(e) => setWithAddress(e.target.value)}
                  placeholder="Paste 0x... or TRC20 address"
                  required
                  className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                  <span>Withdrawal Amount</span>
                  <span>Max: {holdings[withAsset] || 0} {withAsset}</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="0.001"
                    value={withAmount}
                    onChange={(e) => setWithAmount(e.target.value)}
                    required
                    className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">
                    {withAsset}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Network Fee:</span>
                  <span className="font-mono text-slate-200">1.50 {withAsset}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-100 pt-1 border-t border-slate-800">
                  <span>Receive Amount:</span>
                  <span className="font-mono text-emerald-400">
                    {Math.max(0, (parseFloat(withAmount) || 0) - 1.5).toFixed(4)} {withAsset}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Security Verification &rarr;</span>
              </button>
            </>
          ) : (
            <>
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Withdrawal Request Pre-Validated</span>
                </div>
                <p className="text-slate-400">
                  Please enter your 6-digit Authenticator TOTP token to authorize withdrawal.
                </p>
                <div className="text-slate-300 font-mono text-xs pt-2 border-t border-slate-800">
                  Amount: <strong>{withAmount} {withAsset}</strong> &bull; Destination: <strong>{withAddress.slice(0, 10)}...</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  2FA Authenticator Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={with2FACode}
                  onChange={(e) => setWith2FACode(e.target.value)}
                  placeholder="123456"
                  className="glass-input w-full px-3.5 py-3 rounded-xl text-center text-lg font-mono tracking-widest font-bold"
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmStep(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? 'Authorizing...' : 'Authorize & Broadcast Transfer'}
                </button>
              </div>
            </>
          )}
        </form>
      </Modal>

      {/* MODAL 3: SEND DIRECT */}
      <Modal
        isOpen={sendOpen}
        onClose={() => setSendOpen(false)}
        title="Direct Instant Transfer"
        subtitle="Zero-fee instant transfer between Bit Trade Net accounts"
        maxWidth="md"
      >
        <form onSubmit={handleConfirmSend} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Recipient Email or Account Tag
            </label>
            <input
              type="text"
              value={sendRecipient}
              onChange={(e) => setSendRecipient(e.target.value)}
              placeholder="e.g. jordan@bittrade.net"
              required
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Currency
            </label>
            <select
              value={sendAsset}
              onChange={(e) => setSendAsset(e.target.value)}
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-bold"
            >
              {assets.map((a) => (
                <option key={a.symbol} value={a.symbol} className="bg-[#0b1220]">
                  {a.name} ({a.symbol})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Transfer Amount
            </label>
            <input
              type="number"
              step="any"
              min="0.01"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              required
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold"
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? 'Transferring...' : 'Send Funds Instantly'}
          </button>
        </form>
      </Modal>

      {/* MODAL 4: RECEIVE QR CODE */}
      <Modal
        isOpen={receiveOpen}
        onClose={() => setReceiveOpen(false)}
        title="Receive Crypto Assets"
        subtitle="Share your QR code or address to receive deposits"
        maxWidth="sm"
      >
        <div className="text-center space-y-4">
          <div className="w-44 h-44 mx-auto bg-white p-3 rounded-2xl flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <rect width="100" height="100" fill="#ffffff" />
              <rect x="10" y="10" width="30" height="30" fill="#060a12" />
              <rect x="15" y="15" width="20" height="20" fill="#ffffff" />
              <rect x="20" y="20" width="10" height="10" fill="#060a12" />
              <rect x="60" y="10" width="30" height="30" fill="#060a12" />
              <rect x="65" y="15" width="20" height="20" fill="#ffffff" />
              <rect x="70" y="20" width="10" height="10" fill="#060a12" />
              <rect x="10" y="60" width="30" height="30" fill="#060a12" />
              <rect x="15" y="65" width="20" height="20" fill="#ffffff" />
              <rect x="20" y="70" width="10" height="10" fill="#060a12" />
              <circle cx="50" cy="50" r="7" fill="#10B981" />
            </svg>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 break-all">
            bc1q9v8t3z7k8x5n2m4p6r1y0w9e8u7i6o5p4a3s2d
          </div>

          <button
            type="button"
            onClick={() => handleCopyAddress('bc1q9v8t3z7k8x5n2m4p6r1y0w9e8u7i6o5p4a3s2d')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Address Copied' : 'Copy Receive Address'}</span>
          </button>
        </div>
      </Modal>

      {/* Investment Rules Compliance Notice Modal */}
      <InvestmentNoticeModal
        isOpen={investmentNoticeOpen}
        onClose={() => setInvestmentNoticeOpen(false)}
        onOpenDeposit={() => setDepositOpen(true)}
      />
    </div>
  );
};
