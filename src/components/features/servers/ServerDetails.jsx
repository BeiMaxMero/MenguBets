// components/features/servers/ServerDetails.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getServerDetails } from '../../../services/discord';
import { Card } from '../../ui/Card';

export const ServerDetails = () => {
  const { serverId } = useParams();
  const { user } = useAuth();
  const [serverData, setServerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details = await getServerDetails(serverId, user.accessToken);
        setServerData(details);
      } catch (error) {
        console.error('Error fetching server details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (serverId && user?.accessToken) {
      fetchDetails();
    }
  }, [serverId, user]);

  if (loading) return <div>Cargando...</div>;

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gold mb-4">{serverData?.name}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-white">Miembros: {serverData?.memberCount}</p>
          {/* Más detalles aquí */}
        </div>
      </div>
    </Card>
  );
};