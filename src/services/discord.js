// src/services/discord.js - Improved version with proper caching and rate limiting handling
const DISCORD_API = 'https://discord.com/api/v10';
const CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_DISCORD_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const ADMIN_PERMISSION = 0x8;  // Permiso de administrador en Discord
const BOT_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;

// Constantes de permisos de Discord
export const DISCORD_PERMISSIONS = {
  ADMINISTRATOR: 0x8,
  MANAGE_GUILD: 0x20
};

// Cache implementation
const cache = {
  data: new Map(),
  set: (key, value, ttl = 300000) => { // Default TTL: 5 minutes
    const item = {
      value,
      expiry: Date.now() + ttl,
    };
    cache.data.set(key, item);
    return value;
  },
  get: (key) => {
    const item = cache.data.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      cache.data.delete(key);
      return null;
    }
    
    return item.value;
  },
  clear: () => {
    cache.data.clear();
  }
};

// Rate limiting handling
const rateLimits = {
  retryMap: new Map(),
  
  markEndpoint: (endpoint, retryAfter) => {
    const retryTime = Date.now() + (retryAfter * 1000);
    rateLimits.retryMap.set(endpoint, retryTime);
  },
  
  canMakeRequest: (endpoint) => {
    const retryTime = rateLimits.retryMap.get(endpoint);
    if (!retryTime) return true;
    
    if (Date.now() < retryTime) {
      return false;
    }
    
    rateLimits.retryMap.delete(endpoint);
    return true;
  },
  
  getWaitTime: (endpoint) => {
    const retryTime = rateLimits.retryMap.get(endpoint);
    if (!retryTime) return 0;
    
    const waitTime = retryTime - Date.now();
    return waitTime > 0 ? waitTime : 0;
  }
};

// Helper function for exponential backoff retry
const retryWithExponentialBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      retries++;
      
      // Stop retrying if it's not a rate limit error
      if (error.response?.status !== 429 || retries >= maxRetries) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, retries) + Math.random() * 1000;
      console.log(`Rate limited. Retrying in ${delay}ms (attempt ${retries}/${maxRetries})...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Unified fetch wrapper
const discordFetch = async (endpoint, options = {}) => {
  const fullEndpoint = endpoint.startsWith('http') ? endpoint : `${DISCORD_API}${endpoint}`;
  
  // Check if endpoint is rate limited
  if (!rateLimits.canMakeRequest(endpoint)) {
    const waitTime = rateLimits.getWaitTime(endpoint);
    console.log(`Rate limited. Waiting ${waitTime}ms before retrying for endpoint: ${endpoint}`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  try {
    const response = await fetch(fullEndpoint, options);
    
    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after') || 5; // Default to 5 seconds
      rateLimits.markEndpoint(endpoint, parseInt(retryAfter));
      throw { status: 429, retryAfter, message: 'Rate limited by Discord API' };
    }
    
    // Handle other errors
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Discord API error (${response.status}): ${errorData}`);
      throw { status: response.status, message: errorData };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error.status === 429) {
      throw error; // Let the retry mechanism handle it
    }
    console.error('Error fetching from Discord API:', error);
    throw error;
  }
};

// Redirect user to Discord login page
export const loginWithDiscord = () => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'identify email guilds guilds.members.read',
    // Adding state parameter for security
    state: crypto.randomUUID(),
  });
  
  // Store state in localStorage to verify when callback is received
  localStorage.setItem('discord_oauth_state', params.get('state'));
  
  const url = `${DISCORD_API}/oauth2/authorize?${params}`;
  console.log('Auth URL:', url);
  
  window.location.href = url;
};

// Get Discord user token and profile
export const getDiscordUser = async (code, state) => {
  try {
    // Verify state parameter to prevent CSRF attacks
    const storedState = localStorage.getItem('discord_oauth_state');
    localStorage.removeItem('discord_oauth_state'); // Clear state after use
    
    // Only check state if it was provided in the callback
    if (state && storedState !== state) {
      throw new Error('OAuth state mismatch. The request may have been tampered with.');
    }
    
    // 1. Exchange code for token
    const tokenData = await retryWithExponentialBackoff(async () => {
      const response = await fetch(`${DISCORD_API}/oauth2/token`, {
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
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Token Error: ${errorText}`);
      }
      
      return response.json();
    });
    
    // 2. Get user data
    const userData = await retryWithExponentialBackoff(async () => {
      const response = await fetch(`${DISCORD_API}/users/@me`, {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`User Data Error: ${errorText}`);
      }
      
      return response.json();
    });
    
    // 3. Format data
    const user = {
      id: userData.id,
      username: userData.username,
      avatar: userData.avatar 
        ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
        : null,
      email: userData.email,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      tokenExpires: Date.now() + (tokenData.expires_in * 1000)
    };
    
    // Cache user data
    cache.set('current_user', user, 86400000); // Cache for 24 hours
    
    return user;
  } catch (error) {
    console.error('Error in getDiscordUser:', error);
    throw error;
  }
};

// Refresh token if needed
export const refreshDiscordToken = async (refreshToken) => {
  try {
    const response = await fetch(`${DISCORD_API}/oauth2/token`, {
      method: 'POST',
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    if (!response.ok) {
      // If we can't refresh, we need to re-authenticate
      throw new Error('Unable to refresh token');
    }
    
    const tokenData = await response.json();
    
    // Update user's token data
    const currentUser = cache.get('current_user');
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || refreshToken, // Some providers don't return a new refresh token
        tokenExpires: Date.now() + (tokenData.expires_in * 1000)
      };
      
      cache.set('current_user', updatedUser, 86400000);
      
      // Update localStorage if that's where you store user data
      localStorage.setItem('discord_user', JSON.stringify(updatedUser));
      
      return updatedUser;
    }
    
    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    // Clear user data to force re-authentication
    localStorage.removeItem('discord_user');
    cache.data.delete('current_user');
    throw error;
  }
};

// Get user's servers with caching and retry logic
export const getUserServers = async (accessToken) => {
  // Check cache first
  const cacheKey = `servers_${accessToken.substring(0, 10)}`; // Use part of token as cache key
  const cachedServers = cache.get(cacheKey);
  if (cachedServers) {
    console.log('Using cached server list');
    return cachedServers;
  }
  
  // Fetch from API with retry
  return retryWithExponentialBackoff(async () => {
    const servers = await discordFetch('/users/@me/guilds', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Cache the result
    cache.set(cacheKey, servers, 300000); // Cache for 5 minutes
    
    return servers;
  });
};

// Get server details with caching
export const getServerDetails = async (serverId, accessToken) => {
  const cacheKey = `server_${serverId}`;
  const cachedDetails = cache.get(cacheKey);
  if (cachedDetails) {
    return cachedDetails;
  }
  
  // In development, use mock data
  if (process.env.NODE_ENV === 'development' && !accessToken) {
    const mockData = {
      id: serverId,
      name: `Test Server ${serverId}`,
      icon: null,
      owner: false,
      permissions: '8',
      features: [],
      memberCount: 120,
      members: []
    };
    
    cache.set(cacheKey, mockData);
    return mockData;
  }
  
  try {
    // Get basic server info
    const serverData = await discordFetch(`/guilds/${serverId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    let memberCount = 0;
    
    // Since we don't have a bot token in this example, we'll skip member fetching
    // In production with a bot token, you'd fetch members here
    
    const serverDetails = {
      ...serverData,
      memberCount: memberCount || serverData.approximate_member_count || 0,
    };
    
    cache.set(cacheKey, serverDetails, 600000); // Cache for 10 minutes
    return serverDetails;
  } catch (error) {
    console.error('Error fetching server details:', error);
    throw error;
  }
};

// Check if user can manage the bot in a server
export const canManageBot = (serverPermissions) => {
  if (!serverPermissions) return false;
  
  const permissions = parseInt(serverPermissions);
  return (
    (permissions & DISCORD_PERMISSIONS.ADMINISTRATOR) === DISCORD_PERMISSIONS.ADMINISTRATOR ||
    (permissions & DISCORD_PERMISSIONS.MANAGE_GUILD) === DISCORD_PERMISSIONS.MANAGE_GUILD
  );
};

// Clear all API caches and user data
export const clearDiscordData = () => {
  cache.clear();
  localStorage.removeItem('discord_user');
  localStorage.removeItem('discord_oauth_state');
};

// For development/testing
export const getMockServers = () => {
  return [
    {
      id: 'server1',
      name: 'Test Server 1',
      icon: null,
      permissions: '8', // Admin permission
      memberCount: 120
    },
    {
      id: 'server2',
      name: 'Test Server 2',
      icon: null,
      permissions: '0', // No special permissions
      memberCount: 85
    },
    {
      id: 'server3',
      name: 'Test Server 3',
      icon: null,
      permissions: '32', // Manage server
      memberCount: 210
    }
  ];
};