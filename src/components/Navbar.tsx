import React, { useState } from 'react';
import {
  Video,
  Users,
  ShieldCheck,
  Compass,
  Sparkles,
  Menu,
  X,
  MessageSquare,
  User as UserIcon,
  Settings,
} from 'lucide-react';
import { AppView } from '../types';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onlineCount?: number;
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onlineCount = 4280,
  onOpenAuthModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const navItems = [
    { id: 'landing' as AppView, label: 'Explore', icon: Compass },
    { id: 'video-chat' as AppView, label: 'Random Video', icon: Video, highlight: true },
    { id: 'friends' as AppView, label: 'Friends & DMs', icon: MessageSquare },
    { id: 'community' as AppView, label: 'Lounges', icon: Users },
    { id: 'safety' as AppView, label: 'Safety', icon: ShieldCheck },
  ];

  const handleNavClick = (view: AppView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#253148] bg-[#080B14]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1769FF] to-[#25D9F8] flex items-center justify-center shadow-lg shadow-[#1769FF]/25 group-hover:shadow-[#1769FF]/45 transition-all duration-300">
              <Video className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-[#F4F7FF] font-mono">
                  LUMIO
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D9F8] animate-pulse" />
              </div>
              <p className="text-[10px] text-[#A5B1C7] tracking-wider uppercase font-medium">
                Midnight Neon Social
              </p>
            </div>
          </button>

          {/* Online stats with Mint Green indicator */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-[#A5B1C7] pl-4 border-l border-[#253148]">
            <span className="flex items-center gap-1.5 text-[#34D399] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
              {onlineCount.toLocaleString()} peers active
            </span>
            <span aria-hidden="true" className="text-[#253148]">·</span>
            <span className="text-[#748198]">Stage 5 Social Accounts</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#F4F7FF] bg-[#121A2A] border border-[#1769FF]/60 shadow-sm shadow-[#1769FF]/10'
                    : 'text-[#A5B1C7] hover:text-[#F4F7FF] hover:bg-[#0D1220]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-[#25D9F8]' : 'text-[#748198]'
                  }`}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Button & User Profile Pill */}
        <div className="hidden sm:flex items-center gap-3">
          {currentView !== 'video-chat' && (
            <button
              onClick={() => handleNavClick('video-chat')}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] text-white text-sm font-semibold tracking-wide shadow-lg shadow-[#1769FF]/30 hover:shadow-[#1769FF]/50 transition-all duration-200 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-white stroke-[2.2]" />
              Start Video Chat
            </button>
          )}

          {/* User Profile Pill button */}
          <button
            onClick={() => handleNavClick('profile')}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
              currentView === 'profile'
                ? 'bg-[#192438] border-[#1769FF] text-[#F4F7FF]'
                : 'bg-[#121A2A] border-[#253148] text-[#A5B1C7] hover:border-[#1769FF]/50 hover:text-[#F4F7FF]'
            }`}
            title="Profile & Settings"
          >
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="w-6 h-6 rounded-full object-cover border border-[#1769FF]/60"
            />
            <span className="font-medium text-xs text-[#F4F7FF] max-w-[100px] truncate">
              {user.displayName}
            </span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-[#A5B1C7] hover:text-[#F4F7FF] hover:bg-[#121A2A] focus:outline-none cursor-pointer"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#253148] bg-[#0D1220] px-4 pt-2 pb-4 space-y-1">
          <div className="py-2 px-3 mb-2 text-xs text-[#34D399] bg-[#121A2A] rounded-lg border border-[#253148] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
              Social Discovery Live
            </span>
            <span>{onlineCount.toLocaleString()} online</span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#F4F7FF] bg-[#121A2A] border border-[#1769FF]/50'
                    : 'text-[#A5B1C7] hover:text-[#F4F7FF] hover:bg-[#121A2A]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#748198]" />
                {item.label}
              </button>
            );
          })}

          <button
            onClick={() => handleNavClick('profile')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#A5B1C7] hover:text-[#F4F7FF] hover:bg-[#121A2A] cursor-pointer"
          >
            <Settings className="w-4 h-4 text-[#748198]" />
            Profile & Settings
          </button>

          <div className="pt-2">
            <button
              onClick={() => handleNavClick('video-chat')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] text-white font-semibold text-sm shadow-md shadow-[#1769FF]/30 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Start Video Chat
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
