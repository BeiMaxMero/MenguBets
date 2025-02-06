// pages/auth/Login.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';  // Añadir esta importación
import { Button } from '../../components/ui/Button';
import { loginWithDiscord } from '../../services/discord';

export const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-blue-deep flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-gold mb-9">MenguBets ⚽🎰</h1>
        <Button 
          variant="secondary" 
          className="text-white flex items-center gap-2 mx-auto text-lg py-3 px-8"
          onClick={loginWithDiscord}
        >
          <img src="src\assets\discord-icon.svg" className="w-6 h-6" alt="Discord" />
          Entrar con Discord
        </Button>
      </div>
    </div>
  );
};