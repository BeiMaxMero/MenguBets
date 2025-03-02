// src/components/features/admin/MatchCreator.jsx
import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { NotificationBanner } from '../../ui/NotificationBanner';
import { isRequired, isInRange } from '../../../utils/validators';

export const MatchCreator = ({ serverId, onCreateMatch }) => {
  const [matchData, setMatchData] = useState({
    homeTeam: '',
    awayTeam: '',
    competition: 'laliga',
    date: '',
    time: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lista de competiciones disponibles para este servidor
  const availableCompetitions = [
    { id: 'laliga', name: 'La Liga' },
    { id: 'premier', name: 'Premier League' },
    { id: 'champions', name: 'Champions League' },
    { id: 'copa', name: 'Copa del Rey' },
    { id: 'seriea', name: 'Serie A' }
  ];

  // Lista de equipos disponibles por competición
  const teamsByCompetition = {
    laliga: [
      'Real Madrid', 'Barcelona', 'Atlético Madrid', 'Sevilla', 
      'Real Sociedad', 'Villarreal', 'Athletic Bilbao', 'Valencia'
    ],
    premier: [
      'Manchester City', 'Manchester United', 'Liverpool', 'Chelsea', 
      'Arsenal', 'Tottenham', 'Newcastle', 'Aston Villa'
    ],
    champions: [
      'Real Madrid', 'Barcelona', 'Manchester City', 'Bayern Munich', 
      'PSG', 'Inter Milan', 'Borussia Dortmund', 'Liverpool'
    ],
    copa: [
      'Real Madrid', 'Barcelona', 'Atlético Madrid', 'Sevilla', 
      'Real Sociedad', 'Villarreal', 'Athletic Bilbao', 'Valencia'
    ],
    seriea: [
      'Inter Milan', 'AC Milan', 'Juventus', 'Napoli', 
      'Roma', 'Lazio', 'Atalanta', 'Fiorentina'
    ]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMatchData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error al cambiar el valor
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }

    // Si se cambia la competición, resetear los equipos
    if (name === 'competition') {
      setMatchData(prev => ({
        ...prev,
        homeTeam: '',
        awayTeam: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Validar campos requeridos
    const requiredFields = ['homeTeam', 'awayTeam', 'date', 'time'];
    requiredFields.forEach(field => {
      const error = isRequired(matchData[field]);
      if (error) newErrors[field] = error;
    });
    
    // Validar que no sea el mismo equipo
    if (matchData.homeTeam && matchData.homeTeam === matchData.awayTeam) {
      newErrors.awayTeam = 'El equipo visitante no puede ser igual al local';
    }
    
    // Validar fecha futura
    if (matchData.date && matchData.time) {
      const matchDateTime = new Date(`${matchData.date}T${matchData.time}`);
      if (matchDateTime <= new Date()) {
        newErrors.date = 'La fecha del partido debe ser futura';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      setNotification({
        type: 'error',
        message: 'Por favor, corrige los errores del formulario'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Aquí iría la lógica para crear el partido
      const match = {
        ...matchData,
        id: Date.now(), // Temporal, luego lo asignará el backend
        datetime: `${matchData.date}T${matchData.time}`,
        serverId
      };
      
      // Simulamos una llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onCreateMatch) {
        onCreateMatch(match);
      }
      
      // Resetear el formulario
      setMatchData({
        homeTeam: '',
        awayTeam: '',
        competition: 'laliga',
        date: '',
        time: '',
        description: ''
      });
      
      setNotification({
        type: 'success',
        message: 'Partido creado correctamente'
      });
      
    } catch (error) {
      console.error('Error creating match:', error);
      setNotification({
        type: 'error',
        message: 'Error al crear el partido. Inténtalo de nuevo.'
      });
    } finally {
      setIsSubmitting(false);
      
      // Limpiar notificación después de un tiempo
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gold mb-6">Crear Nuevo Partido</h2>
      
      {notification && (
        <div className="mb-6">
          <NotificationBanner 
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selección de competición */}
        <div className="space-y-1">
          <label className="text-gold font-medium">Competición</label>
          <select
            name="competition"
            value={matchData.competition}
            onChange={handleInputChange}
            className="w-full bg-blue-deep text-white p-3 rounded-lg border focus:ring-2 focus:ring-red-casino"
          >
            {availableCompetitions.map(comp => (
              <option key={comp.id} value={comp.id}>
                {comp.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Selección de equipos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-gold font-medium">Equipo Local</label>
            <select
              name="homeTeam"
              value={matchData.homeTeam}
              onChange={handleInputChange}
              className="w-full bg-blue-deep text-white p-3 rounded-lg border focus:ring-2 focus:ring-red-casino"
            >
              <option value="">Selecciona equipo local</option>
              {teamsByCompetition[matchData.competition]?.map(team => (
                <option key={`home-${team}`} value={team}>
                  {team}
                </option>
              ))}
            </select>
            {errors.homeTeam && <span className="text-red-casino text-sm">{errors.homeTeam}</span>}
          </div>
          
          <div className="space-y-1">
            <label className="text-gold font-medium">Equipo Visitante</label>
            <select
              name="awayTeam"
              value={matchData.awayTeam}
              onChange={handleInputChange}
              className="w-full bg-blue-deep text-white p-3 rounded-lg border focus:ring-2 focus:ring-red-casino"
            >
              <option value="">Selecciona equipo visitante</option>
              {teamsByCompetition[matchData.competition]?.map(team => (
                <option key={`away-${team}`} value={team} disabled={team === matchData.homeTeam}>
                  {team}
                </option>
              ))}
            </select>
            {errors.awayTeam && <span className="text-red-casino text-sm">{errors.awayTeam}</span>}
          </div>
        </div>
        
        {/* Fecha y hora */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Fecha"
            type="date"
            name="date"
            value={matchData.date}
            onChange={handleInputChange}
            error={errors.date}
            min={new Date().toISOString().split('T')[0]}
          />
          
          <Input
            label="Hora"
            type="time"
            name="time"
            value={matchData.time}
            onChange={handleInputChange}
            error={errors.time}
          />
        </div>
        
        {/* Descripción */}
        <div className="space-y-1">
          <label className="text-gold font-medium">Descripción (opcional)</label>
          <textarea
            name="description"
            value={matchData.description}
            onChange={handleInputChange}
            placeholder="Añade información adicional sobre este partido"
            className="w-full bg-blue-deep text-white p-3 rounded-lg border focus:ring-2 focus:ring-red-casino"
            rows={3}
          />
        </div>
        
        {/* Vista previa */}
        {matchData.homeTeam && matchData.awayTeam && (
          <Card className="bg-blue-deep p-4">
            <h4 className="text-lg font-bold text-gold mb-2">Vista Previa</h4>
            <div className="flex justify-between items-center">
              <div className="text-center">
                <p className="text-white font-bold text-lg">{matchData.homeTeam}</p>
                <p className="text-gold text-sm">Local</p>
              </div>
              
              <div className="text-center">
                <p className="text-white text-lg font-bold">VS</p>
                <p className="text-gold text-sm">
                  {availableCompetitions.find(c => c.id === matchData.competition)?.name}
                </p>
                {matchData.date && matchData.time && (
                  <p className="text-white text-xs">
                    {new Date(`${matchData.date}T${matchData.time}`).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
              
              <div className="text-center">
                <p className="text-white font-bold text-lg">{matchData.awayTeam}</p>
                <p className="text-gold text-sm">Visitante</p>
              </div>
            </div>
          </Card>
        )}
        
        {/* Botones de acción */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setMatchData({
                homeTeam: '',
                awayTeam: '',
                competition: 'laliga',
                date: '',
                time: '',
                description: ''
              });
              setErrors({});
            }}
          >
            Limpiar
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gold border-t-transparent mr-2"></div>
                Creando...
              </div>
            ) : (
              'Crear Partido'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};