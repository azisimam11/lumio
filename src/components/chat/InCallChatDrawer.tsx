import React, { useRef, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { ChatMessage, MatchingState } from '../../types';
import { SAMPLE_ICEBREAKERS } from '../../data/mockData';

interface InCallChatDrawerProps {
  isOpen: boolean;
  matchingState: MatchingState;
  messages: ChatMessage[];
  chatInput: string;
  onInputChange: (val: string) => void;
  onSendMessage: (e?: React.FormEvent) => void;
  onSelectIcebreaker: (prompt: string) => void;
}

export const InCallChatDrawer: React.FC<InCallChatDrawerProps> = ({
  isOpen,
  matchingState,
  messages,
  chatInput,
  onInputChange,
  onSendMessage,
  onSelectIcebreaker,
}) => {
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  if (!isOpen) return null;

  return (
    <aside className="w-80 md:w-88 border-l border-[#253148] bg-[#0D1220] flex flex-col z-20 shrink-0">
      {/* Chat Header */}
      <div className="p-3.5 border-b border-[#253148] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#25D9F8]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F4F7FF] font-mono">
            Live Text Chat
          </h3>
        </div>
        <span className="text-[10px] text-[#748198] font-medium">
          {matchingState === 'matched' ? 'Active Peer' : 'Idle'}
        </span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-[#748198] space-y-2">
            <p>No messages yet in this session.</p>
            <p className="text-[11px] text-[#A5B1C7]">
              Connect with a peer or use an icebreaker below to start chatting.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === 'me';
            const isSys = msg.sender === 'system';

            if (isSys) {
              return (
                <div
                  key={msg.id}
                  className="py-1.5 px-3 rounded-xl bg-[#121A2A] border border-[#1769FF]/40 text-[11px] text-[#25D9F8] text-center"
                >
                  {msg.text}
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="text-[10px] text-[#748198] mb-0.5 px-1">
                  {msg.senderName} · {msg.timestamp}
                </div>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-[#1769FF] text-white font-medium rounded-tr-none shadow-sm shadow-[#1769FF]/20'
                      : 'bg-[#121A2A] text-[#F4F7FF] rounded-tl-none border border-[#253148]'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Icebreakers */}
      <div className="px-3 py-2 border-t border-[#253148] bg-[#121A2A]">
        <span className="text-[10px] text-[#A5B1C7] block mb-1.5 font-medium">
          💡 Quick Icebreakers:
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {SAMPLE_ICEBREAKERS.slice(0, 3).map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelectIcebreaker(prompt)}
              className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#0D1220] border border-[#253148] text-[#A5B1C7] hover:text-[#F4F7FF] hover:bg-[#192438] transition-colors shrink-0 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={onSendMessage} className="p-3 border-t border-[#253148] flex gap-2 bg-[#0D1220]">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={
            matchingState === 'matched' ? 'Type message... (Enter to send)' : 'Connect first to chat...'
          }
          disabled={matchingState !== 'matched'}
          className="flex-1 bg-[#121A2A] border border-[#253148] rounded-xl px-3 py-2 text-xs text-[#F4F7FF] placeholder-[#748198] focus:outline-none focus:border-[#1769FF] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={matchingState !== 'matched' || !chatInput.trim()}
          className="p-2.5 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] disabled:bg-[#121A2A] text-white disabled:text-[#748198] transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </aside>
  );
};
