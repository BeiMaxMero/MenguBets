// services/discord.js
const DISCORD_API = 'https://discord.com/api/v10';
const CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_DISCORD_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const ADMIN_PERMISSION = 0x8;  // Permiso de administrador en Discord
const BOT_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;


export const loginWithDiscord = () => {
    console.log('Redirect URI:', REDIRECT_URI); // Para debug
  
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: 'identify email guilds guilds.members.read' 
    });
  
    const url = `${DISCORD_API}/oauth2/authorize?${params}`;
    console.log('Auth URL:', url); // Para debug
    
    window.location.href = url;
  };

export const getDiscordUser = async (code) => {
try {
    // 1. Obtener token
    const tokenResponse = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: 'POST',
    body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI
    }),
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    });

    if (!tokenResponse.ok) {
    throw new Error(`Token Error: ${await tokenResponse.text()}`);
    }

    const tokens = await tokenResponse.json();
    console.log('Received tokens:', tokens);

    // 2. Obtener datos del usuario
    const userResponse = await fetch(`${DISCORD_API}/users/@me`, {
    headers: {
        Authorization: `Bearer ${tokens.access_token}`
    }
    });

    if (!userResponse.ok) {
    throw new Error(`User Data Error: ${await userResponse.text()}`);
    }

    const userData = await userResponse.json();
    console.log('Raw user data:', userData);

    // 3. Formatear datos
    return {
    id: userData.id,
    username: userData.username,
    avatar: userData.avatar 
        ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
        : null,
    email: userData.email,
    accessToken: tokens.access_token  // Añadir esto
    };
} catch (error) {
    console.error('Error in getDiscordUser:', error);
    throw error;
}
};
  

export const getUserServers = async (accessToken) => {
    try {
      const response = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
  
      // Manejar rate limiting
      if (response.status === 429) {
        const rateLimit = await response.json();
        await new Promise(resolve => setTimeout(resolve, rateLimit.retry_after * 1000));
        return getUserServers(accessToken);
      }
  
      if (!response.ok) {
        throw new Error(`Error fetching servers: ${response.status}`);
      }
  
      const servers = await response.json();
      console.log('Raw server data:', servers); // Debug log
      return servers;
    } catch (error) {
      console.error('Error getting servers:', error);
      throw error;
    }
  };

export const getServerDetails = async (serverId, accessToken) => {
    try {
      // Obtener detalles básicos del servidor
      const response = await fetch(`https://discord.com/api/guilds/${serverId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Error fetching server details');
      }
  
      const serverData = await response.json();
      
      // Obtener miembros (requiere bot con intents)
      const membersResponse = await fetch(`https://discord.com/api/guilds/${serverId}/members`, {
        headers: {
          Authorization: `Bot ${import.meta.env.VITE_DISCORD_BOT_TOKEN}`
        }
      });
  
      const members = await membersResponse.json();
  
      return {
        ...serverData,
        memberCount: members.length,
        members: members
      };
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };