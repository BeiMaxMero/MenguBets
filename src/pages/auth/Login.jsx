
// pages/auth/Login.jsx
import { Button } from '../../components/ui/Button';

export const Login = () => (
  <div className="min-h-screen bg-blue-deep flex items-center justify-center">
    <div className="text-center space-y-6">
      <h1 className="text-4xl font-bold text-gold mb-8">MenguBets ⚽🎰</h1>
      <Button 
        variant="secondary" 
        className="text-white flex items-center gap-2 mx-auto text-lg py-3 px-8"
      >
        <img src="src\assets\discord-icon.svg" className="w-6 h-6" alt="Discord" />
        Entrar con Discord
      </Button>
    </div>
  </div>
);