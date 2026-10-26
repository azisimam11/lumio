import React, { useState } from 'react';
import {
  User,
  Shield,
  Save,
  CheckCircle2,
  Globe,
  Heart,
  Ban,
  LogOut,
  Camera,
  Sparkles,
} from 'lucide-react';
import { AppView } from '../types';
import { useAuth } from '../hooks/useAuth';
import { MOCK_INTERESTS, MOCK_LANGUAGES } from '../data/mockData';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
];

interface ProfilePageProps {
  onNavigate: (view: AppView) => void;
  onOpenAuthModal: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate, onOpenAuthModal }) => {
  const { user, updateProfile, logout, isAuthenticated } = useAuth();

  const [displayName, setDisplayName] = useState(user.displayName);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [country, setCountry] = useState(user.country);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatarUrl);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user.interests);
  const [allowFriendRequests, setAllowFriendRequests] = useState(true);
  const [hideCountryFlag, setHideCountryFlag] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleInterest = (topic: string) => {
    setSelectedInterests((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName,
      username,
      bio,
      country,
      avatarUrl: selectedAvatar,
      interests: selectedInterests,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#080B14]">
      {/* Toast Alert */}
      {savedSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-[#121A2A] border border-[#34D399] text-[#34D399] text-xs font-medium shadow-xl flex items-center gap-2 backdrop-blur-md animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Header Profile Summary */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0D1220] border border-[#253148] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={selectedAvatar}
              alt={displayName}
              className="w-20 h-20 rounded-3xl object-cover border-2 border-[#1769FF]"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#34D399] border-2 border-[#0D1220]" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#F4F7FF] font-mono">{displayName}</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#121A2A] border border-[#1769FF]/60 text-[#25D9F8] font-mono">
                @{username}
              </span>
            </div>
            <p className="text-xs text-[#A5B1C7] leading-relaxed max-w-md">{bio}</p>
            <div className="flex items-center gap-2 text-xs text-[#748198] pt-1">
              <Globe className="w-3.5 h-3.5 text-[#25D9F8]" />
              <span>{country}</span>
              <span>·</span>
              <span>Member since {user.createdAt}</span>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col gap-2 shrink-0">
          {!isAuthenticated ? (
            <button
              onClick={onOpenAuthModal}
              className="px-4 py-2 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md shadow-[#1769FF]/30 cursor-pointer"
            >
              Sign In / Register
            </button>
          ) : (
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#121A2A] hover:bg-[#192438] border border-[#253148] text-[#FB7185] text-xs font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* Avatar Picker */}
        <div className="p-6 rounded-3xl bg-[#0D1220] border border-[#253148] space-y-4">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#25D9F8]" />
            <h3 className="text-sm font-bold text-[#F4F7FF]">Choose Avatar</h3>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {PRESET_AVATARS.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedAvatar(url)}
                className={`relative rounded-2xl overflow-hidden border-2 transition-transform cursor-pointer ${
                  selectedAvatar === url
                    ? 'border-[#1769FF] scale-105 shadow-md shadow-[#1769FF]/30'
                    : 'border-[#253148] hover:border-[#1769FF]/50'
                }`}
              >
                <img src={url} alt="Preset avatar" className="w-14 h-14 object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-6 rounded-3xl bg-[#0D1220] border border-[#253148] space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#1769FF]" />
            <h3 className="text-sm font-bold text-[#F4F7FF]">Identity & Bio</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[#A5B1C7] font-medium block mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#121A2A] border border-[#253148] rounded-xl px-3.5 py-2.5 text-[#F4F7FF] focus:outline-none focus:border-[#1769FF]"
              />
            </div>
            <div>
              <label className="text-[#A5B1C7] font-medium block mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#121A2A] border border-[#253148] rounded-xl px-3.5 py-2.5 text-[#F4F7FF] focus:outline-none focus:border-[#1769FF]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[#A5B1C7] font-medium block mb-1">Bio / Status</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full bg-[#121A2A] border border-[#253148] rounded-xl p-3 text-[#F4F7FF] focus:outline-none focus:border-[#1769FF] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Interests & Topics */}
        <div className="p-6 rounded-3xl bg-[#0D1220] border border-[#253148] space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#F472B6]" />
            <h3 className="text-sm font-bold text-[#F4F7FF]">My Favorite Topics & Interests</h3>
          </div>
          <p className="text-xs text-[#A5B1C7]">
            Select your passions to boost matching compatibility with like-minded peers:
          </p>
          <div className="flex flex-wrap gap-2">
            {MOCK_INTERESTS.filter((t) => t !== 'All Topics').map((topic) => {
              const isSelected = selectedInterests.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleInterest(topic)}
                  className={`text-xs px-3.5 py-1.5 rounded-xl border font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1769FF] text-white border-[#3B82F6] shadow-sm shadow-[#1769FF]/20'
                      : 'bg-[#121A2A] text-[#A5B1C7] border-[#253148] hover:text-[#F4F7FF] hover:bg-[#192438]'
                  }`}
                >
                  #{topic}
                </button>
              );
            })}
          </div>
        </div>

        {/* Privacy Preferences */}
        <div className="p-6 rounded-3xl bg-[#0D1220] border border-[#253148] space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#34D399]" />
            <h3 className="text-sm font-bold text-[#F4F7FF]">Privacy Controls</h3>
          </div>
          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#121A2A] border border-[#253148] cursor-pointer">
              <span className="text-[#F4F7FF]">Allow friend requests during video chats</span>
              <input
                type="checkbox"
                checked={allowFriendRequests}
                onChange={(e) => setAllowFriendRequests(e.target.checked)}
                className="rounded border-[#253148] text-[#1769FF]"
              />
            </label>
            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#121A2A] border border-[#253148] cursor-pointer">
              <span className="text-[#F4F7FF]">Hide country flag in random matching watermark</span>
              <input
                type="checkbox"
                checked={hideCountryFlag}
                onChange={(e) => setHideCountryFlag(e.target.checked)}
                className="rounded border-[#253148] text-[#1769FF]"
              />
            </label>
          </div>
        </div>

        {/* Action Save Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] text-white text-xs font-bold tracking-wide shadow-lg shadow-[#1769FF]/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
