// src/pages/BetSearch.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/core/LoadingSpinner';

export const BetSearch = () => {
  // Estados
  const [isLoading, setIsLoading] = useState(true);
  const [bets, setBets] = useState([]);
  const [filteredBets, setFilteredBets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    competition: 'all',
    status: 'all',
    timeRange: 'all',
    sortBy: 'date'
  });
  
  // Datos de ejemplo - esto vendría de un hook
  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const mockBets = [
        {
          id: 1,
          homeTeam: 'Real Madrid',
          awayTeam: 'Barcelona',
          competition: 'laliga',
          date: '2024-04-12T20:00',
          status: 'pending',
          totalBets: 35,
          userBet: null
        },
        {
          id: 2,
          homeTeam: 'Atlético Madrid',
          awayTeam: 'Sevilla',
          competition: 'laliga',
          date: '2024-04-14T18:30',
          status: 'pending',
          totalBets: 22,
          userBet: '1-0'
        },
        {
          id: 3,
          homeTeam: 'Manchester City',
          awayTeam: 'Liverpool',
          competition: 'premier',
          date: '2024-04-08T17:00',
          status: 'completed',
          result: '2-1',
          totalBets: 48,
          userBet: '2-1',
          won: true
        },
        {
          id: 4,
          homeTeam: 'Bayern Munich',
          awayTeam: 'PSG',
          competition: 'champions',
          date: '2024-04-10T21:00',
          status: 'completed',
          result: '3-2',
          totalBets: 55,
          userBet: '2-2',
          won: false
        },
        {
          id: 5,
          homeTeam: 'Valencia',
          awayTeam: 'Villarreal',
          competition: 'laliga',
          date: '2024-03-25T16:00',
          status: 'completed',
          result: '0-0',
          totalBets: 18,
          userBet: null
        },
        {
          id: 6,
          homeTeam: 'Inter Milan',
          awayTeam: 'AC Milan',
          competition: 'seriea',
          date: '2024-04-20T20:45',
          status: 'pending',
          totalBets: 32,
          userBet: '3-1'
        },
        {
          id: 7,
          homeTeam: 'Arsenal',
          awayTeam: 'Tottenham',
          competition: 'premier',
          date: '2024-04-15T17:30',
          status: 'pending',
          totalBets: 40,
          userBet: null
        },
        {
          id: 8,
          homeTeam: 'Barcelona',
          awayTeam: 'Atlético Madrid',
          competition: 'laliga',
          date: '2024-03-15T20:00',
          status: 'completed',
          result: '1-1',
          totalBets: 45,
          userBet: '2-1',
          won: false
        }
      ];
      
      setBets(mockBets);
      setFilteredBets(mockBets);
      setIsLoading(false);
    }, 1500);
  }, []);
  
  // Filtrar y buscar cuando cambian los filtros o el término de búsqueda
  useEffect(() => {
    if (bets.length === 0) return;
    
    let result = [...bets];
    
    // Aplicar filtro de competición
    if (filters.competition !== 'all') {
      result = result.filter(bet => bet.competition === filters.competition);
    }
    
    // Aplicar filtro de estado
    if (filters.status !== 'all') {
      result = result.filter(bet => bet.status === filters.status);
    }
    
    // Aplicar filtro de rango de tiempo
    if (filters.timeRange !== 'all') {
      const now = new Date();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      const oneMonth = 30 * 24 * 60 * 60 * 1000;
      
      result = result.filter(bet => {
        const betDate = new Date(bet.date);
        
        switch (filters.timeRange) {
          case 'week':
            return (now - betDate) <= oneWeek;
          case 'month':
            return (now - betDate) <= oneMonth;
          default:
            return true;
        }
      });
    }
    
    // Aplicar búsqueda por texto
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(bet => 
        bet.homeTeam.toLowerCase().includes(term) || 
        bet.awayTeam.toLowerCase().includes(term)
      );
    }
    
    // Aplicar ordenamiento
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'popularity':
          return b.totalBets - a.totalBets;
        case 'alphabetical':
          return a.homeTeam.localeCompare(b.homeTeam);
        default:
          return 0;
      }
    });
    
    setFilteredBets(result);
  }, [bets, filters, searchTerm]);
  
  // Constantes para los nombres de las competiciones
  const competitionNames = {
    laliga: 'La Liga',
    premier: 'Premier League',
    champions: 'Champions League',
    seriea: 'Serie A'
  };
  
  // Handler para cambiar filtros
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-3xl font-bold text-gold mb-6">Buscador de Apuestas</h1>
        
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Búsqueda por texto */}
          <div className="md:col-span-2">
            <Input
              placeholder="Buscar por equipos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          {/* Filtro por competición */}
          <div>
            <select
              className="w-full bg-blue-deep text-white p-3 rounded-lg border border-gold"
              value={filters.competition}
              onChange={(e) => handleFilterChange('competition', e.target.value)}
            >
              <option value="all">Todas las competiciones</option>
              <option value="laliga">La Liga</option>
              <option value="premier">Premier League</option>
              <option value="champions">Champions League</option>
              <option value="seriea">Serie A</option>
            </select>
          </div>
          
          {/* Filtro por estado */}
          <div>
            <select
              className="w-full bg-blue-deep text-white p-3 rounded-lg border border-gold"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="completed">Completados</option>
            </select>
          </div>
        </div>
        
        {/* Opciones adicionales */}
        <div className="flex flex-wrap gap-3 border-t border-gold pt-4 mb-6">
          {/* Filtro por tiempo */}
          <div className="mr-6">
            <span className="text-gold mr-2">Periodo:</span>
            <div className="inline-flex rounded-md overflow-hidden">
              <button
                className={`px-3 py-1 ${
                  filters.timeRange === 'all' 
                    ? 'bg-gold text-black-ebano' 
                    : 'bg-blue-deep text-gold'
                }`}
                onClick={() => handleFilterChange('timeRange', 'all')}
              >
                Todos
              </button>
              <button
                className={`px-3 py-1 ${
                  filters.timeRange === 'month' 
                    ? 'bg-gold text-black-ebano' 
                    : 'bg-blue-deep text-gold'
                }`}
                onClick={() => handleFilterChange('timeRange', 'month')}
              >
                Mes
              </button>
              <button
                className={`px-3 py-1 ${
                  filters.timeRange === 'week' 
                    ? 'bg-gold text-black-ebano' 
                    : 'bg-blue-deep text-gold'
                }`}
                onClick={() => handleFilterChange('timeRange', 'week')}
              >
                Semana
              </button>
            </div>
          </div>
          
          {/* Ordenación */}
          <div>
            <span className="text-gold mr-2">Ordenar por:</span>
            <div className="inline-flex rounded-md overflow-hidden">
              <button
                className={`px-3 py-1 ${
                  filters.sortBy === 'date' 
                    ? 'bg-gold text-black-ebano' 
                    : 'bg-blue-deep text-gold'
                }`}
                onClick={() => handleFilterChange('sortBy', 'date')}
              >
                Fecha
              </button>
              <button
                className={`px-3 py-1 ${
                  filters.sortBy === 'popularity' 
                    ? 'bg-gold text-black-ebano' 
                    : 'bg-blue-deep text-gold'
                }`}
                onClick={() => handleFilterChange('sortBy', 'popularity')}
              >
                Popularidad
              </button>
              <button
                className={`px-3 py-1 ${
                  filters.sortBy === 'alphabetical' 
                    ? 'bg-gold text-black-ebano' 
                    : 'bg-blue-deep text-gold'
                }`}
                onClick={() => handleFilterChange('sortBy', 'alphabetical')}
              >
                Alfabético
              </button>
            </div>
          </div>
        </div>
        
        {/* Resultados */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl text-gold">Resultados ({filteredBets.length})</h2>
            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  competition: 'all',
                  status: 'all',
                  timeRange: 'all',
                  sortBy: 'date'
                });
              }}
            >
              Limpiar Filtros
            </Button>
          </div>
          
          {filteredBets.length > 0 ? (
            <div className="space-y-4">
              {filteredBets.map(bet => (
                <Card key={bet.id} className="bg-blue-deep">
                  <div className="flex flex-col md:flex-row justify-between">
                    {/* Información del partido */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 rounded bg-black-ebano text-gold text-xs">
                          {competitionNames[bet.competition] || bet.competition}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {new Date(bet.date).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {bet.status === 'completed' && (
                          <span className={`px-2 py-1 rounded text-xs ${
                            bet.userBet && bet.won 
                              ? 'bg-green-500 text-white' 
                              : bet.userBet 
                                ? 'bg-red-500 text-white' 
                                : 'bg-gray-600 text-white'
                          }`}>
                            {bet.userBet && bet.won 
                              ? 'Ganada' 
                              : bet.userBet 
                                ? 'Perdida' 
                                : 'No apostada'}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex-1 text-right">
                          <p className="text-white font-bold">{bet.homeTeam}</p>
                        </div>
                        
                        <div className="mx-4">
                          {bet.status === 'completed' ? (
                            <p className="text-xl font-bold text-gold">{bet.result}</p>
                          ) : (
                            <p className="text-white font-bold">VS</p>
                          )}
                        </div>
                        
                        <div className="flex-1 text-left">
                          <p className="text-white font-bold">{bet.awayTeam}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <p className="text-gold">
                          {bet.totalBets} {bet.totalBets === 1 ? 'apuesta' : 'apuestas'}
                        </p>
                        
                        {bet.userBet ? (
                          <p className="text-white">
                            Tu apuesta: <span className="font-bold">{bet.userBet}</span>
                          </p>
                        ) : bet.status === 'pending' ? (
                          <p className="text-gray-400">No has apostado</p>
                        ) : null}
                      </div>
                    </div>
                    
                    {/* Acciones */}
                    <div className="flex justify-end items-center mt-4 md:mt-0">
                      {bet.status === 'pending' && !bet.userBet && (
                        <Button variant="primary" className="w-full md:w-auto">
                          Apostar
                        </Button>
                      )}
                      
                      {bet.status === 'pending' && bet.userBet && (
                        <Button variant="ghost" className="w-full md:w-auto">
                          Editar Apuesta
                        </Button>
                      )}
                      
                      {bet.status === 'completed' && (
                        <Button variant="ghost" className="w-full md:w-auto">
                          Ver Detalles
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-8">
              <p className="text-gold text-lg mb-4">No se encontraron apuestas con los filtros seleccionados</p>
              <Button 
                variant="ghost"
                onClick={() => {
                  setSearchTerm('');
                  setFilters({
                    competition: 'all',
                    status: 'all',
                    timeRange: 'all',
                    sortBy: 'date'
                  });
                }}
              >
                Limpiar filtros
              </Button>
            </Card>
          )}
        </div>
      </Card>
    </div>
  );
};