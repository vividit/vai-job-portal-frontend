'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getApiUrl, API_CONFIG } from '@/config/api';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        router.push('/login?error=' + encodeURIComponent(error));
        return;
      }

      if (token) {
        try {
          // Store token
          localStorage.setItem('authToken', token);
          
          // Fetch user data using the token
          const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ME), {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.user) {
              setUser(data.user);
              
              // Redirect based on user role to appropriate dashboard
              const roleRoutes = {
                'admin': '/admin',
                'job_seeker': '/job-seeker', 
                'recruiter': '/recruiter',
                'consultant': '/consultant'
              };
              
              const redirectPath = roleRoutes[data.user.userType] || '/dashboard';
              console.log(`OAuth success: ${data.user.userType} user logged in, redirecting to ${redirectPath}`);
              router.push(redirectPath);
            } else {
              throw new Error('Failed to get user data');
            }
          } else {
            throw new Error('Failed to authenticate with token');
          }
        } catch (err) {
          console.error('OAuth callback error:', err);
          localStorage.removeItem('authToken');
          router.push('/login?error=Authentication failed');
        }
      } else {
        router.push('/login?error=No authentication token received');
      }
    };

    handleCallback();
  }, [searchParams, router, setUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Completing Sign In</h2>
        <p className="text-gray-600">Please wait while we redirect you...</p>
      </div>
    </div>
  );
}
