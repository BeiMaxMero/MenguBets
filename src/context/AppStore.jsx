// src/context/AppStore.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services'; // Importación actualizada

// Estado inicial de la aplicación
const initialState = {
  theme: localStorage.getItem('theme') || 'dark',
  serversList: {
    data: [],
    isLoading: false,
    error: null,
    lastUpdated: null
  },
  currentServer: {
    data: null,
    isLoading: false,
    error: null
  },
  notifications: [],
  systemPreferences: {
    enableNotifications: localStorage.getItem('enableNotifications') === 'true',
    autoRefreshInterval: Number(localStorage.getItem('autoRefreshInterval') || 30), // segundos
    betCloseReminder: localStorage.getItem('betCloseReminder') !== 'false', // por defecto true
    language: localStorage.getItem('language') || 'es'
  }
};

// Tipos de acciones
const ActionTypes = {
  SET_THEME: 'SET_THEME',
  SERVERS_FETCH_START: 'SERVERS_FETCH_START',
  SERVERS_FETCH_SUCCESS: 'SERVERS_FETCH_SUCCESS',
  SERVERS_FETCH_ERROR: 'SERVERS_FETCH_ERROR',
  CURRENT_SERVER_FETCH_START: 'CURRENT_SERVER_FETCH_START',
  CURRENT_SERVER_FETCH_SUCCESS: 'CURRENT_SERVER_FETCH_SUCCESS',
  CURRENT_SERVER_FETCH_ERROR: 'CURRENT_SERVER_FETCH_ERROR',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  UPDATE_SYSTEM_PREFERENCE: 'UPDATE_SYSTEM_PREFERENCE'
};

// Reducer para manejar las acciones
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_THEME:
      localStorage.setItem('theme', action.payload);
      return {
        ...state,
        theme: action.payload
      };
      
    case ActionTypes.SERVERS_FETCH_START:
      return {
        ...state,
        serversList: {
          ...state.serversList,
          isLoading: true,
          error: null
        }
      };
      
    case ActionTypes.SERVERS_FETCH_SUCCESS:
      return {
        ...state,
        serversList: {
          data: action.payload,
          isLoading: false,
          error: null,
          lastUpdated: new Date().toISOString()
        }
      };
      
    case ActionTypes.SERVERS_FETCH_ERROR:
      return {
        ...state,
        serversList: {
          ...state.serversList,
          isLoading: false,
          error: action.payload
        }
      };
      
    case ActionTypes.CURRENT_SERVER_FETCH_START:
      return {
        ...state,
        currentServer: {
          ...state.currentServer,
          isLoading: true,
          error: null
        }
      };
      
    case ActionTypes.CURRENT_SERVER_FETCH_SUCCESS:
      return {
        ...state,
        currentServer: {
          data: action.payload,
          isLoading: false,
          error: null
        }
      };
      
    case ActionTypes.CURRENT_SERVER_FETCH_ERROR:
      return {
        ...state,
        currentServer: {
          ...state.currentServer,
          isLoading: false,
          error: action.payload
        }
      };
      
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, {
          id: Date.now(),
          ...action.payload
        }]
      };
      
    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        )
      };
      
    case ActionTypes.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: []
      };
      
    case ActionTypes.UPDATE_SYSTEM_PREFERENCE:
      const { key, value } = action.payload;
      localStorage.setItem(key, value.toString());
      return {
        ...state,
        systemPreferences: {
          ...state.systemPreferences,
          [key]: value
        }
      };
      
    default:
      return state;
  }
}

// Crear contexto
const AppStoreContext = createContext();

// Hook personalizado para usar el store
export const useAppStore = () => useContext(AppStoreContext);

// Proveedor del store
export const AppStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user } = useAuth();
  
  // Acciones
  const actions = {
    setTheme: (theme) => {
      dispatch({ type: ActionTypes.SET_THEME, payload: theme });
    },
    
    fetchServers: async () => {
      if (!user) return;
      
      dispatch({ type: ActionTypes.SERVERS_FETCH_START });
      
      try {
        // Usar api.get en lugar de api.get porque ahora tenemos la API completa importada
        const response = await api.api.get('/servers');
        dispatch({ 
          type: ActionTypes.SERVERS_FETCH_SUCCESS, 
          payload: response.data 
        });
      } catch (error) {
        dispatch({ 
          type: ActionTypes.SERVERS_FETCH_ERROR, 
          payload: error.message 
        });
        
        // También añadir una notificación de error
        actions.addNotification({
          type: 'error',
          title: 'Error al cargar servidores',
          message: error.message
        });
      }
    },
    
    fetchServerDetails: async (serverId) => {
      if (!user || !serverId) return;
      
      dispatch({ type: ActionTypes.CURRENT_SERVER_FETCH_START });
      
      try {
        // Usar api.get en lugar de api.get porque ahora tenemos la API completa importada
        const response = await api.api.get(`/servers/${serverId}`);
        dispatch({ 
          type: ActionTypes.CURRENT_SERVER_FETCH_SUCCESS, 
          payload: response.data 
        });
      } catch (error) {
        dispatch({ 
          type: ActionTypes.CURRENT_SERVER_FETCH_ERROR, 
          payload: error.message 
        });
        
        // También añadir una notificación de error
        actions.addNotification({
          type: 'error',
          title: 'Error al cargar detalles del servidor',
          message: error.message
        });
      }
    },
    
    addNotification: (notification) => {
      // Si las notificaciones están desactivadas y no es crítica, no mostrar
      if (!state.systemPreferences.enableNotifications && 
          notification.type !== 'error' && 
          !notification.critical) {
        return;
      }
      
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          ...notification,
          // Añadir duración por defecto según tipo si no se especifica
          duration: notification.duration || (
            notification.type === 'error' ? 8000 : 
            notification.type === 'success' ? 3000 : 5000
          )
        }
      });
      
      // Auto-eliminar después de la duración si no es persistente
      if (!notification.persistent) {
        setTimeout(() => {
          actions.removeNotification(Date.now());
        }, notification.duration || 5000);
      }
    },
    
    removeNotification: (id) => {
      dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id });
    },
    
    clearNotifications: () => {
      dispatch({ type: ActionTypes.CLEAR_NOTIFICATIONS });
    },
    
    updateSystemPreference: (key, value) => {
      dispatch({ 
        type: ActionTypes.UPDATE_SYSTEM_PREFERENCE, 
        payload: { key, value }
      });
    }
  };
  
  // Cargar servidores cuando el usuario inicia sesión
  useEffect(() => {
    if (user) {
      actions.fetchServers();
    }
  }, [user]);
  
  // Aplicar tema al renderizar
  useEffect(() => {
    document.documentElement.className = state.theme;
  }, [state.theme]);
  
  // Valor del contexto
  const value = {
    state,
    actions
  };
  
  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
};

export default AppStoreProvider;