import React, { useState } from 'react';
import { AppView, CommunityRoom, CreateLoungePayload } from '../types';
import { CommunityService } from '../services/communityService';
import { useAuth } from '../hooks/useAuth';
import { CommunityRoomsView } from '../components/CommunityRoomsView';
import { ActiveVoiceLoungeModal } from '../components/community/ActiveVoiceLoungeModal';
import { CreateLoungeModal } from '../components/community/CreateLoungeModal';

interface CommunityPageProps {
  onNavigate: (view: AppView) => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<CommunityRoom[]>(() => CommunityService.getRooms());
  const [activeRoom, setActiveRoom] = useState<CommunityRoom | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateLounge = (payload: CreateLoungePayload) => {
    const newRoom = CommunityService.createRoom(payload, user);
    setRooms(CommunityService.getRooms());
    setActiveRoom(newRoom);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#080B14]">
      <CommunityRoomsView
        rooms={rooms}
        onNavigate={onNavigate}
        onSelectRoom={(room) => setActiveRoom(room)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* Interactive Active Voice Stage Modal */}
      {activeRoom && (
        <ActiveVoiceLoungeModal
          room={activeRoom}
          onClose={() => setActiveRoom(null)}
        />
      )}

      {/* Host a New Lounge Modal */}
      <CreateLoungeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateLounge}
      />
    </div>
  );
};
