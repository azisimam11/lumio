import React, { useState } from 'react';
import {
  Server,
  X,
  ShieldCheck,
  Cpu,
  Lock,
  Cloud,
  Terminal,
  Activity,
  FileText,
  Zap,
} from 'lucide-react';

interface DeploymentRunbookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentRunbookModal: React.FC<DeploymentRunbookModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'coturn' | 'security' | 'cost'>(
    'architecture'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#080B14]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0D1220] border border-[#253148] rounded-3xl flex flex-col overflow-hidden shadow-2xl text-[#F4F7FF]">
        {/* Header */}
        <div className="p-5 border-b border-[#253148] bg-[#080B14] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#121A2A] text-[#1769FF] flex items-center justify-center border border-[#1769FF]/40">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#121A2A] border border-[#253148] text-[#25D9F8]">
                  Tahap 7 Production Readiness
                </span>
                <span className="text-[10px] text-[#34D399] font-mono">Verified Build</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#F4F7FF] font-mono">
                System Architecture & Production Runbook
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#A5B1C7] hover:text-[#F4F7FF] hover:bg-[#121A2A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-[#253148] bg-[#080B14]/60 overflow-x-auto text-xs shrink-0">
          {[
            { id: 'architecture' as const, label: 'Full-Stack Architecture', icon: Cpu },
            { id: 'coturn' as const, label: 'TURN Server (Coturn) Setup', icon: Terminal },
            { id: 'security' as const, label: 'Security & Abuse Mitigation', icon: Lock },
            { id: 'cost' as const, label: 'Capacity & Operating Cost', icon: Cloud },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#1769FF] text-white shadow-sm shadow-[#1769FF]/30'
                    : 'bg-[#121A2A] text-[#A5B1C7] border border-[#253148] hover:text-[#F4F7FF]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-[#A5B1C7]">
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#121A2A] border border-[#253148] space-y-2">
                <h4 className="text-sm font-bold text-[#F4F7FF] font-mono flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#25D9F8]" />
                  1. High-Level Topology
                </h4>
                <p>
                  Lumio combines a reactive browser client (React 19 + TypeScript + Vite) with peer-to-peer WebRTC media streams and a lightweight signaling layer.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px]">
                  <div className="p-3 rounded-xl bg-[#0D1220] border border-[#253148]">
                    <span className="text-[#25D9F8] font-bold block mb-1">Frontend Layer</span>
                    <span>Responsive client with <code className="text-white">navigator.mediaDevices</code> and hardware track controllers.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0D1220] border border-[#253148]">
                    <span className="text-[#1769FF] font-bold block mb-1">Signaling Engine</span>
                    <span>Lightweight WebSocket / Socket.IO exchange for SDP Offer/Answer and ICE candidates.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0D1220] border border-[#253148]">
                    <span className="text-[#34D399] font-bold block mb-1">P2P Media Channel</span>
                    <span>Encrypted DTLS/SRTP audio-video connection routed directly peer-to-peer via Google STUN.</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#121A2A] border border-[#253148] space-y-2">
                <h4 className="text-sm font-bold text-[#F4F7FF] font-mono">
                  2. Random Matching Algorithm Lifecycle
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 pl-1">
                  <li><strong>Enqueue:</strong> User joins matching pool with selected topic and language preferences.</li>
                  <li><strong>Compatibility Scoring:</strong> Engine calculates score (+35 Topic match, +15 Language match) and excludes self, previous partner, and blocked IDs.</li>
                  <li><strong>Pair Allocation:</strong> Atomically provisions a unique <code className="text-[#25D9F8]">room-xxxx</code> and initiates WebRTC offer.</li>
                  <li><strong>Teardown & Cleanup:</strong> On Skip or Disconnect, all tracks are released and memory cleared.</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'coturn' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#121A2A] border border-[#253148] space-y-2">
                <h4 className="text-sm font-bold text-[#F4F7FF] font-mono flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#1769FF]" />
                  Coturn Server Configuration (/etc/turnserver.conf)
                </h4>
                <p>
                  To achieve 100% connectivity behind restrictive symmetric NATs and corporate firewalls, deploy Coturn on Ubuntu:
                </p>
                <pre className="p-3 rounded-xl bg-[#080B14] border border-[#253148] text-[#25D9F8] font-mono text-[11px] overflow-x-auto">
{`# Coturn Production Configuration
listening-port=3478
tls-listening-port=5349
fingerprint
lt-cred-mech
use-auth-secret
static-auth-secret=YOUR_HIGH_ENTROPY_SECRET
realm=turn.lumio.social
total-quota=100
bps-capacity=0
stale-nonce=600
cert=/etc/letsencrypt/live/turn.lumio.social/cert.pem
pkey=/etc/letsencrypt/live/turn.lumio.social/privkey.pem
no-stdout-log`}
                </pre>
              </div>

              <div className="p-4 rounded-2xl bg-[#121A2A] border border-[#253148] space-y-1.5">
                <h4 className="text-sm font-bold text-[#F4F7FF]">Ephemeral Credentials Generation</h4>
                <p>
                  In production, the backend generates HMAC-SHA1 short-lived credentials valid for 1 hour so the TURN server secret is never exposed to clients.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#121A2A] border border-[#253148] space-y-2">
                <h4 className="text-sm font-bold text-[#F4F7FF] font-mono flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#34D399]" />
                  Production Trust & Safety Enforcement
                </h4>
                <ul className="list-disc list-inside space-y-1.5 pl-1">
                  <li><strong>Zero Video Recording:</strong> Media feeds are never relayed or buffered to disk on servers.</li>
                  <li><strong>IP Masking:</strong> STUN reflexive IP candidates are obfuscated from client UI; partner only sees display metadata.</li>
                  <li><strong>1-Click Instant Skip & Block:</strong> Bypasses uncomfortable encounters immediately and records persistent hardware ban.</li>
                  <li><strong>Rate-Limiting (Anti-Spam):</strong> Token-bucket limiter restricts rapid skips to max 8 per 10s with automated cooldown.</li>
                  <li><strong>Strict 18+ Age Policy:</strong> Explicit consent gating enforced prior to media authorization.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'cost' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#121A2A] border border-[#253148] space-y-2">
                <h4 className="text-sm font-bold text-[#F4F7FF] font-mono flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-[#25D9F8]" />
                  Operational Capacity & Cost Projection
                </h4>
                <p>
                  Because WebRTC streams directly between peers via STUN for over 85% of sessions, server bandwidth costs remain minimal compared to centralized video streaming:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px]">
                  <div className="p-3 rounded-xl bg-[#0D1220] border border-[#253148]">
                    <span className="text-[#34D399] font-bold block mb-1">Direct P2P (85%+ of Calls)</span>
                    <span>$0.00 media egress cost. Only lightweight WebSocket signaling packets (~2 KB per session).</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0D1220] border border-[#253148]">
                    <span className="text-[#FBBF24] font-bold block mb-1">TURN Relayed (10–15% of Calls)</span>
                    <span>~500 kbps per stream. Budget ~$0.08 per GB egress on standard cloud VMs.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#253148] bg-[#080B14] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[#748198]">
            Lumio Social Production Runbook v1.0
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] text-white text-xs font-semibold cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
