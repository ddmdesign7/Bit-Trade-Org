export type NavPage = 
  | 'login' 
  | 'register' 
  | 'forgot-password' 
  | 'dashboard' 
  | 'markets' 
  | 'trade' 
  | 'wallet' 
  | 'transactions' 
  | 'settings';

export type AppTheme = 'dim' | 'true-black';

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
  circulatingSupply: string;
  sparkline7d: number[];
  category: 'layer1' | 'defi' | 'infrastructure' | 'stablecoin';
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  kycTier: 'Tier 1' | 'Tier 2 Verified' | 'Institutional';
  twoFactorEnabled: boolean;
  securityAlertsEnabled: boolean;
  loginAlertsEnabled: boolean;
  avatarUrl?: string;
  joinedDate: string;
}

export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAW' | 'INVESTMENT' | 'REINVESTMENT';
  assetSymbol: string;
  assetName: string;
  amount: number;
  price: number;
  total: number;
  fee: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  timestamp: string;
  txHash: string;
  network?: string;
  destinationAddress?: string;
  note?: string;
}

export interface Order {
  id: string;
  type: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT';
  symbol: string;
  price: number;
  amount: number;
  total: number;
  filled: number;
  status: 'OPEN' | 'FILLED' | 'CANCELLED';
  timestamp: string;
}

export interface WalletAsset {
  symbol: string;
  name: string;
  balance: number;
  available: number;
  locked: number;
  valueUSD: number;
  depositAddress: string;
  networks: string[];
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  isCurrent: boolean;
  lastActive: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  ip: string;
  location: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  device: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}
