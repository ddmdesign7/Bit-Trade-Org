import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  CryptoAsset, 
  User, 
  Transaction, 
  Order, 
  ActiveSession, 
  ActivityLog, 
  NavPage, 
  ToastMessage,
  AppTheme 
} from '../types';
import { 
  INITIAL_USER, 
  INITIAL_CRYPTO_ASSETS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_ORDERS, 
  INITIAL_SESSIONS, 
  INITIAL_LOGS 
} from '../data/mockData';

interface TradingContextType {
  user: User | null;
  currentPage: NavPage;
  setCurrentPage: (page: NavPage) => void;
  assets: CryptoAsset[];
  selectedAsset: CryptoAsset;
  setSelectedAsset: (asset: CryptoAsset) => void;
  holdings: Record<string, number>;
  cashBalanceUSD: number;
  watchlist: string[];
  toggleWatchlist: (symbol: string) => void;
  orders: Order[];
  transactions: Transaction[];
  sessions: ActiveSession[];
  activityLogs: ActivityLog[];
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  executeTrade: (params: {
    type: 'BUY' | 'SELL';
    orderType: 'MARKET' | 'LIMIT';
    symbol: string;
    amount: number;
    price: number;
  }) => Promise<{ success: boolean; message: string }>;
  cancelOrder: (orderId: string) => void;
  executeDeposit: (symbol: string, amount: number, network: string) => Promise<boolean>;
  executeWithdraw: (symbol: string, amount: number, address: string, network: string) => Promise<boolean>;
  investmentNoticeOpen: boolean;
  setInvestmentNoticeOpen: (open: boolean) => void;
  attemptedWithdrawalAmount: number;
  attemptedWithdrawalAddress: string;
  showInvestmentNotice: (amount?: number, address?: string) => void;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  terminateSession: (sessionId: string) => void;
  updateUser: (updates: Partial<User>) => void;
  totalPortfolioValue: number;
  todayPnL: { value: number; percent: number };
  recentPriceChanges: Record<string, 'up' | 'down'>;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(INITIAL_USER);
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');
  const [theme, setThemeState] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem('bittrade_theme');
      if (saved === 'true-black' || saved === 'dim') return saved;
    } catch {
      // ignore
    }
    return 'dim';
  });

  // Synchronize theme class on HTML document root for universal styling
  useEffect(() => {
    try {
      localStorage.setItem('bittrade_theme', theme);
    } catch {
      // ignore
    }

    const root = document.documentElement;
    if (theme === 'true-black') {
      root.classList.add('theme-true-black');
      root.classList.remove('theme-dim');
    } else {
      root.classList.add('theme-dim');
      root.classList.remove('theme-true-black');
    }
  }, [theme]);
  const [assets, setAssets] = useState<CryptoAsset[]>(INITIAL_CRYPTO_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset>(INITIAL_CRYPTO_ASSETS[0]);
  const [recentPriceChanges, setRecentPriceChanges] = useState<Record<string, 'up' | 'down'>>({});
  
  // Holdings
  const [holdings, setHoldings] = useState<Record<string, number>>({
    BTC: 0.28,
    ETH: 3.4,
    SOL: 35.0,
    XRP: 1800.0,
    USDT: 12450.0,
    BNB: 2.5,
    AVAX: 40.0,
  });
  
  const [cashBalanceUSD, setCashBalanceUSD] = useState<number>(47986.00);
  const [investmentNoticeOpen, setInvestmentNoticeOpen] = useState<boolean>(false);
  const [attemptedWithdrawalAmount, setAttemptedWithdrawalAmount] = useState<number>(47986.00);
  const [attemptedWithdrawalAddress, setAttemptedWithdrawalAddress] = useState<string>('');

  const showInvestmentNotice = (amount?: number, address?: string) => {
    if (amount !== undefined) setAttemptedWithdrawalAmount(amount);
    if (address !== undefined) setAttemptedWithdrawalAddress(address);
    setInvestmentNoticeOpen(true);
    addToast({
      type: 'warning',
      title: 'Investment Rules Compliance Notice',
      message: '$5,960.00 has to be paid before the available balance can be withdrawn, to meet with the investment rules.',
      duration: 8000,
    });
  };
  const [watchlist, setWatchlist] = useState<string[]>(['BTC', 'ETH', 'SOL', 'XRP']);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [sessions, setSessions] = useState<ActiveSession[]>(INITIAL_SESSIONS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_LOGS);
  const [toasts, setToasts] = useState<ToastMessage[]>([
    {
      id: 'toast_welcome',
      type: 'info',
      title: 'Simulation Mode Active',
      message: 'Bit Trade Net is running in institutional sandbox demo mode.',
      duration: 5000,
    }
  ]);

  // Toast Helper
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));

    const duration = toast.duration || 4500;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Watchlist toggle
  const toggleWatchlist = (symbol: string) => {
    setWatchlist((prev) => {
      const isStarred = prev.includes(symbol);
      const next = isStarred ? prev.filter((s) => s !== symbol) : [...prev, symbol];
      addToast({
        type: 'info',
        title: isStarred ? 'Removed from Watchlist' : 'Added to Watchlist',
        message: `${symbol} ${isStarred ? 'removed from' : 'added to'} your monitored assets.`,
        duration: 2500,
      });
      return next;
    });
  };

  // Realistic micro price simulator: every 3.5 seconds, subtly update 1 or 2 assets
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prevAssets) => {
        const randomIndex = Math.floor(Math.random() * prevAssets.length);
        const asset = prevAssets[randomIndex];
        if (!asset || asset.symbol === 'USDT') return prevAssets;

        // ±0.04% to ±0.25% tick
        const pctChange = (Math.random() * 0.4 - 0.18) / 100;
        const newPrice = Math.max(0.0001, Number((asset.price * (1 + pctChange)).toFixed(asset.price > 10 ? 2 : 4)));
        const direction = newPrice >= asset.price ? 'up' : 'down';

        setRecentPriceChanges((prev) => ({ ...prev, [asset.symbol]: direction }));

        // Clear direction highlight after 1.2 seconds
        setTimeout(() => {
          setRecentPriceChanges((prev) => {
            const next = { ...prev };
            delete next[asset.symbol];
            return next;
          });
        }, 1200);

        const updatedAsset: CryptoAsset = {
          ...asset,
          price: newPrice,
          change24h: Number((asset.change24h + pctChange * 10).toFixed(2)),
          high24h: Math.max(asset.high24h, newPrice),
          low24h: Math.min(asset.low24h, newPrice),
        };

        const nextAssets = [...prevAssets];
        nextAssets[randomIndex] = updatedAsset;
        return nextAssets;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Update selectedAsset if its live price updates
  useEffect(() => {
    const current = assets.find((a) => a.symbol === selectedAsset.symbol);
    if (current && current.price !== selectedAsset.price) {
      setSelectedAsset(current);
    }
  }, [assets, selectedAsset.symbol]);

  // Compute total portfolio value
  const totalPortfolioValue = useMemo(() => {
    let cryptoValue = 0;
    Object.entries(holdings).forEach(([symbol, qty]) => {
      const quantity = Number(qty) || 0;
      const asset = assets.find((a) => a.symbol === symbol);
      if (asset) {
        cryptoValue += quantity * asset.price;
      }
    });
    return Number((cashBalanceUSD + cryptoValue).toFixed(2));
  }, [assets, holdings, cashBalanceUSD]);

  // Today PnL calculation
  const todayPnL = useMemo(() => {
    // Weighted avg gain based on assets
    let gain = 0;
    Object.entries(holdings).forEach(([symbol, qty]) => {
      const quantity = Number(qty) || 0;
      const asset = assets.find((a) => a.symbol === symbol);
      if (asset) {
        const val = quantity * asset.price;
        gain += val * (asset.change24h / 100);
      }
    });
    const percent = totalPortfolioValue > 0 ? (gain / totalPortfolioValue) * 100 : 0;
    return {
      value: Number(gain.toFixed(2)),
      percent: Number(percent.toFixed(2)),
    };
  }, [assets, holdings, totalPortfolioValue]);

  // Execute Trade function
  const executeTrade = async (params: {
    type: 'BUY' | 'SELL';
    orderType: 'MARKET' | 'LIMIT';
    symbol: string;
    amount: number;
    price: number;
  }): Promise<{ success: boolean; message: string }> => {
    const { type, orderType, symbol, amount, price } = params;
    const total = amount * price;
    const fee = Number((total * 0.001).toFixed(2)); // 0.1% fee
    const grandTotal = type === 'BUY' ? total + fee : total - fee;

    if (amount <= 0 || price <= 0) {
      addToast({
        type: 'error',
        title: 'Invalid Order Parameters',
        message: 'Amount and price must be greater than zero.',
      });
      return { success: false, message: 'Invalid parameters' };
    }

    if (type === 'BUY') {
      if (cashBalanceUSD < grandTotal) {
        addToast({
          type: 'error',
          title: 'Insufficient Funds',
          message: `Required: $${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}. Available: $${cashBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        });
        return { success: false, message: 'Insufficient USD balance' };
      }

      // Deduct cash, add crypto
      setCashBalanceUSD((prev) => Number((prev - grandTotal).toFixed(2)));
      setHoldings((prev) => ({
        ...prev,
        [symbol]: Number(((prev[symbol] || 0) + amount).toFixed(6)),
      }));
    } else {
      // SELL
      const currentHolding = holdings[symbol] || 0;
      if (currentHolding < amount) {
        addToast({
          type: 'error',
          title: 'Insufficient Asset Balance',
          message: `You hold ${currentHolding} ${symbol}, but attempted to sell ${amount} ${symbol}.`,
        });
        return { success: false, message: 'Insufficient asset balance' };
      }

      // Deduct crypto, add cash
      setHoldings((prev) => ({
        ...prev,
        [symbol]: Number((prev[symbol] - amount).toFixed(6)),
      }));
      setCashBalanceUSD((prev) => Number((prev + grandTotal).toFixed(2)));
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type,
      assetSymbol: symbol,
      assetName: assets.find((a) => a.symbol === symbol)?.name || symbol,
      amount,
      price,
      total,
      fee,
      status: 'COMPLETED',
      timestamp,
      txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    };

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      type,
      orderType,
      symbol,
      price,
      amount,
      total,
      filled: amount,
      status: 'FILLED',
      timestamp,
    };

    setTransactions((prev) => [newTx, ...prev]);
    setOrders((prev) => [newOrder, ...prev]);

    addToast({
      type: 'success',
      title: `${type === 'BUY' ? 'Buy' : 'Sell'} Order Executed`,
      message: `Successfully executed ${amount} ${symbol} at $${price.toLocaleString()} ($${total.toLocaleString()})`,
    });

    return { success: true, message: 'Order filled successfully' };
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'CANCELLED' } : o))
    );
    addToast({
      type: 'info',
      title: 'Order Cancelled',
      message: `Order #${orderId} was cancelled.`,
    });
  };

  // Deposit simulation
  const executeDeposit = async (symbol: string, amount: number, network: string): Promise<boolean> => {
    if (amount <= 0) return false;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (symbol === 'USDT') {
      setCashBalanceUSD((prev) => Number((prev + amount).toFixed(2)));
    } else {
      setHoldings((prev) => ({
        ...prev,
        [symbol]: Number(((prev[symbol] || 0) + amount).toFixed(6)),
      }));
    }

    const asset = assets.find((a) => a.symbol === symbol);
    const price = asset?.price || 1;
    const newTx: Transaction = {
      id: `tx_dep_${Date.now()}`,
      type: 'DEPOSIT',
      assetSymbol: symbol,
      assetName: asset?.name || symbol,
      amount,
      price,
      total: amount * price,
      fee: 0,
      status: 'COMPLETED',
      timestamp,
      txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      network,
    };

    setTransactions((prev) => [newTx, ...prev]);
    addToast({
      type: 'success',
      title: 'Deposit Confirmed',
      message: `Credited ${amount} ${symbol} via ${network}. Transaction finalized on ledger.`,
    });
    return true;
  };

  // Withdraw simulation with investment rule verification
  const executeWithdraw = async (
    symbol: string,
    amount: number,
    address: string,
    network: string
  ): Promise<boolean> => {
    if (amount <= 0) {
      addToast({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Please enter a valid withdrawal amount.',
      });
      return false;
    }
    if (!address || !address.trim()) {
      addToast({
        type: 'error',
        title: 'Wallet Address Required',
        message: 'Please provide a valid destination wallet address.',
      });
      return false;
    }

    setAttemptedWithdrawalAmount(amount);
    setAttemptedWithdrawalAddress(address);

    // Simulate blockchain node authorization check
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Per user specification:
    // Regardless of amount try to withdraw, once withdraw is being processed
    // it pops out a notification that says that $5,960.00 has to be paid before the available balance can be withdrawn, to meet with the investment rules.
    setInvestmentNoticeOpen(true);
    addToast({
      type: 'warning',
      title: 'Investment Rules Compliance Notice',
      message: '$5,960.00 has to be paid before the available balance can be withdrawn, to meet with the investment rules.',
      duration: 8000,
    });

    return false;
  };

  // Authentication
  const login = async (email: string): Promise<boolean> => {
    setUser({
      ...INITIAL_USER,
      name: 'Joshua James Bergin',
      email: email && email.includes('@') ? email : 'Berginjoshua1@gmail.com',
      joinedDate: 'March 2019',
    });
    setCurrentPage('dashboard');
    addToast({
      type: 'success',
      title: 'Welcome Back, Joshua James Bergin',
      message: 'Signed in as Berginjoshua1@gmail.com. Session encrypted.',
    });
    return true;
  };

  const register = async (name: string, email: string): Promise<boolean> => {
    setUser({
      ...INITIAL_USER,
      id: `usr_${Date.now()}`,
      name: name || 'Demo Trader',
      email: email || 'trader@bittrade.net',
    });
    setCurrentPage('dashboard');
    addToast({
      type: 'success',
      title: 'Account Created Successfully',
      message: 'Welcome to Bit Trade Net! Your demo trading sandbox is ready.',
    });
    return true;
  };

  const logout = () => {
    setUser(null);
    setCurrentPage('login');
    addToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been securely signed out of Bit Trade Net.',
    });
  };

  const terminateSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    addToast({
      type: 'info',
      title: 'Session Revoked',
      message: 'The remote session was immediately terminated.',
    });
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your profile and security preferences were updated.',
    });
  };

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    addToast({
      type: 'info',
      title: 'Display Theme Updated',
      message: newTheme === 'true-black'
        ? 'True Black OLED mode enabled (pure #000000 blacks, high contrast).'
        : 'Dim theme enabled (default midnight blue & slate palette).',
      duration: 3500,
    });
  };

  return (
    <TradingContext.Provider
      value={{
        user,
        currentPage,
        setCurrentPage,
        theme,
        setTheme,
        assets,
        selectedAsset,
        setSelectedAsset,
        holdings,
        cashBalanceUSD,
        watchlist,
        toggleWatchlist,
        orders,
        transactions,
        sessions,
        activityLogs,
        toasts,
        addToast,
        removeToast,
        executeTrade,
        cancelOrder,
        executeDeposit,
        executeWithdraw,
        investmentNoticeOpen,
        setInvestmentNoticeOpen,
        attemptedWithdrawalAmount,
        attemptedWithdrawalAddress,
        showInvestmentNotice,
        login,
        register,
        logout,
        terminateSession,
        updateUser,
        totalPortfolioValue,
        todayPnL,
        recentPriceChanges,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};
