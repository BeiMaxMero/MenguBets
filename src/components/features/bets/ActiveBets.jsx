// src/components/features/ActiveBets.jsx
import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { BetForm } from '../../../components/features/bets/BetForm';
import { TeamBet } from '../../../components/features/bets/TeamBet';

export const ActiveBets = ({ groupId }) => {
  const [expandedMatch, setExpandedMatch] = useState(null);

  // Mock data - esto vendría de un hook
  const activeBets = [
    {
      id: 1,
      homeTeam: 'Real Madrid',
      awayTeam: 'Barcelona',
      date: '2024-03-15T20:00:00',
      groupId: 'laliga',
      bets: [
        {
          id: 1,
          prediction: '2-1',
          members: [
            { id: 1, username: 'Usuario1', avatar: null },
            { id: 2, username: 'Usuario2', avatar: null }
          ]
        }
      ]
    },
    {
      id: 2,
      homeTeam: 'Atlético Madrid',
      awayTeam: 'Sevilla',
      date: '2024-03-16T18:00:00',
      groupId: 'laliga',
      bets: []
    }
  ].filter(bet => !groupId || bet.groupId === groupId);

  const handleSubmitBet = (matchId, prediction) => {
    console.log(`Nueva apuesta para partido ${matchId}:`, prediction);
    setExpandedMatch(null);
  };

  return (
    <div className="space-y-6">
      {activeBets.map(match => (
        <Card key={match.id} className="bg-blue-deep">
          {/* Cabecera del partido */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl text-white">
                {match.homeTeam} vs {match.awayTeam}
              </h3>
              <p className="text-sm text-gray-400">
                {new Date(match.date).toLocaleString()}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => setExpandedMatch(expandedMatch === match.id ? null : match.id)}
              className="text-gold hover:text-white"
            >
              {expandedMatch === match.id ? 'Cerrar' : 'Apostar'}
            </Button>
          </div>

          {/* Apuestas existentes */}
          {match.bets.length > 0 && (
            <div className="mb-4">
              <h4 className="text-gold mb-2">Apuestas del equipo:</h4>
              {match.bets.map(bet => (
                <TeamBet key={bet.id} bet={bet} />
              ))}
            </div>
          )}

          {/* Formulario de apuesta */}
          {expandedMatch === match.id && (
            <div className="mt-4 border-t border-gold pt-4">
              <BetForm
                match={match}
                onSubmit={(prediction) => handleSubmitBet(match.id, prediction)}
              />
            </div>
          )}
        </Card>
      ))}

      {activeBets.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-gold text-lg">
            No hay apuestas activas 
            {groupId !== 'general' && ' en este grupo'}
          </p>
          <p className="text-gray-400 mt-2">
            Las nuevas apuestas aparecerán aquí cuando estén disponibles
          </p>
        </Card>
      )}
    </div>
  );
};