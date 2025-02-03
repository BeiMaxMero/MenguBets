// src/components/features/bets/ScoreSelector.jsx
import React from 'react';
import { Card } from '../../ui/Card';

export const ScoreSelector = ({ team, score, onScoreChange }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-white font-medium">{team}</p>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onScoreChange(Math.max(0, score - 1))}
          className="w-8 h-8 bg-blue-deep text-gold rounded-lg hover:bg-blue-700 flex items-center justify-center font-bold"
        >
          -
        </button>
        <span className="w-10 h-10 bg-blue-deep text-gold rounded-lg flex items-center justify-center font-bold text-xl">
          {score}
        </span>
        <button 
          onClick={() => onScoreChange(Math.min(9, score + 1))}
          className="w-8 h-8 bg-blue-deep text-gold rounded-lg hover:bg-blue-700 flex items-center justify-center font-bold"
        >
          +
        </button>
      </div>
    </div>
  );
};