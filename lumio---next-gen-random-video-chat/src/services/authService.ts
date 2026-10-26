import { AuthUser } from '../types';

const STORAGE_KEY = 'lumio_auth_user_session';

const DEFAULT_USER: AuthUser = {
  id: 'user-lumio-current',
  username: 'alex_neon',
  displayName: 'Alex Chen',
  email: 'alex@lumio.social',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  bio: 'Music lover & developer from Singapore. Exploring global sounds and deep talks.',
  country: 'Singapore',
  languages: ['English', 'Bahasa Indonesia'],
  interests: ['Music & Lo-Fi', 'Tech & AI', 'Deep Conversations'],
  isGuest: false,
  createdAt: '2026-03-01',
};

export class AuthService {
  private static user: AuthUser | null = null;

  public static getCurrentUser(): AuthUser {
    if (this.user) return this.user;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.user = JSON.parse(stored);
        return this.user!;
      }
    } catch (e) {
      console.warn('Failed to parse auth storage:', e);
    }

    this.user = DEFAULT_USER;
    this.saveUser(this.user);
    return this.user;
  }

  public static updateProfile(updates: Partial<AuthUser>): AuthUser {
    const current = this.getCurrentUser();
    const updated = { ...current, ...updates };
    this.user = updated;
    this.saveUser(updated);
    return updated;
  }

  public static login(email: string, _password?: string): AuthUser {
    const username = email.split('@')[0] || 'member';
    const user: AuthUser = {
      ...DEFAULT_USER,
      email,
      username,
      displayName: username.charAt(0).toUpperCase() + username.slice(1),
      isGuest: false,
    };
    this.user = user;
    this.saveUser(user);
    return user;
  }

  public static register(displayName: string, email: string): AuthUser {
    const username = displayName.toLowerCase().replace(/\s+/g, '_');
    const user: AuthUser = {
      id: `user-${Date.now()}`,
      username,
      displayName,
      email,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'New explorer on Lumio Live.',
      country: 'Global',
      languages: ['English'],
      interests: ['All Topics'],
      isGuest: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.user = user;
    this.saveUser(user);
    return user;
  }

  public static logout(): void {
    const guestUser: AuthUser = {
      id: `guest-${Math.random().toString(36).substring(2, 7)}`,
      username: 'guest_user',
      displayName: 'Guest Explorer',
      email: '',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      bio: 'Anonymous guest browsing Lumio.',
      country: 'Global',
      languages: ['English'],
      interests: ['All Topics'],
      isGuest: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.user = guestUser;
    this.saveUser(guestUser);
  }

  private static saveUser(user: AuthUser): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }
}
