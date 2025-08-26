'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import JobSeekerDashboard from '@/components/dashboards/JobSeekerDashboard';

export default function JobSeekerPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Ensure only job seekers can access this page
    if (!isLoading && isAuthenticated && user && user.userType !== 'job_seeker') {
      console.log(`Non-job-seeker user (${user.userType}) attempted to access job-seeker page, redirecting to dashboard`);
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Loading job seeker dashboard...</p>
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
        <JobSeekerDashboard user={user} />
      </main>
    </div>
  );
}
