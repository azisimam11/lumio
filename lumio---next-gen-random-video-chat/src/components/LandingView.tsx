import React, { useState } from 'react';
import {
  Video,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe2,
  Users,
  Lock,
  ArrowRight,
  Play,
  MessageSquare,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import { AppView } from '../types';
import { MOCK_INTERESTS } from '../data/mockData';

interface LandingViewProps {
  onStartChat: (interest?: string) => void;
  onNavigate: (view: AppView) => void;
  onlineCount?: number;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartChat,
  onNavigate,
  onlineCount = 4280,
}) => {
  const [selectedTopic, setSelectedTopic] = useState('All Topics');

  const features = [
    {
      icon: Zap,
      title: 'Sub-Second Next-Stranger Transition',
      desc: 'Seamlessly transition between global partners with zero jarring refreshes and lightning-fast ICE negotiation.',
      color: 'text-[#25D9F8]',
    },
    {
      icon: Globe2,
      title: 'Language & Interest Matching',
      desc: 'Filter partners by languages you want to practice or passions like music, coding, gaming, and creative arts.',
      color: 'text-[#1769FF]',
    },
    {
      icon: Lock,
      title: 'Peer-to-Peer Privacy Shield',
      desc: 'Pure WebRTC encrypted peer transmission. We never record video feeds or expose personal IP addresses.',
      color: 'text-[#A78BFA]',
    },
    {
      icon: ShieldCheck,
      title: 'Strict 1-Click Moderation',
      desc: 'Zero tolerance for violations. One-click report and instant hardware disconnect keep the ecosystem respectful.',
      color: 'text-[#34D399]',
    },
    {
      icon: MessageSquare,
      title: 'In-Call Text & Icebreakers',
      desc: 'Break the awkward silence with curated conversational prompts, instant text messaging, and cultural exchanges.',
      color: 'text-[#25D9F8]',
    },
    {
      icon: Users,
      title: 'Topic Lounges & Voice Rooms',
      desc: 'Expand beyond 1-on-1s. Step into thematic multi-user audio lounges for lo-fi chill, founders, and gaming squads.',
      color: 'text-[#F472B6]',
    },
  ];

  return (
    <div className="space-y-20 py-8 sm:py-14 bg-[#080B14]">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Indicator */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121A2A] border border-[#253148] text-xs font-semibold backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
              <span className="text-[#F4F7FF]">{onlineCount.toLocaleString()} peers active live</span>
              <span className="text-[#253148]">·</span>
              <span className="text-[#A5B1C7] font-normal">Midnight Neon Social</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F4F7FF] leading-[1.12] font-mono">
              Meet spontaneous minds across the globe.
            </h1>

            <p className="text-base sm:text-lg text-[#A5B1C7] leading-relaxed max-w-2xl">
              Lumio delivers modern random video matching with deep interest filters, dark navy aesthetics, peer-to-peer WebRTC STUN architecture, and community safety.
            </p>

            {/* Quick Topic Chips */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-semibold text-[#A5B1C7] uppercase tracking-wider block">
                Choose your vibe before starting:
              </span>
              <div className="flex flex-wrap gap-2">
                {MOCK_INTERESTS.slice(0, 5).map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`text-xs px-3.5 py-1.5 rounded-xl border font-medium transition-all cursor-pointer ${
                      selectedTopic === topic
                        ? 'bg-[#1769FF] text-white border-[#3B82F6] shadow-sm shadow-[#1769FF]/30'
                        : 'bg-[#121A2A] text-[#A5B1C7] border-[#253148] hover:text-[#F4F7FF] hover:bg-[#192438]'
                    }`}
                  >
                    #{topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onStartChat(selectedTopic)}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] text-white text-sm font-bold tracking-wide shadow-xl shadow-[#1769FF]/30 hover:shadow-[#1769FF]/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-white stroke-[2]" />
                Start Video Chat Now
              </button>

              <button
                onClick={() => onNavigate('community')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#121A2A] hover:bg-[#192438] border border-[#253148] text-[#F4F7FF] text-sm font-medium transition-all cursor-pointer"
              >
                <Users className="w-4 h-4 text-[#25D9F8]" />
                Browse Lounges
              </button>
            </div>

            {/* Micro guarantees */}
            <div className="flex items-center gap-6 pt-1 text-xs text-[#748198]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                <span className="text-[#A5B1C7]">No account needed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#25D9F8]" />
                <span className="text-[#A5B1C7]">18+ Strict safety charter</span>
              </div>
            </div>
          </div>

          {/* Right Hero: Live Video Preview Component */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl p-1 bg-gradient-to-b from-[#1769FF]/40 to-[#253148] shadow-2xl shadow-[#080B14]">
              <div className="rounded-xl bg-[#0D1220] overflow-hidden border border-[#253148]">
                {/* Header bar of preview */}
                <div className="px-4 py-3 bg-[#121A2A] border-b border-[#253148] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] animate-pulse" />
                    <span className="font-semibold text-[#F4F7FF]">P2P Peer Discovery Preview</span>
                  </div>
                  <span className="text-[10px] text-[#25D9F8] font-mono">WebRTC Active</span>
                </div>

                {/* Video split mock */}
                <div className="relative aspect-[4/3] bg-[#080B14] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80"
                    alt="Sample peer"
                    className="w-full h-full object-cover filter contrast-105"
                  />

                  {/* Remote overlay info */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#080B14]/80 backdrop-blur-md border border-[#253148] text-[11px] text-[#F4F7FF] flex items-center gap-2">
                    <span className="font-semibold">Kenji S.</span>
                    <span className="text-[#A5B1C7]">· Tokyo, JP</span>
                  </div>

                  {/* Local video PiP thumbnail */}
                  <div className="absolute bottom-3 right-3 w-28 aspect-video rounded-xl overflow-hidden border-2 border-[#1769FF] shadow-lg bg-[#0D1220]">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
                      alt="Local PiP preview"
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                    <span className="absolute bottom-1 left-1 text-[8px] bg-black/70 px-1 rounded text-white">
                      You
                    </span>
                  </div>

                  {/* Center CTA button inside preview */}
                  <div className="absolute inset-0 bg-[#080B14]/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                    <button
                      onClick={() => onStartChat(selectedTopic)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] text-white font-bold text-xs shadow-lg shadow-[#1769FF]/40 hover:scale-105 transition-transform cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Launch Live Studio
                    </button>
                    <span className="text-[11px] text-[#A5B1C7] mt-2 font-medium">
                      Press to connect instantly
                    </span>
                  </div>
                </div>

                {/* Quick features banner */}
                <div className="p-3 bg-[#121A2A] border-t border-[#253148] grid grid-cols-3 gap-2 text-center text-[10px] text-[#A5B1C7]">
                  <div>
                    <span className="block text-[#F4F7FF] font-bold">1-on-1</span>
                    <span>Video & Audio</span>
                  </div>
                  <div>
                    <span className="block text-[#25D9F8] font-bold">Encrypted</span>
                    <span>WebRTC STUN</span>
                  </div>
                  <div>
                    <span className="block text-[#34D399] font-bold">18+</span>
                    <span>Safe Social</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR TOPIC DISCOVERY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0D1220] border border-[#253148] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#25D9F8] text-xs font-semibold uppercase tracking-wider mb-1">
                <Flame className="w-4 h-4" />
                Featured Passion Channels
              </div>
              <h2 className="text-2xl font-bold text-[#F4F7FF] font-mono">
                Connect with people who share your world
              </h2>
            </div>
            <button
              onClick={() => onStartChat()}
              className="text-xs font-semibold text-[#1769FF] hover:text-[#3B82F6] flex items-center gap-1.5 self-start cursor-pointer"
            >
              <span>Explore all interests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'Gaming & Esports', count: '1,420 peers' },
              { name: 'Music & Lo-Fi', count: '980 peers' },
              { name: 'Tech & AI', count: '850 peers' },
              { name: 'Language Exchange', count: '1,210 peers' },
              { name: 'Travel & Culture', count: '630 peers' },
              { name: 'Deep Conversations', count: '790 peers' },
            ].map((topic) => (
              <button
                key={topic.name}
                onClick={() => onStartChat(topic.name)}
                className="p-3.5 rounded-2xl bg-[#121A2A] border border-[#253148] hover:border-[#1769FF]/60 hover:bg-[#192438] text-left transition-all group cursor-pointer"
              >
                <div className="text-xs font-semibold text-[#F4F7FF] group-hover:text-[#25D9F8] transition-colors">
                  {topic.name}
                </div>
                <div className="text-[10px] text-[#748198] mt-1">{topic.count}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F7FF] font-mono">
            Engineered for Modern Social Interaction
          </h2>
          <p className="text-sm text-[#A5B1C7] leading-relaxed">
            Every layer of Lumio is engineered to eliminate friction and prioritize real human connection, privacy, and safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#121A2A] border border-[#253148] hover:border-[#1769FF]/50 transition-all duration-300 space-y-3 group"
              >
                <div className={`w-11 h-11 rounded-xl bg-[#0D1220] border border-[#253148] flex items-center justify-center ${feat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#F4F7FF] group-hover:text-[#25D9F8] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#A5B1C7] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* TRUST & SAFETY PLEDGE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0D1220] border border-[#253148] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121A2A] border border-[#253148] text-[#25D9F8] text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Safety by Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F7FF] font-mono">
              Our Zero-Tolerance Trust Framework
            </h2>
            <p className="text-xs text-[#A5B1C7] leading-relaxed">
              We mandate an 18+ user baseline, provide immediate 1-click skipping and permanent blocking, and enforce hardware network bans on abusive actors.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <button
                onClick={() => onNavigate('safety')}
                className="text-[#1769FF] hover:text-[#3B82F6] font-semibold underline underline-offset-4 cursor-pointer"
              >
                Read Community Standards →
              </button>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-3">
            <button
              onClick={() => onStartChat()}
              className="px-8 py-4 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] text-white font-bold text-sm tracking-wide shadow-xl shadow-[#1769FF]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Start Matching Strangers
            </button>
            <p className="text-[11px] text-[#748198] text-center">
              WebRTC encrypted peer connection
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
