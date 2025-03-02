// src/types/types.js
/**
 * @typedef {Object} User
 * @property {string} id - ID del usuario (proveniente de Discord)
 * @property {string} username - Nombre de usuario de Discord
 * @property {string|null} avatar - URL del avatar del usuario
 * @property {string|null} email - Email del usuario (opcional)
 * @property {string} accessToken - Token de acceso de Discord
 * @property {number} points - Puntos totales del usuario
 * @property {number} winRate - Tasa de victorias (0-100)
 * @property {Date} joinDate - Fecha de registro
 * @property {Array<string>} streak - Racha actual ['win', 'loss', etc]
 * @property {boolean} isOnline - Estado de conexión
 */

/**
 * @typedef {Object} Server
 * @property {string} id - ID del servidor de Discord
 * @property {string} name - Nombre del servidor
 * @property {string|null} icon - URL del icono del servidor
 * @property {number} memberCount - Número de miembros
 * @property {number} activeUsers - Usuarios activos en apuestas
 * @property {boolean} isConfigured - Si el bot está configurado
 * @property {string} permissions - Permisos del usuario en este servidor
 * @property {Array<Competition>} competitions - Competiciones disponibles
 * @property {ServerConfig} config - Configuración del servidor
 */

/**
 * @typedef {Object} Competition
 * @property {string} id - ID único de la competición
 * @property {string} name - Nombre de la competición
 * @property {string} icon - Icono de la competición
 * @property {boolean} enabled - Si está activa o no
 * @property {number} totalBets - Total de apuestas en esta competición
 */

/**
 * @typedef {Object} ServerConfig
 * @property {number} exactScore - Puntos por resultado exacto
 * @property {number} correctWinner - Puntos por acertar ganador
 * @property {number} streakBonus - Bonus por racha
 * @property {number} minimumBets - Mínimo de apuestas para clasificar
 * @property {number} betCloseMinutes - Minutos antes del partido para cerrar apuestas
 * @property {boolean} autoPostResults - Publicar resultados automáticamente
 * @property {boolean} publicLeaderboard - Clasificación pública
 * @property {boolean} notifyNewBets - Notificar nuevas apuestas
 * @property {string|null} betsChannelId - Canal de Discord para apuestas
 * @property {string|null} resultsChannelId - Canal para resultados
 */

/**
 * @typedef {Object} Match
 * @property {string} id - ID único del partido
 * @property {string} homeTeam - Equipo local
 * @property {string} awayTeam - Equipo visitante
 * @property {string} competition - ID de la competición
 * @property {string} serverId - ID del servidor
 * @property {string} datetime - Fecha y hora (ISO)
 * @property {string} status - Estado ('pending', 'active', 'completed')
 * @property {string|null} result - Resultado (ej. '2-1')
 * @property {string|null} description - Descripción opcional
 * @property {number} totalBets - Número total de apuestas
 */

/**
 * @typedef {Object} Bet
 * @property {string} id - ID único de la apuesta
 * @property {string} matchId - ID del partido
 * @property {string} userId - ID del usuario
 * @property {string} serverId - ID del servidor
 * @property {string} prediction - Predicción (ej. '2-1')
 * @property {Date} createdAt - Fecha de creación
 * @property {string|null} status - Estado ('pending', 'won', 'lost')
 * @property {number|null} points - Puntos obtenidos
 */

/**
 * @typedef {Object} UserStats
 * @property {number} totalBets - Apuestas totales
 * @property {number} wonBets - Apuestas ganadas
 * @property {number} lostBets - Apuestas perdidas
 * @property {number} points - Puntos totales
 * @property {number} winRate - Tasa de victorias
 * @property {number} activeBets - Apuestas activas
 * @property {Array<string>} streak - Racha actual
 * @property {Array<Bet>} recentBets - Apuestas recientes
 */

/**
 * @typedef {Object} ServerStats
 * @property {number} totalBets - Apuestas totales
 * @property {number} activeUsers - Usuarios activos
 * @property {number} activeBets - Apuestas activas
 * @property {Array<{name: string, bets: number}>} competitions - Stats por competición
 * @property {Array<{match: string, accuracy: number}>} topPredictions - Predicciones más acertadas
 * @property {Array<string>} serverStreak - Racha del servidor
 * @property {Array<Object>} topUsers - Usuarios top
 */

/**
 * @typedef {Object} LeaderboardEntry
 * @property {string} userId - ID del usuario
 * @property {string} username - Nombre de usuario
 * @property {string|null} avatar - Avatar del usuario
 * @property {number} position - Posición en la tabla
 * @property {number} points - Puntos totales
 * @property {number} winRate - Tasa de victorias
 * @property {Array<string>} streak - Racha actual
 * @property {number} totalBets - Apuestas totales
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Indica si la petición fue exitosa
 * @property {Object|Array|null} data - Datos devueltos
 * @property {string|null} error - Mensaje de error (si lo hay)
 * @property {number|null} code - Código de error (si lo hay)
 */

// Ejemplos de uso:
/*
const user = {
  id: '123456789',
  username: 'JohnDoe',
  avatar: 'https://cdn.discordapp.com/avatars/123456789/abcdef.png',
  email: 'john@example.com',
  accessToken: 'token123',
  points: 350,
  winRate: 75,
  joinDate: new Date('2024-01-15'),
  streak: ['win', 'win', 'loss', 'win'],
  isOnline: true
};

const server = {
  id: '987654321',
  name: 'Real Madrid Fan Club',
  icon: 'https://cdn.discordapp.com/icons/987654321/abcdef.png',
  memberCount: 120,
  activeUsers: 45,
  isConfigured: true,
  permissions: '0x8',
  competitions: [
    { id: 'laliga', name: 'La Liga', icon: '⚽', enabled: true, totalBets: 150 }
  ],
  config: {
    exactScore: 3,
    correctWinner: 1,
    streakBonus: 2,
    minimumBets: 5,
    betCloseMinutes: 15,
    autoPostResults: true,
    publicLeaderboard: true,
    notifyNewBets: true,
    betsChannelId: '111222333',
    resultsChannelId: '444555666'
  }
};
*/