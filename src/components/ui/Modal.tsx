import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card / Bottom Sheet on mobile */}
      <div 
        className={`relative w-full ${maxWidthClasses[maxWidth]} rounded-t-3xl sm:rounded-2xl bg-[#0b1220] border-t sm:border border-slate-700/70 shadow-2xl p-4 sm:p-6 z-10 max-h-[92vh] overflow-y-auto safe-area-pb sm:my-8 transition-transform`}
        style={{
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.8), 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(16, 185, 129, 0.08)'
        }}
      >
        {/* Mobile Pull Handle Indicator */}
        <div className="sm:hidden flex justify-center pb-2 pt-0.5">
          <div className="w-12 h-1 rounded-full bg-slate-700" />
        </div>

        {/* Subtle decorative glow at the top */}
        <div className="hidden sm:block absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

        {/* Header */}
        <div className="flex items-start justify-between pb-3 sm:pb-4 border-b border-slate-800/80">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-100 tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-3.5 sm:mt-4">
          {children}
        </div>
      </div>
    </div>
  );
};
