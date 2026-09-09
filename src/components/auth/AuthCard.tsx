import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Logo } from '../layout/Logo';
import { Eye, EyeOff, Lock, Mail, User as UserIcon, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AuthCardProps {
  initialMode?: 'login' | 'register' | 'forgot-password';
  onSuccess?: () => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({ initialMode = 'login', onSuccess }) => {
  const { login, register, loginWithGoogle, sendPasswordReset, setCurrentPage, addToast } = useTrading();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password'>(initialMode);
  
  // Form fields
  const [email, setEmail] = useState('Berginjoshua1@gmail.com');
  const [password, setPassword] = useState('Thatguy12@');
  const [name, setName] = useState('Joshua James Bergin');
  const [confirmPassword, setConfirmPassword] = useState('Thatguy12@');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password.trim()) {
          addToast({
            type: 'error',
            title: 'Validation Error',
            message: 'Please provide both email address and password.',
          });
          setIsLoading(false);
          return;
        }
        const success = await login(email, password);
        if (success) {
          onSuccess?.();
        }
      } else if (mode === 'register') {
        if (!name.trim() || !email.trim() || !password.trim()) {
          addToast({
            type: 'error',
            title: 'Validation Error',
            message: 'Please fill in all required registration fields.',
          });
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          addToast({
            type: 'error',
            title: 'Password Mismatch',
            message: 'The confirmed password does not match.',
          });
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          addToast({
            type: 'error',
            title: 'Password Too Short',
            message: 'Firebase Authentication requires passwords to be at least 6 characters.',
          });
          setIsLoading(false);
          return;
        }
        if (!agreeTerms) {
          addToast({
            type: 'warning',
            title: 'Terms Required',
            message: 'You must accept the terms of service and risk disclosure.',
          });
          setIsLoading(false);
          return;
        }
        const success = await register(name, email, password);
        if (success) {
          onSuccess?.();
        }
      } else if (mode === 'forgot-password') {
        if (!email.trim() || !email.includes('@')) {
          addToast({
            type: 'error',
            title: 'Invalid Email',
            message: 'Please provide a valid registered email address.',
          });
          setIsLoading(false);
          return;
        }
        const res = await sendPasswordReset(email);
        if (res.success) {
          setForgotSent(true);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    if (mode === 'login') {
      setEmail('Berginjoshua1@gmail.com');
      setPassword('Thatguy12@');
    } else if (mode === 'register') {
      setName('Joshua James Bergin');
      setEmail('Berginjoshua1@gmail.com');
      setPassword('Thatguy12@');
      setConfirmPassword('Thatguy12@');
    } else {
      setEmail('Berginjoshua1@gmail.com');
    }
    addToast({
      type: 'info',
      title: 'Credentials Loaded',
      message: 'Account credentials populated for Berginjoshua1@gmail.com.',
      duration: 2000,
    });
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        onSuccess?.();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#060a12] overflow-hidden">
      {/* Background Cyber Glow & Financial Grid Elements */}
      <div className="absolute inset-0 bg-trading-grid opacity-30 pointer-events-none" />
      
      {/* Radial soft emerald glow */}
      <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[550px] h-[550px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Abstract digital trading lines */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path d="M0,150 Q300,50 600,200 T1200,100 T1800,220" fill="none" stroke="url(#grid-grad)" strokeWidth="1.5" />
        <path d="M0,350 Q450,450 900,250 T1800,380" fill="none" stroke="url(#grid-grad)" strokeWidth="1" />
        <path d="M100,0 L100,1000 M500,0 L500,1000 M900,0 L900,1000 M1300,0 L1300,1000" stroke="#10b981" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.15" />
      </svg>

      {/* Main Authentication Card */}
      <div className="relative w-full max-w-[440px] z-10">
        <div 
          className="glass-panel rounded-2xl p-7 sm:p-9 shadow-2xl border border-slate-700/60 relative overflow-hidden"
          style={{
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(16, 185, 129, 0.08)'
          }}
        >
          {/* Top subtle highlight */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80" />

          {/* Logo / Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <Logo size="lg" showTagline={true} className="mb-4" />
            
            {mode === 'login' && (
              <>
                <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Sign in to your Bit Trade Net account
                </p>
              </>
            )}

            {mode === 'register' && (
              <>
                <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                  Create Account
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Join the next generation of institutional crypto trading
                </p>
              </>
            )}

            {mode === 'forgot-password' && (
              <>
                <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                  Reset Password
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Enter your verified email to receive recovery instructions
                </p>
              </>
            )}
          </div>

          {/* Quick Demo Fill Helper Pill */}
          <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-500/20 rounded-lg px-3 py-1.5 mb-5 text-xs text-emerald-300">
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Simulation Demo Sandbox</span>
            </div>
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors cursor-pointer"
            >
              Fill Demo Data
            </button>
          </div>

          {/* Form */}
          {forgotSent && mode === 'forgot-password' ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-slate-100">
                Check Your Inbox
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We've sent a secure one-time password recovery link to <strong className="text-slate-200">{email}</strong>. Please check your spam folder if it doesn't arrive within 2 minutes.
              </p>
              <button
                type="button"
                onClick={() => {
                  setForgotSent(false);
                  setMode('login');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors mt-2"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Vance"
                      required
                      className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all placeholder:text-slate-500"
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Password Input (for login & register) */}
              {mode !== 'forgot-password' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot-password')}
                        className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="glass-input w-full pl-10 pr-10 py-2.5 rounded-xl text-sm transition-all placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password (register mode) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="glass-input w-full pl-10 pr-10 py-2.5 rounded-xl text-sm transition-all placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Checkboxes */}
              {mode === 'login' && (
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800/80 text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0 cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-300 cursor-pointer select-none">
                    Remember me on this device
                  </label>
                </div>
              )}

              {mode === 'register' && (
                <div className="flex items-start">
                  <input
                    id="terms-agree"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-slate-800/80 text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0 cursor-pointer"
                  />
                  <label htmlFor="terms-agree" className="ml-2 block text-xs text-slate-400 leading-tight select-none">
                    I acknowledge that Bit Trade Net is a simulated demonstration interface and agree to the Terms of Service and Privacy Policy.
                  </label>
                </div>
              )}

              {/* Primary Submit Button */}
              <button
                type="submit"
                id="btn-auth-submit"
                disabled={isLoading}
                className="w-full relative group overflow-hidden py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {mode === 'login' && 'Sign In'}
                      {mode === 'register' && 'Create Free Account'}
                      {mode === 'forgot-password' && 'Send Recovery Instructions'}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* OR Divider (for login & register) */}
          {mode !== 'forgot-password' && !forgotSent && (
            <>
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0b1220] px-3 text-slate-500 font-semibold tracking-wider">
                    OR
                  </span>
                </div>
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/70 hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.99] cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.2C.6 9.2 0 11.5 0 14s.6 4.8 1.6 6.8l3.7-2.9c-.3-.8-.5-1.7-.5-3.2z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5.1L1.6 16.1C3.5 19.9 7.4 23 12 23z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </>
          )}

          {/* Mode Switch Prompts */}
          <div className="mt-6 text-center text-xs text-slate-400">
            {mode === 'login' && (
              <p>
                Don’t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Create Account
                </button>
              </p>
            )}

            {mode === 'register' && (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Sign In to Account
                </button>
              </p>
            )}

            {mode === 'forgot-password' && !forgotSent && (
              <p>
                Remembered your password?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-5 text-center">
          <p className="text-[11px] text-slate-500 font-medium">
            Bit Trade Net Institutional Sandbox &bull; AES-256 Encrypted Protocol
          </p>
        </div>
      </div>
    </div>
  );
};
