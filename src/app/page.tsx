import Header from '@/components/Header';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Floating Geometric Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large Circle - Top Right */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full animate-float"></div>
        
        {/* Medium Circle - Top Left */}
        <div className="absolute top-40 left-16 w-20 h-20 bg-gradient-to-r from-purple-200/40 to-pink-200/40 rounded-full animate-pulse"></div>
        
        {/* Small Circles */}
        <div className="absolute top-96 right-32 w-12 h-12 bg-gradient-to-r from-blue-300/30 to-cyan-300/30 rounded-full animate-bounce"></div>
        <div className="absolute top-[600px] left-20 w-16 h-16 bg-gradient-to-r from-green-200/30 to-blue-200/30 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-80 right-20 w-8 h-8 bg-gradient-to-r from-yellow-200/40 to-orange-200/40 rotate-45 animate-spin" style={{animationDuration: '8s'}}></div>
        <div className="absolute top-[500px] right-10 w-6 h-6 bg-gradient-to-r from-indigo-200/40 to-purple-200/40 rounded-full animate-ping"></div>
        
        {/* Large Background Circle */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-full animate-pulse" style={{animationDuration: '4s'}}></div>
        
        {/* Bottom decorative elements */}
        <div className="absolute bottom-40 left-10 w-24 h-24 bg-gradient-to-r from-teal-200/30 to-blue-200/30 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-40 w-14 h-14 bg-gradient-to-r from-pink-200/30 to-purple-200/30 rotate-12 animate-bounce" style={{animationDelay: '1.5s'}}></div>
      </div>
      
      <Header />
      
      {/* Hero Section */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* AI-Powered Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span>AI-Powered Job Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Find Your Dream Job.
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                Simplified.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
              Connecting talented professionals with exceptional opportunities.{' '}
              <span className="text-blue-600 font-semibold">
                Your career journey starts here.
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
              <Link 
                href="/get-started" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <span>Get Started</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              
              <Link 
                href="/browse-jobs" 
                className="bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
                </svg>
                <span>Browse Jobs</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Revolutionizing Job Search with AI
            </h2>
            <p className="text-lg text-gray-600">
              Experience the next generation of career discovery and professional growth
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                AI-Powered Matching
              </h3>
              <p className="text-gray-600 mb-4">
                Our advanced AI algorithms analyze your skills, experience, and preferences to match you with the perfect job opportunities.
              </p>
              <div className="text-blue-600 text-sm font-medium">
                • 98% accuracy rate
                • Real-time skill assessment
                • Personality-job fit analysis
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Instant Applications
              </h3>
              <p className="text-gray-600 mb-4">
                Apply to multiple jobs with just one click using our intelligent application system that customizes your profile for each role.
              </p>
              <div className="text-purple-600 text-sm font-medium">
                • One-click applications
                • Auto-customized resumes
                • Application tracking
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Career Analytics
              </h3>
              <p className="text-gray-600 mb-4">
                Get detailed insights into your job search progress, market trends, and receive personalized career growth recommendations.
              </p>
              <div className="text-green-600 text-sm font-medium">
                • Performance dashboards
                • Market salary insights
                • Career path planning
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How VAI AI Works
              </h2>
              <p className="text-lg text-gray-600">
                Get started in just a few simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Create Profile', desc: 'Sign up and build your professional profile with AI assistance' },
                { step: '02', title: 'AI Analysis', desc: 'Our AI analyzes your skills and matches you with relevant opportunities' },
                { step: '03', title: 'Browse & Apply', desc: 'Discover personalized job recommendations and apply instantly' },
                { step: '04', title: 'Get Hired', desc: 'Track your progress and land your dream job faster' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* For Recruiters Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 md:p-12 text-white">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    For Recruiters & Employers
                  </h2>
                  <p className="text-lg text-blue-100 mb-6">
                    Find the perfect candidates faster with our AI-powered recruitment tools. Post jobs, screen candidates, and manage applications all in one place.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      AI-powered candidate matching
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Automated screening process
          </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Advanced analytics dashboard
          </li>
                  </ul>
                  <Link 
                    href="/signup" 
                    className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all inline-block"
                  >
                    Start Recruiting
                  </Link>
                </div>
                <div className="text-center">
                  <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                    <span className="text-6xl">🎯</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Trusted by Professionals Worldwide
              </h2>
              <p className="text-xl text-blue-100">
                Join millions who've accelerated their careers with VAI AI
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8 text-center text-white">
              <div className="group">
                <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">25K+</div>
                <div className="text-blue-100 text-lg">Active Jobs</div>
                <div className="text-blue-200 text-sm mt-1">Updated daily</div>
              </div>
              <div className="group">
                <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">2.5K+</div>
                <div className="text-blue-100 text-lg">Partner Companies</div>
                <div className="text-blue-200 text-sm mt-1">Fortune 500 included</div>
              </div>
              <div className="group">
                <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">150K+</div>
                <div className="text-blue-100 text-lg">Job Seekers</div>
                <div className="text-blue-200 text-sm mt-1">Growing community</div>
              </div>
              <div className="group">
                <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">92%</div>
                <div className="text-blue-100 text-lg">Success Rate</div>
                <div className="text-blue-200 text-sm mt-1">Within 60 days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What Our Users Say
              </h2>
              <p className="text-lg text-gray-600">
                Real stories from professionals who found their dream jobs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Chen",
                  role: "Software Engineer at Google",
                  content: "VAI AI's matching algorithm found me the perfect role that aligned with my skills and career goals. The application process was seamless!",
                  avatar: "👩‍💻"
                },
                {
                  name: "Marcus Johnson",
                  role: "Product Manager at Microsoft",
                  content: "I was amazed by how accurately VAI AI understood my preferences. Within 2 weeks, I had multiple offers from top companies.",
                  avatar: "👨‍💼"
                },
                {
                  name: "Emily Rodriguez",
                  role: "UX Designer at Apple",
                  content: "The career analytics helped me understand market trends and negotiate a 40% salary increase. Highly recommend!",
                  avatar: "👩‍🎨"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl mr-4 shadow-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.content}"</p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
