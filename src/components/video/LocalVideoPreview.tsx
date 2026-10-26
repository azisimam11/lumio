import React, { useRef, useEffect } from 'react';
import {
  Camera,
  VideoOff,
  MicOff,
  RotateCw,
  AlertCircle,
  PowerOff,
  Loader2,
  Lock,
} from 'lucide-react';
import { MediaPermissionStatus } from '../../types';

interface LocalVideoPreviewProps {
  stream: MediaStream | null;
  permissionStatus: MediaPermissionStatus;
  errorMessage: string | null;
  isMuted: boolean;
  isVideoOff: boolean;
  isMirrored: boolean;
  onStartMedia: () => void;
  onStopMedia: () => void;
  onToggleMirror: () => void;
  onToggleVideo: () => void;
}

export const LocalVideoPreview: React.FC<LocalVideoPreviewProps> = ({
  stream,
  permissionStatus,
  errorMessage,
  isMuted,
  isVideoOff,
  isMirrored,
  onStartMedia,
  onStopMedia,
  onToggleMirror,
  onToggleVideo,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Bind MediaStream to HTML5 video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#0D1220] border border-[#253148] flex items-center justify-center shadow-inner h-full min-h-[260px]">
      {/* 1. GRANTED: REAL WEBCAM ACTIVE */}
      {permissionStatus === 'granted' && stream ? (
        <div className="w-full h-full relative flex items-center justify-center bg-[#080B14]">
          {/* Real HTML5 Video element */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${isMirrored ? 'scale-x-[-1]' : ''} ${
              isVideoOff ? 'hidden' : 'block'
            }`}
          />

          {/* Fallback if user temporarily toggled camera off */}
          {isVideoOff && (
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#121A2A] border border-[#253148] flex items-center justify-center text-[#748198]">
                <VideoOff className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-[#A5B1C7]">
                Camera feed paused
              </span>
              <button
                onClick={onToggleVideo}
                className="px-3.5 py-1.5 rounded-xl bg-[#121A2A] border border-[#1769FF]/60 text-[#25D9F8] text-xs hover:bg-[#192438] transition-colors cursor-pointer"
              >
                Turn On Camera
              </button>
            </div>
          )}

          {/* Top-Left Watermark */}
          <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#080B14]/80 backdrop-blur-md border border-[#253148] text-[11px] text-[#F4F7FF]">
            <span className="w-2 h-2 rounded-full bg-[#25D9F8] animate-pulse" />
            <span className="font-medium text-[#F4F7FF]">You (Live Local Stream)</span>
          </div>

          {/* Audio Mute Status indicator */}
          {isMuted && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-xl bg-[#121A2A]/90 border border-[#FB7185]/60 text-[11px] text-[#FB7185] flex items-center gap-1.5 font-medium">
              <MicOff className="w-3 h-3" />
              <span>MUTED</span>
            </div>
          )}

          {/* Bottom Controls Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            {/* Kill stream button */}
            <button
              onClick={onStopMedia}
              className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#121A2A]/90 hover:bg-[#192438] border border-[#FB7185]/50 text-[11px] text-[#FB7185] font-medium transition-colors cursor-pointer"
              title="Stop all media tracks completely"
            >
              <PowerOff className="w-3 h-3" />
              <span>Turn Off Hardware</span>
            </button>

            {/* Mirror / Flip button */}
            <button
              onClick={onToggleMirror}
              className="pointer-events-auto p-2 rounded-xl bg-[#121A2A]/80 backdrop-blur-md border border-[#253148] text-[#A5B1C7] hover:text-[#F4F7FF] hover:bg-[#192438] transition-colors cursor-pointer"
              title="Flip / Mirror local preview"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : permissionStatus === 'requesting' ? (
        /* 2. REQUESTING PERMISSION STATE */
        <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
          <Loader2 className="w-8 h-8 text-[#25D9F8] animate-spin" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-[#F4F7FF]">
              Requesting Camera & Mic Access...
            </h4>
            <p className="text-xs text-[#A5B1C7] max-w-xs">
              Please click <strong className="text-[#25D9F8]">"Allow"</strong> on your browser prompt to enable your video preview.
            </p>
          </div>
        </div>
      ) : permissionStatus === 'denied' ? (
        /* 3. PERMISSION DENIED STATE */
        <div className="flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#121A2A] border border-[#FB7185]/50 flex items-center justify-center text-[#FB7185]">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#F4F7FF]">
              Camera Permission Denied
            </h4>
            <p className="text-xs text-[#A5B1C7] leading-relaxed">
              {errorMessage || 'Browser camera access was blocked. Click the lock/camera icon in your address bar to allow access.'}
            </p>
          </div>
          <button
            onClick={onStartMedia}
            className="px-4 py-2 rounded-xl bg-[#121A2A] hover:bg-[#192438] border border-[#253148] text-xs font-semibold text-[#F4F7FF] transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : permissionStatus === 'unavailable' ? (
        /* 4. HARDWARE UNAVAILABLE / NOT FOUND */
        <div className="flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#121A2A] border border-[#FBBF24]/50 flex items-center justify-center text-[#FBBF24]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#F4F7FF]">
              No Camera Detected
            </h4>
            <p className="text-xs text-[#A5B1C7] leading-relaxed">
              No webcam or video capture device was found. Connect an external camera or check system permissions.
            </p>
          </div>
          <button
            onClick={onStartMedia}
            className="px-4 py-2 rounded-xl bg-[#121A2A] hover:bg-[#192438] border border-[#253148] text-xs font-semibold text-[#F4F7FF] transition-colors cursor-pointer"
          >
            Check Again
          </button>
        </div>
      ) : (
        /* 5. IDLE STATE */
        <div className="flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#121A2A] border border-[#1769FF]/40 flex items-center justify-center text-[#25D9F8]">
            <Camera className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#F4F7FF]">
              Local Camera Preview
            </h4>
            <p className="text-xs text-[#A5B1C7] leading-relaxed">
              Enable your camera to preview your video and audio stream before meeting strangers.
            </p>
          </div>
          <button
            onClick={onStartMedia}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] text-white text-xs font-bold shadow-lg shadow-[#1769FF]/30 transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4 stroke-[2.2]" />
            Enable Camera & Mic
          </button>
        </div>
      )}
    </div>
  );
};
