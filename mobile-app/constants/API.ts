// mobile-app/constants/API.ts

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
  
  // Fallback static production URL string for native emulators or manual routing (defaulting to local backend)
  return 'http://localhost:8000/api';
};

export const API_BASE_URL = getBaseUrl();

// Debug tracker to confirm the correct handshake address in your browser developer console
console.log('--- ACTIVE NETWORK API ENDPOINT: ---', API_BASE_URL);