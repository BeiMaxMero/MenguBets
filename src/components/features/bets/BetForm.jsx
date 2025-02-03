import React, { useState } from 'react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { ScoreSelector } from './ScoreSelector';
import { Card } from '../../ui/Card';

export const BetForm = ({ match, onSubmit }) => {
  const [prediction, setPrediction] = useState({
    homeScore: 0,
    awayScore: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(`${prediction.homeScore}-${prediction.awayScore}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-blue-deep p-6">
        <div className="flex flex-col md:flex-row items-center justify-around gap-8">
          {/* Selector equipo local */}
          <ScoreSelector
            team={match.homeTeam}
            score={prediction.homeScore}
            onScoreChange={(score) => setPrediction(prev => ({ ...prev, homeScore: score }))}
          />

          {/* VS */}
          <div className="flex flex-col items-center">
            <span className="text-gold text-2xl font-bold">VS</span>
            <span className="text-sm text-gray-400">
              {new Date(match.date).toLocaleDateString()}
            </span>
          </div>

          {/* Selector equipo visitante */}
          <ScoreSelector
            team={match.awayTeam}
            score={prediction.awayScore}
            onScoreChange={(score) => setPrediction(prev => ({ ...prev, awayScore: score }))}
          />
        </div>
      </Card>

      {/* Resumen y botón de envío */}
      <div className="flex flex-col items-center gap-4">
        <p className="text-gold text-lg">
          Tu predicción: 
          <span className="font-bold ml-2">
            {prediction.homeScore} - {prediction.awayScore}
          </span>
        </p>
        <Button 
          type="submit" 
          variant="primary"
          className="text-red-casino w-full md:w-auto px-8"
        >
          Confirmar Apuesta 🎲
        </Button>
      </div>
    </form>
  );
};