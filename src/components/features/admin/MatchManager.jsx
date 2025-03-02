// src/components/features/admin/MatchManager.jsx
import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';
import { NotificationBanner } from '../../ui/NotificationBanner';
import { MatchCreator } from './MatchCreator';

export const MatchManager = ({ serverId }) => {
  // Estados
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'pending', 'completed'
  const [matches, setMatches] = useState({
    active: [
      {
        id: 1,
        homeTeam: 'Real Madrid',
        awayTeam: 'Barcelona',
        competition: 'laliga',
        datetime: '2024-03-22T20:00',
        description: 'El Clásico - Jornada 26',
        totalBets: 15
      },
      {
        id: 2,
        homeTeam: 'Atlético Madrid',
        awayTeam: 'Sevilla',
        competition: 'laliga',
        datetime: '2024-03-24T18:00',
        description: 'Jornada 26',
        totalBets: 8
      }
    ],
    pending: [
      {
        id: 3,
        homeTeam: 'Manchester City',
        awayTeam: 'Liverpool',
        competition: 'premier',
        datetime: '2024-04-05T17:30',
        description: 'Premier League - Jornada 30',
        totalBets: 0
      }
    ],
    completed: [
      {
        id: 4,
        homeTeam: 'Valencia',
        awayTeam: 'Villarreal',
        competition: 'laliga',
        datetime: '2024-03-10T16:00',
        description: 'Jornada 25',
        result: '2-1',
        totalBets: 12
      },
      {
        id: 5,
        homeTeam: 'Bayern Munich',
        awayTeam: 'PSG',
        competition: 'champions',
        datetime: '2024-03-12T21:00',
        description: 'Champions League - Octavos de Final',
        result: '3-2',
        totalBets: 18
      }
    ]
  });
  
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [result, setResult] = useState({ home: 0, away: 0 });
  const [notification, setNotification] = useState(null);
  
  // Constantes - estos mapeos vendrían de configuración
  const competitionNames = {
    laliga: 'La Liga',
    premier: 'Premier League',
    champions: 'Champions League',
    copa: 'Copa del Rey',
    seriea: 'Serie A'
  };
  
  // Manejadores de eventos
  const handleAddMatch = (newMatch) => {
    setMatches(prev => ({
      ...prev,
      pending: [...prev.pending, newMatch]
    }));
    setShowCreateModal(false);
    
    setNotification({
      type: 'success',
      message: `Partido ${newMatch.homeTeam} vs ${newMatch.awayTeam} creado correctamente`
    });
    
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  const handleSubmitResult = () => {
    const resultString = `${result.home}-${result.away}`;
    
    // Mover el partido a completados
    setMatches(prev => {
      const updatedActive = prev.active.filter(m => m.id !== selectedMatch.id);
      const updatedCompleted = [
        ...prev.completed, 
        { ...selectedMatch, result: resultString }
      ];
      
      return {
        ...prev,
        active: updatedActive,
        completed: updatedCompleted
      };
    });
    
    setShowResultModal(false);
    setSelectedMatch(null);
    setResult({ home: 0, away: 0 });
    
    setNotification({
      type: 'success',
      message: `Resultado ${selectedMatch.homeTeam} ${result.home}-${result.away} ${selectedMatch.awayTeam} registrado correctamente`
    });
    
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  const handleDeleteMatch = () => {
    // Eliminar el partido según su estado
    const matchState = selectedMatch.result ? 'completed' : 
                       new Date(selectedMatch.datetime) > new Date() ? 'pending' : 'active';
    
    setMatches(prev => ({
      ...prev,
      [matchState]: prev[matchState].filter(m => m.id !== selectedMatch.id)
    }));
    
    setShowDeleteConfirm(false);
    setSelectedMatch(null);
    
    setNotification({
      type: 'success',
      message: `Partido ${selectedMatch.homeTeam} vs ${selectedMatch.awayTeam} eliminado correctamente`
    });
    
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  // Renderizar la lista de partidos según la pestaña activa
  const renderMatches = () => {
    const currentMatches = matches[activeTab];
    
    if (currentMatches.length === 0) {
      return (
        <Card className="bg-blue-deep text-center p-8">
          <p className="text-gold">No hay partidos en esta categoría</p>
          {activeTab === 'pending' && (
            <Button 
              variant="primary" 
              className="mt-4"
              onClick={() => setShowCreateModal(true)}
            >
              Crear Nuevo Partido
            </Button>
          )}
        </Card>
      );
    }
    
    return currentMatches.map(match => (
      <Card key={match.id} className="bg-blue-deep">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Información del partido */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded bg-black-ebano text-gold text-xs">
                {competitionNames[match.competition] || match.competition}
              </span>
              <span className="text-gray-400 text-sm">
                {new Date(match.datetime).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <div className="flex-1 text-right">
                <p className="text-white font-bold">{match.homeTeam}</p>
              </div>
              
              <div className="mx-4">
                {match.result ? (
                  <p className="text-xl font-bold text-gold">{match.result}</p>
                ) : (
                  <p className="text-white font-bold">VS</p>
                )}
              </div>
              
              <div className="flex-1 text-left">
                <p className="text-white font-bold">{match.awayTeam}</p>
              </div>
            </div>
            
            {match.description && (
              <p className="text-sm text-gray-400 mb-2">{match.description}</p>
            )}
            
            <p className="text-sm text-gold">
              {match.totalBets} {match.totalBets === 1 ? 'apuesta' : 'apuestas'}
            </p>
          </div>
          
          {/* Acciones */}
          <div className="flex flex-row md:flex-col justify-end gap-2 mt-4 md:mt-0">
            {activeTab === 'active' && (
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedMatch(match);
                  setShowResultModal(true);
                }}
                className="text-sm"
              >
                Registrar Resultado
              </Button>
            )}
            
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedMatch(match);
                setShowDeleteConfirm(true);
              }}
              className="text-sm"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Card>
    ));
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gold">Gestión de Partidos</h2>
          <Button 
            variant="primary"
            onClick={() => setShowCreateModal(true)}
          >
            Crear Partido
          </Button>
        </div>
        
        {/* Tabs de navegación */}
        <div className="flex border-b border-gold mb-6">
          <button
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'active' 
                ? 'bg-gold text-black-ebano rounded-t-lg' 
                : 'text-gold hover:text-white'
            }`}
            onClick={() => setActiveTab('active')}
          >
            Activos
          </button>
          <button
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'pending' 
                ? 'bg-gold text-black-ebano rounded-t-lg' 
                : 'text-gold hover:text-white'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            Pendientes
          </button>
          <button
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'completed' 
                ? 'bg-gold text-black-ebano rounded-t-lg' 
                : 'text-gold hover:text-white'
            }`}
            onClick={() => setActiveTab('completed')}
          >
            Completados
          </button>
        </div>
        
        {/* Lista de partidos */}
        <div className="space-y-4">
          {renderMatches()}
        </div>
      </Card>
      
      {/* Modal para registrar resultado */}
      <Modal
        isOpen={showResultModal}
        onClose={() => {
          setShowResultModal(false);
          setSelectedMatch(null);
          setResult({ home: 0, away: 0 });
        }}
        title="Registrar Resultado"
      >
        {selectedMatch && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-lg text-white mb-2">
                {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
              </p>
              <p className="text-sm text-gold">
                {new Date(selectedMatch.datetime).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-center">
                <p className="text-white mb-2">{selectedMatch.homeTeam}</p>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={result.home}
                  onChange={(e) => setResult(prev => ({ ...prev, home: parseInt(e.target.value) || 0 }))}
                  className="w-16 h-16 text-2xl font-bold bg-blue-deep text-gold text-center rounded-lg border-2 border-gold"
                />
              </div>
              
              <div className="text-2xl text-gold font-bold">-</div>
              
              <div className="text-center">
                <p className="text-white mb-2">{selectedMatch.awayTeam}</p>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={result.away}
                  onChange={(e) => setResult(prev => ({ ...prev, away: parseInt(e.target.value) || 0 }))}
                  className="w-16 h-16 text-2xl font-bold bg-blue-deep text-gold text-center rounded-lg border-2 border-gold"
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-700">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowResultModal(false);
                    setSelectedMatch(null);
                    setResult({ home: 0, away: 0 });
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmitResult}
                >
                  Guardar Resultado
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Modal para crear partido */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nuevo Partido"
      >
        <MatchCreator
          serverId={serverId}
          onCreateMatch={handleAddMatch}
        />
      </Modal>
      
      {/* Modal de confirmación para eliminar */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedMatch(null);
        }}
        title="Confirmar Eliminación"
      >
        {selectedMatch && (
          <div className="space-y-6">
            <p className="text-white">
              ¿Estás seguro de que quieres eliminar el partido entre 
              <span className="font-bold text-gold"> {selectedMatch.homeTeam} </span>
              y 
              <span className="font-bold text-gold"> {selectedMatch.awayTeam}</span>?
            </p>
            
            {selectedMatch.totalBets > 0 && (
              <div className="bg-red-casino bg-opacity-20 p-4 rounded-lg">
                <p className="text-red-casino">
                  ¡Atención! Este partido tiene {selectedMatch.totalBets} {selectedMatch.totalBets === 1 ? 'apuesta' : 'apuestas'}.
                  Al eliminarlo, todas las apuestas asociadas también se eliminarán.
                </p>
              </div>
            )}
            
            <div className="pt-4 border-t border-gray-700">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedMatch(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  className="bg-red-casino hover:bg-red-800"
                  onClick={handleDeleteMatch}
                >
                  Eliminar Partido
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};