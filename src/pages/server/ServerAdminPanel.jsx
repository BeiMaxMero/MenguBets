// pages/server/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useServers } from '../../hooks/useServers';
import { canManageBot } from '../../services/discord';

export const ServerAdminPanel = () => {
  const { serverId } = useParams();
  const navigate = useNavigate();
  const { servers } = useServers();
  const [server, setServer] = useState(null);
  
  useEffect(() => {
    // Verificar si el usuario tiene permisos para administrar este servidor
    const currentServer = servers.find(s => s.id === serverId);
    if (!currentServer || !canManageBot(currentServer.permissions)) {
      navigate('/');
      return;
    }
    setServer(currentServer);
  }, [serverId, servers, navigate]);

  if (!server) {
    return null;
  }

  return (
    <div className="space-y-8">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gold">
              Administración de {server.name}
            </h1>
            <p className="text-gray-400">
              Configura las apuestas y gestiona el bot para este servidor
            </p>
          </div>
          <img 
            src={server.icon ? 
              `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png` : 
              '/default-server-icon.png'
            }
            alt={server.name}
            className="w-16 h-16 rounded-full border-2 border-gold"
          />
        </div>

        {/* Secciones de administración */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Configuración de Canales */}
          <Card className="bg-blue-deep">
            <h2 className="text-xl font-bold text-gold mb-4">
              Configuración de Canales
            </h2>
            <div className="space-y-4">
              <Input
                label="Canal de Apuestas"
                placeholder="Selecciona un canal"
              />
              <Input
                label="Canal de Anuncios"
                placeholder="Selecciona un canal"
              />
              <Button variant="secondary" className="w-full">
                Guardar Configuración
              </Button>
            </div>
          </Card>

          {/* Configuración de Roles */}
          <Card className="bg-blue-deep">
            <h2 className="text-xl font-bold text-gold mb-4">
              Configuración de Roles
            </h2>
            <div className="space-y-4">
              <Input
                label="Rol de Administrador"
                placeholder="Selecciona un rol"
              />
              <Input
                label="Rol de Apostador"
                placeholder="Selecciona un rol"
              />
              <Button variant="secondary" className="w-full">
                Guardar Roles
              </Button>
            </div>
          </Card>
        </div>

        {/* Acciones adicionales */}
        <div className="mt-6 flex gap-4">
          <Button 
            variant="primary"
            onClick={() => navigate(`/server/${serverId}`)}
          >
            Ver Apuestas 🎲
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate('/')}
          >
            Volver al Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};