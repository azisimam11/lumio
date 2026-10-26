import React from 'react';
import { Video, ShieldCheck, Heart, Lock, AlertTriangle } from 'lucide-react';
import { AppView } from '../types';

interface FooterProps {
  onNavigate: (view: AppView) => void;
  onOpenRunbook?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenRunbook }) => {
  return (
    <footer className="w-full border-t border-[#253148] bg-[#080B14] text-[#A5B1C7] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#1769FF] to-[#25D9F8] flex items-center justify-center">
                <Video className="w-4 h-4 text-white stroke-[2.2]" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#F4F7FF] font-mono">
                LUMIO
              </span>
            </div>
            <p className="text-xs text-[#A5B1C7] leading-relaxed">
              Midnight Neon Social: Next-generation random video matching with privacy-first peer WebRTC encryption and strict community safety.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#748198]">
              <Lock className="w-3.5 h-3.5 text-[#25D9F8]" />
              <span>STUN encrypted P2P signaling</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-[#F4F7FF] uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('landing')}
                  className="hover:text-[#F4F7FF] transition-colors cursor-pointer"
                >
                  Overview & Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('video-chat')}
                  className="hover:text-[#25D9F8] transition-colors flex items-center gap-1.5 cursor-pointer text-[#F4F7FF]"
                >
                  Random Video Chat
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1769FF]" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('community')}
                  className="hover:text-[#F4F7FF] transition-colors cursor-pointer"
                >
                  Community Lounges
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('safety')}
                  className="hover:text-[#F4F7FF] transition-colors cursor-pointer"
                >
                  Safety Guidelines & Code of Conduct
                </button>
              </li>
            </ul>
          </div>

          {/* Safety & Trust */}
          <div>
            <h4 className="text-xs font-semibold text-[#F4F7FF] uppercase tracking-wider mb-3">
              Trust & Safety
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-[#A5B1C7]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
                <span>Zero Tolerance for Harassment</span>
              </li>
              <li className="flex items-center gap-1.5 text-[#A5B1C7]">
                <AlertTriangle className="w-3.5 h-3.5 text-[#FBBF24] shrink-0" />
                <span>Strict 18+ Age Restriction</span>
              </li>
              <li className="flex items-center gap-1.5 text-[#A5B1C7]">
                <Lock className="w-3.5 h-3.5 text-[#25D9F8] shrink-0" />
                <span>No Central Media Storage</span>
              </li>
              <li className="flex items-center gap-1.5 text-[#A5B1C7]">
                <span className="w-3.5 h-3.5 rounded-full bg-[#121A2A] border border-[#253148] flex items-center justify-center text-[9px] text-[#25D9F8]">⚡</span>
                <span>Instant 1-Click Report & Block</span>
              </li>
            </ul>
          </div>

          {/* Development Notice */}
          <div className="p-4 rounded-2xl bg-[#121A2A] border border-[#253148] space-y-2 text-xs">
            <div className="flex items-center justify-between text-[#F4F7FF] font-semibold">
              <span>Roadmap Status</span>
              <span className="text-[#25D9F8] text-[11px] font-mono">Stage 7 Production</span>
            </div>
            <p className="text-[#A5B1C7] text-[11px] leading-relaxed">
              Operating with live local media feeds, WebRTC STUN/TURN peer connection handling, and Midnight Neon Social theme tokens.
            </p>
            {onOpenRunbook && (
              <button
                onClick={onOpenRunbook}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#25D9F8] hover:text-[#F4F7FF] pt-1 transition-colors cursor-pointer"
              >
                <span>Production Runbook & Coturn Specs</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="pt-6 border-t border-[#253148] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#748198]">
          <p>© {new Date().getFullYear()} Lumio Live. Crafted for safe spontaneous social discovery.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('safety')} className="hover:text-[#F4F7FF] cursor-pointer">Privacy Policy</button>
            <span>·</span>
            <button onClick={() => onNavigate('safety')} className="hover:text-[#F4F7FF] cursor-pointer">Terms of Service</button>
            <span>·</span>
            <span className="flex items-center gap-1 text-[#748198]">
              Built with <Heart className="w-3 h-3 text-[#F472B6] fill-[#F472B6]" /> & WebRTC Peer Architecture
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
