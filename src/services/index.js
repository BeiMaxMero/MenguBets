// src/services/index.js
import axios from 'axios';

// Configuración de la API base
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 segundos
});

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem('discord_user');
    
    if (userData) {
      const { accessToken } = JSON.parse(userData);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
apiClient.interceptors.response.use(
  (response) => {
    // Si la respuesta contiene data.success = false, es un error de negocio
    if (response.data && response.data.success === false) {
      return Promise.reject({
        message: response.data.error || 'Error desconocido',
        code: response.data.code,
        response: response
      });
    }
    
    return response;
  },
  (error) => {
    // Si el token expiró, limpiar sesión y redirigir a login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('discord_user');
      // Redirigir solo si no estamos ya en la página de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Personalizar mensaje de error según status
    const errorMessage = getErrorMessage(error);
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      response: error.response,
      originalError: error
    });
  }
);

// Función para obtener mensajes de error personalizados
const getErrorMessage = (error) => {
  if (!error.response) {
    return 'Error de conexión. Comprueba tu conexión a Internet.';
  }
  
  const { status } = error.response;
  
  switch (status) {
    case 400:
      return 'La solicitud contiene datos inválidos.';
    case 401:
      return 'Sesión expirada. Por favor, inicia sesión de nuevo.';
    case 403:
      return 'No tienes permiso para realizar esta acción.';
    case 404:
      return 'El recurso solicitado no existe.';
    case 409:
      return 'Conflicto con el estado actual del recurso.';
    case 422:
      return 'Los datos enviados no son válidos.';
    case 429:
      return 'Demasiadas solicitudes. Por favor, intenta de nuevo más tarde.';
    case 500:
      return 'Error del servidor. Por favor, intenta de nuevo más tarde.';
    default:
      return error.response?.data?.error || `Error: ${status}`;
  }
};

// API base con métodos genéricos
export const api = {
  /**
   * Realiza una petición GET
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} params - Parámetros de la consulta
   * @returns {Promise<any>} - Respuesta de la API
   */
  async get(endpoint, params = {}) {
    try {
      const response = await apiClient.get(endpoint, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Realiza una petición POST
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} data - Datos a enviar
   * @returns {Promise<any>} - Respuesta de la API
   */
  async post(endpoint, data = {}) {
    try {
      const response = await apiClient.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Realiza una petición PUT
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} data - Datos a enviar
   * @returns {Promise<any>} - Respuesta de la API
   */
  async put(endpoint, data = {}) {
    try {
      const response = await apiClient.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Realiza una petición PATCH
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} data - Datos a enviar
   * @returns {Promise<any>} - Respuesta de la API
   */
  async patch(endpoint, data = {}) {
    try {
      const response = await apiClient.patch(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Realiza una petición DELETE
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} params - Parámetros de la consulta
   * @returns {Promise<any>} - Respuesta de la API
   */
  async delete(endpoint, params = {}) {
    try {
      const response = await apiClient.delete(endpoint, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

/**
 * Servicio para gestionar usuarios
 */
export const userService = {
  /**
   * Obtener perfil del usuario actual
   * @returns {Promise<User>} - Datos del usuario
   */
  async getProfile() {
    return api.get('/users/profile');
  },
  
  /**
   * Actualizar perfil de usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<User>} - Datos actualizados
   */
  async updateProfile(userData) {
    return api.put('/users/profile', userData);
  },
  
  /**
   * Obtener estadísticas del usuario
   * @returns {Promise<UserStats>} - Estadísticas del usuario
   */
  async getUserStats() {
    return api.get('/users/stats');
  },
  
  /**
   * Obtener historial de apuestas del usuario
   * @param {Object} params - Parámetros de filtrado
   * @returns {Promise<Array<Bet>>} - Historial de apuestas
   */
  async getBetHistory(params = {}) {
    return api.get('/users/bets', params);
  }
};

/**
 * Servicio para gestionar servidores
 */
export const serverService = {
  /**
   * Obtener todos los servidores del usuario
   * @returns {Promise<Array<Server>>} - Lista de servidores
   */
  async getUserServers() {
    return api.get('/servers');
  },
  
  /**
   * Obtener detalles de un servidor
   * @param {string} serverId - ID del servidor
   * @returns {Promise<Server>} - Detalles del servidor
   */
  async getServerDetails(serverId) {
    return api.get(`/servers/${serverId}`);
  },
  
  /**
   * Obtener estadísticas de un servidor
   * @param {string} serverId - ID del servidor
   * @returns {Promise<ServerStats>} - Estadísticas del servidor
   */
  async getServerStats(serverId) {
    return api.get(`/servers/${serverId}/stats`);
  },
  
  /**
   * Actualizar configuración de un servidor
   * @param {string} serverId - ID del servidor
   * @param {ServerConfig} config - Configuración a actualizar
   * @returns {Promise<ServerConfig>} - Configuración actualizada
   */
  async updateServerConfig(serverId, config) {
    return api.put(`/servers/${serverId}/config`, config);
  },
  
  /**
   * Obtener competiciones de un servidor
   * @param {string} serverId - ID del servidor
   * @returns {Promise<Array<Competition>>} - Lista de competiciones
   */
  async getServerCompetitions(serverId) {
    return api.get(`/servers/${serverId}/competitions`);
  }
};

/**
 * Servicio para gestionar partidos
 */
export const matchService = {
  /**
   * Obtener partidos activos de un servidor
   * @param {string} serverId - ID del servidor
   * @param {Object} params - Parámetros de filtrado
   * @returns {Promise<Array<Match>>} - Lista de partidos
   */
  async getActiveMatches(serverId, params = {}) {
    return api.get(`/servers/${serverId}/matches/active`, params);
  },
  
  /**
   * Obtener partidos completados de un servidor
   * @param {string} serverId - ID del servidor
   * @param {Object} params - Parámetros de filtrado
   * @returns {Promise<Array<Match>>} - Lista de partidos
   */
  async getCompletedMatches(serverId, params = {}) {
    return api.get(`/servers/${serverId}/matches/completed`, params);
  }
};

// Exportar todos los servicios
export default {
  api,
  user: userService,
  server: serverService,
  match: matchService
};