// hooks/useServers.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserServers } from '../services/discord';

// Cache para almacenar los datos de los servidores
const serversCache = {
  data: null,
  timestamp: null,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutos en milisegundos
};

export const useServers = () => {
  const [servers, setServers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const fetchInProgress = useRef(false);

  // Comprobación de si el caché es válido
  const isCacheValid = useCallback(() => {
    return (
      serversCache.data &&
      serversCache.timestamp &&
      Date.now() - serversCache.timestamp < serversCache.CACHE_DURATION
    );
  }, []);

  // Función para obtener los servidores
  const fetchServers = useCallback(async () => {
    // Si ya hay una petición en curso, no hacer otra
    if (fetchInProgress.current) return;

    // Si el caché es válido, usar esos datos
    if (isCacheValid()) {
      setServers(serversCache.data);
      setIsLoading(false);
      return;
    }

    try {
      fetchInProgress.current = true;
      setIsLoading(true);
      setError(null);

      const serverList = await getUserServers(user.accessToken);

      // Actualizar el caché
      serversCache.data = serverList;
      serversCache.timestamp = Date.now();

      setServers(serverList);
    } catch (err) {
      setError(err.message);
      setServers([]);
    } finally {
      setIsLoading(false);
      fetchInProgress.current = false;
    }
  }, [user?.accessToken, isCacheValid]);

  // useEffect para obtener los servidores cuando el token de acceso esté disponible
  useEffect(() => {
    if (user?.accessToken) {
      fetchServers();
    } else {
      setServers([]);
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      fetchInProgress.current = false;
    };
  }, [user?.accessToken, fetchServers]);

  // Función para forzar una recarga ignorando la caché
  const refreshServers = useCallback(() => {
    serversCache.data = null;
    serversCache.timestamp = null;
    return fetchServers();
  }, [fetchServers]);

  return {
    servers,
    isLoading,
    error,
    refreshServers, // Exponer la función de recarga por si es necesaria
  };
};
