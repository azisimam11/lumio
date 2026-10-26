import { useState, useEffect, useRef, useCallback } from 'react';
import { WebRTCService } from '../services/webrtcService';
import { NetworkDiagnosticsStats, PeerConnectionState, TurnServerConfig } from '../types';

interface UseWebRTCProps {
  localStream: MediaStream | null;
  turnServers?: TurnServerConfig[];
  onRemoteConnected?: () => void;
  onRemoteDisconnected?: () => void;
}

export function useWebRTC({
  localStream,
  turnServers = [],
  onRemoteConnected,
  onRemoteDisconnected,
}: UseWebRTCProps) {
  const [peerState, setPeerState] = useState<PeerConnectionState>('new');
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [iceCandidateCount, setIceCandidateCount] = useState(0);
  const [networkStats, setNetworkStats] = useState<NetworkDiagnosticsStats | null>(null);

  const webrtcServiceRef = useRef<WebRTCService | null>(null);

  /**
   * Initialize WebRTC peer connection and simulate standard SDP & ICE exchange
   */
  const initiatePeerConnection = useCallback(
    async (partnerId: string) => {
      setPeerState('connecting');
      setIceCandidateCount(0);

      // Clean up any existing connection
      if (webrtcServiceRef.current) {
        webrtcServiceRef.current.cleanup();
      }

      const service = new WebRTCService(
        {
          onRemoteStream: (stream) => {
            setRemoteStream(stream);
          },
          onConnectionStateChange: (state) => {
            setPeerState(state);
            if (state === 'connected' && onRemoteConnected) {
              onRemoteConnected();
            } else if (
              (state === 'disconnected' || state === 'failed' || state === 'closed') &&
              onRemoteDisconnected
            ) {
              onRemoteDisconnected();
            }
          },
          onIceCandidate: (_candidate) => {
            setIceCandidateCount((prev) => prev + 1);
          },
        },
        turnServers
      );

      webrtcServiceRef.current = service;
      service.initialize(localStream);

      try {
        const offer = await service.createOffer();

        setTimeout(async () => {
          if (service.getConnection()) {
            setPeerState('connected');
            const stats = await service.getNetworkStats();
            setNetworkStats(stats);
            if (onRemoteConnected) onRemoteConnected();
          }
        }, 800);

        return offer;
      } catch (err) {
        console.warn('WebRTC negotiation exception:', err);
        setPeerState('failed');
      }
    },
    [localStream, turnServers, onRemoteConnected, onRemoteDisconnected]
  );

  /**
   * Teardown peer connection on skip / end
   */
  const closePeerConnection = useCallback(() => {
    if (webrtcServiceRef.current) {
      webrtcServiceRef.current.cleanup();
      webrtcServiceRef.current = null;
    }
    setPeerState('closed');
    setRemoteStream(null);
    setIceCandidateCount(0);
    setNetworkStats(null);
  }, []);

  /**
   * Request ICE restart
   */
  const restartIce = useCallback(async () => {
    if (webrtcServiceRef.current) {
      await webrtcServiceRef.current.restartIce();
    }
  }, []);

  // Poll network stats while connected
  useEffect(() => {
    let interval: any;
    if (peerState === 'connected') {
      interval = setInterval(async () => {
        if (webrtcServiceRef.current) {
          const stats = await webrtcServiceRef.current.getNetworkStats();
          setNetworkStats(stats);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [peerState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (webrtcServiceRef.current) {
        webrtcServiceRef.current.cleanup();
      }
    };
  }, []);

  return {
    peerState,
    remoteStream,
    iceCandidateCount,
    networkStats,
    initiatePeerConnection,
    closePeerConnection,
    restartIce,
  };
}
