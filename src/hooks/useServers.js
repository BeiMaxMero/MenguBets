// hooks/useServers.js
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserServers } from '../services/discord';

export const useServers = () => {
  const [servers, setServers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchServers = async () => {
      if (!user?.accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const serverList = await getUserServers(user.accessToken);
        if (isMounted) {
          setServers(serverList);
          setError(null);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchServers();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return { servers, isLoading, error };
};