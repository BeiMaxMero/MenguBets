// src/components/features/leaderboard/LeaderboardCard.jsx
import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Modal } from '../../ui/Modal';
import { UserBetHistory } from './UserBetHistory'; // Añadir esta importación

export const LeaderboardCard = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState(null);

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
        <h3 className="text-2xl font-bold text-gold mb-6">Clasificación 🏆</h3>
        
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
                  <p className="text-sm text-gray-400">Racha: {user.streak.length} 🔥</p>
                </div>
              </div>
              
              {/* Puntos */}
              <div className="text-right">
                <p className="text-gold font-bold text-xl">{user.points}</p>
                <p className="text-sm text-gray-400">puntos</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Modal de Historial de Usuario */}
      <Modal 
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={`Historial de ${selectedUser?.name}`}
      >
        <UserBetHistory userId={selectedUser?.id} />
      </Modal>
    </>
  );
};