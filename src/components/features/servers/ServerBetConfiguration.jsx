// src/components/features/servers/ServerBetConfiguration.jsx
import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Modal } from '../../ui/Modal';
import { NotificationBanner } from '../../ui/NotificationBanner';

export const ServerBetConfiguration = ({ serverId }) => {
  const [competitions, setCompetitions] = useState([
    { id: 'laliga', name: 'La Liga', enabled: true, icon: '⚽' },
    { id: 'premier', name: 'Premier League', enabled: true, icon: '⚽' },
    { id: 'champions', name: 'Champions League', enabled: true, icon: '🏆' },
    { id: 'copa', name: 'Copa del Rey', enabled: false, icon: '🏆' },
    { id: 'europa', name: 'Europa League', enabled: false, icon: '🏆' }
  ]);
  
  const [scoringConfig, setScoringConfig] = useState({
    exactScore: 3,
    correctWinner: 1,
    streakBonus: 2,
    minimumBets: 5
  });
  
  const [generalConfig, setGeneralConfig] = useState({
    betCloseMinutes: 15,
    autoPostResults: true,
    publicLeaderboard: true,
    notifyNewBets: true
  });
  
  const [showAddCompModal, setShowAddCompModal] = useState(false);
  const [newCompetition, setNewCompetition] = useState({ name: '', id: '', icon: '⚽' });
  const [notification, setNotification] = useState(null);
  
  // Manejadores de eventos
  const handleCompetitionToggle = (id) => {
    setCompetitions(prevComps => 
      prevComps.map(comp => 
        comp.id === id ? { ...comp, enabled: !comp.enabled } : comp
      )
    );
  };
  
  const handleScoringChange = (e) => {
    const { name, value } = e.target;
    setScoringConfig(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };
  
  const handleGeneralConfigChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneralConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSaveConfig = () => {
    // Aquí iría la lógica para guardar la configuración
    console.log('Configuración guardada:', {
      competitions: competitions.filter(c => c.enabled),
      scoring: scoringConfig,
      general: generalConfig
    });
    
    setNotification({
      type: 'success',
      message: 'Configuración guardada correctamente'
    });
    
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  const handleAddCompetition = () => {
    // Validar los campos
    if (!newCompetition.name || !newCompetition.id) {
      setNotification({
        type: 'error',
        message: 'Todos los campos son obligatorios'
      });
      return;
    }
    
    // Verificar si ya existe una competición con ese ID
    if (competitions.some(c => c.id === newCompetition.id)) {
      setNotification({
        type: 'error',
        message: 'Ya existe una competición con ese ID'
      });
      return;
    }
    
    // Añadir la nueva competición
    setCompetitions(prev => [
      ...prev,
      { ...newCompetition, enabled: true }
    ]);
    
    // Resetear el formulario y cerrar el modal
    setNewCompetition({ name: '', id: '', icon: '⚽' });
    setShowAddCompModal(false);
    
    // Mostrar notificación de éxito
    setNotification({
      type: 'success',
      message: `Competición "${newCompetition.name}" añadida`
    });
    
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  return (
    <div className="space-y-6">
      {notification && (
        <NotificationBanner
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      
      <Card>
        <h2 className="text-2xl font-bold text-gold mb-6">Configuración de Apuestas</h2>
        
        {/* Gestión de competiciones */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl text-gold">Competiciones</h3>
            <Button 
              variant="secondary"
              onClick={() => setShowAddCompModal(true)}
            >
              Añadir Competición
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {competitions.map(comp => (
              <Card 
                key={comp.id} 
                className={`bg-blue-deep flex justify-between items-center ${
                  !comp.enabled && 'opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{comp.icon}</span>
                  <span className="font-medium text-white">{comp.name}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={comp.enabled}
                    onChange={() => handleCompetitionToggle(comp.id)}
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-gold peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Sistema de puntuación */}
        <div className="mb-8">
          <h3 className="text-xl text-gold mb-4">Sistema de Puntuación</h3>
          <Card className="bg-blue-deep">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Puntos por resultado exacto"
                type="number"
                name="exactScore"
                value={scoringConfig.exactScore}
                onChange={handleScoringChange}
                min={0}
              />
              <Input
                label="Puntos por acertar ganador"
                type="number"
                name="correctWinner"
                value={scoringConfig.correctWinner}
                onChange={handleScoringChange}
                min={0}
              />
              <Input
                label="Bonus por racha (3 aciertos)"
                type="number"
                name="streakBonus"
                value={scoringConfig.streakBonus}
                onChange={handleScoringChange}
                min={0}
              />
              <Input
                label="Mínimo de apuestas para clasificar"
                type="number"
                name="minimumBets"
                value={scoringConfig.minimumBets}
                onChange={handleScoringChange}
                min={0}
              />
            </div>
          </Card>
        </div>
        
        {/* Configuración general */}
        <div className="mb-8">
          <h3 className="text-xl text-gold mb-4">Configuración General</h3>
          <Card className="bg-blue-deep">
            <div className="space-y-4">
              <Input
                label="Minutos antes del partido para cerrar apuestas"
                type="number"
                name="betCloseMinutes"
                value={generalConfig.betCloseMinutes}
                onChange={handleGeneralConfigChange}
                min={0}
              />
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="autoPostResults" 
                    name="autoPostResults"
                    checked={generalConfig.autoPostResults}
                    onChange={handleGeneralConfigChange}
                    className="h-4 w-4 text-gold border-gold rounded"
                  />
                  <label htmlFor="autoPostResults" className="text-white">
                    Publicar resultados automáticamente
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="publicLeaderboard" 
                    name="publicLeaderboard"
                    checked={generalConfig.publicLeaderboard}
                    onChange={handleGeneralConfigChange}
                    className="h-4 w-4 text-gold border-gold rounded"
                  />
                  <label htmlFor="publicLeaderboard" className="text-white">
                    Clasificación pública para todos
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="notifyNewBets" 
                    name="notifyNewBets"
                    checked={generalConfig.notifyNewBets}
                    onChange={handleGeneralConfigChange}
                    className="h-4 w-4 text-gold border-gold rounded"
                  />
                  <label htmlFor="notifyNewBets" className="text-white">
                    Notificar nuevas apuestas disponibles
                  </label>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Botones de acción */}
        <div className="flex justify-end gap-4">
          <Button variant="ghost">Restablecer Valores</Button>
          <Button variant="primary" onClick={handleSaveConfig}>
            Guardar Configuración
          </Button>
        </div>
      </Card>
      
      {/* Modal para añadir competición */}
      <Modal
        isOpen={showAddCompModal}
        onClose={() => setShowAddCompModal(false)}
        title="Añadir Nueva Competición"
      >
        <div className="space-y-4">
          <Input
            label="Nombre de la competición"
            value={newCompetition.name}
            onChange={(e) => setNewCompetition({...newCompetition, name: e.target.value})}
            placeholder="Ej: Serie A"
          />
          
          <Input
            label="ID de la competición"
            value={newCompetition.id}
            onChange={(e) => setNewCompetition({...newCompetition, id: e.target.value.toLowerCase().replace(/\s+/g, '')})}
            placeholder="Ej: seriea"
            helperText="Sin espacios, solo letras y números"
          />
          
          <div className="space-y-1">
            <label className="text-gold font-medium">Icono</label>
            <div className="grid grid-cols-4 gap-2">
              {['⚽', '🏆', '🥅', '🏟️', '🎮', '🎯', '🎲', '🎰'].map(icon => (
                <button
                  key={icon}
                  type="button"
                  className={`text-2xl p-2 rounded border ${
                    newCompetition.icon === icon 
                      ? 'border-gold bg-blue-700' 
                      : 'border-gray-700 bg-blue-deep'
                  }`}
                  onClick={() => setNewCompetition({...newCompetition, icon})}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-4">
            <Button
              variant="ghost"
              onClick={() => setShowAddCompModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleAddCompetition}
            >
              Añadir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};