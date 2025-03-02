// src/components/features/bets/BetForm.jsx (corregido)
import React, { useState } from 'react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { ImprovedScoreSelector } from './ImprovedScoreSelector';
import { BetTypeSelector } from './BetTypeSelector';
import { Card } from '../../ui/Card';

export const BetForm = ({ match, onSubmit, initialValues = null, onCancel = null }) => {
  // Tipos de apuesta disponibles
  const BET_TYPES = {
    exact_score: 'exact_score',
    match_result: 'match_result',
    total_goals: 'total_goals',
    scorer: 'scorer'
  };

  // Estado para la información de la apuesta
  const [betData, setBetData] = useState(initialValues || {
    type: BET_TYPES.exact_score,
    homeScore: 0,
    awayScore: 0,
    matchResult: null, // 'home', 'draw', 'away'
    totalGoals: { value: 2.5, isOver: true }, // para apuestas over/under
    scorer: null,
    note: ''
  });
  
  // Estado separado para controlar la persistencia del formulario
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Manejador para cambios en los valores de apuesta
  const handleBetChange = (field, value) => {
    setBetData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Manejador para cambio de tipo de apuesta
  const handleTypeChange = (newType) => {
    setBetData(prev => ({
      ...prev,
      type: newType
    }));
  };

  // Función para preparar los datos de apuesta según su tipo
  const prepareBetData = () => {
    switch (betData.type) {
      case BET_TYPES.exact_score:
        return `${betData.homeScore}-${betData.awayScore}`;
      
      case BET_TYPES.match_result:
        return betData.matchResult;
      
      case BET_TYPES.total_goals:
        return `${betData.totalGoals.isOver ? 'Over' : 'Under'} ${betData.totalGoals.value}`;
      
      case BET_TYPES.scorer:
        return betData.scorer;
      
      default:
        return `${betData.homeScore}-${betData.awayScore}`;
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    const predictionData = {
      type: betData.type,
      value: prepareBetData(),
      note: betData.note
    };
    
    onSubmit(predictionData);
  };

  // Función para cancelar y cerrar el formulario
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Definimos lista de jugadores para pruebas
  const playerOptions = [
    { id: 'player1', name: 'Vinicius Jr', team: match.homeTeam },
    { id: 'player2', name: 'Bellingham', team: match.homeTeam },
    { id: 'player3', name: 'Lewandowski', team: match.awayTeam },
    { id: 'player4', name: 'Raphinha', team: match.awayTeam }
  ];

  // Renderizado del formulario según el tipo de apuesta seleccionado
  const renderBetForm = () => {
    switch (betData.type) {
      case BET_TYPES.exact_score:
        return (
          <Card className="bg-blue-deep p-6">
            <div className="flex flex-col md:flex-row items-center justify-around gap-8">
              {/* Selector equipo local */}
              <ImprovedScoreSelector
                team={match.homeTeam}
                score={betData.homeScore}
                onScoreChange={(score) => handleBetChange('homeScore', score)}
              />

              {/* VS */}
              <div className="flex flex-col items-center">
                <span className="text-gold text-2xl font-bold">VS</span>
                <span className="text-sm text-gray-400">
                  {new Date(match.date).toLocaleDateString()}
                </span>
              </div>

              {/* Selector equipo visitante */}
              <ImprovedScoreSelector
                team={match.awayTeam}
                score={betData.awayScore}
                onScoreChange={(score) => handleBetChange('awayScore', score)}
              />
            </div>
          </Card>
        );

      case BET_TYPES.match_result:
        return (
          <Card className="bg-blue-deep p-6">
            <div className="flex flex-col space-y-4">
              <p className="text-white text-center">Selecciona el resultado del partido:</p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant={betData.matchResult === 'home' ? 'primary' : 'secondary'}
                  onClick={() => handleBetChange('matchResult', 'home')}
                  className="flex-1"
                >
                  Victoria {match.homeTeam}
                </Button>
                <Button
                  variant={betData.matchResult === 'draw' ? 'primary' : 'secondary'}
                  onClick={() => handleBetChange('matchResult', 'draw')}
                  className="flex-1"
                >
                  Empate
                </Button>
                <Button
                  variant={betData.matchResult === 'away' ? 'primary' : 'secondary'}
                  onClick={() => handleBetChange('matchResult', 'away')}
                  className="flex-1"
                >
                  Victoria {match.awayTeam}
                </Button>
              </div>
            </div>
          </Card>
        );

      case BET_TYPES.total_goals:
        return (
          <Card className="bg-blue-deep p-6">
            <div className="flex flex-col space-y-6">
              <p className="text-white text-center">Goles totales en el partido:</p>
              
              <div className="flex justify-center space-x-4">
                <Button
                  variant={betData.totalGoals.isOver ? 'primary' : 'secondary'}
                  onClick={() => handleBetChange('totalGoals', {...betData.totalGoals, isOver: true})}
                >
                  Más de
                </Button>
                <Button
                  variant={!betData.totalGoals.isOver ? 'primary' : 'secondary'}
                  onClick={() => handleBetChange('totalGoals', {...betData.totalGoals, isOver: false})}
                >
                  Menos de
                </Button>
              </div>
              
              <div className="flex justify-center items-center space-x-2">
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={betData.totalGoals.value}
                  onChange={(e) => handleBetChange('totalGoals', {
                    ...betData.totalGoals,
                    value: parseFloat(e.target.value) || 0
                  })}
                  className="w-24 text-center"
                />
                <span className="text-gold">goles</span>
              </div>
            </div>
          </Card>
        );

      case BET_TYPES.scorer:
        return (
          <Card className="bg-blue-deep p-6">
            <div className="flex flex-col space-y-4">
              <p className="text-white text-center">¿Quién marcará gol?</p>
              
              <div className="grid grid-cols-2 gap-2">
                {playerOptions.map(player => (
                  <Button
                    key={player.id}
                    variant={betData.scorer === player.id ? 'primary' : 'secondary'}
                    onClick={() => handleBetChange('scorer', player.id)}
                    className="flex items-center justify-between px-3 py-2"
                  >
                    <span>{player.name}</span>
                    <span className="text-xs opacity-70">({player.team})</span>
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selector de tipo de apuesta */}
      <BetTypeSelector
        selectedType={betData.type}
        onChange={handleTypeChange}
        types={BET_TYPES}
      />
      
      {/* Formulario dinámico según el tipo de apuesta */}
      {renderBetForm()}
      
      {/* Notas adicionales (opcional) */}
      <div className="space-y-1">
        <label className="text-gold font-medium">Nota personal (opcional)</label>
        <textarea
          value={betData.note}
          onChange={(e) => handleBetChange('note', e.target.value)}
          className="w-full bg-blue-deep text-white p-3 rounded-lg border focus:ring-2 focus:ring-red-casino"
          placeholder="Añade una nota personal a tu apuesta..."
          rows={2}
        />
      </div>

      {/* Resumen y botones de acción */}
      <div className="flex flex-col items-center gap-4">
        <p className="text-gold text-lg">
          Tu predicción: 
          <span className="font-bold ml-2">
            {betData.type === BET_TYPES.exact_score && `${betData.homeScore} - ${betData.awayScore}`}
            {betData.type === BET_TYPES.match_result && (
              betData.matchResult === 'home' ? `Victoria ${match.homeTeam}` :
              betData.matchResult === 'away' ? `Victoria ${match.awayTeam}` :
              betData.matchResult === 'draw' ? 'Empate' : 'No seleccionado'
            )}
            {betData.type === BET_TYPES.total_goals && 
              `${betData.totalGoals.isOver ? 'Más' : 'Menos'} de ${betData.totalGoals.value} goles`
            }
            {betData.type === BET_TYPES.scorer && 
              (playerOptions?.find(p => p.id === betData.scorer)?.name || 'No seleccionado')
            }
          </span>
        </p>
        
        <div className="flex space-x-4">
          {onCancel && (
            <Button 
              type="button" 
              variant="ghost"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          )}
          
          <Button 
            type="submit" 
            variant="primary"
            className="text-black-ebano w-full md:w-auto px-8"
            disabled={
              (betData.type === BET_TYPES.match_result && !betData.matchResult) ||
              (betData.type === BET_TYPES.scorer && !betData.scorer)
            }
          >
            Confirmar Apuesta 🎲
          </Button>
        </div>
      </div>
    </form>
  );
};