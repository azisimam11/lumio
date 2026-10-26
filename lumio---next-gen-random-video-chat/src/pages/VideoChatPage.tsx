import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { ChatMessage, FilterPreferences, ReportReason } from '../types';
import { useUserMedia } from '../hooks/useUserMedia';
import { useWebRTC } from '../hooks/useWebRTC';
import { useRandomMatching } from '../hooks/useRandomMatching';
import { useFriends } from '../hooks/useFriends';
import { useCallShortcuts } from '../hooks/useCallShortcuts';
import { LocalVideoPreview } from '../components/video/LocalVideoPreview';
import { RemoteVideoViewport } from '../components/video/RemoteVideoViewport';
import { VideoControlDock } from '../components/video/VideoControlDock';
import { VideoChatFilterBar } from '../components/video/VideoChatFilterBar';
import { InCallChatDrawer } from '../components/chat/InCallChatDrawer';
import { SafetyModal } from '../components/SafetyModal';
import { DeviceSettingsModal } from '../components/DeviceSettingsModal';
import { NetworkDiagnosticsModal } from '../components/video/NetworkDiagnosticsModal';
import { DeploymentRunbookModal } from '../components/safety/DeploymentRunbookModal';

interface VideoChatPageProps {
  onNavigateSafety: () => void;
  initialTopic?: string;
}

export const VideoChatPage: React.FC<VideoChatPageProps> = ({ initialTopic = 'All Topics' }) => {
  const [callDuration, setCallDuration] = useState(0);

  // Filters
  const [filters, setFilters] = useState<FilterPreferences>({
    interest: initialTopic,
    language: 'any',
    region: 'global',
  });

  // UI Panels
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isDiagnosticsModalOpen, setIsDiagnosticsModalOpen] = useState(false);
  const [isRunbookOpen, setIsRunbookOpen] = useState(false);

  // In-call Text Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Real Hardware UserMedia Hook (Tahap 2)
  const {
    stream,
    permissionStatus,
    errorMessage,
    isMuted,
    isVideoOff,
    isMirrored,
    availableCameras,
    availableMics,
    selectedCameraId,
    selectedMicId,
    startMedia,
    stopMedia,
    toggleMute,
    toggleVideo,
    toggleMirror,
    switchCamera,
    switchMic,
  } = useUserMedia();

  // WebRTC Peer Connection Hook (Tahap 3 & 7)
  const {
    peerState,
    networkStats,
    initiatePeerConnection,
    closePeerConnection,
    restartIce,
  } = useWebRTC({
    localStream: stream,
    onRemoteConnected: () => {
      showToast('WebRTC STUN session connected');
    },
    onRemoteDisconnected: () => {
      showToast('Peer disconnected');
    },
  });

  // Random Matching Engine Hook (Tahap 4)
  const {
    matchingState,
    currentPartner,
    currentSession,
    searchDuration,
    rateLimitCountdown,
    startSearch,
    skipPartner,
    endCall,
    blockPartner,
  } = useRandomMatching({
    onMatchFound: async (partner, session) => {
      // Negotiate WebRTC P2P connection with the matched peer
      await initiatePeerConnection(partner.id);

      setChatMessages([
        {
          id: `sys-${Date.now()}`,
          sender: 'system',
          senderName: 'Lumio System',
          text: `Matched with ${partner.name} from ${partner.country}! (${session.compatibilityScore}% Compatibility)`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    },
    onCallEnded: () => {
      closePeerConnection();
    },
    onRateLimited: (msg) => {
      showToast(msg);
    },
  });

  const { isFriend, addFriend } = useFriends();

  // Call duration counter
  useEffect(() => {
    let interval: any;
    if (matchingState === 'matched') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [matchingState]);

  // Next Partner (Skip with anti-spam check)
  const handleNextPartner = () => {
    closePeerConnection();
    skipPartner();
  };

  // End Call
  const handleEndCall = () => {
    closePeerConnection();
    endCall();
  };

  // Start Searching with filter & auto-prompt camera
  const handleStartSearch = async () => {
    if (permissionStatus === 'idle') {
      await startMedia();
    }
    setChatMessages([]);
    startSearch(filters);
  };

  // Global Keyboard Shortcuts (Space/N = Next, M = Mic, V = Video, Esc = End)
  useCallShortcuts({
    matchingState,
    isMuted,
    isVideoOff,
    onNextPartner: handleNextPartner,
    onToggleMute: toggleMute,
    onToggleVideo: toggleVideo,
    onEndCall: handleEndCall,
    onToast: showToast,
  });

  // Send message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || matchingState !== 'matched' || !currentPartner) return;

    const userText = chatInput.trim();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      senderName: 'You',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    setTimeout(() => {
      const responses = [
        `Hey! Great to connect! Love discussing ${filters.interest !== 'All Topics' ? filters.interest : 'creative topics'}!`,
        'Nice meeting you! Crystal clear video feed 🚀',
        'Greetings! What timezone are you currently in?',
        'Haha definitely agree on that point!',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      setChatMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: 'partner',
          senderName: currentPartner.name,
          text: randomResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1400);
  };

  const handleReportSubmit = (reason: ReportReason, details: string, block: boolean) => {
    if (block && currentPartner) {
      blockPartner(currentPartner.id);
      showToast(`User blocked. Searching for next peer...`);
    } else {
      showToast(`Report received. Skipping peer...`);
      skipPartner();
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-[#080B14]">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-[#121A2A] border border-[#1769FF]/60 text-[#25D9F8] text-xs font-medium shadow-xl flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-[#25D9F8]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Filter & WebRTC Status Bar (Modular Component) */}
      <VideoChatFilterBar
        filters={filters}
        onFilterChange={setFilters}
        matchingState={matchingState}
        callDuration={callDuration}
        networkStats={networkStats}
        onOpenDiagnostics={() => setIsDiagnosticsModalOpen(true)}
        onOpenDeviceSettings={() => setIsDeviceModalOpen(true)}
        onToast={showToast}
      />

      {/* Main Studio Body: Viewports + In-Call Chat Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 relative flex flex-col p-3 sm:p-4 overflow-hidden">
          {/* Split Video Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 h-full min-h-0">
            {/* 1. Remote Stranger Viewport with Queue Timer & Match Info */}
            <RemoteVideoViewport
              matchingState={matchingState}
              currentPartner={currentPartner}
              selectedInterest={filters.interest}
              searchDuration={searchDuration}
              compatibilityScore={currentSession?.compatibilityScore || 85}
              roomId={currentSession?.roomId}
              rateLimitCountdown={rateLimitCountdown}
              isFriend={currentPartner ? isFriend(currentPartner.id) : false}
              onAddFriend={() => {
                if (currentPartner) {
                  addFriend(currentPartner);
                  showToast(`${currentPartner.name} added to your friends list!`);
                }
              }}
              onStartSearch={handleStartSearch}
              onCancelSearch={handleEndCall}
              onOpenReportModal={() => setIsSafetyModalOpen(true)}
            />

            {/* 2. Real Local Camera Stream Preview (Tahap 2) */}
            <LocalVideoPreview
              stream={stream}
              permissionStatus={permissionStatus}
              errorMessage={errorMessage}
              isMuted={isMuted}
              isVideoOff={isVideoOff}
              isMirrored={isMirrored}
              onStartMedia={() => startMedia()}
              onStopMedia={stopMedia}
              onToggleMirror={toggleMirror}
              onToggleVideo={toggleVideo}
            />
          </div>

          {/* Floating Action Dock */}
          <VideoControlDock
            matchingState={matchingState}
            isMuted={isMuted}
            isVideoOff={isVideoOff}
            isChatOpen={isChatOpen}
            onNextPartner={handleNextPartner}
            onEndCall={handleEndCall}
            onToggleMute={toggleMute}
            onToggleVideo={toggleVideo}
            onToggleChat={() => setIsChatOpen(!isChatOpen)}
            onOpenDeviceSettings={() => setIsDeviceModalOpen(true)}
          />
        </div>

        {/* In-Call Text Chat Drawer */}
        <InCallChatDrawer
          isOpen={isChatOpen}
          matchingState={matchingState}
          messages={chatMessages}
          chatInput={chatInput}
          onInputChange={setChatInput}
          onSendMessage={handleSendMessage}
          onSelectIcebreaker={(prompt) => setChatInput(prompt)}
        />
      </div>

      {/* Safety & Report Modal */}
      <SafetyModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
        partnerName={currentPartner ? currentPartner.name : 'Current Stranger'}
        onSubmitReport={handleReportSubmit}
      />

      {/* Device Hardware Configuration Modal */}
      <DeviceSettingsModal
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
        availableCameras={availableCameras}
        availableMics={availableMics}
        selectedCameraId={selectedCameraId}
        selectedMicId={selectedMicId}
        isMirrored={isMirrored}
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        onSwitchCamera={switchCamera}
        onSwitchMic={switchMic}
        onToggleMirror={toggleMirror}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
      />

      {/* WebRTC Diagnostics & TURN Configuration Modal (Tahap 7) */}
      <NetworkDiagnosticsModal
        isOpen={isDiagnosticsModalOpen}
        onClose={() => setIsDiagnosticsModalOpen(false)}
        stats={networkStats}
        onRestartIce={restartIce}
        onOpenRunbook={() => setIsRunbookOpen(true)}
      />

      {/* Production Architecture & Coturn Runbook Modal (Tahap 7) */}
      <DeploymentRunbookModal
        isOpen={isRunbookOpen}
        onClose={() => setIsRunbookOpen(false)}
      />
    </div>
  );
};
