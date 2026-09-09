import React, { useState } from 'react';
import { TradingProvider, useTrading } from './context/TradingContext';
import { Navbar } from './components/layout/Navbar';
import { TickerRibbon } from './components/layout/TickerRibbon';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { AuthCard } from './components/auth/AuthCard';
import { DashboardView } from './components/dashboard/DashboardView';
import { MarketView } from './components/markets/MarketView';
import { TradeView } from './components/trade/TradeView';
import { WalletView } from './components/wallet/WalletView';
import { TransactionsView } from './components/transactions/TransactionsView';
import { SecurityView } from './components/security/SecurityView';
import { DepositModal } from './components/wallet/DepositModal';
import { ToastContainer } from './components/ui/Toast';

const MainAppContent: React.FC = () => {
  const { user, currentPage, setCurrentPage, toasts, removeToast, theme } = useTrading();
  const [depositModalOpen, setDepositModalOpen] = useState(false);

  // If user is not authenticated or explicitly on auth views, show AuthCard
  const isAuthPage = ['login', 'register', 'forgot-password'].includes(currentPage);
  if (!user || isAuthPage) {
    const authMode = currentPage === 'register' 
      ? 'register' 
      : currentPage === 'forgot-password' 
      ? 'forgot-password' 
      : 'login';

    return (
      <div className={`min-h-screen ${theme === 'true-black' ? 'bg-black' : 'bg-[#060a12]'} text-slate-100 flex flex-col justify-between trading-pattern`}>
        <div className="py-3 sm:py-6 px-3 sm:px-6 flex justify-between items-center max-w-7xl mx-auto w-full safe-area-pt">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-black text-slate-950 text-base shadow-lg shadow-emerald-500/20">
              B
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white font-sans">
              BIT<span className="text-emerald-400">TRADE</span>.NET
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-300 hidden sm:inline">System Operational</span>
            <span className="font-semibold text-slate-300 sm:hidden">Online</span>
          </div>
        </div>

        <main className="flex-1 flex items-center justify-center p-2.5 sm:p-4 w-full">
          <AuthCard 
            initialMode={authMode} 
            onSuccess={() => setCurrentPage('dashboard')} 
          />
        </main>

        <footer className="py-4 sm:py-6 text-center text-xs text-slate-400 border-t border-slate-900 safe-area-pb px-3">
          &copy; {new Date().getFullYear()} Bit Trade Net. Trade Smarter. Move Faster. Institutional simulation environment.
        </footer>
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'true-black' ? 'bg-black' : 'bg-[#060a12]'} text-slate-100 flex flex-col justify-between trading-pattern selection:bg-emerald-500 selection:text-slate-950 overflow-x-hidden w-full transition-colors duration-200`}>
      {/* Top Navigation */}
      <header className="sticky top-0 z-30">
        <Navbar onOpenDeposit={() => setDepositModalOpen(true)} />
        <TickerRibbon />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 pt-3 sm:pt-6 pb-24 md:pb-12 overflow-x-hidden">
        {currentPage === 'dashboard' && <DashboardView />}
        {currentPage === 'markets' && <MarketView />}
        {currentPage === 'trade' && <TradeView />}
        {currentPage === 'wallet' && <WalletView />}
        {currentPage === 'transactions' && <TransactionsView />}
        {currentPage === 'settings' && <SecurityView />}
      </main>

      {/* Quick Deposit Modal from Navbar */}
      <DepositModal 
        isOpen={depositModalOpen} 
        onClose={() => setDepositModalOpen(false)} 
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />

      {/* Footer */}
      <Footer />

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default function App() {
  return (
    <TradingProvider>
      <MainAppContent />
    </TradingProvider>
  );
}
