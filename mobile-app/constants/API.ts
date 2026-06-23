// mobile-app/constants/API.ts
import Constants from 'expo-constants';
import axios from 'axios';

// Set global headers to bypass localtunnel reminder screen automatically
axios.defaults.headers.common['Bypass-Tunnel-Reminder'] = 'true';

const getBaseUrl = (): string => {
  // Check if running inside a browser environment (Expo Web)
  if (typeof window !== 'undefined' && window.location) {
    const currentHost = window.location.hostname; // e.g., laughing-journey-x545766x4w9x2pr69-8081.app.github.dev
    
    // If we are previewing on a GitHub Codespaces domain address
    if (currentHost.includes('github.dev')) {
      // Safely replace the frontend port string (-8081.) with the backend port string (-8000.)
      const backendHost = currentHost.replace('-8081.', '-8000.');
      return `https://${backendHost}/api`;
    }
    
    // If running on a local development server
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
      return 'http://localhost:8000/api';
    }
  }
  
  // Try resolving the dynamic debugger/packager IP for physical mobile devices running Expo Go
  const hostUri = Constants.expoConfig?.hostUri; // e.g., "192.168.1.44:8081" or "tv3ptzy-anonymous-8081.exp.direct"
  if (hostUri) {
    const localIp = hostUri.split(':')[0];
    if (localIp) {
      // If it is a tunnel domain, we cannot connect to port 8000 of that tunnel.
      // We fall back to the public backend localtunnel URL so it works from anywhere!
      if (localIp.includes('exp.direct') || localIp.includes('ngrok')) {
        return 'https://upset-carrots-battle.loca.lt/api';
      }
      return `http://${localIp}:8000/api`;
    }
  }
  
  // Fallback static production URL string for native emulators or manual routing (defaulting to public localtunnel backend)
  return 'https://upset-carrots-battle.loca.lt/api';
};

export const API_BASE_URL = getBaseUrl();

// Debug tracker to confirm the correct handshake address in your browser developer console
console.log('--- ACTIVE NETWORK API ENDPOINT: ---', API_BASE_URL);