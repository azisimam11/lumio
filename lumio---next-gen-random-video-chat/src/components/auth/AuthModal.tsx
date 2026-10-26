import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (isRegisterMode && !displayName.trim()) {
      setErrorMsg('Please enter your display name.');
      return;
    }

    if (isRegisterMode) {
      register(displayName, email);
    } else {
      login(email, password);
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      if (onSuccess) onSuccess();
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080B14]/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0D1220] border border-[#253148] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F4F7FF]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-[#A5B1C7] hover:text-[#F4F7FF] hover:bg-[#121A2A] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#121A2A] text-[#34D399] flex items-center justify-center border border-[#34D399]/40">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-bold text-[#F4F7FF]">
              {isRegisterMode ? 'Account Created!' : 'Welcome Back!'}
            </h3>
            <p className="text-xs text-[#A5B1C7]">
              Logged in successfully to Lumio Live.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-[#121A2A] text-[#1769FF] flex items-center justify-center border border-[#1769FF]/40">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-[#F4F7FF] font-mono">
                {isRegisterMode ? 'Join Lumio Social' : 'Sign in to Lumio'}
              </h3>
              <p className="text-xs text-[#A5B1C7]">
                {isRegisterMode
                  ? 'Create an account to save friends, customize your profile & DM peers.'
                  : 'Welcome back! Enter your credentials to access your saved connections.'}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-[#121A2A] border border-[#FB7185]/50 text-xs text-[#FB7185]">
                {errorMsg}
              </div>
            )}

            <div className="space-y-3 text-xs">
              {isRegisterMode && (
                <div>
                  <label className="text-[#A5B1C7] font-medium mb-1 block">Display Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#748198] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Maya Lin"
                      className="w-full bg-[#121A2A] border border-[#253148] rounded-xl pl-9 pr-3 py-2.5 text-[#F4F7FF] placeholder-[#748198] focus:outline-none focus:border-[#1769FF]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[#A5B1C7] font-medium mb-1 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#748198] absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#121A2A] border border-[#253148] rounded-xl pl-9 pr-3 py-2.5 text-[#F4F7FF] placeholder-[#748198] focus:outline-none focus:border-[#1769FF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#A5B1C7] font-medium mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#748198] absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#121A2A] border border-[#253148] rounded-xl pl-9 pr-3 py-2.5 text-[#F4F7FF] placeholder-[#748198] focus:outline-none focus:border-[#1769FF]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] text-white text-xs font-bold tracking-wide shadow-lg shadow-[#1769FF]/30 transition-all cursor-pointer"
            >
              {isRegisterMode ? 'Create Free Account' : 'Sign In'}
            </button>

            <div className="pt-2 text-center text-xs text-[#748198]">
              {isRegisterMode ? 'Already have an account?' : "Don't have an account yet?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setErrorMsg('');
                }}
                className="text-[#25D9F8] hover:underline font-semibold cursor-pointer"
              >
                {isRegisterMode ? 'Sign In here' : 'Sign Up free'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
