// src/hooks/useAsyncData.js
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para manejar carga asíncrona de datos con estados de carga y error
 * @param {Function} fetchFunction - Función que devuelve una promesa con los datos
 * @param {Array} dependencies - Array de dependencias para refrescar los datos
 * @param {Object} options - Opciones adicionales
 * @returns {Object} - { data, isLoading, error, refetch }
 */
export const useAsyncData = (fetchFunction, dependencies = [], options = {}) => {
  const { 
    initialData = null,
    autoFetch = true,
    onSuccess = null,
    onError = null,
    enableRefetch = true,
    cacheKey = null,
    cacheDuration = 5 * 60 * 1000 // 5 minutos por defecto
  } = options;

  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState(null);
  
  // Manejo de caché
  const getCachedData = useCallback(() => {
    if (!cacheKey) return null;
    
    try {
      const cachedItem = localStorage.getItem(`mbets_cache_${cacheKey}`);
      if (!cachedItem) return null;
      
      const { data: cachedData, timestamp } = JSON.parse(cachedItem);
      const isExpired = Date.now() - timestamp > cacheDuration;
      
      if (isExpired) {
        localStorage.removeItem(`mbets_cache_${cacheKey}`);
        return null;
      }
      
      return cachedData;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  }, [cacheKey, cacheDuration]);
  
  const setCachedData = useCallback((data) => {
    if (!cacheKey) return;
    
    try {
      const cacheItem = {
        data,
        timestamp: Date.now()
      };
      
      localStorage.setItem(`mbets_cache_${cacheKey}`, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }, [cacheKey]);

  // Función para obtener datos
  const fetchData = useCallback(async (ignoreCache = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Intenta obtener datos de la caché si no se especifica ignorarla
      if (!ignoreCache && cacheKey) {
        const cachedData = getCachedData();
        if (cachedData) {
          setData(cachedData);
          setIsLoading(false);
          
          if (onSuccess) {
            onSuccess(cachedData);
          }
          
          return;
        }
      }
      
      // Obtener datos frescos
      const result = await fetchFunction();
      
      setData(result);
      
      // Guardar en caché si hay clave de caché
      if (cacheKey) {
        setCachedData(result);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err);
      
      if (onError) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, cacheKey, getCachedData, setCachedData, onSuccess, onError]);

  // Efecto para cargar datos automáticamente
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, fetchFunction]);

  // Función para refrescar datos manualmente
  const refetch = useCallback((ignoreCache = true) => {
    if (enableRefetch) {
      return fetchData(ignoreCache);
    }
  }, [enableRefetch, fetchData]);

  return { data, isLoading, error, refetch };
};