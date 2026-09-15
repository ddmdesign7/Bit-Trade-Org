import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Modal } from '../ui/Modal';
import { 
  Shield, 
  KeyRound, 
  Smartphone, 
  Laptop, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  LogOut, 
  Bell, 
  Check, 
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  MailCheck,
  Moon,
  Sparkles,
  Palette
} from 'lucide-react';

export const SecurityView: React.FC = () => {
  const { 
    user, 
    sessions, 
    activityLogs, 
    terminateSession, 
    updateUser, 
    updateUserPassword,
    addToast,
    theme,
    setTheme
  } = useTrading();

  // 2FA Setup Modal State
  const [twoFAModalOpen, setTwoFAModalOpen] = useState(false);
  const [totpInput, setTotpInput] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  // Password Form State
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const totpSecret = 'JBSWY3DPEHPK3PXP';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(totpSecret);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    addToast({
      type: 'info',
      title: 'Secret Key Copied',
      message: 'Authenticator secret copied to clipboard.',
    });
  };

  const handleToggle2FA = () => {
    if (user?.twoFactorEnabled) {
      updateUser({ twoFactorEnabled: false });
      addToast({
        type: 'warning',
        title: '2FA Disabled',
        message: 'Two-factor authentication has been disabled for this account.',
      });
    } else {
      setTwoFAModalOpen(true);
    }
  };

  const handleVerify2FASetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (totpInput.length < 6) {
      addToast({
        type: 'error',
        title: 'Invalid Code',
        message: 'Please enter a valid 6-digit authenticator passcode.',
      });
      return;
    }
    updateUser({ twoFactorEnabled: true });
    setTwoFAModalOpen(false);
    setTotpInput('');
    addToast({
      type: 'success',
      title: '2FA Enabled',
      message: 'Google Authenticator / TOTP protection is now active.',
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currPassword || !newPassword || !confirmPassword) {
      addToast({
        type: 'error',
        title: 'Missing Fields',
        message: 'Please fill in all password fields.',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast({
        type: 'error',
        title: 'Passwords Mismatch',
        message: 'New password and confirmation do not match.',
      });
      return;
    }
    if (newPassword.length < 6) {
      addToast({
        type: 'error',
        title: 'Weak Password',
        message: 'Firebase passwords must contain at least 6 characters.',
      });
      return;
    }

    setPassLoading(true);
    try {
      const res = await updateUserPassword(newPassword);
      if (res.success) {
        setCurrPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/60 shadow-lg relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
              Settings & Security
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-extrabold text-emerald-400">
              HARDENED VAULT
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Configure display theme preferences, multi-factor authentication, active device sessions, and security policies.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 self-start sm:self-auto text-xs">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300 font-semibold">Security Score: <strong className="text-emerald-400">96/100</strong></span>
        </div>
      </div>

      {/* Display & Theme Appearance Card (OLED Optimization Toggle) */}
      <div id="settings-theme-card" className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/60 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              theme === 'true-black'
                ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-400'
                : 'bg-sky-500/15 border border-sky-500/30 text-sky-400'
            }`}>
              {theme === 'true-black' ? <Sparkles className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-slate-100">
                  Display Theme & Appearance
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${
                  theme === 'true-black'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {theme === 'true-black' ? 'OLED True Black' : 'Dim Default'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Switch between the default midnight Dim theme and True Black engineered for zero pixel emission on OLED displays.
              </p>
            </div>
          </div>

          {/* Quick Pill Segmented Switch */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              id="btn-theme-dim"
              onClick={() => setTheme('dim')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                theme === 'dim'
                  ? 'bg-slate-800 text-slate-100 shadow border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-sky-400" />
              <span>Dim</span>
            </button>
            <button
              type="button"
              id="btn-theme-true-black"
              onClick={() => setTheme('true-black')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                theme === 'true-black'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>True Black</span>
            </button>
          </div>
        </div>

        {/* Visual Interactive Theme Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
          {/* Option 1: Dim Theme (Default) */}
          <div
            id="card-theme-dim"
            onClick={() => setTheme('dim')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden ${
              theme === 'dim'
                ? 'border-emerald-500/80 bg-slate-900/70 shadow-lg shadow-emerald-500/10'
                : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-100">Dim</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    Default
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Deep midnight blue/slate palette (<span className="font-mono text-slate-300">#060a12</span>) with subtle dark card layering and atmospheric depth.
                </p>
              </div>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                theme === 'dim'
                  ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                  : 'border-slate-700 bg-slate-800/60'
              }`}>
                {theme === 'dim' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            {/* Visual Swatch Preview */}
            <div className="mt-3 p-2 rounded-lg bg-[#060a12] border border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#060a12] border border-slate-600 shadow-inner" />
                <span className="text-slate-300">Canvas #060a12</span>
              </div>
              <span className="text-sky-400">Midnight Slate</span>
            </div>
          </div>

          {/* Option 2: True Black Theme (OLED) */}
          <div
            id="card-theme-true-black"
            onClick={() => setTheme('true-black')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden ${
              theme === 'true-black'
                ? 'border-emerald-500/80 bg-black shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-500/40'
                : 'border-slate-800 bg-black/60 hover:border-slate-700 hover:bg-black/90'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-100">True Black</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    OLED Ready
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pure pitch black (<span className="font-mono text-slate-300">#000000</span>) surfaces. Turns individual OLED pixels completely off for maximum contrast and battery conservation.
                </p>
              </div>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                theme === 'true-black'
                  ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                  : 'border-slate-700 bg-slate-800/60'
              }`}>
                {theme === 'true-black' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            {/* Visual Swatch Preview */}
            <div className="mt-3 p-2 rounded-lg bg-black border border-neutral-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-black border border-neutral-600 shadow-inner" />
                <span className="text-emerald-400 font-bold">Canvas #000000</span>
              </div>
              <span className="text-emerald-400 font-semibold">Zero Pixel Emission</span>
            </div>
          </div>
        </div>

        {/* OLED Technical Callout Banner */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
          <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-200">OLED Display Advantage:</strong> On OLED and AMOLED screens, pixels displaying <code className="text-emerald-400 font-mono">#000000</code> emit zero photons and consume zero display current, providing infinite black levels and extending mobile battery longevity.
          </span>
        </div>
      </div>

      {/* Grid: 2FA Card + Password Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Card 1: Two-Factor Authentication */}
        <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/60 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-100">
                    Two-Factor Authentication (2FA)
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400">
                    TOTP Authenticator app (Google Authenticator, Authy)
                  </p>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0 ${
                user?.twoFactorEnabled
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}>
                {user?.twoFactorEnabled ? 'Active' : 'Disabled'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mt-4">
              Protect your trades, withdrawals, and session authentications with high-security time-based one-time passwords (TOTP).
            </p>
          </div>

          <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              Required for all withdrawal transactions
            </span>
            <button
              type="button"
              id="btn-toggle-2fa"
              onClick={handleToggle2FA}
              className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer text-center ${
                user?.twoFactorEnabled
                  ? 'bg-slate-800 hover:bg-rose-950/40 text-rose-400 border border-slate-700'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              {user?.twoFactorEnabled ? 'Disable 2FA' : 'Configure 2FA'}
            </button>
          </div>
        </div>

        {/* Card 2: Password Management */}
        <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/60 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-100">
                Password Management
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Update account master access credentials
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-3 mt-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Current Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={currPassword}
                onChange={(e) => setCurrPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="glass-input w-full px-3.5 py-2 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  required
                  className="glass-input w-full px-3.5 py-2 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  className="glass-input w-full px-3.5 py-2 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'Hide' : 'Show'} passwords</span>
              </button>

              <button
                type="submit"
                disabled={passLoading}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {passLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Account Verification & Notifications Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Verification Status */}
        <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/60 shadow-xl space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <MailCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-bold text-slate-100">
              Identity & Verification Status
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div>
                <span className="font-bold text-slate-200">Email Verification</span>
                <p className="text-[11px] text-slate-400">{user?.email}</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div>
                <span className="font-bold text-slate-200">KYC Verification Tier</span>
                <p className="text-[11px] text-slate-400">Daily withdrawal limit: $500,000 USD</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                <CheckCircle2 className="w-3 h-3" />
                <span>{user?.kycTier || 'Tier 2'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Security Notifications Preferences */}
        <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-700/60 shadow-xl space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm sm:text-base font-bold text-slate-100">
              Security Notification Preferences
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div>
                <span className="font-bold text-slate-200">New Login Alerts</span>
                <p className="text-[11px] text-slate-400">Notify immediately when signing in from an unknown device</p>
              </div>
              <input
                type="checkbox"
                checked={user?.loginAlertsEnabled}
                onChange={(e) => updateUser({ loginAlertsEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div>
                <span className="font-bold text-slate-200">Withdrawal Confirmations</span>
                <p className="text-[11px] text-slate-400">Dispatch cryptographic email codes on large ledger transfers</p>
              </div>
              <input
                type="checkbox"
                checked={user?.securityAlertsEnabled}
                onChange={(e) => updateUser({ securityAlertsEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="glass-panel rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100">
              Active Authorized Sessions
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Devices currently holding authenticated tokens for your account
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-800/60 text-xs">
          {sessions.map((ses) => (
            <div key={ses.id} className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                  {ses.device.includes('iPhone') ? <Smartphone className="w-4 h-4 text-emerald-400" /> : <Laptop className="w-4 h-4 text-sky-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{ses.device}</span>
                    {ses.isCurrent && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        Current Session
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {ses.browser} &bull; <span className="font-mono">{ses.ip}</span> ({ses.location})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="text-[11px] text-slate-400 font-mono">
                  {ses.lastActive}
                </span>
                {!ses.isCurrent && (
                  <button
                    type="button"
                    onClick={() => terminateSession(ses.id)}
                    className="px-3 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 text-[11px] font-semibold border border-rose-500/30 transition-colors cursor-pointer"
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Login Activity Audit Log */}
      <div className="glass-panel rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800">
          <h3 className="text-sm sm:text-base font-bold text-slate-100">
            Security & Login Activity Audit Log
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic timestamped log of authorization events
          </p>
        </div>

        {/* Mobile Native Card View (<sm) */}
        <div className="sm:hidden divide-y divide-slate-800/60">
          {activityLogs.map((log) => (
            <div key={log.id} className="p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-200">
                  {log.action}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  log.status === 'SUCCESS'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {log.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{log.device}</span>
                <span className="font-mono text-slate-300">{log.ip}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{log.location}</span>
                <span>{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View (sm+) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900/40">
                <th className="py-3 px-4">Event / Action</th>
                <th className="py-3 px-4">Device & Client</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {activityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-200">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {log.device}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {log.ip}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {log.location}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.status === 'SUCCESS'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2FA Configuration Modal */}
      <Modal
        isOpen={twoFAModalOpen}
        onClose={() => setTwoFAModalOpen(false)}
        title="Set Up Authenticator App"
        subtitle="Pair Google Authenticator or 1Password with Bit Trade Net"
        maxWidth="sm"
      >
        <form onSubmit={handleVerify2FASetup} className="space-y-4 text-center">
          {/* QR Code */}
          <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <rect width="100" height="100" fill="#ffffff" />
              <rect x="10" y="10" width="25" height="25" fill="#060a12" />
              <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
              <rect x="65" y="10" width="25" height="25" fill="#060a12" />
              <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
              <rect x="10" y="65" width="25" height="25" fill="#060a12" />
              <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
              <circle cx="50" cy="50" r="10" fill="#10B981" />
            </svg>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 flex items-center justify-between">
            <span>{totpSecret}</span>
            <button
              type="button"
              onClick={handleCopyKey}
              className="p-1 text-slate-300 hover:text-slate-100 cursor-pointer"
            >
              {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 text-left">
              Enter 6-Digit TOTP Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={totpInput}
              onChange={(e) => setTotpInput(e.target.value)}
              placeholder="123456"
              required
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-center text-lg font-mono tracking-widest font-bold"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            Verify & Activate 2FA
          </button>
        </form>
      </Modal>
    </div>
  );
};
