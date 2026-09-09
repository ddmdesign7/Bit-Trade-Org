import React, { useState, useMemo } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Transaction } from '../../types';
import { Modal } from '../ui/Modal';
import { 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  Copy,
  Check,
  Calendar,
  FileText
} from 'lucide-react';

export const TransactionsView: React.FC = () => {
  const { transactions, addToast } = useTrading();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INVESTMENT' | 'WITHDRAW' | 'REINVESTMENT' | 'DEPOSIT' | 'BUY' | 'SELL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING'>('ALL');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [copiedTx, setCopiedTx] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.assetSymbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.note && tx.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
        tx.txHash.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (typeFilter !== 'ALL' && tx.type !== typeFilter) return false;
      if (statusFilter !== 'ALL' && tx.status !== statusFilter) return false;

      return true;
    });
  }, [transactions, searchQuery, typeFilter, statusFilter]);

  const handleExportCSV = () => {
    const headers = 'ID,Type,Asset,Amount,Price,Total,Fee,Status,Timestamp,TxHash\n';
    const rows = filteredTransactions
      .map(
        (t) =>
          `"${t.id}","${t.type}","${t.assetSymbol}","${t.amount}","${t.price}","${t.total}","${t.fee}","${t.status}","${t.timestamp}","${t.txHash}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bit_trade_net_statement_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'Statement Exported',
      message: 'Generated and downloaded CSV financial statement.',
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
    addToast({
      type: 'info',
      title: 'Hash Copied',
      message: 'Cryptographic transaction hash copied.',
      duration: 2000,
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/60 shadow-lg relative overflow-hidden">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
            Transaction History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Complete cryptographic audit trail of all orders, funding deposits, and withdrawals.
          </p>
        </div>

        {/* Export CSV Button */}
        <button
          type="button"
          id="btn-export-csv"
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer w-full sm:w-auto shrink-0"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export CSV Statement</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(['ALL', 'INVESTMENT', 'WITHDRAW', 'REINVESTMENT', 'DEPOSIT', 'BUY', 'SELL'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                typeFilter === type
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {type === 'ALL' ? 'All Types' : type === 'REINVESTMENT' ? 'Re-investment' : type}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by asset, hash, ID..."
            className="glass-input w-full pl-10 pr-4 py-2 rounded-xl text-xs font-medium placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Transactions Container */}
      <div className="glass-panel rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden">
        {/* Mobile Native Transactions List (<sm) */}
        <div className="sm:hidden divide-y divide-slate-800/60">
          {filteredTransactions.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No transactions found matching your criteria.
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const isPositive = tx.type === 'BUY' || tx.type === 'DEPOSIT';
              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="p-3.5 active:bg-slate-800/50 transition-colors cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          tx.type === 'BUY'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : tx.type === 'SELL'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : tx.type === 'DEPOSIT'
                            ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                            : tx.type === 'INVESTMENT'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : tx.type === 'REINVESTMENT'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {tx.type === 'REINVESTMENT' ? 'RE-INVEST' : tx.type}
                      </span>
                      <span className="font-extrabold text-xs text-slate-100">
                        {tx.assetName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        ({tx.assetSymbol})
                      </span>
                    </div>

                    <div className="text-right font-mono font-bold text-xs text-emerald-400">
                      ${tx.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="text-[10px] font-sans text-slate-400">{tx.timestamp}</span>
                    <span className="text-slate-200">
                      {isPositive ? '+' : '-'}{tx.amount} {tx.assetSymbol}
                    </span>
                  </div>

                  {tx.note && (
                    <div className="text-[10px] text-slate-300 bg-slate-900/80 border border-slate-800 rounded px-2 py-1 leading-snug">
                      {tx.note}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px]">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{tx.status}</span>
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-slate-400" />
                      <span>Tap for Receipt</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Transactions Table (sm+) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900/40">
                <th className="py-4 px-4">Type</th>
                <th className="py-4 px-4">Asset</th>
                <th className="py-4 px-4">Timestamp</th>
                <th className="py-4 px-4 text-right">Amount</th>
                <th className="py-4 px-4 text-right">Price</th>
                <th className="py-4 px-4 text-right">Total (USD)</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-center">Receipt</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isPositive = tx.type === 'BUY' || tx.type === 'DEPOSIT';
                  return (
                    <tr 
                      key={tx.id} 
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedTx(tx)}
                    >
                      {/* Type Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            tx.type === 'BUY'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : tx.type === 'SELL'
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : tx.type === 'DEPOSIT'
                              ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                              : tx.type === 'INVESTMENT'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : tx.type === 'REINVESTMENT'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {tx.type === 'REINVESTMENT' ? 'RE-INVEST' : tx.type}
                        </span>
                      </td>

                      {/* Asset */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-100">
                          {tx.assetName}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {tx.assetSymbol}
                        </div>
                        {tx.note && (
                          <div className="text-[10px] text-slate-300 bg-slate-800/70 border border-slate-700/60 rounded px-1.5 py-0.5 mt-1 leading-normal max-w-xs sm:max-w-md">
                            {tx.note}
                          </div>
                        )}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {tx.timestamp}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">
                        {isPositive ? '+' : '-'}{tx.amount} {tx.assetSymbol}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                        ${tx.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                        ${tx.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{tx.status}</span>
                        </span>
                      </td>

                      {/* Receipt Action */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setSelectedTx(tx)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 transition-colors cursor-pointer"
                          title="View receipt"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
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

      {/* Transaction Receipt Modal */}
      {selectedTx && (
        <Modal
          isOpen={!!selectedTx}
          onClose={() => setSelectedTx(null)}
          title="Transaction Receipt"
          subtitle={`Reference: ${selectedTx.id}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            {/* Status Header */}
            <div className="text-center py-3 bg-slate-900/90 rounded-xl border border-slate-800">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-xl font-extrabold font-mono text-slate-100">
                {selectedTx.type === 'BUY' || selectedTx.type === 'DEPOSIT' ? '+' : '-'}{selectedTx.amount} {selectedTx.assetSymbol}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Valuation: ${selectedTx.total.toLocaleString()} USD
              </div>
            </div>

            {/* Receipt Line Items */}
            <div className="divide-y divide-slate-800 text-xs">
              <div className="py-2.5 flex justify-between text-slate-400">
                <span>Operation Type:</span>
                <span className="font-bold text-slate-200">{selectedTx.type} Order</span>
              </div>
              <div className="py-2.5 flex justify-between text-slate-400">
                <span>Execution Price:</span>
                <span className="font-mono text-slate-200">${selectedTx.price.toLocaleString()}</span>
              </div>
              <div className="py-2.5 flex justify-between text-slate-400">
                <span>Network Protocol Fee:</span>
                <span className="font-mono text-slate-200">${selectedTx.fee.toFixed(2)} USD</span>
              </div>
              <div className="py-2.5 flex justify-between text-slate-400">
                <span>Settlement Timestamp:</span>
                <span className="font-mono text-slate-200">{selectedTx.timestamp}</span>
              </div>
              <div className="py-2.5 flex justify-between text-slate-400">
                <span>Consensus Network:</span>
                <span className="text-slate-200">{selectedTx.network || 'Internal Ledger Matching'}</span>
              </div>
              {selectedTx.note && (
                <div className="py-2.5 flex flex-col gap-1 text-slate-400">
                  <span>Investment Ledger Memo:</span>
                  <span className="text-slate-200 bg-slate-900/90 border border-slate-800 rounded p-2 text-[11px] leading-relaxed">
                    {selectedTx.note}
                  </span>
                </div>
              )}
            </div>

            {/* Hash Box */}
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                Ledger Proof Hash
              </span>
              <div className="flex items-center justify-between gap-2 p-2 mt-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                <span className="truncate">{selectedTx.txHash}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(selectedTx.txHash)}
                  className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {copiedTx ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedTx(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Close Receipt
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
