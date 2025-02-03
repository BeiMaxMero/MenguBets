// src/components/features/bets/BetHistory.jsx
import React from 'react';
import { Card } from '../../ui/Card';

export const BetHistory = ({ bets }) => {
  return (
    <Card>
      <h3 className="text-xl font-bold text-gold mb-6">Historial de Apuestas</h3>
      
      <div className="space-y-4">
        {bets.map((bet) => (
          <Card 
            key={bet.id} 
            className={`border-2 ${
              bet.status === 'won' ? 'border-green-500' : 
              bet.status === 'lost' ? 'border-red-500' : 
              'border-gold'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg text-white">
                  {bet.homeTeam} vs {bet.awayTeam}
                </h4>
                <p className="text-gold text-sm">
                  {new Date(bet.date).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                bet.status === 'won' ? 'bg-green-500 text-white' :
                bet.status === 'lost' ? 'bg-red-500 text-white' :
                'bg-gold text-black-ebano'
              }`}>
                {bet.status === 'won' ? 'Ganada' :
                 bet.status === 'lost' ? 'Perdida' :
                 'Pendiente'}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-white">Tu Apuesta</p>
                <p className="text-gold font-bold">{bet.prediction}</p>
              </div>
              <div>
                <p className="text-sm text-white">Resultado</p>
                <p className="text-gold font-bold">
                  {bet.result || 'Pendiente'}
                </p>
              </div>
              <div>
                <p className="text-sm text-white">Puntos</p>
                <p className="text-gold font-bold">{bet.points || '-'}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};