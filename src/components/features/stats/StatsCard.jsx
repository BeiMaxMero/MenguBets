// src/components/features/stats/StatsCard.jsx
import React from 'react';
import { Card } from '../../ui/Card';

export const StatsCard = ({ stats }) => {
  return (
    <Card className="border-gold">
      <h3 className="text-xl font-bold text-gold mb-6">Estadísticas</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-deep rounded-lg">
          <p className="text-3xl font-bold text-gold">{stats.totalBets}</p>
          <p className="text-white">Apuestas</p>
        </div>
        
        <div className="text-center p-4 bg-blue-deep rounded-lg">
          <p className="text-3xl font-bold text-gold">
            {stats.winRate}%
          </p>
          <p className="text-white">Tasa de Acierto</p>
        </div>
        
        <div className="text-center p-4 bg-blue-deep rounded-lg">
          <p className="text-3xl font-bold text-gold">{stats.activeBets}</p>
          <p className="text-white">Apuestas Activas</p>
        </div>
        
        <div className="text-center p-4 bg-blue-deep rounded-lg">
          <p className="text-3xl font-bold text-gold">{stats.points}</p>
          <p className="text-white">Puntos</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-deep rounded-lg">
        <h4 className="text-lg font-bold text-gold mb-3">Racha Actual</h4>
        <div className="flex gap-2 overflow-x-auto">
          {stats.streak.map((result, index) => (
            <div
              key={index}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                result === 'win' ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {result === 'win' ? '✓' : '✗'}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};