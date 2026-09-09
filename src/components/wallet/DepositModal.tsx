import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Modal } from '../ui/Modal';
import { ArrowDownLeft, Copy, Check, RefreshCw } from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const { assets, executeDeposit, addToast } = useTrading();
  const [depAsset, setDepAsset] = useState<string>('USDT');
  const [depNetwork, setDepNetwork] = useState<string>('TRC20');
  const [depAmount, setDepAmount] = useState<string>('5000');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const demoAddresses: Record<string, string> = {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(depAmount) || 0;
    if (amountNum <= 0) return;

    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      await executeDeposit(depAsset, amountNum, depNetwork);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Deposit Digital Assets"
      subtitle="Fund your Bit Trade Net institutional sandbox"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Select Currency
          </label>
          <select
            value={depAsset}
            onChange={(e) => setDepAsset(e.target.value)}
            className="glass-input w-full px-3.5 py-2 rounded-xl text-xs font-bold"
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
            Deposit Network
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {['TRC20', 'ERC20', 'BEP20'].map((net) => (
              <button
                key={net}
                type="button"
                onClick={() => setDepNetwork(net)}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  depNetwork === net
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400'
                }`}
              >
                {net}
              </button>
            ))}
          </div>
        </div>

        {/* QR Code & Address */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-2.5">
          <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <rect width="100" height="100" fill="#ffffff" />
              <rect x="10" y="10" width="25" height="25" fill="#060a12" />
              <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
              <rect x="65" y="10" width="25" height="25" fill="#060a12" />
              <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
              <rect x="10" y="65" width="25" height="25" fill="#060a12" />
              <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
              <circle cx="50" cy="50" r="7" fill="#10B981" />
            </svg>
          </div>

          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400">
            <span className="truncate">{demoAddresses[depAsset] || '0x71C...49A2'}</span>
            <button
              type="button"
              onClick={() => handleCopyAddress(demoAddresses[depAsset] || '0x71C...49A2')}
              className="shrink-0 p-1 text-slate-400 hover:text-slate-100 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Simulated Amount
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
              <span>Credit Simulated Balance</span>
            </>
          )}
        </button>
      </form>
    </Modal>
  );
};
