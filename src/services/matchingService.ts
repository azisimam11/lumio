import { FilterPreferences, MatchingSessionInfo, UserProfile } from '../types';
import { MOCK_PARTNERS } from '../data/mockData';

export interface MatchingQueueUser {
  userId: string;
  socketId: string;
  enqueuedAt: number;
  filters: FilterPreferences;
  profile: UserProfile;
}

export interface MatchingResult {
  session: MatchingSessionInfo;
  partner: UserProfile;
}

export class MatchingService {
  private static instance: MatchingService | null = null;
  private currentUserId: string;
  private recentPartnerIds: string[] = [];
  private lastSkipTimestamp: number = 0;
  private skipCountWindow: number = 0;
  private windowStartTimestamp: number = 0;

  // Rate-limiting constraints
  private readonly MIN_SKIP_INTERVAL_MS = 600; // anti-rapid click spam
  private readonly MAX_SKIPS_PER_WINDOW = 8;
  private readonly WINDOW_DURATION_MS = 10000; // 8 skips per 10s

  constructor(currentUserId: string = 'local-user-' + Math.random().toString(36).substring(2, 8)) {
    this.currentUserId = currentUserId;
    this.windowStartTimestamp = Date.now();
  }

  public static getInstance(userId?: string): MatchingService {
    if (!MatchingService.instance) {
      MatchingService.instance = new MatchingService(userId);
    }
    return MatchingService.instance;
  }

  /**
   * Verify whether user is rate-limited from rapid skipping
   */
  public checkRateLimit(): { isLimited: boolean; remainingCooldownMs: number } {
    const now = Date.now();

    // Reset rate-limit window if duration expired
    if (now - this.windowStartTimestamp > this.WINDOW_DURATION_MS) {
      this.windowStartTimestamp = now;
      this.skipCountWindow = 0;
    }

    // Check minimum interval debounce
    const elapsedSinceLast = now - this.lastSkipTimestamp;
    if (elapsedSinceLast < this.MIN_SKIP_INTERVAL_MS) {
      return {
        isLimited: true,
        remainingCooldownMs: this.MIN_SKIP_INTERVAL_MS - elapsedSinceLast,
      };
    }

    // Check window count limit
    if (this.skipCountWindow >= this.MAX_SKIPS_PER_WINDOW) {
      const windowRemaining = this.WINDOW_DURATION_MS - (now - this.windowStartTimestamp);
      return {
        isLimited: true,
        remainingCooldownMs: Math.max(windowRemaining, 1000),
      };
    }

    return { isLimited: false, remainingCooldownMs: 0 };
  }

  /**
   * Register a skip event for anti-spam tracking
   */
  public registerSkip(): void {
    const now = Date.now();
    this.lastSkipTimestamp = now;
    this.skipCountWindow += 1;
  }

  /**
   * Match a candidate based on compatibility rules
   */
  public findCompatibleMatch(
    filters: FilterPreferences,
    blockedIds: Set<string> = new Set()
  ): MatchingResult {
    const now = Date.now();
    const availablePool = MOCK_PARTNERS.filter((partner) => {
      // Rule 4: Prevent self-pairing
      if (partner.id === this.currentUserId) return false;

      // Rule 6: Skip blocked users
      if (blockedIds.has(partner.id)) return false;

      // Avoid immediate rematch with the exact previous peer
      const lastPartnerId = this.recentPartnerIds[this.recentPartnerIds.length - 1];
      if (lastPartnerId && partner.id === lastPartnerId && MOCK_PARTNERS.length > 1) {
        return false;
      }

      return true;
    });

    // Score compatibility
    const scoredCandidates = availablePool.map((candidate) => {
      let score = 50; // base score

      // Topic Match (+35 pts)
      const hasTopicMatch =
        filters.interest === 'All Topics' ||
        candidate.interests.some((i) => i.toLowerCase().includes(filters.interest.toLowerCase()));
      if (hasTopicMatch) score += 35;

      // Language Match (+15 pts)
      if (filters.language !== 'any') {
        const hasLangMatch = candidate.languages.some(
          (l) => l.toLowerCase() === filters.language.toLowerCase()
        );
        if (hasLangMatch) score += 15;
      }

      return {
        candidate,
        score,
        commonInterests: candidate.interests.filter(
          (i) =>
            filters.interest === 'All Topics' ||
            i.toLowerCase().includes(filters.interest.toLowerCase())
        ),
      };
    });

    // Sort by highest compatibility score first
    scoredCandidates.sort((a, b) => b.score - a.score);

    // Pick top candidate
    const selected = scoredCandidates[0] || {
      candidate: MOCK_PARTNERS[0],
      score: 50,
      commonInterests: ['Music & Lo-Fi'],
    };

    // Keep history to avoid repeated consecutive encounters
    this.recentPartnerIds.push(selected.candidate.id);
    if (this.recentPartnerIds.length > 5) {
      this.recentPartnerIds.shift();
    }

    const roomId = `room-${Math.random().toString(36).substring(2, 9)}`;

    return {
      partner: selected.candidate,
      session: {
        roomId,
        partnerId: selected.candidate.id,
        matchedAt: now,
        compatibilityScore: selected.score,
        commonInterests: selected.commonInterests,
      },
    };
  }

  /**
   * Reset matching memory
   */
  public clearSession(): void {
    // Keep rate-limit tracking intact while resetting active room
  }
}
