// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { discordService } from '../services/discord';
import { LoadingSpinner } from '../components/core/LoadingSpinner';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('discord_token');
        if (token) {
          const userData = await discordService.getUserInfo(token);
          setUser({
            id: userData.id,
            username: userData.username,
            discriminator: userData.discriminator,
            avatar: userData.avatar,
            accessToken: token
          });
        }
      } catch (error) {
        console.error('Error iniciando auth:', error);
        localStorage.removeItem('discord_token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('discord_token');
    setUser(null);
  };

  const value = {
    user,
    setUser,
    loading,
    logout
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-deep flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};