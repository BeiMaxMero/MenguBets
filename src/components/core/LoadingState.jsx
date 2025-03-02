// src/components/core/LoadingState.jsx
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { Card } from '../ui/Card';

export const LoadingState = ({ 
  isLoading, 
  error, 
  children, 
  loadingMessage = 'Cargando datos...',
  errorMessage = 'Ha ocurrido un error al cargar los datos.',
  onRetry = null
}) => {
  if (isLoading) {
    return (
      <Card className="flex flex-col items-center justify-center p-8">
        <LoadingSpinner />
        <p className="mt-4 text-gold">{loadingMessage}</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-casino bg-blue-deep">
        <div className="text-center p-4">
          <p className="text-red-casino mb-2">{errorMessage}</p>
          <p className="text-white mb-4">{error.toString()}</p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="px-4 py-2 bg-blue-deep text-gold border border-gold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          )}
        </div>
      </Card>
    );
  }

  return children;
};