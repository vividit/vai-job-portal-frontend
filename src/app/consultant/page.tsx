'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import ConsultantDashboard from '@/components/dashboards/ConsultantDashboard';

export default function ConsultantPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Ensure only consultants can access this page
    if (!isLoading && isAuthenticated && user && user.userType !== 'consultant') {
      console.log(`Non-consultant user (${user.userType}) attempted to access consultant page, redirecting to dashboard`);
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Loading consultant dashboard...</p>
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
        <ConsultantDashboard user={user} />
      </main>
    </div>
  );
}
