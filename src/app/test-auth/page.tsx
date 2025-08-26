'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function TestAuthPage() {
  const { login, loginWithOAuth, user, isLoading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('shreyanshpolkampet45@gmail.com');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');

  const testLogin = async () => {
    setResult('Testing login...');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      setResult(`Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  const testOAuth = () => {
    setResult('Redirecting to OAuth...');
    window.location.href = '/api/auth/google';
  };

  const testDirectBackend = () => {
    setResult('Redirecting to backend OAuth...');
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Authentication Test</h1>
        
        {/* Current Auth State */}
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h3 className="font-bold">Current Auth State:</h3>
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          <p>User: {user ? JSON.stringify(user, null, 2) : 'None'}</p>
        </div>

        {/* Test Login */}
        <div className="mb-6">
          <h3 className="font-bold mb-2">Test Email Login:</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={testLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Test Login API
          </button>
        </div>

        {/* Test OAuth */}
        <div className="mb-6">
          <h3 className="font-bold mb-2">Test OAuth:</h3>
          <button
            onClick={testOAuth}
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
          >
            Test OAuth (Frontend)
          </button>
          <button
            onClick={testDirectBackend}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Test OAuth (Direct Backend)
          </button>
        </div>

        {/* Results */}
        <div className="mb-6">
          <h3 className="font-bold mb-2">Test Results:</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
            {result}
          </pre>
        </div>

        {/* Quick Actions */}
        <div className="space-x-2">
          <button
            onClick={() => localStorage.removeItem('authToken')}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Clear Token
          </button>
          <button
            onClick={() => window.location.href = '/admin'}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Go to Admin
          </button>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
