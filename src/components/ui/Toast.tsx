import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTrading();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-xl transition-all duration-300 transform translate-y-0 opacity-100 bg-[#0c1424]/95 border-slate-700/60"
            style={{
              borderColor: isSuccess 
                ? 'rgba(16, 185, 129, 0.4)' 
                : isError 
                ? 'rgba(239, 68, 68, 0.4)' 
                : isWarning 
                ? 'rgba(245, 158, 11, 0.4)' 
                : 'rgba(56, 189, 248, 0.3)',
              boxShadow: isSuccess 
                ? '0 10px 25px -5px rgba(16, 185, 129, 0.2)' 
                : isError 
                ? '0 10px 25px -5px rgba(239, 68, 68, 0.2)' 
                : '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-semibold text-slate-100 leading-tight">
                {toast.title}
              </h5>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-slate-200 transition-colors p-1 -mr-1 -mt-1 rounded-lg hover:bg-slate-800/60"
              aria-label="Close toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
