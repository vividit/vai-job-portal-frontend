// API Configuration
export const API_CONFIG = {
  // Always use Next.js API routes which proxy to backend
  BASE_URL: '', // Empty string uses Next.js API routes
  
  // API Endpoints
  ENDPOINTS: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    ME: '/api/auth/me',
    GOOGLE_AUTH: '/api/auth/google',
    GITHUB_AUTH: '/api/auth/github',
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
