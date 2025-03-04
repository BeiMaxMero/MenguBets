// src/pages/auth/Callback.jsx - Improved version
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDiscordUser } from '../../services/discord';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/core/LoadingSpinner';
import { NotificationBanner } from '../../components/ui/NotificationBanner';
import { Button } from '../../components/ui/Button';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [processingState, setProcessingState] = useState('loading'); // 'loading', 'success', 'error'

  useEffect(() => {
    // Only run once on component mount
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const errorParam = params.get('error');

      // Clear the URL to prevent code reuse
      window.history.replaceState({}, document.title, window.location.pathname);

      if (errorParam) {
        console.error('Error in authentication:', errorParam);
        setError(`Error en la autenticación: ${errorParam}`);
        setProcessingState('error');
        return;
      }

      if (!code) {
        console.error('No se recibió código de autorización');
        setError('No se recibió código de autorización');
        setProcessingState('error');
        return;
      }

      try {
        setProcessingState('loading');
        
        // Added delay to ensure UI shows loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const userData = await getDiscordUser(code, state);
        
        if (userData) {
          await login(userData);
          setProcessingState('success');
          
          // Short delay before redirecting for better UX
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          throw new Error('No se recibieron datos de usuario');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        
        // Provide more user-friendly error messages
        let errorMessage = 'Error durante el inicio de sesión';
        
        if (error.message?.includes('Token Error')) {
          if (error.message.includes('invalid_grant')) {
            errorMessage = 'El código de autorización ha expirado o ya fue utilizado. Por favor, intenta iniciar sesión nuevamente.';
          } else {
            errorMessage = 'Error con el token de Discord. Por favor, intenta de nuevo.';
          }
        }
        
        setError(errorMessage);
        setProcessingState('error');
      }
    };

    handleCallback();
  }, [login, navigate]); // Only dependencies that won't change

  return (
    <div className="min-h-screen bg-blue-deep flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        {processingState === 'loading' && (
          <>
            <LoadingSpinner />
            <p className="text-gold mt-4">Autenticando con Discord...</p>
            <p className="text-gray-400 mt-2 text-sm">Verificando credenciales...</p>
          </>
        )}
        
        {processingState === 'success' && (
          <>
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-gold text-xl font-bold mb-2">¡Autenticación exitosa!</h2>
              <p className="text-white">Iniciando sesión en MenguBets...</p>
            </div>
          </>
        )}
        
        {processingState === 'error' && (
          <>
            <div className="mb-6">
              <div className="text-5xl mb-4">❌</div>
              <h2 className="text-red-500 text-xl font-bold mb-4">Error de autenticación</h2>
              <NotificationBanner
                type="error"
                message={error || 'Ha ocurrido un error durante la autenticación'}
              />
            </div>
            
            <div className="mt-6">
              <Button
                variant="primary"
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Volver a intentar
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};