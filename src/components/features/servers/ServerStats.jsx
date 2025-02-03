// src/components/features/servers/ServerStats.jsx
import React from 'react';
import { Card } from '../../ui/Card';

export const ServerStats = ({ stats }) => {
  return (
    <Card className="bg-blue-deep">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Estadísticas generales */}
        <Card className="bg-black-ebano">
          <h4 className="text-lg font-bold text-gold mb-3">Participación</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white">Usuarios activos</span>
              <span className="text-gold font-bold">{stats.activeUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Apuestas totales</span>
              <span className="text-gold font-bold">{stats.totalBets}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Promedio/usuario</span>
              <span className="text-gold font-bold">{stats.avgBetsPerUser}</span>
            </div>
          </div>
        </Card>

        {/* Competiciones */}
        <Card className="bg-black-ebano">
          <h4 className="text-lg font-bold text-gold mb-3">Competiciones</h4>
          <div className="space-y-2">
            {stats.competitions.map(comp => (
              <div key={comp.name} className="flex justify-between items-center">
                <span className="text-white">{comp.name}</span>
                <span className="text-gold font-bold">{comp.bets}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Mejores predicciones */}
        <Card className="bg-black-ebano">
          <h4 className="text-lg font-bold text-gold mb-3">Top Aciertos</h4>
          <div className="space-y-2">
            {stats.topPredictions.map(pred => (
              <div key={pred.match} className="text-sm">
                <p className="text-white">{pred.match}</p>
                <p className="text-gold font-bold">{pred.accuracy}% acierto</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Racha del servidor */}
        <Card className="bg-black-ebano">
          <h4 className="text-lg font-bold text-gold mb-3">Racha del Servidor</h4>
          <div className="flex flex-wrap gap-2">
            {stats.serverStreak.map((result, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  result === 'win' ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {result === 'win' ? '✓' : '✗'}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Gráfico de participación */}
      <div className="mt-6">
        <h4 className="text-lg font-bold text-gold mb-3">Actividad Reciente</h4>
        <div className="h-48 bg-black-ebano rounded-lg p-4">
          {/* Aquí iría un gráfico de líneas o barras */}
          <div className="text-center text-white">
            Gráfico de participación (placeholder)
          </div>
        </div>
      </div>
    </Card>
  );
};