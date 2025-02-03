// src/hooks/useServers.js
import { useState, useEffect } from 'react';

export const useServers = () => {
  const [servers, setServers] = useState([
    {
      id: '1',
      name: 'Servidor Demo',
      memberCount: 150,
      iconUrl: '/default-server-icon.png'
    },
    // Puedes agregar más servidores de ejemplo
  ]);
  
  const [isLoading, setIsLoading] = useState(false);

  return { servers, isLoading };
};