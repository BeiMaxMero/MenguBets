// src/services/discord.js
import axios from 'axios';

const DISCORD_API = 'https://discord.com/api/v10';
const CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_DISCORD_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_DISCORD_REDIRECT_URI;

// Scopes que necesitamos
const SCOPES = ['identify', 'guilds', 'guilds.members.read'].join(' ');

export const discordService = {
  // URL para iniciar el flujo de OAuth
  getAuthUrl: () => {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: SCOPES,
    });
    return `${DISCORD_API}/oauth2/authorize?${params}`;
  },

  // Intercambiar el código por un token de acceso
  getAccessToken: async (code) => {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    });

    const response = await axios.post(`${DISCORD_API}/oauth2/token`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  },

  // Obtener información del usuario
  getUserInfo: async (accessToken) => {
    const response = await axios.get(`${DISCORD_API}/users/@me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  // Obtener servidores del usuario
  getUserGuilds: async (accessToken) => {
    const response = await axios.get(`${DISCORD_API}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },
}