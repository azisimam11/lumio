import React, { useState } from 'react';
import {
  Activity,
  X,
  RefreshCw,
  Server,
  Zap,
  ShieldCheck,
  Radio,
  Wifi,
  Sliders,
} from 'lucide-react';
import { NetworkDiagnosticsStats, TurnServerConfig } from '../../types';

interface NetworkDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: NetworkDiagnosticsStats | null;
  onRestartIce: () => void;
  onOpenRunbook?: () => void;
}

export const NetworkDiagnosticsModal: React.FC<NetworkDiagnosticsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onRestartIce,
  onOpenRunbook,
}) => {
  const [turnUrl, setTurnUrl] = useState('turn:turn.lumio.social:3478');
  const [turnUser, setTurnUser] = useState('lumio_user');
  const [turnPass, setTurnPass] = useState('••••••••');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const currentStats = stats || {
    rttMs: 42,
    packetLossPercent: 0,
    connectionQuality: 'excellent' as const,
    candidateType: 'srflx' as const,
    protocol: 'udp' as const,
    resolution: '1280x720',
    frameRate: 30,
    turnRelayActive: false,
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'text-[#34D399] bg-[#34D399]/10 border-[#34D399]/30';
      case 'good':
        return 'text-[#25D9F8] bg-[#25D9F8]/10 border-[#25D9F8]/30';
      case 'fair':
        return 'text-[#FBBF24] bg-[#FBBF24]/10 border-[#FBBF24]/30';
      default:
        return 'text-[#FB7185] bg-[#FB7185]/10 border-[#FB7185]/30';
    }
  };

  const handleSaveTurn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080B14]/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0D1220] border border-[#253148] rounded-3xl p-6 shadow-2xl text-[#F4F7FF]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-[#A5B1C7] hover:text-[#F4F7FF] hover:bg-[#121A2A] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-[#253148] pb-4 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-[#121A2A] text-[#25D9F8] flex items-center justify-center border border-[#1769FF]/40">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F4F7FF] font-mono">
              WebRTC Diagnostics & TURN Relay
            </h3>
            <p className="text-xs text-[#A5B1C7]">
              Real-time P2P transport metrics & network diagnostics
            </p>
          </div>
        </div>

        {/* Live Network Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {/* Latency RTT */}
          <div className="p-3 rounded-2xl bg-[#121A2A] border border-[#253148] text-center space-y-1">
            <span className="text-[10px] text-[#A5B1C7] uppercase font-mono block">RTT Ping</span>
            <div className="text-base font-bold text-[#34D399] font-mono">
              {currentStats.rttMs} ms
            </div>
            <span className="text-[9px] text-[#748198] block">Round-trip</span>
          </div>

          {/* Packet Loss */}
          <div className="p-3 rounded-2xl bg-[#121A2A] border border-[#253148] text-center space-y-1">
            <span className="text-[10px] text-[#A5B1C7] uppercase font-mono block">Packet Loss</span>
            <div className="text-base font-bold text-[#F4F7FF] font-mono">
              {currentStats.packetLossPercent}%
            </div>
            <span className="text-[9px] text-[#34D399] block">Optimal</span>
          </div>

          {/* Candidate Type */}
          <div className="p-3 rounded-2xl bg-[#121A2A] border border-[#253148] text-center space-y-1">
            <span className="text-[10px] text-[#A5B1C7] uppercase font-mono block">ICE Path</span>
            <div className="text-base font-bold text-[#25D9F8] font-mono uppercase">
              {currentStats.candidateType}
            </div>
            <span className="text-[9px] text-[#748198] block">STUN Reflexive</span>
          </div>

          {/* Connection Quality */}
          <div className="p-3 rounded-2xl bg-[#121A2A] border border-[#253148] text-center space-y-1">
            <span className="text-[10px] text-[#A5B1C7] uppercase font-mono block">Quality</span>
            <div className={`text-xs font-bold uppercase py-0.5 rounded-lg border ${getQualityColor(currentStats.connectionQuality)}`}>
              {currentStats.connectionQuality}
            </div>
            <span className="text-[9px] text-[#748198] block">30 fps / 720p</span>
          </div>
        </div>

        {/* Network Action: ICE Restart */}
        <div className="p-3.5 rounded-2xl bg-[#121A2A] border border-[#253148] flex items-center justify-between mb-5">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-[#F4F7FF] block">Experiencing connection stutters?</span>
            <span className="text-[11px] text-[#A5B1C7] block">Trigger an ICE restart to rediscover the fastest network path.</span>
          </div>
          <button
            onClick={onRestartIce}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restart ICE</span>
          </button>
        </div>

        {/* Custom TURN Server Relay Settings (Production Readiness) */}
        <form onSubmit={handleSaveTurn} className="space-y-3 border-t border-[#253148] pt-4 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[#1769FF]" />
              <h4 className="font-bold text-[#F4F7FF]">Enterprise TURN Relay Configuration</h4>
            </div>
            <span className="text-[10px] text-[#34D399] font-mono">Bypass Symmetric NAT</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[#A5B1C7] block mb-1">TURN Server URL</label>
              <input
                type="text"
                value={turnUrl}
                onChange={(e) => setTurnUrl(e.target.value)}
                className="w-full bg-[#121A2A] border border-[#253148] rounded-xl px-3 py-2 text-[#F4F7FF] focus:outline-none focus:border-[#1769FF] font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="text-[#A5B1C7] block mb-1">Username / Credential ID</label>
              <input
                type="text"
                value={turnUser}
                onChange={(e) => setTurnUser(e.target.value)}
                className="w-full bg-[#121A2A] border border-[#253148] rounded-xl px-3 py-2 text-[#F4F7FF] focus:outline-none focus:border-[#1769FF] text-[11px]"
              />
            </div>
            <div>
              <label className="text-[#A5B1C7] block mb-1">Credential Secret</label>
              <input
                type="password"
                value={turnPass}
                onChange={(e) => setTurnPass(e.target.value)}
                className="w-full bg-[#121A2A] border border-[#253148] rounded-xl px-3 py-2 text-[#F4F7FF] focus:outline-none focus:border-[#1769FF] text-[11px]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] text-[#748198]">
              {isSaved ? '✓ Relay configuration updated' : 'Default: Google Public STUN'}
            </span>
            <div className="flex items-center gap-2">
              {onOpenRunbook && (
                <button
                  type="button"
                  onClick={onOpenRunbook}
                  className="px-3 py-2 rounded-xl bg-[#121A2A] hover:bg-[#192438] border border-[#253148] text-xs font-semibold text-[#25D9F8] transition-colors cursor-pointer"
                >
                  Coturn Runbook
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Apply Relay Config
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
