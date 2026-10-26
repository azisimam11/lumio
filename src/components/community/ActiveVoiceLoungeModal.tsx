import React, { useState } from 'react';
import {
  Volume2,
  Mic,
  MicOff,
  Hand,
  MessageSquare,
  Users,
  X,
  PhoneOff,
  Send,
  Crown,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { CommunityRoom } from '../../types';
import { useCommunityLounge } from '../../hooks/useCommunityLounge';
import { useAuth } from '../../hooks/useAuth';

interface ActiveVoiceLoungeModalProps {
  room: CommunityRoom;
  onClose: () => void;
}

export const ActiveVoiceLoungeModal: React.FC<ActiveVoiceLoungeModalProps> = ({
  room,
  onClose,
}) => {
  const { user } = useAuth();
  const {
    participants,
    messages,
    hasRaisedHand,
    isMuted,
    toggleRaiseHand,
    toggleMute,
    promoteSpeaker,
    sendMessage,
  } = useCommunityLounge(room);

  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatInput, setChatInput] = useState('');

  const speakers = participants.filter((p) => p.role === 'host' || p.role === 'speaker');
  const listeners = participants.filter((p) => p.role === 'listener');

  const me = participants.find((p) => p.id === user.id);
  const isMeSpeaker = me?.role === 'host' || me?.role === 'speaker';
  const isMeHost = me?.role === 'host';

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendMessage(chatInput.trim());
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#080B14]/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] bg-[#0D1220] border border-[#253148] rounded-3xl flex flex-col overflow-hidden shadow-2xl text-[#F4F7FF]">
        {/* LOUNGE HEADER */}
        <div className="p-4 sm:p-5 border-b border-[#253148] flex items-center justify-between bg-[#080B14] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#121A2A] border border-[#1769FF]/50 flex items-center justify-center text-[#25D9F8]">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#121A2A] border border-[#253148] text-[#25D9F8]">
                  {room.category}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-[#34D399]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                  Voice Live
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#F4F7FF] font-mono">
                {room.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121A2A] border border-[#253148] text-xs font-mono text-[#A5B1C7]">
              <Users className="w-3.5 h-3.5 text-[#25D9F8]" />
              <span>{participants.length} in room</span>
            </div>

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#121A2A] hover:bg-[#192438] border border-[#FB7185]/50 text-[#FB7185] text-xs font-semibold transition-colors cursor-pointer"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>Leave Lounge</span>
            </button>
          </div>
        </div>

        {/* MAIN BODY: STAGE & CHAT */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT: VOICE STAGE */}
          <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto space-y-6">
            {/* SPEAKERS SECTION */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#A5B1C7] uppercase tracking-wider">
                <span>Stage Speakers ({speakers.length})</span>
                <span className="text-[10px] text-[#748198] normal-case">Multi-peer Audio WebRTC</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {speakers.map((spk) => (
                  <div
                    key={spk.id}
                    className="p-4 rounded-2xl bg-[#121A2A] border border-[#253148] flex flex-col items-center text-center space-y-2 relative group hover:border-[#1769FF]/50 transition-all"
                  >
                    {/* Avatar with speaking wave glow */}
                    <div className="relative">
                      <img
                        src={spk.avatarUrl}
                        alt={spk.name}
                        className={`w-16 h-16 rounded-2xl object-cover border-2 transition-all ${
                          spk.isSpeaking
                            ? 'border-[#34D399] shadow-lg shadow-[#34D399]/30 scale-105'
                            : 'border-[#253148]'
                        }`}
                      />
                      {spk.role === 'host' && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#1769FF] text-white flex items-center justify-center border-2 border-[#121A2A]">
                          <Crown className="w-3 h-3" />
                        </span>
                      )}
                      <span
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] border-2 border-[#121A2A] ${
                          spk.isMuted
                            ? 'bg-[#FB7185] text-white'
                            : 'bg-[#34D399] text-black'
                        }`}
                      >
                        {spk.isMuted ? <MicOff className="w-2.5 h-2.5" /> : <Mic className="w-2.5 h-2.5" />}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#F4F7FF] truncate max-w-[120px]">
                        {spk.name}
                      </div>
                      <span className="text-[10px] text-[#A5B1C7] uppercase font-mono">
                        {spk.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LISTENERS SECTION */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-semibold text-[#A5B1C7] uppercase tracking-wider">
                Audience ({listeners.length})
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {listeners.map((lis) => (
                  <div
                    key={lis.id}
                    className="p-3 rounded-2xl bg-[#080B14] border border-[#253148] flex flex-col items-center text-center space-y-1.5 relative hover:border-[#1769FF]/40 transition-colors"
                  >
                    <div className="relative">
                      <img
                        src={lis.avatarUrl}
                        alt={lis.name}
                        className="w-11 h-11 rounded-xl object-cover border border-[#253148]"
                      />
                      {lis.hasRaisedHand && (
                        <span
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FBBF24] text-black flex items-center justify-center border-2 border-[#080B14] animate-bounce"
                          title="Hand raised to speak"
                        >
                          <Hand className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] font-medium text-[#F4F7FF] truncate max-w-[80px]">
                      {lis.name}
                    </div>

                    {isMeHost && lis.hasRaisedHand && (
                      <button
                        onClick={() => promoteSpeaker(lis.id)}
                        className="text-[9px] px-2 py-0.5 rounded-md bg-[#1769FF] text-white hover:bg-[#3B82F6] cursor-pointer"
                      >
                        Allow Speak
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: LIVE LOUNGE CHAT */}
          {isChatOpen && (
            <div className="w-80 border-l border-[#253148] bg-[#080B14] flex flex-col shrink-0">
              <div className="p-3.5 border-b border-[#253148] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#25D9F8]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#F4F7FF] font-mono">
                    Lounge Chat
                  </h3>
                </div>
                <span className="text-[10px] text-[#748198]">Live Stream</span>
              </div>

              {/* Message list */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
                {messages.map((m) => (
                  <div key={m.id} className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={m.senderAvatar}
                        alt={m.senderName}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span className="font-bold text-[#F4F7FF] text-[11px]">
                        {m.senderName}
                      </span>
                      <span className="text-[9px] text-[#748198]">{m.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#A5B1C7] pl-5 leading-relaxed bg-[#121A2A]/40 p-2 rounded-xl border border-[#253148]/50">
                      {m.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Message input */}
              <form onSubmit={handleSendChat} className="p-3 border-t border-[#253148] flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Share a thought in lounge..."
                  className="flex-1 bg-[#121A2A] border border-[#253148] rounded-xl px-3 py-2 text-xs text-[#F4F7FF] placeholder-[#748198] focus:outline-none focus:border-[#1769FF]"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-2 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] disabled:bg-[#121A2A] text-white disabled:text-[#748198] transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="p-3.5 border-t border-[#253148] bg-[#080B14] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {isMeSpeaker ? (
              <button
                onClick={toggleMute}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isMuted
                    ? 'bg-[#121A2A] border-[#FB7185]/60 text-[#FB7185]'
                    : 'bg-[#1769FF] hover:bg-[#3B82F6] text-white border-transparent'
                }`}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isMuted ? 'Unmute Audio' : 'Mute Mic'}</span>
              </button>
            ) : (
              <button
                onClick={toggleRaiseHand}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  hasRaisedHand
                    ? 'bg-[#121A2A] border-[#FBBF24] text-[#FBBF24]'
                    : 'bg-[#121A2A] border-[#253148] text-[#F4F7FF] hover:bg-[#192438]'
                }`}
              >
                <Hand className="w-4 h-4" />
                <span>{hasRaisedHand ? 'Hand Raised' : 'Raise Hand to Speak'}</span>
              </button>
            )}
          </div>

          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isChatOpen
                ? 'bg-[#121A2A] border-[#1769FF] text-[#25D9F8]'
                : 'bg-[#121A2A] border-[#253148] text-[#A5B1C7] hover:text-[#F4F7FF]'
            }`}
            title="Toggle lounge chat"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
