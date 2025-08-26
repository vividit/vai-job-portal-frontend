'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';

const JOB_CATEGORIES = [
  { 
    id: 'tech', 
    name: 'Technology', 
    icon: '💻', 
    count: '2,847',
    color: 'from-blue-500 to-purple-600',
    jobs: ['Software Engineer', 'Data Scientist', 'Product Manager', 'DevOps Engineer']
  },
  { 
    id: 'design', 
    name: 'Design', 
    icon: '🎨', 
    count: '1,234',
    color: 'from-purple-500 to-pink-600',
    jobs: ['UI/UX Designer', 'Graphic Designer', 'Product Designer', 'Brand Designer']
  },
  { 
    id: 'marketing', 
    name: 'Marketing', 
    icon: '📈', 
    count: '1,567',
    color: 'from-green-500 to-blue-600',
    jobs: ['Digital Marketer', 'Content Manager', 'SEO Specialist', 'Social Media Manager']
  },
  { 
    id: 'sales', 
    name: 'Sales', 
    icon: '💼', 
    count: '2,123',
    color: 'from-orange-500 to-red-600',
    jobs: ['Sales Representative', 'Account Manager', 'Business Development', 'Sales Manager']
  },
  { 
    id: 'finance', 
    name: 'Finance', 
    icon: '💰', 
    count: '987',
    color: 'from-emerald-500 to-teal-600',
    jobs: ['Financial Analyst', 'Accountant', 'Investment Banker', 'Risk Manager']
  },
  { 
    id: 'healthcare', 
    name: 'Healthcare', 
    icon: '🏥', 
    count: '1,456',
    color: 'from-red-500 to-pink-600',
    jobs: ['Nurse', 'Doctor', 'Healthcare Admin', 'Medical Technician']
  }
];

const FEATURED_JOBS = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120k - $180k',
    logo: '🚀',
    tags: ['React', 'Node.js', 'TypeScript'],
    posted: '2 days ago'
  },
  {
    id: 2,
    title: 'Product Designer',
    company: 'DesignHub',
    location: 'Remote',
    type: 'Full-time',
    salary: '$90k - $130k',
    logo: '🎯',
    tags: ['Figma', 'User Research', 'Prototyping'],
    posted: '1 day ago'
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'AI Solutions',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$110k - $160k',
    logo: '📊',
    tags: ['Python', 'Machine Learning', 'SQL'],
    posted: '3 days ago'
  }
];

export default function BrowseJobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Discover Your Dream Job
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Explore thousands of opportunities from top companies worldwide
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search jobs, companies, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Job Categories */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600">
              Find opportunities in your field of expertise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {JOB_CATEGORIES.map((category) => (
              <div
                key={category.id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-3">{category.count} open positions</p>
                <div className="flex flex-wrap gap-2">
                  {category.jobs.slice(0, 2).map((job, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {job}
                    </span>
                  ))}
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                    +{category.jobs.length - 2} more
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Jobs */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Jobs
              </h2>
              <p className="text-lg text-gray-600">
                Hand-picked opportunities from top employers
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {FEATURED_JOBS.map((job) => (
                <div key={job.id} className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">
                      {job.logo}
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                      {job.type}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-1">{job.company}</p>
                  <p className="text-gray-500 text-sm mb-3">{job.location}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-gray-900">{job.salary}</span>
                    <span className="text-gray-500 text-sm">{job.posted}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-white text-gray-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of professionals who found their dream jobs with VAI AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signup"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Create Account
              </Link>
              <Link 
                href="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
              >
                Get Help
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}