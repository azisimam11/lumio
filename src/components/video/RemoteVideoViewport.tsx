import React from 'react';
import { Radio, PhoneOff, Sparkles, Play, Volume2, Flag, Zap, Clock, UserPlus } from 'lucide-react';
import { MatchingState, UserProfile } from '../../types';

interface RemoteVideoViewportProps {
  matchingState: MatchingState;
  currentPartner: UserProfile | null;
  selectedInterest: string;
  searchDuration?: number;
  compatibilityScore?: number;
  roomId?: string;
  rateLimitCountdown?: number;
  isFriend?: boolean;
  onAddFriend?: () => void;
  onStartSearch: () => void;
  onCancelSearch: () => void;
  onOpenReportModal: () => void;
}

export const RemoteVideoViewport: React.FC<RemoteVideoViewportProps> = ({
  matchingState,
  currentPartner,
  selectedInterest,
  searchDuration = 0,
  compatibilityScore = 85,
  roomId,
  rateLimitCountdown = 0,
  isFriend = false,
  onAddFriend,
  onStartSearch,
  onCancelSearch,
  onOpenReportModal,
}) => {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#0D1220] border border-[#253148] flex items-center justify-center shadow-inner h-full min-h-[260px]">
      {/* 1. MATCHED: DISPLAY PARTNER */}
      {matchingState === 'matched' && currentPartner ? (
        <>
          <img
            src={currentPartner.avatarUrl}
            alt={currentPartner.name}
            className="w-full h-full object-cover select-none filter contrast-105"
          />

          {/* Partner Info Watermark */}
          <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#080B14]/85 backdrop-blur-md border border-[#253148] text-[11px] text-[#F4F7FF]">
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
            <span className="font-semibold text-[#F4F7FF]">{currentPartner.name}</span>
            <span className="text-[#A5B1C7]">· {currentPartner.country}</span>
            <span className="text-[10px] text-[#25D9F8] ml-1 border-l border-[#253148] pl-1.5 font-mono">
              {compatibilityScore}% Match
            </span>
          </div>

          {/* Audio Wave & Room Badge with Mint Green */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {roomId && (
              <span className="hidden sm:inline-block px-2 py-1 rounded-lg bg-[#080B14]/80 border border-[#253148] text-[10px] text-[#748198] font-mono">
                {roomId}
              </span>
            )}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#080B14]/85 backdrop-blur-md border border-[#253148] text-xs text-[#34D399] font-mono">
              <Volume2 className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-2 bg-[#34D399] rounded-full animate-pulse" />
                <span className="w-0.5 h-3 bg-[#34D399] rounded-full animate-pulse delay-75" />
                <span className="w-0.5 h-1.5 bg-[#34D399] rounded-full animate-pulse delay-150" />
              </div>
            </div>
          </div>

          {/* Bottom Overlay Info & Report Button */}
          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-gradient-to-t from-[#080B14]/95 via-[#080B14]/75 to-transparent flex flex-wrap items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="text-xs text-[#F4F7FF] font-medium">
                {currentPartner.bio}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {currentPartner.interests.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-[#121A2A] border border-[#1769FF]/50 text-[#25D9F8] font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onAddFriend && (
                <button
                  onClick={onAddFriend}
                  disabled={isFriend}
                  className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    isFriend
                      ? 'bg-[#121A2A] text-[#34D399] border border-[#34D399]/40'
                      : 'bg-[#1769FF] hover:bg-[#3B82F6] text-white shadow-md shadow-[#1769FF]/30'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isFriend ? 'Friends ✓' : 'Add Friend'}</span>
                </button>
              )}

              <button
                onClick={onOpenReportModal}
                className="px-2.5 py-1.5 rounded-xl bg-[#121A2A] border border-[#FB7185]/50 hover:bg-[#192438] text-[#FB7185] text-xs flex items-center gap-1 transition-colors cursor-pointer"
                title="Report this user"
              >
                <Flag className="w-3 h-3" />
                <span>Report</span>
              </button>
            </div>
          </div>
        </>
      ) : matchingState === 'searching' ? (
        /* 2. SEARCHING: RADAR SCANNER WITH REAL QUEUE TIMER */
        <div className="flex flex-col items-center justify-center text-center p-6 space-y-5">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#1769FF]/20 animate-radar" />
            <div className="absolute inset-4 rounded-full bg-[#25D9F8]/20 animate-pulse" />
            <div className="w-16 h-16 rounded-2xl bg-[#121A2A] border border-[#1769FF]/60 flex items-center justify-center z-10 shadow-lg shadow-[#1769FF]/20">
              <Radio className="w-7 h-7 text-[#25D9F8] animate-spin" />
            </div>
          </div>
          <div className="space-y-1.5 max-w-xs">
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#34D399] font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>In queue: {searchDuration.toFixed(1)}s</span>
            </div>
            <h3 className="text-base font-bold text-[#F4F7FF] font-mono">
              Finding Next Stranger...
            </h3>
            <p className="text-xs text-[#A5B1C7]">
              Matching queue with <span className="text-[#25D9F8]">#{selectedInterest}</span>
            </p>
          </div>
          <button
            onClick={onCancelSearch}
            className="px-4 py-1.5 rounded-xl text-xs font-medium text-[#A5B1C7] hover:text-[#F4F7FF] bg-[#121A2A] border border-[#253148] hover:bg-[#192438] transition-colors cursor-pointer"
          >
            Cancel Search
          </button>
        </div>
      ) : matchingState === 'ended' ? (
        /* 3. ENDED STATE */
        <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#121A2A] border border-[#253148] flex items-center justify-center text-[#748198]">
            <PhoneOff className="w-6 h-6 text-[#748198]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#F4F7FF]">Call Ended</h3>
            <p className="text-xs text-[#A5B1C7]">
              Ready for the next face? Click start to reconnect.
            </p>
          </div>
          <button
            onClick={onStartSearch}
            className="px-5 py-2 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] text-white text-xs font-bold shadow-lg shadow-[#1769FF]/30 transition-all hover:scale-105 cursor-pointer"
          >
            Start New Match
          </button>
        </div>
      ) : (
        /* 4. IDLE STATE */
        <div className="flex flex-col items-center justify-center text-center p-8 space-y-5 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#121A2A] border border-[#1769FF]/50 flex items-center justify-center text-[#25D9F8]">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-[#F4F7FF] font-mono">
              Ready to meet spontaneous minds?
            </h3>
            <p className="text-xs text-[#A5B1C7] leading-relaxed">
              Select your favorite topic tag and press Start Search or press [Space] to meet a new peer.
            </p>
          </div>

          {rateLimitCountdown > 0 ? (
            <div className="px-4 py-2 rounded-xl bg-[#121A2A] border border-[#FBBF24]/50 text-xs text-[#FBBF24]">
              Anti-spam cooldown: wait {rateLimitCountdown}s
            </div>
          ) : (
            <button
              onClick={onStartSearch}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] text-white text-xs font-bold tracking-wide shadow-lg shadow-[#1769FF]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              Start Video Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};
