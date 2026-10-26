import { useEffect } from 'react';
import { MatchingState } from '../types';

interface UseCallShortcutsParams {
  matchingState: MatchingState;
  isMuted: boolean;
  isVideoOff: boolean;
  onNextPartner: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  onToast: (msg: string) => void;
}

/**
 * Global Keyboard shortcuts for desktop speed:
 * Space / N = Next partner
 * M = Toggle microphone
 * V = Toggle camera
 * Esc = End current call
 */
export const useCallShortcuts = ({
  matchingState,
  isMuted,
  isVideoOff,
  onNextPartner,
  onToggleMute,
  onToggleVideo,
  onEndCall,
  onToast,
}: UseCallShortcutsParams) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger shortcuts while typing in inputs
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'KeyN' || (e.code === 'Space' && matchingState === 'matched')) {
        e.preventDefault();
        onNextPartner();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        onToggleMute();
        onToast(isMuted ? 'Microphone unmuted' : 'Microphone muted');
      } else if (e.code === 'KeyV') {
        e.preventDefault();
        onToggleVideo();
        onToast(isVideoOff ? 'Camera enabled' : 'Camera disabled');
      } else if (e.code === 'Escape' && matchingState !== 'idle') {
        e.preventDefault();
        onEndCall();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [matchingState, isMuted, isVideoOff, onNextPartner, onToggleMute, onToggleVideo, onEndCall, onToast]);
};
