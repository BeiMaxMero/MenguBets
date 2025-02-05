// components/features/servers/ServerList.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getUserServers } from '../../../services/discord';
import { ServerCard } from './ServerCard';

export const ServerList = () => {
  const { user } = useAuth();
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const serverList = await getUserServers(user.accessToken);
        setServers(serverList);
      } catch (error) {
        console.error('Error fetching servers:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.accessToken) {
      fetchServers();
    }
  }, [user]);

  if (loading) return <div>Cargando servidores...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {servers.map(server => (
        <ServerCard 
          key={server.id}
          name={server.name}
          iconUrl={server.icon}
          memberCount="N/A" // Necesitarías otra llamada para obtener esto
        />
      ))}
    </div>
  );
};
