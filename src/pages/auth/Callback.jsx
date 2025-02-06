// pages/auth/Callback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDiscordUser } from '../../services/discord';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/core/LoadingSpinner';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        console.error('Error en la autenticación:', error);
        navigate('/login');
        return;
      }

      if (!code) {
        console.error('No se recibió código de autorización');
        navigate('/login');
        return;
      }

      try {
        const userData = await getDiscordUser(code);
        if (userData) {
          await login(userData);
          navigate('/');
        } else {
          throw new Error('No se recibieron datos de usuario');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [login, navigate]);

  return (
    <div className="min-h-screen bg-blue-deep flex items-center justify-center">
      <Card className="w-full max-w-md p-8 text-center">
        <LoadingSpinner />
        <p className="text-gold mt-4">Autenticando con Discord...</p>
      </Card>
    </div>
  );
};