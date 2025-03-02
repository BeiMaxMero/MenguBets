// src/context/BetContext.jsx - VERSIÓN CORREGIDA
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { validateBet } from '../types/betTypes';
import api from '../services';

// Estado inicial
const initialState = {
  // Apuestas activas por servidor y partido
  activeBets: {
    data: {},
    isLoading: false,
    error: null
  },
  
  // Apuestas del usuario
  userBets: {
    data: {},
    isLoading: false,
    error: null
  },
  
  // Historial de apuestas
  betHistory: {
    data: [],
    isLoading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalPages: 1,
      totalItems: 0
    }
  },
  
  // Estado actual de la creación/edición de apuesta
  currentBet: {
    isCreating: false,
    isEditing: false,
    matchId: null,
    serverId: null,
    betData: null,
    status: 'idle', // idle, loading, success, error
    error: null
  }
};

// Tipos de acciones
const ActionTypes = {
  // Obtener apuestas activas
  FETCH_ACTIVE_BETS_START: 'FETCH_ACTIVE_BETS_START',
  FETCH_ACTIVE_BETS_SUCCESS: 'FETCH_ACTIVE_BETS_SUCCESS',
  FETCH_ACTIVE_BETS_ERROR: 'FETCH_ACTIVE_BETS_ERROR',
  
  // Obtener apuestas del usuario
  FETCH_USER_BETS_START: 'FETCH_USER_BETS_START',
  FETCH_USER_BETS_SUCCESS: 'FETCH_USER_BETS_SUCCESS',
  FETCH_USER_BETS_ERROR: 'FETCH_USER_BETS_ERROR',
  
  // Obtener historial de apuestas
  FETCH_BET_HISTORY_START: 'FETCH_BET_HISTORY_START',
  FETCH_BET_HISTORY_SUCCESS: 'FETCH_BET_HISTORY_SUCCESS',
  FETCH_BET_HISTORY_ERROR: 'FETCH_BET_HISTORY_ERROR',
  
  // Crear nueva apuesta
  CREATE_BET_START: 'CREATE_BET_START',
  CREATE_BET_SUCCESS: 'CREATE_BET_SUCCESS',
  CREATE_BET_ERROR: 'CREATE_BET_ERROR',
  
  // Editar apuesta existente
  EDIT_BET_START: 'EDIT_BET_START',
  EDIT_BET_SUCCESS: 'EDIT_BET_SUCCESS',
  EDIT_BET_ERROR: 'EDIT_BET_ERROR',
  
  // Iniciar/cancelar creación/edición
  START_CREATE_BET: 'START_CREATE_BET',
  START_EDIT_BET: 'START_EDIT_BET',
  CANCEL_BET_FORM: 'CANCEL_BET_FORM',
  
  // Eliminar apuesta
  DELETE_BET_START: 'DELETE_BET_START',
  DELETE_BET_SUCCESS: 'DELETE_BET_SUCCESS',
  DELETE_BET_ERROR: 'DELETE_BET_ERROR',
  
  // Limpiar errores
  CLEAR_ERRORS: 'CLEAR_ERRORS'
};

// Reducer para manejar las acciones
function betReducer(state, action) {
  switch (action.type) {
    // Acciones para obtener apuestas activas
    case ActionTypes.FETCH_ACTIVE_BETS_START:
      return {
        ...state,
        activeBets: {
          ...state.activeBets,
          isLoading: true,
          error: null
        }
      };
    
    case ActionTypes.FETCH_ACTIVE_BETS_SUCCESS:
      return {
        ...state,
        activeBets: {
          data: {
            ...state.activeBets.data,
            [action.payload.serverId]: action.payload.bets || []
          },
          isLoading: false,
          error: null
        }
      };
    
    case ActionTypes.FETCH_ACTIVE_BETS_ERROR:
      return {
        ...state,
        activeBets: {
          ...state.activeBets,
          isLoading: false,
          error: action.payload
        }
      };
    
    // Acciones para obtener apuestas del usuario
    case ActionTypes.FETCH_USER_BETS_START:
      return {
        ...state,
        userBets: {
          ...state.userBets,
          isLoading: true,
          error: null
        }
      };
    
    case ActionTypes.FETCH_USER_BETS_SUCCESS:
      // Organizar apuestas por serverId y matchId para facilitar acceso
      const userBetsData = { ...state.userBets.data };
      
      // Verificar que action.payload sea un array
      const betsArray = Array.isArray(action.payload) ? action.payload : [];
      
      betsArray.forEach(bet => {
        if (!userBetsData[bet.serverId]) {
          userBetsData[bet.serverId] = {};
        }
        userBetsData[bet.serverId][bet.matchId] = bet;
      });
      
      return {
        ...state,
        userBets: {
          data: userBetsData,
          isLoading: false,
          error: null
        }
      };
    
    case ActionTypes.FETCH_USER_BETS_ERROR:
      return {
        ...state,
        userBets: {
          ...state.userBets,
          isLoading: false,
          error: action.payload
        }
      };
    
    // Acciones para obtener historial de apuestas
    case ActionTypes.FETCH_BET_HISTORY_START:
      return {
        ...state,
        betHistory: {
          ...state.betHistory,
          isLoading: true,
          error: null
        }
      };
    
    case ActionTypes.FETCH_BET_HISTORY_SUCCESS:
      // Verificar que la estructura de payload sea correcta
      const bets = action.payload?.bets || [];
      const pagination = action.payload?.pagination || {
        page: 1,
        pageSize: 10,
        totalPages: 1,
        totalItems: 0
      };
      
      return {
        ...state,
        betHistory: {
          data: bets,
          isLoading: false,
          error: null,
          pagination: pagination
        }
      };
    
    case ActionTypes.FETCH_BET_HISTORY_ERROR:
      return {
        ...state,
        betHistory: {
          ...state.betHistory,
          isLoading: false,
          error: action.payload
        }
      };
    
    // Acciones para crear/editar apuestas
    case ActionTypes.START_CREATE_BET:
      return {
        ...state,
        currentBet: {
          isCreating: true,
          isEditing: false,
          matchId: action.payload?.matchId || null,
          serverId: action.payload?.serverId || null,
          betData: null,
          status: 'idle',
          error: null
        }
      };
    
    case ActionTypes.START_EDIT_BET:
      return {
        ...state,
        currentBet: {
          isCreating: false,
          isEditing: true,
          matchId: action.payload?.matchId || null,
          serverId: action.payload?.serverId || null,
          betData: action.payload?.betData || null,
          status: 'idle',
          error: null
        }
      };
    
    case ActionTypes.CANCEL_BET_FORM:
      return {
        ...state,
        currentBet: {
          isCreating: false,
          isEditing: false,
          matchId: null,
          serverId: null,
          betData: null,
          status: 'idle',
          error: null
        }
      };
    
    case ActionTypes.CREATE_BET_START:
    case ActionTypes.EDIT_BET_START:
      return {
        ...state,
        currentBet: {
          ...state.currentBet,
          status: 'loading',
          error: null
        }
      };
    
    case ActionTypes.CREATE_BET_SUCCESS:
    case ActionTypes.EDIT_BET_SUCCESS:
      // Verificar que bet existe en el payload
      if (!action.payload?.bet) {
        return state;
      }
      
      // Actualizar las apuestas del usuario con la nueva/editada
      const newUserBets = { ...state.userBets.data };
      const { serverId, matchId } = action.payload.bet;
      
      if (!newUserBets[serverId]) {
        newUserBets[serverId] = {};
      }
      
      newUserBets[serverId][matchId] = action.payload.bet;
      
      return {
        ...state,
        userBets: {
          ...state.userBets,
          data: newUserBets
        },
        currentBet: {
          isCreating: false,
          isEditing: false,
          matchId: null,
          serverId: null,
          betData: null,
          status: 'success',
          error: null
        }
      };
    
    case ActionTypes.CREATE_BET_ERROR:
    case ActionTypes.EDIT_BET_ERROR:
      return {
        ...state,
        currentBet: {
          ...state.currentBet,
          status: 'error',
          error: action.payload
        }
      };
    
    // Eliminar apuesta
    case ActionTypes.DELETE_BET_SUCCESS:
      // Verificar que serverId y matchId estén definidos
      if (!action.payload?.serverId || !action.payload?.matchId) {
        return state;
      }
      
      const updatedUserBets = { ...state.userBets.data };
      const targetServerId = action.payload.serverId;
      const targetMatchId = action.payload.matchId;
      
      if (updatedUserBets[targetServerId] && updatedUserBets[targetServerId][targetMatchId]) {
        delete updatedUserBets[targetServerId][targetMatchId];
      }
      
      return {
        ...state,
        userBets: {
          ...state.userBets,
          data: updatedUserBets
        }
      };
    
    // Limpiar errores
    case ActionTypes.CLEAR_ERRORS:
      return {
        ...state,
        activeBets: {
          ...state.activeBets,
          error: null
        },
        userBets: {
          ...state.userBets,
          error: null
        },
        betHistory: {
          ...state.betHistory,
          error: null
        },
        currentBet: {
          ...state.currentBet,
          error: null
        }
      };
    
    default:
      return state;
  }
}

// Crear contexto
const BetContext = createContext();

// Hook personalizado para usar el contexto
export const useBets = () => useContext(BetContext);

// Proveedor del contexto
export const BetProvider = ({ children }) => {
  const [state, dispatch] = useReducer(betReducer, initialState);
  const { user } = useAuth();
  
  // Acciones
  const actions = {
    // Obtener apuestas activas para un servidor
    fetchActiveBets: async (serverId) => {
      if (!user || !serverId) return;
      
      dispatch({ type: ActionTypes.FETCH_ACTIVE_BETS_START });
      
      try {
        // En modo de desarrollo, simular datos de apuestas activas
        let betsData = [];
        
        if (process.env.NODE_ENV === 'development') {
          betsData = [
            {
              id: 1,
              homeTeam: 'Real Madrid',
              awayTeam: 'Barcelona',
              date: '2024-04-15T20:00:00',
              serverId: serverId,
              matchId: 'm1',
              competition: 'laliga',
              totalBets: 25
            },
            {
              id: 2,
              homeTeam: 'Atlético Madrid',
              awayTeam: 'Sevilla',
              date: '2024-04-16T18:30:00',
              serverId: serverId,
              matchId: 'm2',
              competition: 'laliga',
              totalBets: 18
            }
          ];
        } else {
          const response = await api.api.get(`/servers/${serverId}/matches/active`);
          betsData = response.data;
        }
        
        dispatch({
          type: ActionTypes.FETCH_ACTIVE_BETS_SUCCESS,
          payload: {
            serverId,
            bets: betsData
          }
        });
      } catch (error) {
        console.error('Error fetching active bets:', error);
        dispatch({
          type: ActionTypes.FETCH_ACTIVE_BETS_ERROR,
          payload: error.message || 'Error al obtener apuestas activas'
        });
      }
    },
    
    // Obtener apuestas del usuario actual
    fetchUserBets: async () => {
      if (!user) return;
      
      dispatch({ type: ActionTypes.FETCH_USER_BETS_START });
      
      try {
        // En modo de desarrollo, simular datos de apuestas del usuario
        let userBetsData = [];
        
        if (process.env.NODE_ENV === 'development') {
          userBetsData = [
            {
              id: 'bet1',
              serverId: 'server1',
              matchId: 'm1',
              type: 'exact_score',
              value: '2-1',
              createdAt: new Date().toISOString()
            },
            {
              id: 'bet2',
              serverId: 'server2',
              matchId: 'm3',
              type: 'match_result',
              value: 'home',
              createdAt: new Date().toISOString()
            }
          ];
        } else {
          const response = await api.api.get('/users/bets/active');
          userBetsData = response.data || [];
        }
        
        dispatch({
          type: ActionTypes.FETCH_USER_BETS_SUCCESS,
          payload: userBetsData
        });
      } catch (error) {
        console.error('Error fetching user bets:', error);
        dispatch({
          type: ActionTypes.FETCH_USER_BETS_ERROR,
          payload: error.message || 'Error al obtener apuestas del usuario'
        });
      }
    },
    
    // Obtener historial de apuestas
    fetchBetHistory: async (params = {}) => {
      if (!user) return;
      
      dispatch({ type: ActionTypes.FETCH_BET_HISTORY_START });
      
      try {
        // En modo de desarrollo, simular datos de historial
        let historyData = [];
        let paginationData = {
          page: params.page || 1,
          pageSize: 10,
          totalPages: 3,
          totalItems: 28
        };
        
        if (process.env.NODE_ENV === 'development') {
          historyData = Array(10).fill(null).map((_, index) => ({
            id: `hist${index}`,
            serverId: 'server1',
            matchId: `hist-match-${index}`,
            homeTeam: 'Equipo A',
            awayTeam: 'Equipo B',
            date: new Date(Date.now() - index * 86400000).toISOString(),
            prediction: index % 2 === 0 ? '2-1' : '1-1',
            result: index % 2 === 0 ? '2-1' : '2-2',
            type: index % 3 === 0 ? 'exact_score' : 'match_result',
            status: index % 2 === 0 ? 'won' : 'lost',
            points: index % 2 === 0 ? 3 : 0
          }));
        } else {
          const response = await api.api.get('/users/bets/history', params);
          historyData = response.data.bets || [];
          paginationData = response.data.pagination || paginationData;
        }
        
        dispatch({
          type: ActionTypes.FETCH_BET_HISTORY_SUCCESS,
          payload: {
            bets: historyData,
            pagination: paginationData
          }
        });
      } catch (error) {
        console.error('Error fetching bet history:', error);
        dispatch({
          type: ActionTypes.FETCH_BET_HISTORY_ERROR,
          payload: error.message || 'Error al obtener historial de apuestas'
        });
      }
    },
    
    // Resto de acciones...
    // [Las acciones siguientes permanecen igual que en el código original]
    
    // Iniciar creación de apuesta
    startCreateBet: (matchId, serverId) => {
      dispatch({
        type: ActionTypes.START_CREATE_BET,
        payload: { matchId, serverId }
      });
    },
    
    // Iniciar edición de apuesta
    startEditBet: (matchId, serverId) => {
      const betData = state.userBets.data?.[serverId]?.[matchId];
      
      if (!betData) {
        console.error('No se encontró la apuesta para editar');
        return;
      }
      
      dispatch({
        type: ActionTypes.START_EDIT_BET,
        payload: { matchId, serverId, betData }
      });
    },
    
    // Cancelar formulario de apuesta
    cancelBetForm: () => {
      dispatch({ type: ActionTypes.CANCEL_BET_FORM });
    },
    
    // Crear nueva apuesta
    createBet: async (betData) => {
      if (!user) return;
      
      // Validar la apuesta
      const validationResult = validateBet(betData);
      if (!validationResult.valid) {
        dispatch({
          type: ActionTypes.CREATE_BET_ERROR,
          payload: validationResult.message
        });
        return;
      }
      
      dispatch({ type: ActionTypes.CREATE_BET_START });
      
      const { serverId, matchId } = state.currentBet;
      
      try {
        // En desarrollo, simular creación
        let responseData;
        
        if (process.env.NODE_ENV === 'development') {
          // Simular retraso
          await new Promise(resolve => setTimeout(resolve, 500));
          
          responseData = {
            id: `bet-${Date.now()}`,
            ...betData,
            createdAt: new Date().toISOString(),
            userId: user.id
          };
        } else {
          const response = await api.api.post(`/servers/${serverId}/matches/${matchId}/bets`, betData);
          responseData = response.data;
        }
        
        dispatch({
          type: ActionTypes.CREATE_BET_SUCCESS,
          payload: {
            bet: {
              ...responseData,
              serverId,
              matchId
            }
          }
        });
        
        return responseData;
      } catch (error) {
        console.error('Error creating bet:', error);
        dispatch({
          type: ActionTypes.CREATE_BET_ERROR,
          payload: error.message || 'Error al crear apuesta'
        });
        throw error;
      }
    },
    
    // Obtener apuesta del usuario para un partido específico
    getUserBetForMatch: (serverId, matchId) => {
      return state.userBets.data?.[serverId]?.[matchId] || null;
    },
    
    // Comprobar si el usuario ya ha apostado en un partido
    hasUserBetForMatch: (serverId, matchId) => {
      return !!state.userBets.data?.[serverId]?.[matchId];
    },
    
    // Limpiar errores
    clearErrors: () => {
      dispatch({ type: ActionTypes.CLEAR_ERRORS });
    }
  };
  
  // Cargar apuestas del usuario cuando inicia sesión
  useEffect(() => {
    if (user) {
      actions.fetchUserBets();
    }
  }, [user]);
  
  return (
    <BetContext.Provider value={{ state, actions }}>
      {children}
    </BetContext.Provider>
  );
};

export default BetProvider;