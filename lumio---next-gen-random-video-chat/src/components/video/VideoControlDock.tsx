import React from 'react';
import {
  SkipForward,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  Sliders,
} from 'lucide-react';
import { MatchingState } from '../../types';

interface VideoControlDockProps {
  matchingState: MatchingState;
  isMuted: boolean;
  isVideoOff: boolean;
  isChatOpen: boolean;
  onNextPartner: () => void;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleChat: () => void;
  onOpenDeviceSettings: () => void;
}

export const VideoControlDock: React.FC<VideoControlDockProps> = ({
  matchingState,
  isMuted,
  isVideoOff,
  isChatOpen,
  onNextPartner,
  onEndCall,
  onToggleMute,
  onToggleVideo,
  onToggleChat,
  onOpenDeviceSettings,
}) => {
  return (
    <div className="h-16 pt-3 flex items-center justify-center gap-3 shrink-0">
      {/* Primary Action: NEXT / START */}
      <button
        onClick={onNextPartner}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] text-white text-sm font-bold shadow-lg shadow-[#1769FF]/30 transition-all active:scale-95 cursor-pointer"
      >
        <SkipForward className="w-4 h-4 fill-white stroke-[2]" />
        <span>{matchingState === 'matched' ? 'Next Stranger' : 'Start Searching'}</span>
      </button>

      {/* Stop / End Call */}
      {matchingState !== 'idle' && (
        <button
          onClick={onEndCall}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#121A2A] hover:bg-[#192438] border border-[#FB7185]/50 text-[#FB7185] text-xs font-semibold transition-all active:scale-95 cursor-pointer"
          title="End current call session (Esc)"
        >
          <PhoneOff className="w-4 h-4" />
          <span className="hidden sm:inline">End Call</span>
        </button>
      )}

      {/* Mic Toggle */}
      <button
        onClick={onToggleMute}
        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
          isMuted
            ? 'bg-[#121A2A] border-[#FB7185]/60 text-[#FB7185]'
            : 'bg-[#121A2A] border-[#253148] text-[#F4F7FF] hover:text-white hover:bg-[#192438]'
        }`}
        title={isMuted ? 'Unmute microphone (M)' : 'Mute microphone (M)'}
      >
        {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </button>

      {/* Video Toggle */}
      <button
        onClick={onToggleVideo}
        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
          isVideoOff
            ? 'bg-[#121A2A] border-[#FB7185]/60 text-[#FB7185]'
            : 'bg-[#121A2A] border-[#253148] text-[#F4F7FF] hover:text-white hover:bg-[#192438]'
        }`}
        title={isVideoOff ? 'Enable camera (V)' : 'Disable camera (V)'}
      >
        {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
      </button>

      {/* Device Hardware Config Trigger */}
      <button
        onClick={onOpenDeviceSettings}
        className="p-2.5 rounded-xl border border-[#253148] bg-[#121A2A] text-[#A5B1C7] hover:text-[#F4F7FF] hover:bg-[#192438] transition-all cursor-pointer"
        title="Audio & Video Settings"
      >
        <Sliders className="w-4 h-4" />
      </button>

      {/* In-Call Text Chat Drawer Toggle */}
      <button
        onClick={onToggleChat}
        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
          isChatOpen
            ? 'bg-[#121A2A] border-[#1769FF]/70 text-[#25D9F8]'
            : 'bg-[#121A2A] border-[#253148] text-[#A5B1C7] hover:text-[#F4F7FF]'
        }`}
        title="Toggle text chat"
      >
        <MessageSquare className="w-4 h-4" />
      </button>
    </div>
  );
};
