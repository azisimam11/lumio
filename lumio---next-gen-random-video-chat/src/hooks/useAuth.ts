import { useState, useCallback, useEffect } from 'react';
import { AuthService } from '../services/authService';
import { AuthUser } from '../types';

export function useAuth() {
  const [user, setUser] = useState<AuthUser>(() => AuthService.getCurrentUser());

  const updateProfile = useCallback((updates: Partial<AuthUser>) => {
    const updated = AuthService.updateProfile(updates);
    setUser(updated);
    return updated;
  }, []);

  const login = useCallback((email: string, password?: string) => {
    const logged = AuthService.login(email, password);
    setUser(logged);
    return logged;
  }, []);

  const register = useCallback((displayName: string, email: string) => {
    const reg = AuthService.register(displayName, email);
    setUser(reg);
    return reg;
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setUser(AuthService.getCurrentUser());
  }, []);

  return {
    user,
    isAuthenticated: !user.isGuest,
    updateProfile,
    login,
    register,
    logout,
  };
}
