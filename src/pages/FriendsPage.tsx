import React, { useState } from 'react';
import {
  Users,
  Search,
  MessageSquare,
  Video,
  Send,
  MoreVertical,
  Trash2,
  Sparkles,
  UserPlus,
  ArrowRight,
} from 'lucide-react';
import { AppView } from '../types';
import { useFriends } from '../hooks/useFriends';

interface FriendsPageProps {
  onNavigate: (view: AppView) => void;
  onStartVideoCallWithFriend?: (friendName: string) => void;
}

export const FriendsPage: React.FC<FriendsPageProps> = ({
  onNavigate,
  onStartVideoCallWithFriend,
}) => {
  const {
    friends,
    activeFriend,
    messages,
    setActiveFriend,
    removeFriend,
    sendMessage,
  } = useFriends();

  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const filteredFriends = friends.filter(
    (f) =>
      f.profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.profile.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.profile.interests.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const handleCall = () => {
    if (activeFriend && onStartVideoCallWithFriend) {
      onStartVideoCallWithFriend(activeFriend.profile.name);
    } else {
      onNavigate('video-chat');
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-[#080B14]">
      {/* Container Card */}
      <div className="flex-1 rounded-3xl bg-[#0D1220] border border-[#253148] flex overflow-hidden shadow-2xl">
        {/* LEFT COLUMN: FRIENDS LIST */}
        <div className="w-80 md:w-96 border-r border-[#253148] flex flex-col bg-[#0D1220] shrink-0">
          {/* Header */}
          <div className="p-4 border-b border-[#253148] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#25D9F8]" />
                <h2 className="text-base font-bold text-[#F4F7FF] font-mono">
                  Friends & DMs
                </h2>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#121A2A] text-[#34D399] border border-[#253148] font-mono">
                {friends.filter((f) => f.isOnline).length} online
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#748198] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search friends by name or topic..."
                className="w-full bg-[#121A2A] border border-[#253148] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F4F7FF] placeholder-[#748198] focus:outline-none focus:border-[#1769FF]"
              />
            </div>
          </div>

          {/* Friends List Items */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredFriends.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#748198] space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#121A2A] border border-[#253148] flex items-center justify-center text-[#748198]">
                  <UserPlus className="w-6 h-6" />
                </div>
                <p className="text-xs">
                  {friends.length === 0
                    ? 'No friends added yet. Connect with strangers in video chat to add them!'
                    : 'No friends matching your search query.'}
                </p>
                <button
                  onClick={() => onNavigate('video-chat')}
                  className="px-4 py-2 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] text-white text-xs font-semibold cursor-pointer"
                >
                  Meet People in Video Chat
                </button>
              </div>
            ) : (
              filteredFriends.map((friend) => {
                const isSelected = activeFriend?.id === friend.id;
                return (
                  <div
                    key={friend.id}
                    onClick={() => setActiveFriend(friend)}
                    className={`relative w-full p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#121A2A] border border-[#1769FF]/60 shadow-sm'
                        : 'hover:bg-[#121A2A]/50 border border-transparent'
                    }`}
                  >
                    {/* Avatar with status indicator */}
                    <div className="relative shrink-0">
                      <img
                        src={friend.profile.avatarUrl}
                        alt={friend.profile.name}
                        className="w-11 h-11 rounded-2xl object-cover border border-[#253148]"
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0D1220] ${
                          friend.isOnline ? 'bg-[#34D399]' : 'bg-[#748198]'
                        }`}
                      />
                    </div>

                    {/* Friend Summary */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#F4F7FF] truncate">
                          {friend.profile.name}
                        </h4>
                        <span className="text-[10px] text-[#748198]">{friend.lastActive}</span>
                      </div>
                      <p className="text-[11px] text-[#A5B1C7] truncate mt-0.5">
                        {friend.lastMessage || 'Connected via Lumio'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE DIRECT MESSAGE CONVERSATION */}
        {activeFriend ? (
          <div className="flex-1 flex flex-col bg-[#080B14]">
            {/* Conversation Header */}
            <div className="p-4 border-b border-[#253148] bg-[#0D1220] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={activeFriend.profile.avatarUrl}
                    alt={activeFriend.profile.name}
                    className="w-10 h-10 rounded-2xl object-cover border border-[#253148]"
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0D1220] ${
                      activeFriend.isOnline ? 'bg-[#34D399]' : 'bg-[#748198]'
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F4F7FF]">
                    {activeFriend.profile.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-[#A5B1C7]">
                    <span>{activeFriend.profile.country}</span>
                    <span>·</span>
                    <span className="text-[#34D399]">
                      {activeFriend.isOnline ? 'Online now' : 'Active ' + activeFriend.lastActive}
                    </span>
                  </div>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCall}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md shadow-[#1769FF]/25 transition-all cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setMenuOpenId(menuOpenId ? null : activeFriend.id)}
                    className="p-2 rounded-xl text-[#A5B1C7] hover:text-[#F4F7FF] hover:bg-[#121A2A] transition-colors cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {menuOpenId === activeFriend.id && (
                    <div className="absolute right-0 top-10 w-44 rounded-2xl bg-[#121A2A] border border-[#253148] p-1.5 shadow-xl z-30 text-xs">
                      <button
                        onClick={() => {
                          removeFriend(activeFriend.id);
                          setMenuOpenId(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#FB7185] hover:bg-[#192438] transition-colors cursor-pointer text-left"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Friend</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {messages.map((m) => {
                const isMe = m.sender === 'me';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-[#748198] mb-1 px-1">
                      {isMe ? 'You' : activeFriend.profile.name} · {m.timestamp}
                    </div>
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl leading-relaxed text-xs ${
                        isMe
                          ? 'bg-[#1769FF] text-white font-medium rounded-tr-none shadow-sm'
                          : 'bg-[#121A2A] text-[#F4F7FF] rounded-tl-none border border-[#253148]'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 border-t border-[#253148] bg-[#0D1220] flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeFriend.profile.name}...`}
                className="flex-1 bg-[#121A2A] border border-[#253148] rounded-xl px-4 py-2.5 text-xs text-[#F4F7FF] placeholder-[#748198] focus:outline-none focus:border-[#1769FF]"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] disabled:bg-[#121A2A] text-white disabled:text-[#748198] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        ) : (
          /* Empty Right Pane */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#748198] space-y-3 bg-[#080B14]">
            <MessageSquare className="w-10 h-10 text-[#748198]" />
            <p className="text-xs">Select a friend to open your direct messages conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
};
