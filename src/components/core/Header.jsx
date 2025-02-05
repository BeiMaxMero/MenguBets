// Header.jsx
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { loginWithDiscord } from '../../services/discord';

export const Header = () => {
  const { user, logout } = useAuth();  // Obtener logout del contexto

  return (
    <header className="bg-blue-deep p-4 border-b-2 border-gold shadow-lg">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Logo" className="h-12 w-12" />
          <h1 className="text-2xl font-bold text-gold">MenguBets 🏆</h1>
        </div>
        
        {user ? (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <img 
                src={user.avatar || '/default-avatar.png'} 
                alt="Avatar" 
                className="h-10 w-10 rounded-full border-2 border-gold"
              />
              <span className="text-gold font-medium">{user.username}</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={logout}
            >
              <span className="text-gold font-medium">Salir</span>
            </Button>
          </div>
        ) : (
          <Button 
            variant="secondary" 
            className="flex items-center gap-2"
            onClick={loginWithDiscord}
          >
            <img src="/discord-logo.svg" className="w-6 h-6" alt="Discord" />
            Conectar con Discord
          </Button>
        )}
      </nav>
    </header>
  );
};