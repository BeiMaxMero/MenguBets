// src/pages/dashboard/[serverId].jsx
import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import { useBets } from '../../hooks/useBets';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BetForm } from '../../components/features/bets/BetForm';
import { LoadingSpinner } from '../../components/core/LoadingSpinner';
import { LeaderboardCard } from '../../components/features/leaderboard/LeaderboardCard';

export const ServerDashboard = () => {
  const { serverId } = useParams();
  const { bets, isLoading, createBet } = useBets(serverId);
  const [activeTab, setActiveTab] = useState('bets'); // 'bets' o 'leaderboard'

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Datos de ejemplo para el leaderboard
  const leaderboardData = [
    {
      id: '1',
      name: 'Usuario 1',
      avatar: null,
      points: 150,
      streak: ['win', 'win', 'loss', 'win'],
    },
    {
      id: '2',
      name: 'Usuario 2',
      avatar: null,
      points: 120,
      streak: ['win', 'loss', 'win', 'win'],
    },
    // Más usuarios...
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      {/* Tabs de navegación */}
      <div className="flex gap-4 border-b border-gold">
        <Button
          variant={activeTab === 'bets' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('bets')}
          className="px-6 py-2 rounded-t-lg rounded-b-none"
        >
          Apuestas Activas
        </Button>
        <Button
          variant={activeTab === 'leaderboard' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('leaderboard')}
          className="px-6 py-2 rounded-t-lg rounded-b-none"
        >
          Clasificación
        </Button>
      </div>

      {/* Contenido según la tab activa */}
      {activeTab === 'bets' ? (
        <div className="space-y-8">
          {/* Sección de Apuestas Activas */}
          <Card>
            <h2 className="text-2xl font-bold text-gold mb-6">Apuestas Disponibles</h2>
            <div className="space-y-6">
              {bets?.active?.map(bet => (
                <Card key={bet.id} className="border-gold">
                  <h4 className="text-lg text-white mb-4">
                    {bet.homeTeam} vs {bet.awayTeam}
                  </h4>
                  <p className="text-gold mb-4">
                    Fecha: {new Date(bet.date).toLocaleDateString()}
                  </p>
                  <BetForm match={bet} onSubmit={createBet} />
                </Card>
              ))}
            </div>
          </Card>

          {/* Historial de Apuestas */}
          <Card>
            <h3 className="text-xl text-gold mb-6">Tus Apuestas Anteriores</h3>
            <div className="space-y-4">
              {bets?.history?.map(bet => (
                <Card key={bet.id} className="border-gray-700">
                  <h4 className="text-lg text-white mb-2">
                    {bet.homeTeam} vs {bet.awayTeam}
                  </h4>
                  <p className="text-gold">Resultado: {bet.result}</p>
                  <p className="text-white">Tu apuesta: {bet.userBet}</p>
                  <p className={`text-${bet.won ? 'green' : 'red'}-500 font-bold`}>
                    {bet.won ? 'Ganada' : 'Perdida'}
                  </p>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <div>
          {/* Vista de Leaderboard */}
          <LeaderboardCard users={leaderboardData} />
          
          {/* Resumen de reglas de puntuación */}
          <Card className="mt-6">
            <h3 className="text-xl font-bold text-gold mb-4">Sistema de Puntuación</h3>
            <ul className="space-y-2 text-white">
              <li>• Resultado exacto: 3 puntos</li>
              <li>• Acertar ganador: 1 punto</li>
              <li>• Racha de 3 aciertos: +2 puntos extra</li>
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
};