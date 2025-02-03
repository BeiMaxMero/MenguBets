// src/hooks/useBets.js
import { useState } from 'react';

export const useBets = (serverId) => {
  const [bets, setBets] = useState({
    active: [
      {
        id: 1,
        homeTeam: 'Real Madrid',
        awayTeam: 'Barcelona',
        date: '2024-02-15',
        status: 'pending'
      },
      {
        id: 2,
        homeTeam: 'Atlético Madrid',
        awayTeam: 'Sevilla',
        date: '2024-02-18',
        status: 'pending'
      }
    ],
    history: [
      {
        id: 3,
        homeTeam: 'Valencia',
        awayTeam: 'Villarreal',
        date: '2024-02-01',
        status: 'completed',
        result: '2-1',
        userBet: '2-1',
        won: true
      },
      {
        id: 4,
        homeTeam: 'Athletic',
        awayTeam: 'Betis',
        date: '2024-02-05',
        status: 'completed',
        result: '0-0',
        userBet: '1-0',
        won: false
      }
    ]
  });

  const [isLoading, setIsLoading] = useState(false);

  const createBet = (prediction) => {
    console.log('Nueva apuesta:', prediction, 'para el servidor:', serverId);
  };

  return {
    bets,
    isLoading,
    createBet
  };
};