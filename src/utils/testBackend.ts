// Test backend connectivity
export const testBackendConnection = async () => {
  try {
    // Test the root endpoint first (from your backend: app.get("/", ...))
    const response = await fetch('http://localhost:5000/', {
      method: 'GET',
    });
    
    if (response.ok) {
      const text = await response.text();
      console.log('✅ Backend is running:', text);
      return true;
    } else {
      console.log('❌ Backend responded with error:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Backend is not running or not accessible:', error);
    return false;
  }
};

// Test auth endpoints
export const testAuthEndpoints = async () => {
  const endpoints = [
    '/auth/login',
    '/auth/register', 
    '/auth/google',
    '/auth/github',
    '/auth/me'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'GET',
      });
      console.log(`${endpoint}: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`${endpoint}: Connection failed`);
    }
  }
};
