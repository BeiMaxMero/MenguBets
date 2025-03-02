// src/types/betTypes.js

/**
 * @typedef {Object} BetType
 * @property {string} id - Identificador único del tipo de apuesta
 * @property {string} name - Nombre descriptivo
 * @property {string} icon - Emoji o icono representativo
 * @property {string} description - Descripción corta
 * @property {number} multiplier - Multiplicador de puntos (dificultad)
 * @property {Array<string>} validations - Reglas de validación a aplicar
 * @property {function} formatValue - Función para formatear el valor
 * @property {function} validateValue - Función para validar el valor
 * @property {function} compareResult - Función para comparar con el resultado real
 */

/**
 * @typedef {Object} BetValue
 * @property {string} type - Tipo de apuesta (id del tipo)
 * @property {*} value - Valor de la apuesta (depende del tipo)
 * @property {string} [note] - Nota opcional del usuario
 */

/**
 * @typedef {Object} BetResult
 * @property {boolean} success - Si la apuesta fue acertada
 * @property {number} points - Puntos obtenidos
 * @property {string} [partialSuccess] - Si hubo acierto parcial
 * @property {string} [explanation] - Explicación del resultado
 */

// Validadores para los distintos tipos de apuesta
const betValidators = {
    exactScore: (value) => {
      // Formato "n-n" donde n es un número
      const regex = /^\d+-\d+$/;
      if (!regex.test(value)) {
        return { valid: false, message: 'El formato debe ser n-n (ej: 2-1)' };
      }
      return { valid: true };
    },
    
    matchResult: (value) => {
      // Debe ser 'home', 'draw' o 'away'
      if (!['home', 'draw', 'away'].includes(value)) {
        return { valid: false, message: 'El resultado debe ser victoria local, empate o victoria visitante' };
      }
      return { valid: true };
    },
    
    totalGoals: (value) => {
      // Formato "Over/Under n.n"
      const regex = /^(Over|Under) \d+(\.\d+)?$/;
      if (!regex.test(value)) {
        return { valid: false, message: 'El formato debe ser "Over/Under n.n" (ej: Over 2.5)' };
      }
      return { valid: true };
    },
    
    scorer: (value) => {
      // Simple validación de que existe un valor
      if (!value || value.trim() === '') {
        return { valid: false, message: 'Debe seleccionar un jugador' };
      }
      return { valid: true };
    },
    
    correctMinute: (value) => {
      // Formato para minuto de gol: número entre 1 y 120
      const minute = parseInt(value);
      if (isNaN(minute) || minute < 1 || minute > 120) {
        return { valid: false, message: 'El minuto debe ser un número entre 1 y 120' };
      }
      return { valid: true };
    },
    
    firstScorer: (value) => {
      // Igual que el validador de goleador normal
      return betValidators.scorer(value);
    },
    
    scoreAtHalf: (value) => {
      // Mismo formato que resultado exacto
      return betValidators.exactScore(value);
    },
    
    bothTeamsScore: (value) => {
      // Debe ser 'yes' o 'no'
      if (!['yes', 'no'].includes(value)) {
        return { valid: false, message: 'El valor debe ser "sí" o "no"' };
      }
      return { valid: true };
    }
  };
  
  // Comparadores para verificar aciertos
  const betComparators = {
    exactScore: (bet, result) => {
      // Apuesta exacta: coincide exactamente
      if (bet === result) {
        return { 
          success: true, 
          points: 3,
          explanation: 'Resultado exacto acertado'
        };
      }
      
      // Acierto parcial: dirección del resultado (victoria local/visitante o empate)
      const [betHome, betAway] = bet.split('-').map(Number);
      const [resultHome, resultAway] = result.split('-').map(Number);
      
      const betDirection = betHome > betAway ? 'home' : (betHome < betAway ? 'away' : 'draw');
      const resultDirection = resultHome > resultAway ? 'home' : (resultHome < resultAway ? 'away' : 'draw');
      
      if (betDirection === resultDirection) {
        return {
          success: false,
          partialSuccess: 'direction',
          points: 1,
          explanation: 'Acertó la tendencia del partido (victoria/empate)'
        };
      }
      
      return {
        success: false,
        points: 0,
        explanation: 'Resultado no acertado'
      };
    },
    
    matchResult: (bet, result) => {
      // Resultado: victoria local, empate, victoria visitante
      // Convertir resultado en formato "n-n" a direction
      const [resultHome, resultAway] = result.split('-').map(Number);
      const resultDirection = resultHome > resultAway ? 'home' : (resultHome < resultAway ? 'away' : 'draw');
      
      if (bet === resultDirection) {
        return {
          success: true,
          points: 2,
          explanation: 'Acertó el resultado del partido'
        };
      }
      
      return {
        success: false,
        points: 0,
        explanation: 'No acertó el resultado'
      };
    },
    
    totalGoals: (bet, result) => {
      // Formato "Over/Under n.n"
      const [betType, threshold] = bet.split(' ');
      const [resultHome, resultAway] = result.split('-').map(Number);
      const totalGoals = resultHome + resultAway;
      
      const isOver = betType === 'Over';
      const thresholdValue = parseFloat(threshold);
      
      if (isOver && totalGoals > thresholdValue) {
        return {
          success: true,
          points: 2,
          explanation: `Acertó: hubo más de ${threshold} goles (${totalGoals})`
        };
      } else if (!isOver && totalGoals < thresholdValue) {
        return {
          success: true,
          points: 2,
          explanation: `Acertó: hubo menos de ${threshold} goles (${totalGoals})`
        };
      }
      
      return {
        success: false,
        points: 0,
        explanation: `No acertó: hubo ${totalGoals} goles y apostó ${bet}`
      };
    },
    
    scorer: (bet, scorers) => {
      // scorers es un array de IDs de jugadores que marcaron
      if (scorers.includes(bet)) {
        return {
          success: true,
          points: 2,
          explanation: 'Acertó el goleador'
        };
      }
      
      return {
        success: false,
        points: 0,
        explanation: 'No acertó el goleador'
      };
    },
    
    correctMinute: (bet, goalMinutes) => {
      // goalMinutes es un array con todos los minutos en que se marcaron goles
      const betMinute = parseInt(bet);
      
      // Margen de 5 minutos para acierto parcial
      const closeMatch = goalMinutes.some(minute => Math.abs(minute - betMinute) <= 5);
      
      if (goalMinutes.includes(betMinute)) {
        return {
          success: true,
          points: 3,
          explanation: `Acertó el minuto exacto del gol (${betMinute}')`
        };
      } else if (closeMatch) {
        return {
          success: false,
          partialSuccess: 'close',
          points: 1,
          explanation: 'Acertó un minuto aproximado (±5 minutos)'
        };
      }
      
      return {
        success: false,
        points: 0,
        explanation: 'No acertó el minuto de gol'
      };
    },
    
    firstScorer: (bet, firstScorer) => {
      if (bet === firstScorer) {
        return {
          success: true,
          points: 3,
          explanation: 'Acertó el primer goleador'
        };
      }
      
      return {
        success: false,
        points: 0,
        explanation: 'No acertó el primer goleador'
      };
    },
    
    scoreAtHalf: (bet, halfTimeScore) => {
      if (bet === halfTimeScore) {
        return {
          success: true,
          points: 3,
          explanation: 'Acertó el resultado al descanso'
        };
      }
      
      return {
        success: false,
        points: 0,
        explanation: 'No acertó el resultado al descanso'
      };
    },
    
    bothTeamsScore: (bet, result) => {
      const [homeGoals, awayGoals] = result.split('-').map(Number);
      const bothScored = homeGoals > 0 && awayGoals > 0;
      
      if ((bet === 'yes' && bothScored) || (bet === 'no' && !bothScored)) {
        return {
          success: true,
          points: 2,
          explanation: bothScored 
            ? 'Acertó: ambos equipos marcaron' 
            : 'Acertó: al menos un equipo no marcó'
        };
      }
      
      return {
        success: false,
        points: 0,
        explanation: bothScored 
          ? 'No acertó: ambos equipos marcaron' 
          : 'No acertó: al menos un equipo no marcó'
      };
    }
  };
  
  // Definición completa de tipos de apuesta
  export const BET_TYPES = {
    EXACT_SCORE: {
      id: 'exact_score',
      name: 'Resultado Exacto',
      icon: '🔢',
      description: 'Predice el marcador final del partido',
      multiplier: 1.5,
      validations: ['exactScore'],
      formatValue: (value) => value, // Ya viene formateado como "n-n"
      validateValue: (value) => betValidators.exactScore(value),
      compareResult: (value, result) => betComparators.exactScore(value, result)
    },
    
    MATCH_RESULT: {
      id: 'match_result',
      name: '1X2',
      icon: '🏆',
      description: 'Victoria local, empate o victoria visitante',
      multiplier: 1.0,
      validations: ['matchResult'],
      formatValue: (value) => {
        switch(value) {
          case 'home': return '1 (Victoria Local)';
          case 'draw': return 'X (Empate)';
          case 'away': return '2 (Victoria Visitante)';
          default: return value;
        }
      },
      validateValue: (value) => betValidators.matchResult(value),
      compareResult: (value, result) => betComparators.matchResult(value, result)
    },
    
    TOTAL_GOALS: {
      id: 'total_goals',
      name: 'Total de Goles',
      icon: '⚽',
      description: 'Más/menos de cierta cantidad de goles',
      multiplier: 1.0,
      validations: ['totalGoals'],
      formatValue: (value) => value, // Ya viene formateado como "Over/Under n.n"
      validateValue: (value) => betValidators.totalGoals(value),
      compareResult: (value, result) => betComparators.totalGoals(value, result)
    },
    
    SCORER: {
      id: 'scorer',
      name: 'Goleador',
      icon: '👟',
      description: 'Jugador que marcará gol',
      multiplier: 1.2,
      validations: ['scorer'],
      formatValue: (value, playerName) => playerName || value, // Necesita el nombre del jugador
      validateValue: (value) => betValidators.scorer(value),
      compareResult: (value, result) => betComparators.scorer(value, result)
    },
    
    CORRECT_MINUTE: {
      id: 'correct_minute',
      name: 'Minuto de Gol',
      icon: '⏱️',
      description: 'Minuto exacto en que se marcará un gol',
      multiplier: 1.8,
      validations: ['correctMinute'],
      formatValue: (value) => `${value}'`,
      validateValue: (value) => betValidators.correctMinute(value),
      compareResult: (value, result) => betComparators.correctMinute(value, result)
    },
    
    FIRST_SCORER: {
      id: 'first_scorer',
      name: 'Primer Goleador',
      icon: '1️⃣',
      description: 'Jugador que marcará el primer gol',
      multiplier: 1.5,
      validations: ['firstScorer'],
      formatValue: (value, playerName) => playerName || value,
      validateValue: (value) => betValidators.firstScorer(value),
      compareResult: (value, result) => betComparators.firstScorer(value, result)
    },
    
    SCORE_AT_HALF: {
      id: 'score_at_half',
      name: 'Resultado al Descanso',
      icon: '🏁',
      description: 'Marcador al final de la primera parte',
      multiplier: 1.4,
      validations: ['scoreAtHalf'],
      formatValue: (value) => value,
      validateValue: (value) => betValidators.scoreAtHalf(value),
      compareResult: (value, result) => betComparators.scoreAtHalf(value, result)
    },
    
    BOTH_TEAMS_SCORE: {
      id: 'both_teams_score',
      name: 'Ambos Equipos Marcan',
      icon: '🥅',
      description: '¿Marcarán gol ambos equipos?',
      multiplier: 1.1,
      validations: ['bothTeamsScore'],
      formatValue: (value) => value === 'yes' ? 'Sí' : 'No',
      validateValue: (value) => betValidators.bothTeamsScore(value),
      compareResult: (value, result) => betComparators.bothTeamsScore(value, result)
    }
  };
  
  /**
   * Valida una apuesta según su tipo
   * @param {BetValue} bet - Apuesta a validar
   * @returns {Object} - Resultado de la validación
   */
  export const validateBet = (bet) => {
    const betType = BET_TYPES[bet.type.toUpperCase()];
    
    if (!betType) {
      return { valid: false, message: 'Tipo de apuesta no válido' };
    }
    
    return betType.validateValue(bet.value);
  };
  
  /**
   * Calcula el resultado de una apuesta comparándola con el resultado real
   * @param {BetValue} bet - Apuesta realizada
   * @param {*} result - Resultado real (formato depende del tipo)
   * @returns {BetResult} - Resultado de la apuesta
   */
  export const calculateBetResult = (bet, result) => {
    const betType = BET_TYPES[bet.type.toUpperCase()];
    
    if (!betType) {
      return {
        success: false,
        points: 0,
        explanation: 'Tipo de apuesta no válido'
      };
    }
    
    // Aplicar el multiplicador del servidor si existe
    const serverMultiplier = bet.serverMultiplier || 1;
    
    // Obtener resultado base
    const baseResult = betType.compareResult(bet.value, result);
    
    // Aplicar multiplicadores
    const finalPoints = Math.round(baseResult.points * betType.multiplier * serverMultiplier);
    
    return {
      ...baseResult,
      points: finalPoints
    };
  };
  
  /**
   * Obtiene un tipo de apuesta por su ID
   * @param {string} typeId - ID del tipo de apuesta
   * @returns {BetType|null} - Tipo de apuesta o null si no existe
   */
  export const getBetTypeById = (typeId) => {
    const upperTypeId = typeId.toUpperCase();
    return BET_TYPES[upperTypeId] || null;
  };
  
  /**
   * Formatea una apuesta para mostrarla al usuario
   * @param {BetValue} bet - Apuesta a formatear
   * @param {Object} extraData - Datos adicionales necesarios para el formateo (ej: nombres de jugadores)
   * @returns {string} - Apuesta formateada
   */
  export const formatBetForDisplay = (bet, extraData = {}) => {
    const betType = getBetTypeById(bet.type);
    
    if (!betType) {
      return bet.value.toString();
    }
    
    // Extraer datos adicionales si son necesarios
    let formattedValue = bet.value;
    
    // Para apuestas de goleador, necesitamos el nombre del jugador
    if (bet.type === 'scorer' || bet.type === 'first_scorer') {
      const playerName = extraData.playerName || extraData.players?.[bet.value] || bet.value;
      formattedValue = betType.formatValue(bet.value, playerName);
    } else {
      formattedValue = betType.formatValue(bet.value);
    }
    
    return `${betType.name}: ${formattedValue}`;
  };
  
  export default BET_TYPES;