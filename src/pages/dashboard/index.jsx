// src/pages/dashboard/index.jsx
import React from 'react';
import { useServers } from '../../hooks/useServers';
import { ServerCard } from '../../components/features/servers/ServerCard';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/core/LoadingSpinner';

export const DashboardIndex = () => {
  console.log('Renderizando DashboardIndex');
  const { servers, isLoading } = useServers();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <Card>
        <h1 className="text-3xl font-bold text-gold mb-6">Tus Servidores</h1>
        <p className="text-white mb-8">
          Selecciona un servidor para gestionar sus apuestas y ver estadísticas
        </p>
        
        {servers?.length === 0 ? (
          <Card className="border-red-casino bg-blue-deep">
            <p className="text-gold text-center">
              No se encontraron servidores. Asegúrate de tener los permisos necesarios.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servers?.map(server => (
              <ServerCard key={server.id} {...server} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};