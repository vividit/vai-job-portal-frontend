'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';

// Dashboard components for different user types
import JobSeekerDashboard from '@/components/dashboards/JobSeekerDashboard';
import RecruiterDashboard from '@/components/dashboards/RecruiterDashboard';
import ConsultantDashboard from '@/components/dashboards/ConsultantDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Redirect to role-specific dashboard if user is authenticated
    if (!isLoading && isAuthenticated && user) {
      const roleRoutes = {
        'admin': '/admin',
        'job_seeker': '/job-seeker',
        'recruiter': '/recruiter',
        'consultant': '/consultant'
      };
      
      const specificRoute = roleRoutes[user.userType];
      if (specificRoute && window.location.pathname === '/dashboard') {
        console.log(`Redirecting ${user.userType} from /dashboard to ${specificRoute}`);
        router.push(specificRoute);
      }
    }
  }, [isAuthenticated, isLoading, router, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  // Debug: Log user data to see what we're getting
  console.log('Dashboard - User data:', user);
  console.log('Dashboard - User type:', user.userType);

  const renderDashboard = () => {
    console.log('Rendering dashboard for user type:', user.userType);
    
    switch (user.userType) {
      case 'job_seeker':
        return <JobSeekerDashboard user={user} />;
      case 'recruiter':
        return <RecruiterDashboard user={user} />;
      case 'consultant':
        return <ConsultantDashboard user={user} />;
      case 'admin':
        return <AdminDashboard user={user} />;
      default:
        console.log('Using default dashboard for unknown user type:', user.userType);
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Welcome, {user.firstName}!
              </h2>
              <p className="text-gray-600 mb-4">
                User Type: <strong>{user.userType}</strong>
              </p>
              <p className="text-gray-600">
                Your dashboard is being set up. Please contact support if this persists.
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <pre className="text-xs text-gray-600">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <main className="pt-16">
        {renderDashboard()}
      </main>
    </div>
  );
}
