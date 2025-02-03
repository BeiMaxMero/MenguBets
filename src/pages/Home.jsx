import React from 'react';
import { ServerCard } from '../components/ServerCard';
import { Card } from '../components/ui/Card';

export const Home = () => {
  // Aquí después conectaremos con los hooks para obtener los servidores
  const servers = [
    { id: 1, name: 'Server Demo', memberCount: 150, iconUrl: '/default-server-icon.png' }
  ];

  return (
    <div className="space-y-8">
      <Card>
        <h2 className="text-2xl font-bold text-gold mb-4">Tus Servidores de Discord</h2>
        <p className="text-white mb-6">
          Selecciona un servidor para ver y crear apuestas
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servers.map(server => (
            <ServerCard key={server.id} {...server} />
          ))}
        </div>
      </Card>
    </div>
  );
};