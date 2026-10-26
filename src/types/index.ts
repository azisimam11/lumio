export type AppView =
  | 'landing'
  | 'video-chat'
  | 'community'
  | 'safety'
  | 'friends'
  | 'profile'
  | 'not-found';

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  bio: string;
  country: string;
  languages: string[];
  interests: string[];
  isGuest: boolean;
  createdAt: string;
}

export interface FriendItem {
  id: string;
  profile: UserProfile;
  status: 'accepted' | 'pending';
  addedAt: number;
  lastMessage?: string;
  lastActive: string;
  isOnline: boolean;
}

export interface DirectMessage {
  id: string;
  conversationWith: string;
  sender: 'me' | 'friend';
  text: string;
  timestamp: string;
}

export type MatchingState = 'idle' | 'searching' | 'matched' | 'connecting' | 'connected' | 'ended';

export interface MatchingSessionInfo {
  roomId: string;
  partnerId: string;
  matchedAt: number;
  compatibilityScore: number;
  commonInterests: string[];
}

export type MediaPermissionStatus =
  | 'idle'
  | 'requesting'
  | 'granted'
  | 'denied'
  | 'unavailable'
  | 'error';

export type PeerConnectionState =
  | 'new'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'failed'
  | 'closed';

export interface NetworkDiagnosticsStats {
  rttMs: number;
  packetLossPercent: number;
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
  candidateType: 'host' | 'srflx' | 'relay';
  protocol: 'udp' | 'tcp';
  resolution: string;
  frameRate: number;
  turnRelayActive: boolean;
}

export interface TurnServerConfig {
  urls: string;
  username?: string;
  credential?: string;
}

export interface MediaDeviceItem {
  deviceId: string;
  label: string;
  kind: 'audioinput' | 'videoinput' | 'audiooutput';
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  country: string;
  countryCode: string;
  avatarUrl: string;
  interests: string[];
  bio: string;
  languages: string[];
  isVerified?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'partner' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface FilterPreferences {
  interest: string;
  language: string;
  region: string;
}

export interface CommunityRoom {
  id: string;
  title: string;
  description: string;
  category: string;
  activeCount: number;
  maxCount: number;
  tags: string[];
  isVoiceActive: boolean;
  hostAvatar: string;
  hostName: string;
}

export interface LoungeParticipant {
  id: string;
  name: string;
  avatarUrl: string;
  role: 'host' | 'speaker' | 'listener';
  isMuted: boolean;
  isSpeaking: boolean;
  hasRaisedHand: boolean;
}

export interface LoungeMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
}

export interface CreateLoungePayload {
  title: string;
  description: string;
  category: string;
  tags: string[];
  isVoiceActive: boolean;
}

export type ReportReason =
  | 'inappropriate_video'
  | 'harassment'
  | 'underage'
  | 'hate_speech'
  | 'spam_commercial'
  | 'other';
