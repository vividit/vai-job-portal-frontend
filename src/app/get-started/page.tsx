import Header from '@/components/Header';
import Link from 'next/link';

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Get Started with VAI AI
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Choose your path and begin your journey with our AI-powered job platform
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Link 
                href="/signup"
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">👤</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Create Account
                </h3>
                <p className="text-gray-600">
                  Sign up for a new account and unlock the full potential of AI-powered job matching
                </p>
              </Link>

              <Link 
                href="/login"
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🔓</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Sign In
                </h3>
                <p className="text-gray-600">
                  Already have an account? Sign in to continue your job search journey
                </p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
