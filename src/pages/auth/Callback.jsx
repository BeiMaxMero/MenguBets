// src/pages/auth/Callback.jsx
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { discordService } from '../../services/discord';
import { LoadingSpinner } from '../../components/core/LoadingSpinner';

export const Callback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        if (!code) {
          throw new Error('No code provided');
        }

        // Obtener el token
        const tokenData = await discordService.getAccessToken(code);
        
        // Obtener información del usuario
        const userData = await discordService.getUserInfo(tokenData.access_token);
        
        // Guardar el token y la información del usuario
        localStorage.setItem('discord_token', tokenData.access_token);
        
        // Actualizar el contexto
        setUser({
          id: userData.id,
          username: userData.username,
          discriminator: userData.discriminator,
          avatar: userData.avatar,
          accessToken: tokenData.access_token
        });

        // Redirigir al dashboard
        navigate('/');
      } catch (error) {
        console.error('Error en autenticación:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser]);

  return (
    <div className="min-h-screen bg-blue-deep flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner />
        <p className="text-gold">Conectando con Discord...</p>
      </div>
    </div>
  );
};