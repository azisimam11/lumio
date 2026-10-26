import React from 'react';
import { AppView } from '../types';
import { LandingView } from '../components/LandingView';

interface LandingPageProps {
  onStartChat: (interest?: string) => void;
  onNavigate: (view: AppView) => void;
  onlineCount: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartChat,
  onNavigate,
  onlineCount,
}) => {
  return (
    <LandingView
      onStartChat={onStartChat}
      onNavigate={onNavigate}
      onlineCount={onlineCount}
    />
  );
};
