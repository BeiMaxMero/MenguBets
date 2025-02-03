// src/pages/admin/index.jsx
import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';

export const AdminPanel = () => {
  const { user } = useAuth();
  const [matchData, setMatchData] = useState({
    homeTeam: '',
    awayTeam: '',
    date: '',
    time: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí irá la lógica para crear un nuevo partido
    console.log('Nuevo partido:', matchData);
  };

  return (
    <div className="space-y-8">
      <Card>
        <h1 className="text-3xl font-bold text-gold mb-6">Panel de Control</h1>
        
        {/* Formulario para crear partidos */}
        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          <h2 className="text-2xl text-gold mb-4">Crear Nuevo Partido</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Equipo Local"
              value={matchData.homeTeam}
              onChange={(e) => setMatchData({...matchData, homeTeam: e.target.value})}
              required
            />
            <Input
              label="Equipo Visitante"
              value={matchData.awayTeam}
              onChange={(e) => setMatchData({...matchData, awayTeam: e.target.value})}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Fecha"
              value={matchData.date}
              onChange={(e) => setMatchData({...matchData, date: e.target.value})}
              required
            />
            <Input
              type="time"
              label="Hora"
              value={matchData.time}
              onChange={(e) => setMatchData({...matchData, time: e.target.value})}
              required
            />
          </div>
          
          <Button type="submit" variant="primary" className="w-full">
            Crear Partido 🎮
          </Button>
        </form>

        {/* Lista de partidos pendientes */}
        <div className="space-y-4">
          <h2 className="text-2xl text-gold mb-4">Partidos Pendientes</h2>
          {/* Aquí irá la lista de partidos pendientes */}
        </div>
      </Card>
    </div>
  );
};