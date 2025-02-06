// hooks/useServerData.js
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useServerData = (serverId) => {
  const [serverData, setServerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchServerData = async () => {
      try {
        // Aquí harías la llamada a la API de Discord para obtener detalles del servidor
        // Por ahora, datos de ejemplo más completos
        const mockData = {
          id: serverId,
          name: "Real Madrid Fan Club",
          totalBets: 150,
          activeBets: 5,
          groups: [
            {
              id: 'laliga',
              name: 'La Liga',
              activeBets: [
                {
                  id: 1,
                  homeTeam: 'Real Madrid',
                  awayTeam: 'Barcelona',
                  date: '2024-03-15T20:00:00',
                  bets: [
                    {
                      id: 1,
                      prediction: '2-1',
                      members: [
                        {
                          id: '123',
                          username: 'JohnDoe',
                          avatar: null
                        }
                      ]
                    }
                  ]
                }
              ],
              leaderboard: [
                {
                  id: '123',
                  username: 'JohnDoe',
                  avatar: null,
                  points: 150,
                  winRate: 75,
                  streak: ['win', 'win', 'loss']
                }
              ]
            },
            {
              id: 'champions',
              name: 'Champions League',
              activeBets: [],
              leaderboard: []
            }
          ]
        };

        setServerData(mockData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (serverId && user?.accessToken) {
      fetchServerData();
    }
  }, [serverId, user?.accessToken]);

  return { serverData, loading, error };
};