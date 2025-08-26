'use client';

import { useState } from 'react';
import { testBackendConnection, testAuthEndpoints } from '@/utils/testBackend';

export default function TestBackendPage() {
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runTests = async () => {
    setIsLoading(true);
    setResults([]);
    
    const newResults: string[] = [];
    
    // Test basic connectivity
    newResults.push('🔍 Testing backend connectivity...');
    const isConnected = await testBackendConnection();
    
    if (isConnected) {
      newResults.push('✅ Backend is running on http://localhost:5000');
      
      // Test auth endpoints
      newResults.push('🔍 Testing auth endpoints...');
      await testAuthEndpoints();
    } else {
      newResults.push('❌ Backend is not running or not accessible');
      newResults.push('💡 Make sure your backend is running on port 5000');
    }
    
    setResults(newResults);
    setIsLoading(false);
  };

  const testLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'testpassword'
        })
      });
      
      const data = await response.json();
      setResults(prev => [...prev, `Login test: ${response.status} - ${JSON.stringify(data)}`]);
    } catch (error) {
      setResults(prev => [...prev, `Login test failed: ${error}`]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Backend Connectivity Test</h1>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Test Your Backend Connection</h2>
          <p className="text-gray-600 mb-6">
            This page helps you verify that your MongoDB backend is running and accessible.
          </p>
          
          <div className="flex space-x-4 mb-6">
            <button
              onClick={runTests}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Backend'}
            </button>
            
            <button
              onClick={testLogin}
              className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all"
            >
              Test Login API
            </button>
          </div>
          
          {results.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Test Results:</h3>
              <div className="space-y-1">
                {results.map((result, index) => (
                  <div key={index} className="text-sm font-mono text-gray-700">
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Backend Setup Instructions</h2>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-900">1. Start Your Backend</h3>
              <p>Make sure your MongoDB backend is running on <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:5000</code></p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900">2. Your Backend Endpoints (Found!)</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><code className="bg-gray-100 px-2 py-1 rounded">POST /auth/login</code> ✅</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">POST /auth/register</code> ✅</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">GET /auth/me</code> ✅</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">GET /auth/google</code> ✅</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">GET /auth/github</code> ✅</li>
              </ul>
              <p className="text-sm text-green-600 mt-2">✅ Found your routes in src/routes/auth.js!</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">3. CORS Configuration</h3>
              <p>Your backend should allow requests from <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
