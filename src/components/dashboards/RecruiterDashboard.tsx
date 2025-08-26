'use client';

import { useState, useEffect } from 'react';
import { 
  PlusIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ChartBarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  StarIcon,
  MapPinIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
}

interface RecruiterDashboardProps {
  user: User;
}

export default function RecruiterDashboard({ user }: RecruiterDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    candidatesHired: 0,
    interviewsScheduled: 0
  });

  useEffect(() => {
    fetchRecruiterData();
  }, []);

  const fetchRecruiterData = async () => {
    // Mock data - replace with actual API calls
    setStats({
      activeJobs: 8,
      totalApplications: 156,
      candidatesHired: 12,
      interviewsScheduled: 7
    });

    setJobs([
      {
        id: '1',
        title: 'Senior Frontend Developer',
        department: 'Engineering',
        location: 'San Francisco, CA',
        salary: '$120k - $150k',
        type: 'Full-time',
        status: 'Active',
        applications: 45,
        posted: '2024-01-15',
        description: 'We are looking for a skilled Frontend Developer...'
      },
      {
        id: '2',
        title: 'Product Manager',
        department: 'Product',
        location: 'Remote',
        salary: '$130k - $160k',
        type: 'Full-time',
        status: 'Draft',
        applications: 0,
        posted: '2024-01-22',
        description: 'Join our product team to drive innovation...'
      },
      {
        id: '3',
        title: 'UX Designer',
        department: 'Design',
        location: 'New York, NY',
        salary: '$90k - $120k',
        type: 'Full-time',
        status: 'Active',
        applications: 28,
        posted: '2024-01-18',
        description: 'Create amazing user experiences...'
      }
    ]);

    setApplications([
      {
        id: '1',
        candidateName: 'John Smith',
        jobTitle: 'Senior Frontend Developer',
        appliedDate: '2024-01-20',
        status: 'Under Review',
        rating: 4,
        experience: '5 years',
        skills: ['React', 'TypeScript', 'Node.js']
      },
      {
        id: '2',
        candidateName: 'Sarah Johnson',
        jobTitle: 'UX Designer',
        appliedDate: '2024-01-19',
        status: 'Interview Scheduled',
        rating: 5,
        experience: '3 years',
        skills: ['Figma', 'User Research', 'Prototyping']
      },
      {
        id: '3',
        candidateName: 'Mike Chen',
        jobTitle: 'Senior Frontend Developer',
        appliedDate: '2024-01-18',
        status: 'Shortlisted',
        rating: 4,
        experience: '7 years',
        skills: ['Vue.js', 'JavaScript', 'CSS']
      }
    ]);

    setCandidates([
      {
        id: '1',
        name: 'Alice Brown',
        title: 'Full Stack Developer',
        location: 'Seattle, WA',
        experience: '4 years',
        skills: ['React', 'Node.js', 'PostgreSQL'],
        rating: 4.5,
        availability: 'Available',
        lastActive: '2 days ago'
      },
      {
        id: '2',
        name: 'David Wilson',
        title: 'DevOps Engineer',
        location: 'Austin, TX',
        experience: '6 years',
        skills: ['AWS', 'Docker', 'Kubernetes'],
        rating: 4.8,
        availability: 'Available',
        lastActive: '1 week ago'
      }
    ]);
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

  const JobCard = ({ job }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              job.status === 'Active' ? 'bg-green-100 text-green-800' : 
              job.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {job.status}
            </span>
          </div>
          <div className="space-y-1 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <BriefcaseIcon className="h-4 w-4 mr-2" />
              <span>{job.department}</span>
            </div>
            <div className="flex items-center">
              <MapPinIcon className="h-4 w-4 mr-2" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-4 w-4 mr-2" />
              <span className="font-medium">{job.salary}</span>
              <span className="mx-2">•</span>
              <span>{job.type}</span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{job.applications} applications</span>
          <span>Posted {job.posted}</span>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
            <EyeIcon className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg">
            <PencilIcon className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const ApplicationRow = ({ application }) => (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {application.candidateName.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{application.candidateName}</div>
            <div className="text-sm text-gray-500">{application.experience} experience</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">{application.jobTitle}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{application.appliedDate}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          application.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
          application.status === 'Interview Scheduled' ? 'bg-blue-100 text-blue-800' :
          application.status === 'Shortlisted' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {application.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`h-4 w-4 ${
                i < application.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
          <button className="text-green-600 hover:text-green-800 text-sm">Interview</button>
          <button className="text-red-600 hover:text-red-800 text-sm">Reject</button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.firstName}! Manage your job postings and candidates.</p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
              <p className="text-gray-600 text-sm">Streamline your recruitment process</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <PlusIcon className="h-4 w-4 mr-2" />
                Post New Job
              </button>
              <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                Search Candidates
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Active Jobs" 
            value={stats.activeJobs} 
            icon={BriefcaseIcon}
            color="blue"
          />
          <StatCard 
            title="Total Applications" 
            value={stats.totalApplications} 
            icon={DocumentTextIcon}
            color="green"
          />
          <StatCard 
            title="Candidates Hired" 
            value={stats.candidatesHired} 
            icon={UserGroupIcon}
            color="purple"
          />
          <StatCard 
            title="Interviews Scheduled" 
            value={stats.interviewsScheduled} 
            icon={ClockIcon}
            color="yellow"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
                { id: 'jobs', name: 'My Jobs', icon: BriefcaseIcon },
                { id: 'applications', name: 'Applications', icon: DocumentTextIcon },
                { id: 'candidates', name: 'Candidate Pool', icon: UserGroupIcon },
                { id: 'analytics', name: 'Analytics', icon: ChartBarIcon }
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
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recruitment Overview</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Recent Activity</h4>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                        <span className="text-gray-600">New application for Frontend Developer</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        <span className="text-gray-600">Interview scheduled with Sarah Johnson</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                        <span className="text-gray-600">Job posting for UX Designer is live</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Top Performing Jobs</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Senior Frontend Developer</span>
                        <span className="text-sm font-medium text-gray-900">45 applications</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">UX Designer</span>
                        <span className="text-sm font-medium text-gray-900">28 applications</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Product Manager</span>
                        <span className="text-sm font-medium text-gray-900">0 applications</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Job Postings</h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create New Job
                  </button>
                </div>
                <div className="grid gap-6">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
                  <div className="flex gap-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>All Jobs</option>
                      <option>Senior Frontend Developer</option>
                      <option>UX Designer</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>All Status</option>
                      <option>Under Review</option>
                      <option>Interview Scheduled</option>
                      <option>Shortlisted</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Candidate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Job Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applied Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((application) => (
                        <ApplicationRow key={application.id} application={application} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'candidates' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Candidate Pool</h3>
                  <div className="flex gap-2">
                    <div className="relative">
                      <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search candidates..."
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                      Filter
                    </button>
                  </div>
                </div>
                <div className="grid gap-4">
                  {candidates.map((candidate) => (
                    <div key={candidate.id} className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                              <span className="text-blue-600 font-semibold">
                                {candidate.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{candidate.name}</h4>
                              <p className="text-gray-600">{candidate.title}</p>
                            </div>
                          </div>
                          <div className="ml-16 space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPinIcon className="h-4 w-4 mr-2" />
                              <span>{candidate.location} • {candidate.experience} experience</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {candidate.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(candidate.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-1 text-sm text-gray-600">{candidate.rating}</span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              candidate.availability === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {candidate.availability}
                            </span>
                            <p className="text-gray-500">Active {candidate.lastActive}</p>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button className="px-3 py-1 text-blue-600 border border-blue-600 rounded text-sm hover:bg-blue-50">
                              View Profile
                            </button>
                            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                              Contact
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recruitment Analytics</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Application Trends</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">This Week</span>
                        <span className="text-sm font-medium text-gray-900">23 applications</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Last Week</span>
                        <span className="text-sm font-medium text-gray-900">18 applications</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Growth</span>
                        <span className="text-sm font-medium text-green-600">+27.8%</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Hiring Funnel</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Applications</span>
                        <span className="text-sm font-medium text-gray-900">156</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Interviews</span>
                        <span className="text-sm font-medium text-gray-900">24</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Offers</span>
                        <span className="text-sm font-medium text-gray-900">8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Hires</span>
                        <span className="text-sm font-medium text-gray-900">6</span>
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