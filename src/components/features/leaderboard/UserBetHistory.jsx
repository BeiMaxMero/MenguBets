// src/components/features/leaderboard/UserBetHistory.jsx
import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

export const UserBetHistory = ({ userId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [selectedCompetition, setSelectedCompetition] = useState('all');
  const ITEMS_PER_PAGE = 3;
  const MAX_VISIBLE_PAGES = 3;

  // Resetear la página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [groupId, timeRange, selectedSeason, selectedCompetition]);
  
  // Filtrar las apuestas basado en todos los criterios
  const filterBets = (bets) => {
    return bets.filter(bet => {
      const matchesGroup = !groupId || bet.groupId === groupId;
      const matchesTimeRange = timeRange === 'all' || isWithinTimeRange(bet.date, timeRange);
      const matchesSeason = selectedSeason === 'all' || bet.season === selectedSeason;
      const matchesCompetition = selectedCompetition === 'all' || bet.competition === selectedCompetition;
      
      return matchesGroup && matchesTimeRange && matchesSeason && matchesCompetition;
    });
  };

  const isWithinTimeRange = (date, range) => {
    const betDate = new Date(date);
    const now = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const oneMonth = 30 * 24 * 60 * 60 * 1000;

    switch(range) {
      case 'week':
        return (now - betDate) <= oneWeek;
      case 'month':
        return (now - betDate) <= oneMonth;
      default:
        return true;
    }
  };
  
  // Datos de ejemplo
  const seasons = [
    { id: '2024', name: 'Temporada 2024' },
    { id: '2023', name: 'Temporada 2023' }
  ];

  const competitions = [
    { id: 'laliga', name: 'La Liga' },
    { id: 'champions', name: 'Champions League' },
    { id: 'copa', name: 'Copa del Rey' }
  ];

  // Simulación de datos con más apuestas
  const allBets = Array(20).fill(null).map((_, index) => ({
    id: index + 1,
    date: '2024-02-15',
    season: index < 10 ? '2024' : '2023',
    competition: index % 3 === 0 ? 'laliga' : index % 3 === 1 ? 'champions' : 'copa',
    match: {
      homeTeam: 'Real Madrid',
      awayTeam: 'Barcelona',
      result: '2-1'
    },
    prediction: '2-1',
    points: index % 2 === 0 ? 3 : 0,
    status: index % 2 === 0 ? 'won' : 'lost'
  }));

  // Filtrar por temporada y competición
  const filteredBets = allBets.filter(bet => 
    (selectedSeason === 'all' || bet.season === selectedSeason) &&
    (selectedCompetition === 'all' || bet.competition === selectedCompetition)
  );

  // Calcular páginas
  const totalPages = Math.ceil(filteredBets.length / ITEMS_PER_PAGE);
  const paginatedBets = filteredBets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Calcular estadísticas basadas en las apuestas filtradas
  const stats = {
    totalBets: filteredBets.length,
    wins: filteredBets.filter(bet => bet.status === 'won').length,
    totalPoints: filteredBets.reduce((acc, bet) => acc + bet.points, 0),
    accuracy: Math.round((filteredBets.filter(bet => bet.status === 'won').length / filteredBets.length) * 100)
  };

  // Función para generar el array de páginas a mostrar
  const getPageNumbers = () => {
    const totalPages = Math.ceil(filteredBets.length / ITEMS_PER_PAGE);
    
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);

    if (endPage - startPage < MAX_VISIBLE_PAGES - 1) {
      startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
    }

    const pages = [];

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gold mb-2">Temporada</label>
          <select 
            className="w-full bg-blue-deep text-white p-2 rounded-lg border border-gold"
            value={selectedSeason}
            onChange={(e) => {
              setSelectedSeason(e.target.value);
              setCurrentPage(1);  // Reset página al filtrar
            }}
          >
            <option value="all">Todas las temporadas</option>
            {seasons.map(season => (
              <option key={season.id} value={season.id}>
                {season.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gold mb-2">Competición</label>
          <select 
            className="w-full bg-blue-deep text-white p-2 rounded-lg border border-gold"
            value={selectedCompetition}
            onChange={(e) => {
              setSelectedCompetition(e.target.value);
              setCurrentPage(1);  // Reset página al filtrar
            }}
          >
            <option value="all">Todas las competiciones</option>
            {competitions.map(comp => (
              <option key={comp.id} value={comp.id}>
                {comp.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-deep text-center">
          <p className="text-sm text-gray-400">Total Apuestas</p>
          <p className="text-2xl font-bold text-gold">{stats.totalBets}</p>
        </Card>
        <Card className="bg-blue-deep text-center">
          <p className="text-sm text-gray-400">Aciertos</p>
          <p className="text-2xl font-bold text-gold">{stats.wins}</p>
        </Card>
        <Card className="bg-blue-deep text-center">
          <p className="text-sm text-gray-400">Puntos</p>
          <p className="text-2xl font-bold text-gold">{stats.totalPoints}</p>
        </Card>
        <Card className="bg-blue-deep text-center">
          <p className="text-sm text-gray-400">Precisión</p>
          <p className="text-2xl font-bold text-gold">{stats.accuracy}%</p>
        </Card>
      </div>

      {/* Lista de apuestas paginada */}
      <div className="space-y-4">
        {paginatedBets.map(bet => (
          <Card key={bet.id} className={`border-2 ${
            bet.status === 'won' ? 'border-green-500' : 'border-red-500'
          }`}>
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <p className="text-white font-medium">
                  {bet.match.homeTeam} vs {bet.match.awayTeam}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(bet.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right mt-2 md:mt-0">
                <p className="text-gold font-bold">
                  Predicción: {bet.prediction}
                </p>
                <p className="text-sm text-gray-400">
                  Resultado: {bet.match.result}
                </p>
              </div>
            </div>
            <div className="mt-2 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="space-x-2">
                <span className={`text-sm ${
                  bet.status === 'won' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {bet.status === 'won' ? '✓ Acertada' : '✗ Fallada'}
                </span>
                <span className="text-gold">+{bet.points} pts</span>
              </div>
              <span className="text-sm text-gray-400 mt-1 md:mt-0">
                {competitions.find(c => c.id === bet.competition)?.name}
              </span>
            </div>
          </Card>
        ))}
      </div>


      {/* Paginación Mejorada */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1">
          <Button
            variant="ghost"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            «
          </Button>
          <Button
            variant="ghost"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            ‹
          </Button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="text-gold px-2">
                  {page}
                </span>
              ) : (
                <Button
                  key={page}
                  variant={currentPage === page ? "primary" : "ghost"}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 p-0 text-sm transition-all ${
                    currentPage === page 
                      ? 'bg-gold text-black-ebano' 
                      : 'text-gold hover:bg-blue-deep'
                  }`}
                >
                  {page}
                </Button>
              )
            ))}
          </div>

          <Button
            variant="ghost"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            ›
          </Button>
          <Button
            variant="ghost"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            »
          </Button>
        </div>
      )}
    </div>
  );
};