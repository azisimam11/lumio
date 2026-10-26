import { DirectMessage, FriendItem, UserProfile } from '../types';
import { MOCK_PARTNERS } from '../data/mockData';

const FRIENDS_STORAGE_KEY = 'lumio_friends_list';
const DM_STORAGE_KEY = 'lumio_direct_messages';

const INITIAL_FRIENDS: FriendItem[] = [
  {
    id: 'friend-1',
    profile: MOCK_PARTNERS[0], // Kenji S.
    status: 'accepted',
    addedAt: Date.now() - 3600000 * 24,
    lastMessage: 'Awesome chat yesterday! Let me know when you stream next.',
    lastActive: '5m ago',
    isOnline: true,
  },
  {
    id: 'friend-2',
    profile: MOCK_PARTNERS[1], // Elena Rostova
    status: 'accepted',
    addedAt: Date.now() - 3600000 * 48,
    lastMessage: 'Check out that lo-fi playlist we talked about!',
    lastActive: '2h ago',
    isOnline: false,
  },
  {
    id: 'friend-3',
    profile: MOCK_PARTNERS[3], // Sofia Gomez
    status: 'accepted',
    addedAt: Date.now() - 3600000 * 12,
    lastMessage: 'Barcelona is sunny today! How are your projects coming along?',
    lastActive: 'Just now',
    isOnline: true,
  },
];

const INITIAL_MESSAGES: DirectMessage[] = [
  {
    id: 'dm-1',
    conversationWith: 'partner-1',
    sender: 'friend',
    text: 'Hey! Loved the synth recommendations from our call.',
    timestamp: 'Yesterday, 18:40',
  },
  {
    id: 'dm-2',
    conversationWith: 'partner-1',
    sender: 'me',
    text: 'Glad you liked them! The analog filters make all the difference.',
    timestamp: 'Yesterday, 18:42',
  },
  {
    id: 'dm-3',
    conversationWith: 'partner-1',
    sender: 'friend',
    text: 'Awesome chat yesterday! Let me know when you stream next.',
    timestamp: 'Yesterday, 18:45',
  },
];

export class FriendsService {
  private static friends: FriendItem[] | null = null;
  private static messages: DirectMessage[] | null = null;

  public static getFriends(): FriendItem[] {
    if (this.friends) return this.friends;

    try {
      const stored = localStorage.getItem(FRIENDS_STORAGE_KEY);
      if (stored) {
        this.friends = JSON.parse(stored);
        return this.friends!;
      }
    } catch (e) {
      console.warn('Failed to parse friends storage:', e);
    }

    this.friends = INITIAL_FRIENDS;
    this.saveFriends(this.friends);
    return this.friends;
  }

  public static addFriend(profile: UserProfile): FriendItem {
    const current = this.getFriends();
    const existing = current.find((f) => f.profile.id === profile.id);
    if (existing) return existing;

    const newFriend: FriendItem = {
      id: `friend-${Date.now()}`,
      profile,
      status: 'accepted',
      addedAt: Date.now(),
      lastMessage: 'Connected via Random Video Matching.',
      lastActive: 'Just now',
      isOnline: true,
    };

    const updated = [newFriend, ...current];
    this.friends = updated;
    this.saveFriends(updated);
    return newFriend;
  }

  public static removeFriend(friendId: string): void {
    const current = this.getFriends();
    const updated = current.filter((f) => f.id !== friendId && f.profile.id !== friendId);
    this.friends = updated;
    this.saveFriends(updated);
  }

  public static isFriend(profileId: string): boolean {
    const current = this.getFriends();
    return current.some((f) => f.profile.id === profileId || f.id === profileId);
  }

  public static getMessages(friendUserId: string): DirectMessage[] {
    const all = this.getAllMessages();
    return all.filter((m) => m.conversationWith === friendUserId);
  }

  public static sendMessage(friendUserId: string, text: string): DirectMessage {
    const all = this.getAllMessages();
    const newMsg: DirectMessage = {
      id: `dm-${Date.now()}`,
      conversationWith: friendUserId,
      sender: 'me',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...all, newMsg];
    this.messages = updated;
    this.saveMessages(updated);

    // Update last message in friends list
    const friends = this.getFriends();
    const target = friends.find((f) => f.profile.id === friendUserId || f.id === friendUserId);
    if (target) {
      target.lastMessage = text;
      target.lastActive = 'Just now';
      this.saveFriends([...friends]);
    }

    return newMsg;
  }

  private static getAllMessages(): DirectMessage[] {
    if (this.messages) return this.messages;

    try {
      const stored = localStorage.getItem(DM_STORAGE_KEY);
      if (stored) {
        this.messages = JSON.parse(stored);
        return this.messages!;
      }
    } catch (e) {
      console.warn('Failed to parse dm storage:', e);
    }

    this.messages = INITIAL_MESSAGES;
    this.saveMessages(this.messages);
    return this.messages;
  }

  private static saveFriends(friends: FriendItem[]): void {
    try {
      localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(friends));
    } catch (e) {
      console.warn('Save friends failed:', e);
    }
  }

  private static saveMessages(messages: DirectMessage[]): void {
    try {
      localStorage.setItem(DM_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Save messages failed:', e);
    }
  }
}
