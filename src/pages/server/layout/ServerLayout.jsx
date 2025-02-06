// pages/server/layout/ServerLayout.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { GroupsSidebar } from './GroupsSidebar';
import { ServerHeader } from './ServerHeader';
import { ActiveBets } from '../../../components/features/bets/ActiveBets';
import { LeaderboardCard } from '../../../components/features/leaderboard/LeaderboardCard';
import { useServerData } from '../../../hooks/useServerData';
import { useActiveBets } from '../../../hooks/useActiveBets';
import { LoadingSpinner } from '../../../components/core/LoadingSpinner';

export const ServerLayout = () => {
  const { serverId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState('general');
  
  const { serverData, loading: serverLoading, error: serverError } = useServerData(serverId);
  const { 
    bets, 
    loading: betsLoading, 
    error: betsError,
    createBet 
  } = useActiveBets(serverId, activeGroup);

  const handleGroupSelect = (groupId) => {
    setActiveGroup(groupId);
    setIsSidebarOpen(false);
  };

  if (serverLoading || betsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (serverError || betsError) {
    return (
      <Card className="text-center text-red-500 p-8">
        {serverError || betsError}
      </Card>
    );
  }

  if (!serverData) {
    return (
      <Card className="text-center text-gold p-8">
        Servidor no encontrado
      </Card>
    );
  }

  const currentGroup = activeGroup === 'general' 
    ? null 
    : serverData.groups.find(g => g.id === activeGroup);

  return (
    <div className="relative">
      <ServerHeader
        serverName={serverData.name}
        totalBets={currentGroup?.totalBets || serverData.totalBets}
        activeBets={currentGroup?.activeBets || serverData.activeBets}
        onToggleGroups={() => setIsSidebarOpen(true)}
        groupName={currentGroup?.name}
      />

      <div className="space-y-6">
        <Card>
          <h2 className="text-xl font-bold text-gold mb-4">
            {activeGroup === 'general' ? 'Todas las Apuestas' : `Apuestas - ${
              currentGroup?.name || 'General'
            }`}
          </h2>
          <ActiveBets 
            bets={bets} 
            onCreateBet={createBet}
          />
        </Card>

        <LeaderboardCard 
          users={currentGroup?.leaderboard || serverData.leaderboard || []}
          groupId={activeGroup !== 'general' ? activeGroup : undefined}
        />
      </div>

      <GroupsSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        groups={serverData.groups}
        activeGroup={activeGroup}
        onSelectGroup={handleGroupSelect}
      />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};