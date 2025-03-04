// src/hooks/useServers.js - Optimized version
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserServers, getMockServers } from '../services/discord';

export const useServers = () => {
  const [servers, setServers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  
  // Use refs to prevent multiple in-flight requests and maintain last fetch time
  const fetchInProgress = useRef(false);
  const lastFetchTime = useRef(0);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  // Memoized fetch function to prevent unnecessary renders
  const fetchServers = useCallback(async (ignoreCache = false) => {
    // Prevent multiple concurrent calls
    if (fetchInProgress.current) {
      console.log('Fetch already in progress, skipping duplicate call');
      return;
    }
    
    // Check if cache is still valid
    const timeElapsed = Date.now() - lastFetchTime.current;
    if (!ignoreCache && timeElapsed < CACHE_DURATION && servers.length > 0) {
      console.log('Using cached servers data');
      return;
    }
    
    // Update state for fetching
    fetchInProgress.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      let serverList;
      
      // Use mock data in development if needed
      if (process.env.NODE_ENV === 'development' && !user?.accessToken) {
        console.log('Using mock server data in development');
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        serverList = getMockServers();
      } else {
        // Fetch real data
        serverList = await getUserServers(user.accessToken);
      }
      
      // Update state with fetched data
      setServers(serverList);
      lastFetchTime.current = Date.now();
    } catch (error) {
      console.error('Error fetching servers:', error);
      setError(error.message || 'Error al cargar servidores');
      
      // If in development, fallback to mock data on error
      if (process.env.NODE_ENV === 'development') {
        console.log('Falling back to mock data after error');
        setServers(getMockServers());
        lastFetchTime.current = Date.now();
      }
    } finally {
      setIsLoading(false);
      fetchInProgress.current = false;
    }
  }, [user, servers.length]);
  
  // Effect for initial data loading and cleanup
  useEffect(() => {
    // Only fetch if user has token and we haven't fetched data yet or the cache expired
    if (user?.accessToken && (servers.length === 0 || Date.now() - lastFetchTime.current > CACHE_DURATION)) {
      fetchServers();
    } else if (!user?.accessToken) {
      setServers([]);
      setIsLoading(false);
    }
    
    // Cleanup function
    return () => {
      fetchInProgress.current = false;
    };
  }, [user?.accessToken, fetchServers, servers.length]);
  
  // Function to force reload
  const refreshServers = useCallback(() => {
    return fetchServers(true);
  }, [fetchServers]);
  
  return {
    servers,
    isLoading,
    error,
    refreshServers
  };
};

export default useServers;