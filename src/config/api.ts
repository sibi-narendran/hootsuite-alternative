// API Configuration for different environments
const API_CONFIG = {
  development: 'http://localhost:3001',
  production: '' // Will be set to Vercel URL
};

export const getApiUrl = () => {
  // Check if we're in production environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Check for production domains - use relative URLs for production
    if (hostname.includes('vercel.app') || 
        hostname.includes('typeform-alternative') || 
        hostname.includes('trydooza.com') ||
        hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return ''; // Use relative URLs for production (Vercel functions)
    }
  }
  
  return API_CONFIG.development;
};

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = getApiUrl();
  const url = `${baseUrl}/api/${endpoint}`;
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
};
