// src/components/features/user/UserProfile.jsx
import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { UserAvatar } from '../../ui/UserAvatar';
import { BetStatsChart } from '../stats/BetStatsChart';
import { useAuth } from '../../../context/AuthContext';

export const UserProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('stats'); // 'stats', 'history', 'settings'
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    bio: 'Aficionado a las apuestas deportivas',
    notificationsEnabled: true
  });
  
  // Mock data - esto vendría de un hook
  const userData = {
    username: user?.username || 'Usuario',
    avatar: user?.avatar,
    joinDate: '15/01/2024',
    totalBets: 120,
    winRate: 75,
    points: 360,
    streak: ['win', 'win', 'win', 'loss', 'win'],
    badges: [
      { id: 1, name: 'Apostador Novato', icon: '🎲', description: 'Realizó sus primeras 10 apuestas' },
      { id: 2, name: 'Racha Ganadora', icon: '🔥', description: 'Consiguió una racha de 3 victorias' },
      { id: 3, name: 'Experto en La Liga', icon: '⚽', description: 'Acertó más del 80% en La Liga' }
    ],
    favoriteCompetitions: [
      { id: 'laliga', name: 'La Liga', winRate: 82 },
      { id: 'premier', name: 'Premier League', winRate: 68 },
      { id: 'champions', name: 'Champions League', winRate: 75 }
    ],
    betHistory: [
      { id: 1, match: 'Real Madrid vs Barcelona', date: '2024-02-15', prediction: '2-1', result: '2-1', points: 3, status: 'won' },
      { id: 2, match: 'Atlético vs Sevilla', date: '2024-02-10', prediction: '1-0', result: '1-1', points: 0, status: 'lost' },
      { id: 3, match: 'Valencia vs Villarreal', date: '2024-02-05', prediction: '2-2', result: '2-2', points: 3, status: 'won' },
      { id: 4, match: 'Athletic vs Betis', date: '2024-01-28', prediction: '1-0', result: '0-0', points: 0, status: 'lost' },
      { id: 5, match: 'Man City vs Liverpool', date: '2024-01-20', prediction: '3-2', result: '3-2', points: 3, status: 'won' }
    ]
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para actualizar el perfil
    console.log('Formulario enviado:', profileForm);
    setIsEditing(false);
  };

  // Renderizado condicional según la pestaña activa
  const renderTabContent = () => {
    switch(activeTab) {
      case 'stats':
        return (
          <div className="space-y-6">
            {/* Gráfico de estadísticas */}
            <BetStatsChart />
            
            {/* Competiciones favoritas */}
            <Card className="p-4">
              <h3 className="text-xl font-bold text-gold mb-4">Competiciones Favoritas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userData.favoriteCompetitions.map(comp => (
                  <Card key={comp.id} className="bg-blue-deep">
                    <h4 className="text-lg font-bold text-white mb-2">{comp.name}</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Tasa de acierto:</span>
                      <span className="text-xl font-bold text-gold">{comp.winRate}%</span>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
            
            {/* Insignias conseguidas */}
            <Card className="p-4">
              <h3 className="text-xl font-bold text-gold mb-4">Insignias</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userData.badges.map(badge => (
                  <Card key={badge.id} className="bg-blue-deep flex items-center gap-3 p-3">
                    <div className="text-3xl">{badge.icon}</div>
                    <div>
                      <h4 className="text-white font-bold">{badge.name}</h4>
                      <p className="text-gray-400 text-sm">{badge.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        );
        
      case 'history':
        return (
          <Card className="p-4">
            <h3 className="text-xl font-bold text-gold mb-4">Historial de Apuestas</h3>
            <div className="space-y-4">
              {userData.betHistory.map(bet => (
                <Card 
                  key={bet.id} 
                  className={`p-3 border-2 ${
                    bet.status === 'won' ? 'border-green-500' : 'border-red-500'
                  }`}
                >
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <p className="text-white font-medium">{bet.match}</p>
                      <p className="text-sm text-gray-400">{new Date(bet.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right mt-2 md:mt-0">
                      <p className="text-gold">
                        Predicción: <span className="font-bold">{bet.prediction}</span>
                      </p>
                      <p className="text-gold">
                        Resultado: <span className="font-bold">{bet.result}</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      bet.status === 'won' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {bet.status === 'won' ? 'Ganada' : 'Perdida'}
                    </span>
                    <span className="text-gold font-bold">+{bet.points} pts</span>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        );
        
      case 'settings':
        return (
          <Card className="p-4">
            <h3 className="text-xl font-bold text-gold mb-4">Configuración de Perfil</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                label="Nombre de Usuario" 
                name="username"
                value={profileForm.username}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <div className="space-y-1">
                <label className="text-gold font-medium">Biografía</label>
                <textarea 
                  name="bio"
                  value={profileForm.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full bg-blue-deep text-white p-3 rounded-lg border focus:ring-2 focus:ring-red-casino"
                  rows={4}
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="notifications" 
                  name="notificationsEnabled"
                  checked={profileForm.notificationsEnabled}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-gold border-gold rounded"
                />
                <label htmlFor="notifications" className="text-white">
                  Recibir notificaciones de nuevas apuestas
                </label>
              </div>
              
              <div className="pt-4 flex gap-4 justify-end">
                {isEditing ? (
                  <>
                    <Button 
                      type="button" 
                      variant="ghost"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" variant="primary">
                      Guardar Cambios
                    </Button>
                  </>
                ) : (
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar Perfil
                  </Button>
                )}
              </div>
            </form>
          </Card>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header del perfil */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <UserAvatar user={userData} size="lg" className="w-24 h-24 border-2 border-gold" />
            <div className="absolute -top-2 -right-2 bg-gold rounded-full px-2 py-1 text-black-ebano font-bold text-sm">
              Nivel 15
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gold">{userData.username}</h2>
            <p className="text-gray-400">Miembro desde {userData.joinDate}</p>
            
            <div className="flex flex-wrap gap-4 mt-3 justify-center md:justify-start">
              <div className="text-center">
                <p className="text-sm text-gray-400">Apuestas</p>
                <p className="text-xl font-bold text-gold">{userData.totalBets}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Aciertos</p>
                <p className="text-xl font-bold text-gold">{userData.winRate}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Puntos</p>
                <p className="text-xl font-bold text-gold">{userData.points}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Racha actual */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-gold mb-2">Racha actual:</p>
          <div className="flex gap-2">
            {userData.streak.map((result, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  result === 'win' ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {result === 'win' ? '✓' : '✗'}
              </div>
            ))}
          </div>
        </div>
      </Card>
      
      {/* Tabs de navegación */}
      <div className="flex border-b border-gold">
        <button
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'stats' 
              ? 'bg-gold text-black-ebano rounded-t-lg' 
              : 'text-gold hover:text-white'
          }`}
          onClick={() => setActiveTab('stats')}
        >
          Estadísticas
        </button>
        <button
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'history' 
              ? 'bg-gold text-black-ebano rounded-t-lg' 
              : 'text-gold hover:text-white'
          }`}
          onClick={() => setActiveTab('history')}
        >
          Historial
        </button>
        <button
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'settings' 
              ? 'bg-gold text-black-ebano rounded-t-lg' 
              : 'text-gold hover:text-white'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          Configuración
        </button>
      </div>
      
      {/* Contenido según la pestaña activa */}
      {renderTabContent()}
    </div>
  );
};