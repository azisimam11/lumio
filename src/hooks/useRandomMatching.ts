import { useState, useEffect, useRef, useCallback } from 'react';
import { MatchingService } from '../services/matchingService';
import { FilterPreferences, MatchingSessionInfo, MatchingState, UserProfile } from '../types';

interface UseRandomMatchingProps {
  onMatchFound?: (partner: UserProfile, session: MatchingSessionInfo) => void;
  onCallEnded?: () => void;
  onRateLimited?: (message: string) => void;
}

export function useRandomMatching({
  onMatchFound,
  onCallEnded,
  onRateLimited,
}: UseRandomMatchingProps = {}) {
  const [matchingState, setMatchingState] = useState<MatchingState>('idle');
  const [currentPartner, setCurrentPartner] = useState<UserProfile | null>(null);
  const [currentSession, setCurrentSession] = useState<MatchingSessionInfo | null>(null);
  const [searchDuration, setSearchDuration] = useState<number>(0);
  const [rateLimitCountdown, setRateLimitCountdown] = useState<number>(0);
  const [blockedUserIds, setBlockedUserIds] = useState<Set<string>>(new Set());

  const searchTimerRef = useRef<any>(null);
  const matchTimeoutRef = useRef<any>(null);
  const filtersRef = useRef<FilterPreferences>({
    interest: 'All Topics',
    language: 'any',
    region: 'global',
  });

  const matchingService = MatchingService.getInstance();

  // Search queue duration counter
  useEffect(() => {
    let interval: any;
    if (matchingState === 'searching') {
      const startTime = Date.now();
      interval = setInterval(() => {
        setSearchDuration(Math.floor((Date.now() - startTime) / 100) / 10);
      }, 100);
    } else {
      setSearchDuration(0);
    }
    return () => clearInterval(interval);
  }, [matchingState]);

  // Rate-limit countdown timer
  useEffect(() => {
    let timer: any;
    if (rateLimitCountdown > 0) {
      timer = setInterval(() => {
        setRateLimitCountdown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [rateLimitCountdown]);

  /**
   * Enqueue and search for a compatible partner
   */
  const startSearch = useCallback(
    (filters: FilterPreferences) => {
      // Check anti-spam rate limiting
      const rateCheck = matchingService.checkRateLimit();
      if (rateCheck.isLimited) {
        const seconds = Math.ceil(rateCheck.remainingCooldownMs / 1000);
        setRateLimitCountdown(seconds);
        if (onRateLimited) {
          onRateLimited(`Please wait ${seconds}s before searching again (Anti-Spam).`);
        }
        return;
      }

      filtersRef.current = filters;
      matchingService.registerSkip();

      // Clear any prior pending search
      if (matchTimeoutRef.current) clearTimeout(matchTimeoutRef.current);

      setMatchingState('searching');
      setCurrentPartner(null);
      setCurrentSession(null);

      // Simulate realistic network queue matching latency (1.0s to 1.6s)
      const latency = 1000 + Math.floor(Math.random() * 600);
      matchTimeoutRef.current = setTimeout(() => {
        const { partner, session } = matchingService.findCompatibleMatch(
          filters,
          blockedUserIds
        );

        setCurrentPartner(partner);
        setCurrentSession(session);
        setMatchingState('matched');

        if (onMatchFound) {
          onMatchFound(partner, session);
        }
      }, latency);
    },
    [blockedUserIds, matchingService, onMatchFound, onRateLimited]
  );

  /**
   * Skip current stranger and immediately find next compatible peer
   */
  const skipPartner = useCallback(() => {
    startSearch(filtersRef.current);
  }, [startSearch]);

  /**
   * End current call and transition to ended state
   */
  const endCall = useCallback(() => {
    if (matchTimeoutRef.current) clearTimeout(matchTimeoutRef.current);
    matchingService.clearSession();
    setMatchingState('ended');
    setCurrentPartner(null);
    setCurrentSession(null);
    if (onCallEnded) onCallEnded();
  }, [matchingService, onCallEnded]);

  /**
   * Block partner and disconnect
   */
  const blockPartner = useCallback(
    (partnerId: string) => {
      setBlockedUserIds((prev) => new Set(prev).add(partnerId));
      skipPartner();
    },
    [skipPartner]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (matchTimeoutRef.current) clearTimeout(matchTimeoutRef.current);
    };
  }, []);

  return {
    matchingState,
    currentPartner,
    currentSession,
    searchDuration,
    rateLimitCountdown,
    blockedUserIds,
    startSearch,
    skipPartner,
    endCall,
    blockPartner,
  };
}
