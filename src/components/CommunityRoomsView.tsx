import React, { useState } from 'react';
import { Users, Volume2, Sparkles, ArrowRight, Radio, Plus } from 'lucide-react';
import { AppView, CommunityRoom } from '../types';
import { MOCK_INTERESTS } from '../data/mockData';

interface CommunityRoomsViewProps {
  rooms: CommunityRoom[];
  onNavigate: (view: AppView) => void;
  onSelectRoom: (room: CommunityRoom) => void;
  onOpenCreateModal: () => void;
}

export const CommunityRoomsView: React.FC<CommunityRoomsViewProps> = ({
  rooms,
  onNavigate,
  onSelectRoom,
  onOpenCreateModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All Topics');

  const filteredRooms =
    selectedCategory === 'All Topics'
      ? rooms
      : rooms.filter((r) => r.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#080B14]">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0D1220] border border-[#253148] p-8 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121A2A] border border-[#253148] text-[#25D9F8] text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 text-[#34D399] animate-pulse" />
            Stage 6 Multi-User Voice Lounges
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F7FF] font-mono">
            Topic Lounges & Voice Stages
          </h1>
          <p className="text-sm text-[#A5B1C7] leading-relaxed">
            Step onto interactive audio stages, co-work with creators, or chill in thematic voice lounges with multi-peer audio broadcast.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] text-white text-xs font-bold tracking-wide shadow-lg shadow-[#1769FF]/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Host a Lounge
            </button>

            <button
              onClick={() => onNavigate('video-chat')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#121A2A] hover:bg-[#192438] border border-[#253148] text-[#F4F7FF] text-xs font-medium transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#25D9F8]" />
              Switch to 1-on-1 Video Chat
            </button>
          </div>
        </div>

        {/* Ambient decorative glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#1769FF]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {MOCK_INTERESTS.slice(0, 6).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#1769FF] text-white border border-[#3B82F6] shadow-sm shadow-[#1769FF]/20'
                : 'bg-[#121A2A] text-[#A5B1C7] border border-[#253148] hover:text-[#F4F7FF] hover:bg-[#192438]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredRooms.map((room) => {
          return (
            <div
              key={room.id}
              className="p-6 rounded-2xl border border-[#253148] hover:border-[#1769FF]/60 transition-all duration-300 bg-[#121A2A] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-[#25D9F8] tracking-wider uppercase font-mono">
                        {room.category}
                      </span>
                      {room.isVoiceActive && (
                        <span className="flex items-center gap-1 text-[10px] text-[#34D399] bg-[#0D1220] px-2 py-0.5 rounded-md border border-[#34D399]/40">
                          <Volume2 className="w-3 h-3" />
                          Voice Live
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-[#F4F7FF] group-hover:text-[#25D9F8] transition-colors">
                      {room.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0D1220] border border-[#253148] text-xs font-mono text-[#F4F7FF]">
                    <Users className="w-3.5 h-3.5 text-[#25D9F8]" />
                    <span>{room.activeCount}/{room.maxCount}</span>
                  </div>
                </div>

                <p className="text-xs text-[#A5B1C7] leading-relaxed mb-4">
                  {room.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mb-5 text-[11px] text-[#A5B1C7]">
                  {room.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-lg bg-[#0D1220] text-[#A5B1C7] border border-[#253148]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Host and Action */}
              <div className="flex items-center justify-between pt-4 border-t border-[#253148]">
                <div className="flex items-center gap-2.5">
                  <img
                    src={room.hostAvatar}
                    alt={room.hostName}
                    className="w-7 h-7 rounded-full object-cover border border-[#1769FF]/50"
                  />
                  <div className="text-xs">
                    <span className="text-[#748198] text-[10px] block">Hosted by</span>
                    <span className="text-[#F4F7FF] font-medium">{room.hostName}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectRoom(room)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#1769FF] hover:bg-[#3B82F6] text-white shadow-md shadow-[#1769FF]/20 transition-all cursor-pointer"
                >
                  <span>Enter Stage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
