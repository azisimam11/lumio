import React, { useState } from 'react';
import { AppView } from '../types';
import { SafetyGuidelinesView } from '../components/SafetyGuidelinesView';
import { DeploymentRunbookModal } from '../components/safety/DeploymentRunbookModal';

interface SafetyPageProps {
  onNavigate: (view: AppView) => void;
}

export const SafetyPage: React.FC<SafetyPageProps> = ({ onNavigate }) => {
  const [isRunbookOpen, setIsRunbookOpen] = useState(false);

  return (
    <>
      <SafetyGuidelinesView
        onNavigate={onNavigate}
        onOpenRunbook={() => setIsRunbookOpen(true)}
      />
      <DeploymentRunbookModal
        isOpen={isRunbookOpen}
        onClose={() => setIsRunbookOpen(false)}
      />
    </>
  );
};
