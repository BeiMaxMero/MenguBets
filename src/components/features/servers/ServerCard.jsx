// components/features/servers/ServerCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/Button';

export const ServerCard = ({ id, name, iconUrl, memberCount, canManage }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-blue-deep p-6 rounded-lg border-2 border-gold hover:border-red-casino transition-colors">
      <img 
        src={iconUrl || '/default-server-icon.png'} 
        alt={name}
        className="w-16 h-16 rounded-full mx-auto mb-4"
      />
      <h3 className="text-gold text-xl font-bold text-center mb-2">{name}</h3>
      {memberCount && (
        <p className="text-white text-center mb-4">
          {memberCount} miembros
        </p>
      )}
      
      {canManage ? (
        <div className="space-y-2">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => navigate(`/server/${id}/admin`)}
          >
            Administrar Bot 🤖
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => navigate(`/server/${id}`)}
          >
            Ver Apuestas 🎲
          </Button>
        </div>
      ) : (
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => navigate(`/server/${id}`)}
        >
          Ver Apuestas 🎲
        </Button>
      )}
    </div>
  );
};