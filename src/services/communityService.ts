import { CommunityRoom, CreateLoungePayload, LoungeMessage, LoungeParticipant, AuthUser } from '../types';
import { MOCK_COMMUNITY_ROOMS } from '../data/mockData';

const ROOMS_STORAGE_KEY = 'lumio_community_rooms';

const SEED_PARTICIPANTS: Record<string, LoungeParticipant[]> = {
  'room-1': [
    {
      id: 'p-host',
      name: 'DJ Miko',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      role: 'host',
      isMuted: false,
      isSpeaking: true,
      hasRaisedHand: false,
    },
    {
      id: 'p-spk-1',
      name: 'Yuki K.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role: 'speaker',
      isMuted: false,
      isSpeaking: false,
      hasRaisedHand: false,
    },
    {
      id: 'p-spk-2',
      name: 'Marcus V.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      role: 'speaker',
      isMuted: true,
      isSpeaking: false,
      hasRaisedHand: false,
    },
    {
      id: 'p-lis-1',
      name: 'Sarah Connor',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      role: 'listener',
      isMuted: true,
      isSpeaking: false,
      hasRaisedHand: true,
    },
    {
      id: 'p-lis-2',
      name: 'Liam Neeson',
      avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
      role: 'listener',
      isMuted: true,
      isSpeaking: false,
      hasRaisedHand: false,
    },
  ],
};

const SEED_MESSAGES: Record<string, LoungeMessage[]> = {
  'room-1': [
    {
      id: 'lm-1',
      senderId: 'p-host',
      senderName: 'DJ Miko',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      text: 'Welcome everyone to late night ambient chill! Feel free to raise your hand if you have song requests.',
      timestamp: '22:10',
    },
    {
      id: 'lm-2',
      senderId: 'p-spk-1',
      senderName: 'Yuki K.',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      text: 'The soundscape tonight is sublime 🎧',
      timestamp: '22:12',
    },
  ],
};

export class CommunityService {
  private static rooms: CommunityRoom[] | null = null;
  private static participantsState: Record<string, LoungeParticipant[]> = { ...SEED_PARTICIPANTS };
  private static messagesState: Record<string, LoungeMessage[]> = { ...SEED_MESSAGES };

  public static getRooms(): CommunityRoom[] {
    if (this.rooms) return this.rooms;

    try {
      const stored = localStorage.getItem(ROOMS_STORAGE_KEY);
      if (stored) {
        this.rooms = JSON.parse(stored);
        return this.rooms!;
      }
    } catch (e) {
      console.warn('Failed to parse community rooms storage:', e);
    }

    this.rooms = [...MOCK_COMMUNITY_ROOMS];
    this.saveRooms(this.rooms);
    return this.rooms;
  }

  public static createRoom(payload: CreateLoungePayload, host: AuthUser): CommunityRoom {
    const current = this.getRooms();
    const newRoom: CommunityRoom = {
      id: `room-${Date.now()}`,
      title: payload.title,
      description: payload.description,
      category: payload.category,
      activeCount: 1,
      maxCount: 30,
      tags: payload.tags,
      isVoiceActive: payload.isVoiceActive,
      hostAvatar: host.avatarUrl,
      hostName: host.displayName,
    };

    const updated = [newRoom, ...current];
    this.rooms = updated;
    this.saveRooms(updated);

    // Initialize host as first participant
    this.participantsState[newRoom.id] = [
      {
        id: host.id,
        name: host.displayName,
        avatarUrl: host.avatarUrl,
        role: 'host',
        isMuted: false,
        isSpeaking: false,
        hasRaisedHand: false,
      },
    ];

    this.messagesState[newRoom.id] = [
      {
        id: `lm-${Date.now()}`,
        senderId: host.id,
        senderName: host.displayName,
        senderAvatar: host.avatarUrl,
        text: `Room created: ${payload.title}. Welcome!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];

    return newRoom;
  }

  public static getParticipants(roomId: string, currentUser?: AuthUser): LoungeParticipant[] {
    const existing = this.participantsState[roomId] || [];
    if (!currentUser) return existing;

    const alreadyIn = existing.find((p) => p.id === currentUser.id);
    if (!alreadyIn) {
      const selfParticipant: LoungeParticipant = {
        id: currentUser.id,
        name: currentUser.displayName,
        avatarUrl: currentUser.avatarUrl,
        role: 'listener',
        isMuted: true,
        isSpeaking: false,
        hasRaisedHand: false,
      };
      this.participantsState[roomId] = [...existing, selfParticipant];
      return this.participantsState[roomId];
    }
    return existing;
  }

  public static toggleRaiseHand(roomId: string, userId: string): boolean {
    const list = this.participantsState[roomId] || [];
    const target = list.find((p) => p.id === userId);
    if (target) {
      target.hasRaisedHand = !target.hasRaisedHand;
      return target.hasRaisedHand;
    }
    return false;
  }

  public static toggleMute(roomId: string, userId: string): boolean {
    const list = this.participantsState[roomId] || [];
    const target = list.find((p) => p.id === userId);
    if (target) {
      target.isMuted = !target.isMuted;
      return target.isMuted;
    }
    return true;
  }

  public static promoteToSpeaker(roomId: string, participantId: string): void {
    const list = this.participantsState[roomId] || [];
    const target = list.find((p) => p.id === participantId);
    if (target) {
      target.role = 'speaker';
      target.hasRaisedHand = false;
      target.isMuted = false;
    }
  }

  public static getMessages(roomId: string): LoungeMessage[] {
    return this.messagesState[roomId] || [];
  }

  public static sendMessage(roomId: string, text: string, user: AuthUser): LoungeMessage {
    const list = this.messagesState[roomId] || [];
    const newMsg: LoungeMessage = {
      id: `lm-${Date.now()}`,
      senderId: user.id,
      senderName: user.displayName,
      senderAvatar: user.avatarUrl,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    this.messagesState[roomId] = [...list, newMsg];
    return newMsg;
  }

  private static saveRooms(rooms: CommunityRoom[]): void {
    try {
      localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(rooms));
    } catch (e) {
      console.warn('Save rooms failed:', e);
    }
  }
}
