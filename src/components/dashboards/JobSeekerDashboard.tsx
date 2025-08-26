'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  BookmarkIcon,
  DocumentTextIcon,
  ChartBarIcon,
  BellIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  HeartIcon,
  EyeIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
}

interface JobSeekerDashboardProps {
  user: User;
}

export default function JobSeekerDashboard({ user }: JobSeekerDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [stats, setStats] = useState({
    appliedJobs: 0,
    savedJobs: 0,
    profileViews: 0,
    interviewsScheduled: 0
  });

  useEffect(() => {
    fetchJobSeekerData();
  }, []);

  const fetchJobSeekerData = async () => {
    // Mock data - replace with actual API calls
    setStats({
      appliedJobs: 12,
      savedJobs: 8,
      profileViews: 45,
      interviewsScheduled: 3
    });

    setRecommendedJobs([
      {
        id: '1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        salary: '$120k - $150k',
        type: 'Full-time',
        posted: '2 days ago',
        description: 'We are looking for a skilled Frontend Developer to join our team...',
        skills: ['React', 'TypeScript', 'Next.js'],
        isSaved: false
      },
      {
        id: '2',
        title: 'Full Stack Engineer',
        company: 'StartupXYZ',
        location: 'Remote',
        salary: '$100k - $130k',
        type: 'Full-time',
        posted: '1 week ago',
        description: 'Join our fast-growing startup as a Full Stack Engineer...',
        skills: ['Node.js', 'React', 'PostgreSQL'],
        isSaved: true
      },
      {
        id: '3',
        title: 'React Developer',
        company: 'Digital Agency',
        location: 'New York, NY',
        salary: '$90k - $110k',
        type: 'Contract',
        posted: '3 days ago',
        description: 'Looking for a React Developer for exciting client projects...',
        skills: ['React', 'JavaScript', 'CSS'],
        isSaved: false
      }
    ]);

    setApplications([
      {
        id: '1',
        jobTitle: 'Frontend Developer',
        company: 'Tech Solutions',
        appliedDate: '2024-01-20',
        status: 'Under Review',
        statusColor: 'yellow'
      },
      {
        id: '2',
        jobTitle: 'React Developer',
        company: 'Innovation Labs',
        appliedDate: '2024-01-18',
        status: 'Interview Scheduled',
        statusColor: 'blue'
      },
      {
        id: '3',
        jobTitle: 'Software Engineer',
        company: 'Global Corp',
        appliedDate: '2024-01-15',
        status: 'Rejected',
        statusColor: 'red'
      }
    ]);

    setSavedJobs([
      {
        id: '1',
        title: 'UI/UX Designer',
        company: 'Design Studio',
        location: 'Los Angeles, CA',
        salary: '$80k - $100k',
        savedDate: '2024-01-22'
      },
      {
        id: '2',
        title: 'Product Manager',
        company: 'Product Co.',
        location: 'Seattle, WA',
        salary: '$130k - $160k',
        savedDate: '2024-01-21'
      }
    ]);
  };

  const toggleSaveJob = (jobId: string) => {
    setRecommendedJobs(jobs => 
      jobs.map(job => 
        job.id === jobId ? { ...job, isSaved: !job.isSaved } : job
      )
    );
  };

  const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600 mt-2`}>{value}</p>
        </div>
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const JobCard = ({ job, showSaveButton = true }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <BuildingOfficeIcon className="h-4 w-4 mr-2" />
            <span className="text-sm">{job.company}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPinIcon className="h-4 w-4 mr-2" />
            <span className="text-sm">{job.location}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-4">
            <CurrencyDollarIcon className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">{job.salary}</span>
            <span className="mx-2">•</span>
            <span className="text-sm">{job.type}</span>
          </div>
        </div>
        {showSaveButton && (
          <button
            onClick={() => toggleSaveJob(job.id)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {job.isSaved ? (
              <HeartSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills?.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center text-gray-500 text-sm">
          <ClockIcon className="h-4 w-4 mr-1" />
          {job.posted}
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 text-sm">
            View Details
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center">
            <PaperAirplaneIcon className="h-4 w-4 mr-1" />
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.firstName}!</h1>
          <p className="text-gray-600 mt-2">Find your dream job and track your applications</p>
        </div>

        {/* Quick Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for jobs, companies, or skills..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Locations</option>
                <option>Remote</option>
                <option>San Francisco</option>
                <option>New York</option>
              </select>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Search Jobs
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Applied Jobs" 
            value={stats.appliedJobs} 
            icon={DocumentTextIcon}
            color="blue"
          />
          <StatCard 
            title="Saved Jobs" 
            value={stats.savedJobs} 
            icon={BookmarkIcon}
            color="green"
          />
          <StatCard 
            title="Profile Views" 
            value={stats.profileViews} 
            icon={EyeIcon}
            color="purple"
          />
          <StatCard 
            title="Interviews" 
            value={stats.interviewsScheduled} 
            icon={ChartBarIcon}
            color="yellow"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
                { id: 'jobs', name: 'Recommended Jobs', icon: MagnifyingGlassIcon },
                { id: 'applications', name: 'My Applications', icon: DocumentTextIcon },
                { id: 'saved', name: 'Saved Jobs', icon: BookmarkIcon },
                { id: 'profile', name: 'Profile', icon: BellIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'dashboard' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Job Search Overview</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Recent Activity</h4>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                        <span className="text-gray-600">Applied to Frontend Developer at TechCorp</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        <span className="text-gray-600">Saved React Developer position</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                        <span className="text-gray-600">Profile viewed by 3 recruiters</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Upcoming Interviews</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Frontend Developer</p>
                          <p className="text-sm text-gray-600">Innovation Labs</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-blue-600">Tomorrow</p>
                          <p className="text-xs text-gray-500">2:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recommended Jobs</h3>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All Jobs
                  </button>
                </div>
                <div className="grid gap-6">
                  {recommendedJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Applications</h3>
                  <span className="text-sm text-gray-600">{applications.length} applications</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Job Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applied Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {app.jobTitle}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {app.company}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {app.appliedDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              app.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                              app.statusColor === 'blue' ? 'bg-blue-100 text-blue-800' :
                              app.statusColor === 'green' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                            <button className="hover:text-blue-800">View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'saved' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Saved Jobs</h3>
                  <span className="text-sm text-gray-600">{savedJobs.length} saved jobs</span>
                </div>
                <div className="grid gap-4">
                  {savedJobs.map((job) => (
                    <div key={job.id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                        <p className="text-sm text-gray-500">Saved on {job.savedDate}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-900">{job.salary}</span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Apply Now</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user.firstName}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user.lastName}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Job Preferences</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Desired Job Title
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Frontend Developer"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Location
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., San Francisco, CA or Remote"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expected Salary Range
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., $100k - $130k"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}