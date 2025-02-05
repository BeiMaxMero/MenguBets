// pages/auth/Callback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDiscordUser } from '../../services/discord';
import { useAuth } from '../../context/AuthContext';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const code = new URLSearchParams(window.location.search).get('code');
      console.log('Received code:', code);

      if (code) {
        try {
          const userData = await getDiscordUser(code);
          console.log('Discord user data:', userData);
          await login(userData);
          navigate('/');
        } catch (error) {
          console.error('Error fetching user data:', error);
          navigate('/login');
        }
      }
    };

    handleCallback();
  }, []);

  return <div>Autenticando...</div>;
};