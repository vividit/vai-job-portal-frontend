'use client';

export default function DebugOAuthPage() {
  const handleGoogleOAuth = () => {
    // This will trigger the OAuth flow correctly
    window.location.href = '/api/auth/google';
  };

  const handleGithubOAuth = () => {
    // This will trigger the OAuth flow correctly  
    window.location.href = '/api/auth/github';
  };

  const testDirectBackend = () => {
    // This tests the backend directly
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">OAuth Debug Page</h1>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Test OAuth Flows</h2>
            <p className="text-gray-600 mb-4">
              These buttons will initiate the OAuth flow correctly:
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleOAuth}
              className="w-full bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-all"
            >
              🔴 Test Google OAuth (via Frontend API)
            </button>
            
            <button
              onClick={handleGithubOAuth}
              className="w-full bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-all"
            >
              🖤 Test GitHub OAuth (via Frontend API)
            </button>

            <button
              onClick={testDirectBackend}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all"
            >
              🔵 Test Direct Backend OAuth
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <h3 className="font-semibold text-gray-900 mb-2">How OAuth Works:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>1. User clicks OAuth button</p>
              <p>2. Frontend redirects to <code>/api/auth/google</code></p>
              <p>3. Next.js API route forwards to backend</p>
              <p>4. Backend redirects to Google OAuth</p>
              <p>5. Google redirects back to backend callback</p>
              <p>6. Backend processes auth and redirects to frontend</p>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Important:</h3>
            <p className="text-sm text-yellow-700">
              Never access <code>/api/auth/google</code> directly in the browser URL bar. 
              OAuth must be triggered by user interaction (button clicks).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
