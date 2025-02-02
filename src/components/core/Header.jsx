import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-blue-deep p-4 border-b-2 border-gold">
      <nav className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gold">MenguBets 🎰</h1>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gold">{user.discordUsername}</span>
            <Button variant="ghost">Cerrar Sesión</Button>
          </div>
        ) : (
          <Button variant="secondary">Login con Discord</Button>
        )}
      </nav>
    </header>
  );
};