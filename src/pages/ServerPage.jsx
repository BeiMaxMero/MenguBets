import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { BetForm } from '../components/features/bets/BetForm';

export const ServerPage = () => {
  console.log('Renderizando ServerPage');
  const { serverId } = useParams();
  // Demo data - luego se conectará con los hooks
  const matches = [
    {
      id: 1,
      homeTeam: 'Real Madrid',
      awayTeam: 'Barcelona',
      date: '2024-02-15',
      status: 'pending'
    }
  ];

  const handleSubmitBet = (prediction) => {
    console.log('Nueva apuesta:', prediction);
    // Aquí se conectará con la lógica de negocio
  };

  return (
    <div className="space-y-8">
      <Card>
        <h2 className="text-2xl font-bold text-gold mb-6">Apuestas Activas</h2>
        <div className="space-y-6">
          {matches.map(match => (
            <Card key={match.id} className="border-gold">
              <h3 className="text-xl text-white mb-4">
                {match.homeTeam} vs {match.awayTeam}
              </h3>
              <p className="text-gold mb-4">Fecha: {match.date}</p>
              <BetForm match={match} onSubmit={handleSubmitBet} />
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};