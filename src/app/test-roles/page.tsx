'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function TestRolesPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [testResults, setTestResults] = useState([]);

  const userTypes = [
    { id: 'admin', name: 'Admin', route: '/admin', description: 'Platform administration and user management' },
    { id: 'job_seeker', name: 'Job Seeker', route: '/job-seeker', description: 'Job search and application tracking' },
    { id: 'recruiter', name: 'Recruiter', route: '/recruiter', description: 'Job posting and candidate management' },
    { id: 'consultant', name: 'Consultant', route: '/consultant', description: 'Client management and service delivery' }
  ];

  const testRoute = (route: string, expectedUserType: string) => {
    const result = `Testing ${route} - Expected: ${expectedUserType}, Current User: ${user?.userType || 'None'}`;
    setTestResults(prev => [...prev, result]);
    
    // Navigate to the route
    router.push(route);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Role-Based Routing Test</h1>
          
          {/* Current User Info */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Current User Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium text-blue-700">Loading:</span>
                <p className="text-blue-900">{isLoading ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-blue-700">Authenticated:</span>
                <p className="text-blue-900">{isAuthenticated ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-blue-700">User Type:</span>
                <p className="text-blue-900">{user?.userType || 'None'}</p>
              </div>
            </div>
            {user && (
              <div className="mt-4">
                <span className="text-sm font-medium text-blue-700">User Info:</span>
                <p className="text-blue-900">{user.firstName} {user.lastName} ({user.email})</p>
              </div>
            )}
          </div>

          {/* User Type Cards */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">User Types & Dashboards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userTypes.map((userType) => (
                <div key={userType.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{userType.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user?.userType === userType.id 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user?.userType === userType.id ? 'Current Role' : 'Other Role'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{userType.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => testRoute(userType.route, userType.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Test {userType.route}
                    </button>
                    <button
                      onClick={() => router.push(userType.route)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Navigation</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Login Page
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Generic Dashboard
              </button>
              <button
                onClick={() => router.push('/test-redirect')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                Test Redirect
              </button>
              <button
                onClick={clearResults}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Clear Results
              </button>
            </div>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm text-gray-700 font-mono bg-white p-2 rounded">
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expected Behavior */}
          <div className="mt-8 bg-green-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-900 mb-4">Expected Behavior</h2>
            <ul className="space-y-2 text-green-800">
              <li>✅ <strong>Authenticated users</strong> should be redirected to their role-specific dashboard after login</li>
              <li>✅ <strong>Admin users</strong> can only access /admin (redirected from other role pages)</li>
              <li>✅ <strong>Job Seekers</strong> can only access /job-seeker (redirected from other role pages)</li>
              <li>✅ <strong>Recruiters</strong> can only access /recruiter (redirected from other role pages)</li>
              <li>✅ <strong>Consultants</strong> can only access /consultant (redirected from other role pages)</li>
              <li>✅ <strong>Unauthenticated users</strong> should be redirected to /login from any protected page</li>
              <li>✅ <strong>Generic /dashboard</strong> should redirect to role-specific dashboard</li>
            </ul>
          </div>

          {/* Role Descriptions */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Role Descriptions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">👑 Admin</h3>
                <p className="text-blue-800 text-sm">Complete platform control, user management, job approval, analytics, and system settings.</p>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">🔍 Job Seeker</h3>
                <p className="text-blue-800 text-sm">Job search, application tracking, profile management, and career resources.</p>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">🏢 Recruiter</h3>
                <p className="text-blue-800 text-sm">Job posting, candidate management, application review, and hiring analytics.</p>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">💼 Consultant</h3>
                <p className="text-blue-800 text-sm">Client management, service delivery, appointment scheduling, and earnings tracking.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
