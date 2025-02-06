// src/components/features/leaderboard/LeaderboardCard.jsx
import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';
import { UserBetHistory } from './UserBetHistory';

export const LeaderboardCard = ({ users, groupId }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [timeRange, setTimeRange] = useState('all'); // 'all', 'month', 'week'

  const timeRanges = [
    { id: 'all', label: 'Todo' },
    { id: 'month', label: 'Este Mes' },
    { id: 'week', label: 'Esta Semana' }
  ];

  const getPositionStyle = (position) => {
    switch(position) {
      case 1: return 'text-yellow-400';  // Oro
      case 2: return 'text-gray-400';    // Plata
      case 3: return 'text-amber-600';   // Bronce
      default: return 'text-white';
    }
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gold">
            Clasificación 🏆
            {groupId && ` - ${groupId}`}
          </h3>
          
          {/* Filtros temporales */}
          <div className="flex gap-2">
            {timeRanges.map(range => (
              <Button
                key={range.id}
                variant={timeRange === range.id ? "primary" : "ghost"}
                onClick={() => setTimeRange(range.id)}
                className={`text-sm ${timeRange === range.id ? "text-black-ebano" : "text-gold"}`}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          {users.map((user, index) => (
            <div 
              key={user.id}
              className="flex items-center p-4 bg-blue-deep rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              onClick={() => setSelectedUser(user)}
            >
              {/* Posición */}
              <span className={`text-2xl font-bold w-12 ${getPositionStyle(index + 1)}`}>
                #{index + 1}
              </span>
              
              {/* Avatar y nombre */}
              <div className="flex items-center flex-1">
                <img 
                  src={user.avatar || '/default-avatar.png'} 
                  alt={user.name}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <p className="text-white font-medium">{user.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-400">
                      Racha: {user.streak.length} 🔥
                    </p>
                    <p className="text-sm text-gray-400">
                      Win Rate: {user.winRate || 0}%
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Estadísticas */}
              <div className="text-right">
                <p className="text-gold font-bold text-xl">{user.points}</p>
                <p className="text-sm text-gray-400">puntos</p>
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gold">No hay datos disponibles para mostrar</p>
            </div>
          )}
        </div>
      </Card>

      {/* Modal de Historial de Usuario */}
      <Modal 
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={`Historial de ${selectedUser?.name}`}
      >
        <UserBetHistory 
          userId={selectedUser?.id} 
          groupId={groupId}
          timeRange={timeRange}
        />
      </Modal>
    </>
  );
};