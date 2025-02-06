// pages/dashboard/index.jsx
import React from 'react';
import { useServers } from '../../hooks/useServers';
import { ServerTabs } from '../../components/features/servers/ServerTabs';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/core/LoadingSpinner';

export const DashboardIndex = () => {
  const { servers, isLoading, error: serverError } = useServers();

  console.log('Servers received in dashboard:', servers);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <LoadingSpinner />
        <p className="text-gold mt-4">Cargando tus servidores...</p>
      </div>
    );
  }

  if (serverError) {
    return (
      <Card className="border-red-casino">
        <p className="text-red-500">Error: {serverError}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <h1 className="text-3xl font-bold text-gold mb-6">Tus Servidores</h1>
        <p className="text-white mb-8">
          Gestiona tus servidores y participa en las apuestas
        </p>
        
        {servers.length === 0 ? (
          <Card className="border-red-casino bg-blue-deep">
            <p className="text-gold text-center">
              No se encontraron servidores. Asegúrate de tener los permisos necesarios.
            </p>
          </Card>
        ) : (
          <ServerTabs servers={servers} />
        )}
      </Card>
    </div>
  );
};