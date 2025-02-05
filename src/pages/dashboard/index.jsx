// pages/dashboard/index.jsx
import React, {useState } from 'react';
import { useServers } from '../../hooks/useServers';
import { ServerCard } from '../../components/features/servers/ServerCard';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/core/LoadingSpinner';

export const DashboardIndex = () => {
  const { servers, isLoading } = useServers();
  const [error, setError] = useState(null);

  console.log('Servers received in dashboard:', servers); // Debug log
  

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <p className="text-gold mt-4">Cargando tus servidores...</p>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-casino">
        <p className="text-red-500">Error: {error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <h1 className="text-3xl font-bold text-gold mb-6">Tus Servidores</h1>
        <p className="text-white mb-8">
          Selecciona un servidor para gestionar sus apuestas y ver estadísticas
        </p>
        
        {servers.length === 0 ? (
          <Card className="border-red-casino bg-blue-deep">
            <p className="text-gold text-center">
              No se encontraron servidores. Asegúrate de tener los permisos necesarios.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servers.map(server => (
              <ServerCard 
                key={server.id}
                name={server.name}
                memberCount={server.approximate_member_count}
                iconUrl={server.icon ? 
                  `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png` : 
                  '/default-server-icon.png'
                }
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};