import React from 'react';
import { Globe, Sliders, Activity } from 'lucide-react';
import { FilterPreferences, MatchingState, NetworkDiagnosticsStats } from '../../types';
import {
  MOCK_INTERESTS,
  MOCK_LANGUAGES,
  MOCK_REGIONS,
} from '../../data/mockData';

interface VideoChatFilterBarProps {
  filters: FilterPreferences;
  onFilterChange: (filters: FilterPreferences) => void;
  matchingState: MatchingState;
  callDuration: number;
  networkStats: NetworkDiagnosticsStats | null;
  onOpenDiagnostics: () => void;
  onOpenDeviceSettings: () => void;
  onToast: (msg: string) => void;
}

export const VideoChatFilterBar: React.FC<VideoChatFilterBarProps> = ({
  filters,
  onFilterChange,
  matchingState,
  callDuration,
  networkStats,
  onOpenDiagnostics,
  onOpenDeviceSettings,
  onToast,
}) => {
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-12 border-b border-[#253148] bg-[#0D1220] px-4 flex items-center justify-between gap-4 z-10 shrink-0">
      {/* Topic & Language Selectors */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#121A2A] border border-[#253148]">
          <span className="text-[#A5B1C7]">Topic:</span>
          <select
            value={filters.interest}
            onChange={(e) => {
              onFilterChange({ ...filters, interest: e.target.value });
              onToast(`Filter set to: ${e.target.value}`);
            }}
            className="bg-transparent text-[#25D9F8] font-semibold focus:outline-none cursor-pointer text-xs"
          >
            {MOCK_INTERESTS.map((item) => (
              <option key={item} value={item} className="bg-[#121A2A] text-[#F4F7FF]">
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#121A2A] border border-[#253148]">
          <Globe className="w-3.5 h-3.5 text-[#A5B1C7]" />
          <select
            value={filters.language}
            onChange={(e) => onFilterChange({ ...filters, language: e.target.value })}
            className="bg-transparent text-[#A5B1C7] font-medium focus:outline-none cursor-pointer text-xs"
          >
            {MOCK_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-[#121A2A] text-[#F4F7FF]">
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#121A2A] border border-[#253148]">
          <select
            value={filters.region}
            onChange={(e) => onFilterChange({ ...filters, region: e.target.value })}
            className="bg-transparent text-[#748198] font-medium focus:outline-none cursor-pointer text-xs"
          >
            {MOCK_REGIONS.map((reg) => (
              <option key={reg.code} value={reg.code} className="bg-[#121A2A] text-[#F4F7FF]">
                {reg.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* WebRTC Status, Call Timer & Hardware Settings */}
      <div className="flex items-center gap-3 shrink-0">
        {matchingState === 'matched' && (
          <button
            onClick={onOpenDiagnostics}
            className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#121A2A] hover:bg-[#192438] border border-[#253148] hover:border-[#1769FF]/60 text-xs font-mono text-[#F4F7FF] transition-colors cursor-pointer"
            title="Open WebRTC Diagnostics & TURN Config"
          >
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
            <span>{formatTimer(callDuration)}</span>
            <span className="text-[#253148]">|</span>
            <span className="text-[10px] text-[#25D9F8]">
              {networkStats ? `${networkStats.rttMs}ms` : 'STUN P2P'}
            </span>
            <Activity className="w-3.5 h-3.5 text-[#25D9F8]" />
          </button>
        )}

        <button
          onClick={onOpenDeviceSettings}
          className="p-1.5 rounded-xl text-[#A5B1C7] hover:text-[#F4F7FF] hover:bg-[#121A2A] transition-colors cursor-pointer"
          title="Audio & Video Hardware Settings"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
