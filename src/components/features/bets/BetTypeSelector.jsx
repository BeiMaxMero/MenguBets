// src/components/features/bets/BetTypeSelector.jsx (corregido)
import React from 'react';
import { Button } from '../../ui/Button';

export const BetTypeSelector = ({ selectedType, onChange, types }) => {
  // Configuración de los tipos de apuesta con iconos y nombres
  const typeConfig = {
    'exact_score': {
      icon: '🔢',
      name: 'Resultado Exacto',
      description: 'Predice el marcador final del partido'
    },
    'match_result': {
      icon: '🏆',
      name: '1X2',
      description: 'Victoria local, empate o victoria visitante'
    },
    'total_goals': {
      icon: '⚽',
      name: 'Total de Goles',
      description: 'Más/menos de cierta cantidad de goles'
    },
    'scorer': {
      icon: '👟',
      name: 'Goleador',
      description: 'Jugador que marcará gol'
    },
    // Agregar entradas por defecto para los otros tipos
    'correct_minute': {
      icon: '⏱️',
      name: 'Minuto de Gol',
      description: 'Minuto exacto en que se marcará un gol'
    },
    'first_scorer': {
      icon: '1️⃣',
      name: 'Primer Goleador',
      description: 'Jugador que marcará el primer gol'
    },
    'score_at_half': {
      icon: '🏁',
      name: 'Resultado al Descanso',
      description: 'Marcador al final de la primera parte'
    },
    'both_teams_score': {
      icon: '🥅',
      name: 'Ambos Equipos Marcan',
      description: '¿Marcarán gol ambos equipos?'
    }
  };

  // Convertir 'types' a un array de keys si es un objeto
  const typeKeys = types ? (Array.isArray(types) ? types : Object.keys(types)) : ['exact_score', 'match_result'];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gold mb-2">Tipo de Apuesta</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {typeKeys.map(type => {
          // Manejar el caso donde no existe la configuración
          const config = typeConfig[type] || {
            icon: '📊',  // Icono por defecto
            name: type, // Usar la key como nombre
            description: 'Tipo de apuesta'
          };
          
          return (
            <Button
              key={type}
              type="button"
              variant={selectedType === type ? 'primary' : 'secondary'}
              className={`flex flex-col items-center p-3 h-auto ${
                selectedType === type ? 'border-gold' : ''
              }`}
              onClick={() => onChange(type)}
            >
              <span className="text-xl mb-1">{config.icon}</span>
              <span className="font-medium">{config.name}</span>
              <span className="text-xs mt-1 opacity-80">{config.description}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};