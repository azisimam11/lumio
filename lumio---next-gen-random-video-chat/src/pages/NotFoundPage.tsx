import React from 'react';
import { Compass, ArrowLeft } from 'lucide-react';
import { AppView } from '../types';

interface NotFoundPageProps {
  onNavigate: (view: AppView) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 bg-[#080B14]">
      <div className="w-16 h-16 rounded-2xl bg-[#121A2A] border border-[#253148] flex items-center justify-center text-[#25D9F8]">
        <Compass className="w-8 h-8 animate-pulse" />
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="text-3xl font-extrabold text-[#F4F7FF] font-mono">404 - Page Not Found</h1>
        <p className="text-xs text-[#A5B1C7] leading-relaxed">
          The channel or page you are looking for does not exist in the Lumio platform.
        </p>
      </div>
      <button
        onClick={() => onNavigate('landing')}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] text-white text-xs font-semibold cursor-pointer transition-transform hover:scale-105"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Explore
      </button>
    </div>
  );
};
