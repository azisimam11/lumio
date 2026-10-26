/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppView } from './types';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { VideoChatPage } from './pages/VideoChatPage';
import { CommunityPage } from './pages/CommunityPage';
import { SafetyPage } from './pages/SafetyPage';
import { FriendsPage } from './pages/FriendsPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AuthModal } from './components/auth/AuthModal';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [activeTopic, setActiveTopic] = useState<string>('All Topics');
  const [onlineCount, setOnlineCount] = useState<number>(4280);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Hash route synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '');
      if (!rawHash || rawHash === 'landing') {
        setCurrentView('landing');
      } else if (rawHash === 'video-chat') {
        setCurrentView('video-chat');
      } else if (rawHash === 'friends') {
        setCurrentView('friends');
      } else if (rawHash === 'community') {
        setCurrentView('community');
      } else if (rawHash === 'safety') {
        setCurrentView('safety');
      } else if (rawHash === 'profile') {
        setCurrentView('profile');
      } else {
        setCurrentView('not-found');
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    window.location.hash = view === 'landing' ? '' : view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChatWithTopic = (topic?: string) => {
    if (topic) {
      setActiveTopic(topic);
    }
    handleNavigate('video-chat');
  };

  // Online peers fluctuation simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setOnlineCount((prev) => prev + Math.floor(Math.random() * 7) - 3);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <MainLayout
      currentView={currentView}
      onNavigate={handleNavigate}
      onlineCount={onlineCount}
    >
      {currentView === 'landing' && (
        <LandingPage
          onStartChat={handleStartChatWithTopic}
          onNavigate={handleNavigate}
          onlineCount={onlineCount}
        />
      )}

      {currentView === 'video-chat' && (
        <VideoChatPage
          onNavigateSafety={() => handleNavigate('safety')}
          initialTopic={activeTopic}
        />
      )}

      {currentView === 'friends' && (
        <FriendsPage
          onNavigate={handleNavigate}
          onStartVideoCallWithFriend={() => handleNavigate('video-chat')}
        />
      )}

      {currentView === 'community' && (
        <CommunityPage onNavigate={handleNavigate} />
      )}

      {currentView === 'safety' && (
        <SafetyPage onNavigate={handleNavigate} />
      )}

      {currentView === 'profile' && (
        <ProfilePage
          onNavigate={handleNavigate}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
      )}

      {currentView === 'not-found' && (
        <NotFoundPage onNavigate={handleNavigate} />
      )}

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </MainLayout>
  );
}
