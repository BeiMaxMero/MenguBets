import React, { useState } from 'react';
import { ServerCard } from './ServerCard';
import { canManageBot } from '../../../services/discord'

export const ServerTabs = ({ servers }) => {
  const [activeTab, setActiveTab] = useState('manageable');
  
  // Separar servidores según permisos
  const manageableServers = servers.filter(server => canManageBot(server.permissions));
  const memberServers = servers.filter(server => !canManageBot(server.permissions));

  // Clase base para los botones de las pestañas
  const tabBaseClass = "px-4 py-2 font-semibold transition-colors";
  const activeTabClass = "bg-gold text-black-ebano rounded-t-lg";
  const inactiveTabClass = "text-gold hover:text-white";

  return (
    <div className="space-y-4">
      {/* Pestañas */}
      <div className="flex gap-4 border-b border-gold">
        <button
          className={`${tabBaseClass} ${activeTab === 'manageable' ? activeTabClass : inactiveTabClass}`}
          onClick={() => setActiveTab('manageable')}
        >
          Servidores Administrables ({manageableServers.length})
        </button>
        <button
          className={`${tabBaseClass} ${activeTab === 'member' ? activeTabClass : inactiveTabClass}`}
          onClick={() => setActiveTab('member')}
        >
          Mis Servidores ({memberServers.length})
        </button>
      </div>

      {/* Contenido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'manageable' ? (
          manageableServers.length > 0 ? (
            manageableServers.map(server => (
              <ServerCard
                key={server.id}
                name={server.name}
                memberCount={server.approximate_member_count}
                iconUrl={server.icon ? 
                  `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png` : 
                  '/default-server-icon.png'
                }
                canManage={true}
              />
            ))
          ) : (
            <div className="col-span-full text-center p-8 border-2 border-dashed border-gold rounded-lg">
              <p className="text-gold">No tienes servidores donde puedas administrar el bot</p>
              <p className="text-sm text-gray-400 mt-2">
                Necesitas tener permisos de administrador o de gestión del servidor
              </p>
            </div>
          )
        ) : (
          memberServers.map(server => (
            <ServerCard
              key={server.id}
              name={server.name}
              memberCount={server.approximate_member_count}
              iconUrl={server.icon ? 
                `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png` : 
                '/default-server-icon.png'
              }
              canManage={false}
            />
          ))
        )}
      </div>
    </div>
  );
};