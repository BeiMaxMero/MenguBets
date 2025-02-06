// pages/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Card className="max-w-lg mx-auto text-center">
      <h1 className="text-4xl font-bold text-gold mb-4">404</h1>
      <p className="text-xl text-white mb-8">
        ¡Oops! Parece que te has perdido en el mundo de las apuestas
      </p>
      <Button
        variant="primary"
        onClick={() => navigate('/')}
        className="mx-auto"
      >
        Volver al inicio 🏠
      </Button>
    </Card>
  );
};