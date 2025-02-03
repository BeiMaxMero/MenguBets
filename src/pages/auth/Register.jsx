// src/pages/auth/Register.jsx
import React from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const Register = () => {
  return (
    <div className="min-h-screen bg-blue-deep flex items-center justify-center">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-4xl font-bold text-gold mb-8">MenguBets ⚽🎰</h1>
        
        <div className="space-y-6">
          <p className="text-white text-center">
            Para empezar a usar MenguBets, inicia sesión con tu cuenta de Discord
          </p>

          <Button 
            variant="secondary" 
            className="flex items-center gap-2 mx-auto text-lg py-3 px-8 w-full justify-center"
          >
            <img src="/discord-logo.svg" className="w-6 h-6" alt="Discord" />
            Entrar con Discord
          </Button>

          <p className="text-sm text-gray-400 text-center">
            Al registrarte, aceptas nuestros términos y condiciones
          </p>
        </div>
      </Card>
    </div>
  );
};