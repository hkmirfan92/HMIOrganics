import React, { useState } from 'react';
import { PageId } from '../types';
import { BrandLogo } from '../components/BrandLogo';
import { api } from '../services/api';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle, KeyRound } from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onNavigate: (page: PageId) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onNavigate,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage('Please enter both username/email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await api.login(username.trim(), password);
      if (res.success) {
        onLoginSuccess();
      } else {
        setErrorMessage(res.message || 'Invalid credentials. Access denied.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        
        {/* Top Brand Identity */}
        <div className="text-center space-y-3">
          <div className="inline-block p-4 bg-white rounded-3xl border border-[#D5E1D7] shadow-sm">
            <BrandLogo size="lg" showText={false} />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2C5E43] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2C5E43]" />
              <span>Owner Access Control</span>
            </span>
            <h1 className="font-display text-2xl font-extrabold text-[#112F1C] mt-1">
              Store Admin Portal Login
            </h1>
            <p className="text-xs text-[#52705D] mt-1">
              Authorized personnel only. Enter your administrator credentials to access catalog and pricing management.
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 rounded-3xl border border-[#DFE7E1] shadow-xl space-y-6">
          
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Username / Email */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#2C5E43]" />
                <span>Admin Email or Username</span>
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                placeholder="Enter admin email or username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-xs px-3.5 py-3 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#2C5E43]" />
                  <span>Admin Password</span>
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-3.5 pr-10 py-3 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-[#1B4D2E] hover:bg-[#153D24] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isLoading ? 'Verifying Credentials...' : 'Authenticate & Sign In'}</span>
              </button>
            </div>

          </form>

          {/* Privacy & Security Notice */}
          <div className="pt-3 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2C5E43]" />
              <span>256-bit encrypted session. Brute-force protected.</span>
            </p>
          </div>

        </div>

        {/* Back to website button */}
        <div className="text-center">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#3B5B46] hover:text-[#163824] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Website</span>
          </button>
        </div>

      </div>
    </div>
  );
};
