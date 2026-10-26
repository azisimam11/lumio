import React, { useState } from 'react';
import { AppView } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { DeploymentRunbookModal } from '../components/safety/DeploymentRunbookModal';

interface MainLayoutProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onlineCount: number;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentView,
  onNavigate,
  onlineCount,
  children,
}) => {
  const [isRunbookOpen, setIsRunbookOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F4F7FF] flex flex-col font-sans selection:bg-[#1769FF] selection:text-white">
      {/* Shared Header Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={onNavigate}
        onlineCount={onlineCount}
      />

      {/* Main View Port Container */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Shared Footer (hidden on full-screen video chat studio to allow max viewport height) */}
      {currentView !== 'video-chat' && (
        <Footer
          onNavigate={onNavigate}
          onOpenRunbook={() => setIsRunbookOpen(true)}
        />
      )}

      {/* Platform Architecture & Coturn Runbook Modal */}
      <DeploymentRunbookModal
        isOpen={isRunbookOpen}
        onClose={() => setIsRunbookOpen(false)}
      />
    </div>
  );
};
