// hooks/useActiveBets.js
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useActiveBets = (serverId, groupId = 'general') => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchActiveBets = async () => {
      try {
        // Aquí harías la llamada a tu backend para obtener las apuestas activas
        // Por ahora, datos de ejemplo
        const mockBets = [
          {
            id: 1,
            homeTeam: 'Real Madrid',
            awayTeam: 'Barcelona',
            date: '2024-03-15T20:00:00',
            groupId: 'laliga',
            competition: 'La Liga',
            bets: [
              {
                id: 1,
                prediction: '2-1',
                members: [
                  {
                    id: '123',
                    username: 'JohnDoe',
                    avatar: null
                  },
                  {
                    id: '456',
                    username: 'JaneSmith',
                    avatar: null
                  }
                ]
              }
            ]
          },
          {
            id: 2,
            homeTeam: 'Manchester City',
            awayTeam: 'Bayern Munich',
            date: '2024-03-16T20:00:00',
            groupId: 'champions',
            competition: 'Champions League',
            bets: []
          }
        ].filter(bet => groupId === 'general' || bet.groupId === groupId);

        setBets(mockBets);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (serverId && user?.accessToken) {
      fetchActiveBets();
    }
  }, [serverId, groupId, user?.accessToken]);

  const createBet = async (matchId, prediction) => {
    try {
      // Aquí irá la lógica para crear una nueva apuesta
      console.log('Creando apuesta:', { matchId, prediction });
      
      // Actualizar estado local
      setBets(prevBets => 
        prevBets.map(bet => 
          bet.id === matchId
            ? {
                ...bet,
                bets: [...bet.bets, {
                  id: Date.now(),
                  prediction,
                  members: [{
                    id: user.id,
                    username: user.username,
                    avatar: user.avatar
                  }]
                }]
              }
            : bet
        )
      );
    } catch (err) {
      throw new Error('Error al crear la apuesta');
    }
  };

  return { bets, loading, error, createBet };
};