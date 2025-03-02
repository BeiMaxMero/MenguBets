// src/components/features/servers/ServerDashboard.jsx
import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { BetStatsChart } from '../stats/BetStatsChart';
import { ServerStats } from '../servers/ServerStats';

export const ServerDashboard = ({ serverId }) => {
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'
  
  // Mock data - esto vendría de hooks que conectan con el backend
  const serverStats = {
    name: 'Real Madrid Fan Club',
    memberCount: 120,
    activeUsers: 45,
    totalBets: 350,
    avgBetsPerUser: 7.8,
    activeBets: 12,
    hottest: {
      match: 'Real Madrid vs Barcelona',
      date: '2024-03-15T20:00',
      totalBets: 35
    },
    competitions: [
      { name: 'La Liga', bets: 150 },
      { name: 'Champions League', bets: 120 },
      { name: 'Copa del Rey', bets: 80 }
    ],
    topPredictions: [
      { match: 'Real Madrid vs Barcelona', accuracy: 78 },
      { match: 'Atlético vs Sevilla', accuracy: 65 },
      { match: 'Valencia vs Villarreal', accuracy: 60 }
    ],
    serverStreak: ['win', 'win', 'loss', 'win', 'win'],
    topUsers: [
      { id: 1, username: 'MadridFan23', avatar: null, points: 250, winRate: 80 },
      { id: 2, username: 'BenzemaLegend', avatar: null, points: 180, winRate: 75 },
      { id: 3, username: 'ViniJr20', avatar: null, points: 150, winRate: 70 }
    ],
    activityData: {
      week: [
        { date: 'Lunes', bets: 15, users: 10 },
        { date: 'Martes', bets: 12, users: 8 },
        { date: 'Miércoles', bets: 20, users: 15 },
        { date: 'Jueves', bets: 18, users: 12 },
        { date: 'Viernes', bets: 25, users: 18 },
        { date: 'Sábado', bets: 40, users: 25 },
        { date: 'Domingo', bets: 30, users: 20 }
      ],
      month: [
        { date: 'Semana 1', bets: 120, users: 35 },
        { date: 'Semana 2', bets: 150, users: 40 },
        { date: 'Semana 3', bets: 180, users: 42 },
        { date: 'Semana 4', bets: 200, users: 45 }
      ],
      year: [
        { date: 'Enero', bets: 450, users: 40 },
        { date: 'Febrero', bets: 500, users: 42 },
        { date: 'Marzo', bets: 350, users: 45 }
      ]
    }
  };

  // Obtener los datos según el rango de tiempo seleccionado
  const getActivityData = () => {
    return serverStats.activityData[timeRange] || [];
  };

  return (
    <div className="space-y-8">
      {/* Estadísticas generales */}
      <Card>
        <h2 className="text-2xl font-bold text-gold mb-6">Resumen del Servidor</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-blue-deep text-center">
            <p className="text-sm text-gray-400">Miembros</p>
            <p className="text-3xl font-bold text-gold">{serverStats.memberCount}</p>
          </Card>
          
          <Card className="bg-blue-deep text-center">
            <p className="text-sm text-gray-400">Usuarios Activos</p>
            <p className="text-3xl font-bold text-gold">{serverStats.activeUsers}</p>
          </Card>
          
          <Card className="bg-blue-deep text-center">
            <p className="text-sm text-gray-400">Apuestas Totales</p>
            <p className="text-3xl font-bold text-gold">{serverStats.totalBets}</p>
          </Card>
          
          <Card className="bg-blue-deep text-center">
            <p className="text-sm text-gray-400">Apuestas Activas</p>
            <p className="text-3xl font-bold text-gold">{serverStats.activeBets}</p>
          </Card>
        </div>
        
        {/* Apuesta más popular */}
        <Card className="bg-blue-deep mb-6">
          <h3 className="text-lg font-bold text-gold mb-3">Partido Más Popular</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-medium">{serverStats.hottest.match}</p>
              <p className="text-sm text-gray-400">
                {new Date(serverStats.hottest.date).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <p className="text-xl font-bold text-gold">{serverStats.hottest.totalBets}</p>
              <p className="text-sm text-gray-400 text-right">apuestas</p>
            </div>
          </div>
        </Card>
        
        {/* Top usuarios */}
        <h3 className="text-lg font-bold text-gold mb-3">Top Apostadores</h3>
        <div className="space-y-3 mb-6">
          {serverStats.topUsers.map((user, index) => (
            <Card key={user.id} className="bg-blue-deep">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center mr-3">
                  <span className={`text-xl font-bold ${
                    index === 0 ? 'text-yellow-400' :
                    index === 1 ? 'text-gray-400' :
                    index === 2 ? 'text-amber-600' : 'text-white'
                  }`}>
                    #{index + 1}
                  </span>
                </div>
                
                <div className="flex items-center flex-1">
                  <img 
                    src={user.avatar || '/default-avatar.png'} 
                    alt={user.username}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <span className="text-white">{user.username}</span>
                </div>
                
                <div className="text-right">
                  <p className="text-gold font-bold">{user.points} pts</p>
                  <p className="text-xs text-gray-400">{user.winRate}% aciertos</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
      
      {/* Gráficos de actividad */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gold">Actividad Reciente</h2>
          
          <div className="flex gap-2">
            <Button
              variant={timeRange === 'week' ? 'primary' : 'ghost'}
              onClick={() => setTimeRange('week')}
              className="text-sm"
            >
              Semanal
            </Button>
            <Button
              variant={timeRange === 'month' ? 'primary' : 'ghost'}
              onClick={() => setTimeRange('month')}
              className="text-sm"
            >
              Mensual
            </Button>
            <Button
              variant={timeRange === 'year' ? 'primary' : 'ghost'}
              onClick={() => setTimeRange('year')}
              className="text-sm"
            >
              Anual
            </Button>
          </div>
        </div>
        
        {/* Gráfico de actividad */}
        <div className="h-80">
          <BetStatsChart data={getActivityData()} type={timeRange} />
        </div>
      </Card>
      
      {/* Estadísticas detalladas del servidor */}
      <ServerStats stats={serverStats} />
    </div>
  );
};