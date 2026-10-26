import { useState, useEffect, useCallback } from 'react';
import { CommunityService } from '../services/communityService';
import { CommunityRoom, LoungeMessage, LoungeParticipant } from '../types';
import { useAuth } from './useAuth';

export function useCommunityLounge(room: CommunityRoom | null) {
  const { user } = useAuth();
  const [participants, setParticipants] = useState<LoungeParticipant[]>([]);
  const [messages, setMessages] = useState<LoungeMessage[]>([]);
  const [hasRaisedHand, setHasRaisedHand] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Initialize room data when room opens
  useEffect(() => {
    if (!room) {
      setParticipants([]);
      setMessages([]);
      return;
    }

    const initialParticipants = CommunityService.getParticipants(room.id, user);
    setParticipants([...initialParticipants]);

    const initialMessages = CommunityService.getMessages(room.id);
    setMessages([...initialMessages]);

    const me = initialParticipants.find((p) => p.id === user.id);
    if (me) {
      setIsMuted(me.isMuted);
      setHasRaisedHand(me.hasRaisedHand);
    }
  }, [room, user]);

  const toggleRaiseHand = useCallback(() => {
    if (!room) return;
    const newState = CommunityService.toggleRaiseHand(room.id, user.id);
    setHasRaisedHand(newState);
    setParticipants([...CommunityService.getParticipants(room.id)]);
  }, [room, user.id]);

  const toggleMute = useCallback(() => {
    if (!room) return;
    const newState = CommunityService.toggleMute(room.id, user.id);
    setIsMuted(newState);
    setParticipants([...CommunityService.getParticipants(room.id)]);
  }, [room, user.id]);

  const promoteSpeaker = useCallback(
    (participantId: string) => {
      if (!room) return;
      CommunityService.promoteToSpeaker(room.id, participantId);
      setParticipants([...CommunityService.getParticipants(room.id)]);
    },
    [room]
  );

  const sendMessage = useCallback(
    (text: string) => {
      if (!room || !text.trim()) return;
      const newMsg = CommunityService.sendMessage(room.id, text.trim(), user);
      setMessages((prev) => [...prev, newMsg]);
    },
    [room, user]
  );

  return {
    participants,
    messages,
    hasRaisedHand,
    isMuted,
    toggleRaiseHand,
    toggleMute,
    promoteSpeaker,
    sendMessage,
  };
}
