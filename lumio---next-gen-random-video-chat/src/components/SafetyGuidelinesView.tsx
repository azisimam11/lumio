import React from 'react';
import { ShieldCheck, Lock, EyeOff, Ban, AlertTriangle, UserCheck, HeartHandshake, ArrowRight } from 'lucide-react';
import { AppView } from '../types';

interface SafetyGuidelinesViewProps {
  onNavigate: (view: AppView) => void;
  onOpenRunbook?: () => void;
}

export const SafetyGuidelinesView: React.FC<SafetyGuidelinesViewProps> = ({
  onNavigate,
  onOpenRunbook,
}) => {
  const principles = [
    {
      icon: ShieldCheck,
      title: 'Zero Tolerance Policy',
      color: 'text-[#34D399]',
      desc: 'Harassment, sexual misconduct, hate speech, non-consensual sharing, and intimidation result in immediate hardware and IP network bans.',
    },
    {
      icon: AlertTriangle,
      title: 'Strict 18+ Age Verification',
      color: 'text-[#FBBF24]',
      desc: 'Lumio is exclusively designed for adults. Minors are strictly forbidden from participating in random video discovery to preserve community safety.',
    },
    {
      icon: EyeOff,
      title: 'Zero Video Storage or Logging',
      color: 'text-[#25D9F8]',
      desc: 'WebRTC video streams flow peer-to-peer. Lumio does not record, archive, or inspect live media feeds on central servers.',
    },
    {
      icon: Lock,
      title: 'IP Masking & Privacy Shield',
      color: 'text-[#1769FF]',
      desc: 'Your IP address, physical location, and device fingerprints are kept strictly confidential and never exposed directly in partner UI.',
    },
    {
      icon: Ban,
      title: 'Instant 1-Click Skip & Block',
      color: 'text-[#FB7185]',
      desc: 'If an encounter feels uncomfortable, click Next immediately or submit a 1-click incident report to permanently disallow rematching.',
    },
    {
      icon: UserCheck,
      title: 'Continuous Moderation',
      color: 'text-[#A78BFA]',
      desc: 'Our moderation pipeline analyzes community report patterns and flags repeat violators for permanent revocation.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-[#080B14]">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121A2A] border border-[#253148] text-[#25D9F8] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
          Safety & Trust Standards
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F7FF] font-mono">
          A Safer Space for Spontaneous Connection
        </h1>
        <p className="text-sm text-[#A5B1C7] leading-relaxed">
          Random video chat should be spontaneous, engaging, and above all, safe. Review our community charter and learn how we protect your conversations.
        </p>
      </div>

      {/* Grid of Safety Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {principles.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-[#253148] bg-[#121A2A] space-y-3 transition-transform hover:-translate-y-1 duration-200"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} bg-[#0D1220] border border-[#253148]`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#F4F7FF]">{item.title}</h3>
              <p className="text-xs text-[#A5B1C7] leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Code of Conduct Section */}
      <div className="p-8 rounded-3xl bg-[#0D1220] border border-[#253148] space-y-6">
        <div className="flex items-center gap-3">
          <HeartHandshake className="w-6 h-6 text-[#1769FF]" />
          <h2 className="text-xl font-bold text-[#F4F7FF] font-mono">
            Lumio Community Code of Conduct
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#A5B1C7]">
          <div className="space-y-3">
            <h4 className="font-semibold text-[#34D399] uppercase tracking-wider text-[11px]">
              What We Encourage
            </h4>
            <ul className="space-y-2 list-disc list-inside text-[#A5B1C7]">
              <li>Kindness, curiosity, and cultural respect across borders</li>
              <li>Practicing new languages with patience</li>
              <li>Sharing creative passions: music, programming, art, and philosophy</li>
              <li>Immediately reporting bad actors to safeguard fellow peers</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-[#FB7185] uppercase tracking-wider text-[11px]">
              Strictly Prohibited Behavior
            </h4>
            <ul className="space-y-2 list-disc list-inside text-[#A5B1C7]">
              <li>Indecent exposure, nudity, or sexually explicit behavior</li>
              <li>Targeted insults, racial slurs, and cyberbullying</li>
              <li>Commercial spam, broadcasting prerecorded videos, or bot streams</li>
              <li>Attempting to dox, extract, or solicit sensitive private credentials</li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-[#253148] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#748198]">
            Questions or report appeals: <span className="text-[#A5B1C7]">safety@lumio.social</span>
          </p>
          <div className="flex items-center gap-3">
            {onOpenRunbook && (
              <button
                onClick={onOpenRunbook}
                className="px-4 py-2.5 rounded-xl bg-[#121A2A] hover:bg-[#192438] border border-[#253148] text-[#25D9F8] text-xs font-semibold transition-colors cursor-pointer"
              >
                Architecture & Coturn Runbook
              </button>
            )}
            <button
              onClick={() => onNavigate('video-chat')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-lg shadow-[#1769FF]/30 transition-all cursor-pointer"
            >
              Agree & Start Video Chat
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
