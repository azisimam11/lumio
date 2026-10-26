import React from 'react';
import { Camera, Mic, Volume2, X, Sliders } from 'lucide-react';
import { MediaDeviceItem } from '../types';

interface DeviceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableCameras: MediaDeviceItem[];
  availableMics: MediaDeviceItem[];
  selectedCameraId: string;
  selectedMicId: string;
  isMirrored: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  onSwitchCamera: (deviceId: string) => void;
  onSwitchMic: (deviceId: string) => void;
  onToggleMirror: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
}

export const DeviceSettingsModal: React.FC<DeviceSettingsModalProps> = ({
  isOpen,
  onClose,
  availableCameras,
  availableMics,
  selectedCameraId,
  selectedMicId,
  isMirrored,
  isMuted,
  isVideoOff,
  onSwitchCamera,
  onSwitchMic,
  onToggleMirror,
  onToggleMute,
  onToggleVideo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080B14]/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0D1220] border border-[#253148] rounded-3xl p-6 shadow-2xl text-[#F4F7FF]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-[#A5B1C7] hover:text-[#F4F7FF] hover:bg-[#121A2A] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-[#253148] pb-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#121A2A] text-[#25D9F8] flex items-center justify-center border border-[#253148]">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#F4F7FF]">Audio & Video Hardware</h3>
            <p className="text-xs text-[#A5B1C7]">
              Live hardware device configuration (Stage 3 WebRTC)
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Camera Selector */}
          <div>
            <label className="text-xs font-medium text-[#A5B1C7] flex items-center gap-2 mb-1.5">
              <Camera className="w-4 h-4 text-[#25D9F8]" />
              Camera Device
            </label>
            <select
              value={selectedCameraId}
              onChange={(e) => onSwitchCamera(e.target.value)}
              className="w-full text-xs bg-[#121A2A] border border-[#253148] rounded-xl p-2.5 text-[#F4F7FF] focus:outline-none focus:border-[#1769FF]"
            >
              {availableCameras.length > 0 ? (
                availableCameras.map((cam) => (
                  <option key={cam.deviceId} value={cam.deviceId} className="bg-[#121A2A]">
                    {cam.label}
                  </option>
                ))
              ) : (
                <option value="" className="bg-[#121A2A]">Default System Webcam</option>
              )}
            </select>
          </div>

          {/* Microphone Selector */}
          <div>
            <label className="text-xs font-medium text-[#A5B1C7] flex items-center gap-2 mb-1.5">
              <Mic className="w-4 h-4 text-[#25D9F8]" />
              Microphone Device
            </label>
            <select
              value={selectedMicId}
              onChange={(e) => onSwitchMic(e.target.value)}
              className="w-full text-xs bg-[#121A2A] border border-[#253148] rounded-xl p-2.5 text-[#F4F7FF] focus:outline-none focus:border-[#1769FF]"
            >
              {availableMics.length > 0 ? (
                availableMics.map((mic) => (
                  <option key={mic.deviceId} value={mic.deviceId} className="bg-[#121A2A]">
                    {mic.label}
                  </option>
                ))
              ) : (
                <option value="" className="bg-[#121A2A]">Default System Microphone</option>
              )}
            </select>

            {/* Mic Meter */}
            <div className="mt-2 flex items-center gap-2 text-[11px] text-[#A5B1C7]">
              <span>Input meter:</span>
              <div className="flex-1 h-1.5 bg-[#121A2A] rounded-full overflow-hidden flex">
                <div
                  className={`h-full transition-all duration-300 ${
                    isMuted ? 'w-0 bg-[#748198]' : 'w-3/4 bg-gradient-to-r from-[#34D399] to-[#25D9F8]'
                  }`}
                />
              </div>
              <span className="text-[10px] text-[#748198] font-mono">
                {isMuted ? 'MUTED' : 'ACTIVE'}
              </span>
            </div>
          </div>

          {/* Mirror Video Toggle */}
          <div className="pt-2 border-t border-[#253148] flex items-center justify-between">
            <span className="text-xs text-[#A5B1C7]">Mirror local webcam stream</span>
            <button
              type="button"
              onClick={onToggleMirror}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                isMirrored ? 'bg-[#1769FF]' : 'bg-[#192438]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isMirrored ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Quick Hardware Toggles */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onToggleMute}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                isMuted
                  ? 'bg-[#121A2A] border-[#FB7185]/60 text-[#FB7185]'
                  : 'bg-[#121A2A] border-[#253148] text-[#F4F7FF] hover:bg-[#192438]'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              {isMuted ? 'Unmute Audio' : 'Mute Audio'}
            </button>
            <button
              onClick={onToggleVideo}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                isVideoOff
                  ? 'bg-[#121A2A] border-[#FB7185]/60 text-[#FB7185]'
                  : 'bg-[#121A2A] border-[#253148] text-[#F4F7FF] hover:bg-[#192438]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              {isVideoOff ? 'Enable Video' : 'Disable Video'}
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-5 border-t border-[#253148] mt-5">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1769FF] hover:bg-[#3B82F6] text-white shadow-lg shadow-[#1769FF]/30 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
