// src/components/features/bets/ImprovedScoreSelector.jsx
import React, { useState, useEffect } from 'react';

export const ImprovedScoreSelector = ({ team, score, onScoreChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(score?.toString() || "0");

  // Actualizar el input cuando cambia el score externamente
  useEffect(() => {
    setInputValue((score ?? 0).toString());
  }, [score]);

  // Manejador para cuando se cambia el input manualmente
  const handleInputChange = (e) => {
    // Permitir solo números entre 0 y 99
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 99)) {
      setInputValue(value);
    }
  };

  // Confirmar el cambio de score cuando se pierde el foco o se presiona Enter
  const handleScoreConfirm = () => {
    const newScore = inputValue === '' ? 0 : parseInt(inputValue);
    onScoreChange(newScore);
    setIsEditing(false);
  };

  // Manejar tecla Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleScoreConfirm();
    }
  };

  // Incrementar o decrementar el score
  const adjustScore = (amount) => {
    const currentScore = score ?? 0;
    const newScore = Math.max(0, Math.min(99, currentScore + amount));
    onScoreChange(newScore);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-white font-medium text-center">{team || "Equipo"}</p>
      
      <div className="flex items-center gap-2">
        {/* Botón para decrementar */}
        <button 
          type="button"
          onClick={() => adjustScore(-1)}
          className="w-8 h-8 bg-blue-deep text-gold rounded-lg hover:bg-blue-700 flex items-center justify-center font-bold"
          aria-label="Decrementar"
        >
          -
        </button>
        
        {/* Indicador/input de score */}
        {isEditing ? (
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleScoreConfirm}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-12 h-12 bg-blue-deep text-gold rounded-lg text-center font-bold text-xl border-2 border-gold focus:outline-none"
            maxLength={2}
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="w-12 h-12 bg-blue-deep text-gold rounded-lg flex items-center justify-center font-bold text-xl border border-gold hover:border-2"
          >
            {score ?? 0}
          </button>
        )}
        
        {/* Botón para incrementar */}
        <button 
          type="button"
          onClick={() => adjustScore(1)}
          className="w-8 h-8 bg-blue-deep text-gold rounded-lg hover:bg-blue-700 flex items-center justify-center font-bold"
          aria-label="Incrementar"
        >
          +
        </button>
      </div>
      
      {/* Botones de acceso rápido */}
      <div className="grid grid-cols-4 gap-1 mt-1 w-full max-w-xs">
        {[0, 1, 2, 3].map(num => (
          <button
            key={num}
            type="button"
            onClick={() => onScoreChange(num)}
            className={`w-8 h-6 text-xs rounded ${
              score === num 
                ? 'bg-gold text-black-ebano' 
                : 'bg-blue-700 text-gold'
            } hover:opacity-80`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};