'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getApiUrl, API_CONFIG } from '@/config/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'job_seeker' | 'recruiter' | 'consultant' | 'admin';
  company?: string;
  jobTitle?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithOAuth: (provider: 'google' | 'github') => Promise<{ success: boolean; error?: string }>;
  signup: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Checking auth status, token exists:', !!token);
      
      if (!token) {
        console.log('No token found, user not authenticated');
        setIsLoading(false);
        return;
      }

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ME), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Auth check response status:', response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log('Auth check successful, user data:', userData);
        
        if (userData.success && userData.user) {
          setUser(userData.user);
          console.log('User set in context:', userData.user);
        } else {
          console.log('Invalid user data received');
          localStorage.removeItem('authToken');
        }
      } else {
        console.log('Auth check failed, removing token');
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok && data.success) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        
        // Redirect based on user role after login
        const roleRoutes = {
          'admin': '/admin',
          'job_seeker': '/job-seeker',
          'recruiter': '/recruiter',
          'consultant': '/consultant'
        };
        
        const redirectPath = roleRoutes[data.user.userType] || '/dashboard';
        console.log(`Login successful: ${data.user.userType} user, redirecting to ${redirectPath}`);
        
        // Force redirect after successful login
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 100);
        
        return { success: true };
      } else {
        return { success: false, error: data.message || data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithOAuth = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true);
      // Redirect to OAuth provider on your backend
      window.location.href = getApiUrl(`/api/auth/${provider}`);
      return { success: true };
    } catch (error) {
      console.error('OAuth login error:', error);
      setIsLoading(false);
      return { success: false, error: 'OAuth login failed' };
    }
  };

  const signup = async (userData: any) => {
    try {
      setIsLoading(true);
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.SIGNUP), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        
        // Redirect based on user role after signup
        const roleRoutes = {
          'admin': '/admin',
          'job_seeker': '/job-seeker',
          'recruiter': '/recruiter',
          'consultant': '/consultant'
        };
        
        const redirectPath = roleRoutes[data.user.userType] || '/dashboard';
        console.log(`Signup successful: ${data.user.userType} user, redirecting to ${redirectPath}`);
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 100);
        
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    window.location.href = '/';
  };

  const value = {
    user,
    isLoading,
    login,
    loginWithOAuth,
    signup,
    logout,
    isAuthenticated: !!user,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
