'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import RecruiterDashboard from '@/components/dashboards/RecruiterDashboard';

export default function RecruiterPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Ensure only recruiters can access this page
    if (!isLoading && isAuthenticated && user && user.userType !== 'recruiter') {
      console.log(`Non-recruiter user (${user.userType}) attempted to access recruiter page, redirecting to dashboard`);
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Loading recruiter dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <main className="pt-16">
        <RecruiterDashboard user={user} />
      </main>
    </div>
  );
}
