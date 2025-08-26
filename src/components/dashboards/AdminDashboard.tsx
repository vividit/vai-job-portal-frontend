'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

import { 
  HomeIcon,
  UserGroupIcon, 
  BriefcaseIcon, 
  BuildingOfficeIcon,
  CogIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  Cog6ToothIcon,
  PlayIcon,
  StopIcon,
  ArrowPathIcon,
  DocumentPlusIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  FunnelIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Breadcrumb from '@/components/ui/Breadcrumb';
import JobDetailModal from '@/components/ui/JobDetailModal';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  isVerified: boolean;
  isActive?: boolean;
  createdAt: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  status: string;
  applications: number;
  postedDate: string;
  salary: string | { min: number; max: number; currency: string };
  description?: string;
  source?: string;
  externalUrl?: string;
  sourceUrl?: string;
  skills?: string[];
  experience?: string;
  yearsOfExperience?: string;
  education?: string;
  certifications?: string[];
  benefits?: { 
    healthInsurance?: boolean; 
    dentalInsurance?: boolean; 
    retirement401k?: boolean; 
    paidTimeOff?: boolean; 
    workFromHome?: boolean; 
    flexibleSchedule?: boolean; 
    professionalDevelopment?: boolean; 
  };
  compensation?: { 
    salaryMin?: number; 
    salaryMax?: number; 
    currency?: string; 
  };
  applicationDeadline?: string;
  languages?: string[];
  tags?: string[];
  duration?: string;
  datePosted?: string;
}

interface CrawlerInstance {
  id: string;
  name: string;
  companies: string[];
  status: string;
  totalJobs: number;
  configuration: any;
  statistics: any;
  lastRun: string;
  nextRun: string;
  crawlerId?: string;
  totalJobsExtracted?: number;
  error?: string;
  saveResults?: any;
}

interface Company {
  id: string;
  name: string;
  url: string;
  level: string;
  type: string;
  location: string;
  robotsAllowed?: boolean;
  jobs?: number;
}

interface CrawlerConfig {
  sources: string[];
  searchTerms: string[];
  locations: string[];
  companies: string[];
  maxJobsPerSource: number;
  respectRobots: boolean;
}

interface CrawlerStats {
  status: string;
  totalJobs: number;
  activeSources: number;
  targetCompanies: number;
  pendingJobs: number;
}

interface DashboardStats {
  totalUsers: number;
  totalJobs: number;
  activeJobs: number;
  pendingApprovals: number;
}

interface SystemHealth {
  serverStatus: string;
  database: string;
  apiResponse: string;
}

interface Filters {
  session: string;
  dateRange: string;
  company: string;
  employmentType: string;
  sourceType: string;
  jobTitle: string;
}

interface NewCompany {
  name: string;
  url: string;
  level: string;
  type: string;
  location: string;
}

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  isVerified: boolean;
  isActive: boolean;
}

interface JobWebsite {
  id: string;
  name: string;
  url: string;
  category: string;
  premium: boolean;
}

interface AdminDashboardProps {
  user: User;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobsPage, setJobsPage] = useState(1);
  const [hasMoreJobs, setHasMoreJobs] = useState(true);
  const [loadingMoreJobs, setLoadingMoreJobs] = useState(false);
  const jobsContainerRef = useRef<HTMLDivElement>(null);
  const [crawlerStats, setCrawlerStats] = useState<CrawlerStats>({
    status: 'Stopped',
    totalJobs: 0,
    activeSources: 0,
    targetCompanies: 0,
    pendingJobs: 0
  });
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalJobs: 0,
    activeJobs: 0,
    pendingApprovals: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    serverStatus: 'Online',
    database: 'Connected',
    apiResponse: 'Fast'
  });
  
  const [activeJobTab, setActiveJobTab] = useState('manage'); // 'manage' or 'browse'
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    session: '',
    dateRange: '',
    company: '',
    employmentType: '',
    sourceType: '',
    jobTitle: ''
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  // Crawler states
  const [activeCrawlerTab, setActiveCrawlerTab] = useState('crawler-view'); // 'crawler-view', 'launch-pad-crawler', 'jobs-by-apis', 'launch-pad-apis'
  const [selectedCrawlerJob, setSelectedCrawlerJob] = useState<Job | null>(null);
  const [crawlerLoading, setCrawlerLoading] = useState(false);
  const [crawlerStatus, setCrawlerStatus] = useState('idle'); // 'idle', 'running', 'completed', 'error'
  const [crawlerResults, setCrawlerResults] = useState<any>(null);
  const [crawlerConfig, setCrawlerConfig] = useState<CrawlerConfig>({
    sources: ['linkedin', 'indeed'],
    searchTerms: ['software engineer', 'developer'],
    locations: ['remote', 'san francisco'],
    companies: [],
    maxJobsPerSource: 25,
    respectRobots: true
  });
  
  // Dynamic crawler instances
  const [crawlerInstances, setCrawlerInstances] = useState<CrawlerInstance[]>([]);
  const [loadingCrawlers, setLoadingCrawlers] = useState(false);
  
  // Add company form states
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [selectedCrawlerForCompany, setSelectedCrawlerForCompany] = useState<string | null>(null);
  const [newCompany, setNewCompany] = useState<NewCompany>({
    name: '',
    url: '',
    level: 'All Levels',
    type: 'FTE',
    location: 'Remote'
  });

  // Job website selection states
  const [showJobWebsiteModal, setShowJobWebsiteModal] = useState(false);
  const [selectedCrawlerForWebsites, setSelectedCrawlerForWebsites] = useState<string | null>(null);
  const [jobWebsiteConfig, setJobWebsiteConfig] = useState<Record<string, any>>({});
  
  // Button active states
  const [activeButtons, setActiveButtons] = useState<Record<string, boolean>>({});
  
  // User Management states
  const [activeUserTab, setActiveUserTab] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [userFormData, setUserFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    userType: 'jobseeker',
    isVerified: false,
    isActive: true
  });

  // Comprehensive list of job websites
  const jobWebsites: JobWebsite[] = [
    { id: 'linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com/jobs', category: 'General', premium: false },
    { id: 'indeed', name: 'Indeed', url: 'https://www.indeed.com', category: 'General', premium: false },
    { id: 'glassdoor', name: 'Glassdoor', url: 'https://www.glassdoor.com/Jobs', category: 'General', premium: false },
    { id: 'monster', name: 'Monster', url: 'https://www.monster.com', category: 'General', premium: false },
    { id: 'ziprecruiter', name: 'ZipRecruiter', url: 'https://www.ziprecruiter.com', category: 'General', premium: false },
    { id: 'careerbuilder', name: 'CareerBuilder', url: 'https://www.careerbuilder.com', category: 'General', premium: false },
    { id: 'simplyhired', name: 'SimplyHired', url: 'https://www.simplyhired.com', category: 'General', premium: false },
    { id: 'stackoverflow', name: 'Stack Overflow Jobs', url: 'https://stackoverflow.com/jobs', category: 'Tech', premium: false },
    { id: 'github', name: 'GitHub Jobs', url: 'https://jobs.github.com', category: 'Tech', premium: false },
    { id: 'dice', name: 'Dice', url: 'https://www.dice.com', category: 'Tech', premium: false },
    { id: 'cyberseek', name: 'CyberSeek', url: 'https://www.cyberseek.org', category: 'Tech', premium: false },
    { id: 'angel', name: 'AngelList/Wellfound', url: 'https://wellfound.com', category: 'Startup', premium: false },
    { id: 'ycombinator', name: 'Y Combinator', url: 'https://www.ycombinator.com/jobs', category: 'Startup', premium: false },
    { id: 'crunchboard', name: 'CrunchBoard', url: 'https://www.crunchboard.com', category: 'Startup', premium: false },
    { id: 'remoteco', name: 'Remote.co', url: 'https://remote.co', category: 'Remote', premium: false },
    { id: 'remoteok', name: 'RemoteOK', url: 'https://remoteok.io', category: 'Remote', premium: false },
    { id: 'weworkremotely', name: 'We Work Remotely', url: 'https://weworkremotely.com', category: 'Remote', premium: false },
    { id: 'flexjobs', name: 'FlexJobs', url: 'https://www.flexjobs.com', category: 'Remote', premium: true },
    { id: 'upwork', name: 'Upwork', url: 'https://www.upwork.com', category: 'Freelance', premium: false },
    { id: 'freelancer', name: 'Freelancer', url: 'https://www.freelancer.com', category: 'Freelance', premium: false },
    { id: 'toptal', name: 'Toptal', url: 'https://www.toptal.com', category: 'Freelance', premium: true },
    { id: 'guru', name: 'Guru', url: 'https://www.guru.com', category: 'Freelance', premium: false },
    { id: 'google', name: 'Google Careers', url: 'https://careers.google.com', category: 'Corporate', premium: false },
    { id: 'microsoft', name: 'Microsoft Careers', url: 'https://careers.microsoft.com', category: 'Corporate', premium: false },
    { id: 'apple', name: 'Apple Careers', url: 'https://jobs.apple.com', category: 'Corporate', premium: false },
    { id: 'amazon', name: 'Amazon Jobs', url: 'https://amazon.jobs', category: 'Corporate', premium: false },
    { id: 'meta', name: 'Meta Careers', url: 'https://www.metacareers.com', category: 'Corporate', premium: false },
    { id: 'netflix', name: 'Netflix Jobs', url: 'https://jobs.netflix.com', category: 'Corporate', premium: false },
    { id: 'tesla', name: 'Tesla Careers', url: 'https://www.tesla.com/careers', category: 'Corporate', premium: false },
    { id: 'uber', name: 'Uber Careers', url: 'https://www.uber.com/careers', category: 'Corporate', premium: false },
    { id: 'airbnb', name: 'Airbnb Careers', url: 'https://careers.airbnb.com', category: 'Corporate', premium: false },
    { id: 'stripe', name: 'Stripe Careers', url: 'https://stripe.com/jobs', category: 'Corporate', premium: false },
    { id: 'shopify', name: 'Shopify Careers', url: 'https://www.shopify.com/careers', category: 'Corporate', premium: false },
    { id: 'salesforce', name: 'Salesforce Careers', url: 'https://salesforce.wd1.myworkdayjobs.com', category: 'Corporate', premium: false },
    { id: 'oracle', name: 'Oracle Careers', url: 'https://www.oracle.com/careers', category: 'Corporate', premium: false },
    { id: 'ibm', name: 'IBM Careers', url: 'https://www.ibm.com/careers', category: 'Corporate', premium: false },
    { id: 'cisco', name: 'Cisco Careers', url: 'https://jobs.cisco.com', category: 'Corporate', premium: false },
    { id: 'coinbase', name: 'Coinbase Careers', url: 'https://www.coinbase.com/careers', category: 'Fintech', premium: false },
    { id: 'robinhood', name: 'Robinhood Careers', url: 'https://robinhood.com/careers', category: 'Fintech', premium: false },
    { id: 'plaid', name: 'Plaid Careers', url: 'https://plaid.com/careers', category: 'Fintech', premium: false },
    { id: 'mercury', name: 'Mercury Careers', url: 'https://boards.greenhouse.io/mercury', category: 'Fintech', premium: false },
    { id: 'greenhouse', name: 'Greenhouse (Job Board)', url: 'https://boards.greenhouse.io', category: 'Aggregator', premium: false },
    { id: 'lever', name: 'Lever (Job Board)', url: 'https://jobs.lever.co', category: 'Aggregator', premium: false },
    { id: 'workday', name: 'Workday Jobs', url: 'https://workday.wd5.myworkdayjobs.com', category: 'Aggregator', premium: false }
  ];

  useEffect(() => {
    fetchAdminData();
    fetchCompanies();
    fetchCrawlerInstances();
  }, []);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const response = await fetch('/api/admin/jobs', { headers });
      if (response.ok) {
        const data = await response.json();
        const jobs = data.data || data.jobs || [];
        
        // Extract unique companies
        const uniqueCompanies = [...new Set(jobs.map((job: Job) => job.company).filter(Boolean))];
        setCompanies(uniqueCompanies.map((name, index) => ({ 
          id: `company-${index}`, 
          name: String(name), 
          url: '', 
          level: 'All Levels', 
          type: 'FTE', 
          location: 'Remote' 
        })));
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchAdminData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Fetch real stats from backend
      const statsResponse = await fetch('/api/admin/stats', { headers });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData.success) {
          setStats({
            totalUsers: statsData.data.totalUsers || 0,
            totalJobs: statsData.data.totalJobs || 0,
            activeJobs: statsData.data.activeJobs || 0,
            pendingApprovals: statsData.data.pendingApprovals || 0
          });
          
          // Debug logging
          console.log('[Admin Dashboard] Stats received:', {
            totalUsers: statsData.data.totalUsers,
            totalJobs: statsData.data.totalJobs,
            activeJobs: statsData.data.activeJobs,
            pendingApprovals: statsData.data.pendingApprovals
          });
          
          setRecentActivity(statsData.data.recentActivity || []);
          setSystemHealth(statsData.data.systemHealth || {
            serverStatus: 'Online',
            database: 'Connected',
            apiResponse: 'Fast'
          });
          
          setCrawlerStats({
            status: statsData.data.crawler?.status || 'Stopped',
            totalJobs: statsData.data.crawler?.totalJobs || statsData.data.totalJobs || 0,
            activeSources: statsData.data.crawler?.activeSources || 0,
            targetCompanies: statsData.data.crawler?.targetCompanies || 0,
            pendingJobs: statsData.data.crawler?.pendingJobs || 0
          });
        }
      }

      // Fetch real users from backend
      const usersResponse = await fetch('/api/users', { headers });
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        if (usersData.success || usersData.data) {
          const userData = usersData.data || usersData;
          const formattedUsers = Array.isArray(userData) ? userData.map(user => ({
            id: user._id || user.id,
            firstName: user.name ? user.name.split(' ')[0] : user.firstName || 'Unknown',
            lastName: user.name ? user.name.split(' ').slice(1).join(' ') : user.lastName || '',
            email: user.email,
            userType: user.role || user.userType || 'job_seeker',
            isVerified: user.isVerified !== undefined ? user.isVerified : true,
            createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'
          })) : [];
          setUsers(formattedUsers);
        }
      }

      // Fetch real jobs from backend
      console.log('🔍 Fetching jobs with token:', token ? 'Token exists' : 'No token');
      console.log('🔍 Jobs API headers:', headers);
      
      const jobsResponse = await fetch('/api/jobs/admin-all', { headers });
      console.log('🔍 Jobs response status:', jobsResponse.status);
      console.log('🔍 Jobs response headers:', Object.fromEntries(jobsResponse.headers.entries()));
      
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        
        // Handle different response formats
        let jobs = [];
        if (jobsData.data && Array.isArray(jobsData.data)) {
          // Format: { success: true, data: [...] }
          jobs = jobsData.data;
        } else if (jobsData.jobs && Array.isArray(jobsData.jobs)) {
          // Format: { jobs: [...], pagination: {...} }
          jobs = jobsData.jobs;
        }
        
        if (jobs.length > 0) {
          const formattedJobs = jobs.map((job: any) => ({
            id: job._id || job.id,
            title: job.title || 'Untitled Job',
            company: job.company || 'Unknown Company',
            location: job.location || 'Location not specified',
            type: job.type || 'full-time',
            status: job.status || 'open',
            applications: job.applicants?.length || job.applicationTracking?.totalApplications || 0,
            postedDate: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Unknown',
            salary: typeof job.salary === 'object' && job.salary && job.salary.min !== null && job.salary.max !== null ? 
              `$${job.salary.min?.toLocaleString() || 0} - $${job.salary.max?.toLocaleString() || 0} ${job.salary.currency || 'USD'}` :
              typeof job.salary === 'string' ? job.salary :
              (job.compensation?.salaryMin && job.compensation?.salaryMax ? 
                `$${job.compensation.salaryMin.toLocaleString()} - $${job.compensation.salaryMax.toLocaleString()}` : 'Not specified'),
            description: job.description || '',
            // Real backend fields
            experience: job.experience,
            skills: job.skills,
            department: job.department,
            source: job.source || 'internal',
            datePosted: job.datePosted ? new Date(job.datePosted).toLocaleDateString() : null,
            isActive: job.isActive,
            maxApplications: job.maxApplications,
            applicationDeadline: job.applicationDeadline,
            // Job requirements
            education: job.jobRequirements?.education,
            yearsOfExperience: job.jobRequirements?.yearsOfExperience,
            certifications: job.jobRequirements?.certifications,
            languages: job.jobRequirements?.languages,
            // Benefits
            benefits: job.benefits,
            // Compensation details
            compensation: job.compensation,
            // External tracking
            externalUrl: job.externalUrl,
            sourceUrl: job.sourceUrl,
            crawledAt: job.crawledAt,
            tags: job.tags
          }));
          setJobs(formattedJobs);
        } else {
          setJobs([]);
        }
      } else {
        // Try to get response data even if status is not 200
        try {
          const errorResponse = await jobsResponse.text();
          console.log(`⚠️ Jobs API returned status ${jobsResponse.status}, but attempting to parse response...`);
          
          // Try to parse as JSON in case there's data despite the error status
          try {
            const jobsData = JSON.parse(errorResponse);
            if (jobsData.data && Array.isArray(jobsData.data) && jobsData.data.length > 0) {
              console.log('✅ Found jobs data despite error status, processing...');
              const formattedJobs = jobsData.data.map((job: any) => ({
                id: job._id || job.id,
                title: job.title || 'Untitled Job',
                company: job.company || 'Unknown Company',
                location: job.location || 'Location not specified',
                type: job.type || 'full-time',
                status: job.status || 'open',
                applications: job.applicants?.length || job.applicationTracking?.totalApplications || 0,
                postedDate: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Unknown',
                salary: typeof job.salary === 'object' && job.salary && 'min' in job.salary && 'max' in job.salary ? 
                  `$${(job.salary as any).min?.toLocaleString() || 0} - $${(job.salary as any).max?.toLocaleString() || 0} ${(job.salary as any).currency || 'USD'}` :
                  typeof job.salary === 'string' ? job.salary :
                  (job.compensation?.salaryMin && job.compensation?.salaryMax ? 
                    `$${job.compensation.salaryMin.toLocaleString()} - $${job.compensation.salaryMax.toLocaleString()}` : 'Not specified'),
                description: job.description || '',
                experience: job.experience,
                skills: job.skills,
                department: job.department,
                source: job.source || 'internal',
                datePosted: job.datePosted ? new Date(job.datePosted).toLocaleDateString() : null,
                isActive: job.isActive,
                maxApplications: job.maxApplications,
                applicationDeadline: job.applicationDeadline,
                education: job.jobRequirements?.education,
                yearsOfExperience: job.jobRequirements?.yearsOfExperience,
                certifications: job.jobRequirements?.certifications,
                languages: job.jobRequirements?.languages,
                benefits: job.benefits,
                compensation: job.compensation,
                externalUrl: job.externalUrl,
                sourceUrl: job.sourceUrl,
                crawledAt: job.crawledAt,
                tags: job.tags
              }));
              setJobs(formattedJobs);
              return; // Exit early since we successfully processed the data
            }
          } catch (parseError) {
            // Response is not JSON, continue with normal error handling
          }
        } catch (textError) {
          // Couldn't read response text
        }
        
        // Only log error if we couldn't extract any data
        console.log(`ℹ️ Jobs API returned status ${jobsResponse.status}, setting empty jobs array`);
        setJobs([]);
      }

    } catch (error) {
      console.log('⚠️ Error fetching admin data, using fallback values');
      // Fallback to empty arrays if API fails
      setUsers([]);
      setJobs([]);
      setStats({
        totalUsers: 0,
        totalJobs: 0,
        activeJobs: 0,
        pendingApprovals: 0
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchAdminData(true);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = async () => {
    setLoadingFilters(true);
    try {
      const token = localStorage.getItem('authToken');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.company) params.append('company', filters.company);
      if (filters.employmentType) params.append('type', filters.employmentType);
      if (filters.sourceType) params.append('source', filters.sourceType);
      if (filters.jobTitle) params.append('search', filters.jobTitle);
      if (filters.dateRange) params.append('dateFrom', filters.dateRange);
      if (filters.session) params.append('session', filters.session);
      
      console.log('Applying filters:', filters);
      console.log('API call:', `/api/admin/jobs?${params.toString()}`);
      
      const jobsResponse = await fetch(`/api/jobs/admin-all?${params.toString()}`, { headers });
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        console.log('Filter results:', jobsData);
        
        // Handle different response formats (same as fetchAdminData)
        let jobs = [];
        if (jobsData.data && Array.isArray(jobsData.data)) {
          jobs = jobsData.data;
        } else if (jobsData.jobs && Array.isArray(jobsData.jobs)) {
          jobs = jobsData.jobs;
        }
        
        if (jobs.length >= 0) {
          const formattedJobs = jobs.map((job: any) => ({
            id: job._id || job.id,
            title: job.title || 'Untitled Job',
            company: job.company || 'Unknown Company',
            location: job.location || 'Location not specified',
            type: job.type || 'full-time',
            status: job.status || 'open',
            applications: job.applicants?.length || job.applicationTracking?.totalApplications || 0,
            postedDate: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Unknown',
            salary: typeof job.salary === 'object' && job.salary && job.salary.min !== null && job.salary.max !== null ? 
              `$${job.salary.min?.toLocaleString() || 0} - $${job.salary.max?.toLocaleString() || 0} ${job.salary.currency || 'USD'}` :
              typeof job.salary === 'string' ? job.salary :
              (job.compensation?.salaryMin && job.compensation?.salaryMax ? 
                `$${job.compensation.salaryMin.toLocaleString()} - $${job.compensation.salaryMax.toLocaleString()}` : 'Not specified'),
            description: job.description || '',
            experience: job.experience,
            skills: job.skills,
            department: job.department,
            source: job.source || 'internal',
            datePosted: job.datePosted ? new Date(job.datePosted).toLocaleDateString() : null,
            isActive: job.isActive,
            maxApplications: job.maxApplications,
            applicationDeadline: job.applicationDeadline,
            education: job.jobRequirements?.education,
            yearsOfExperience: job.jobRequirements?.yearsOfExperience,
            certifications: job.jobRequirements?.certifications,
            languages: job.jobRequirements?.languages,
            benefits: job.benefits,
            compensation: job.compensation,
            externalUrl: job.externalUrl,
            sourceUrl: job.sourceUrl,
            crawledAt: job.crawledAt,
            tags: job.tags
          }));
          
          setJobs(formattedJobs);
          setJobsPage(1);
          setHasMoreJobs(false); // Reset pagination for filtered results
          
          console.log(`Applied filters, found ${formattedJobs.length} jobs`);
        } else {
          setJobs([]);
        }
      } else {
        console.log('⚠️ Filter request returned non-200 status, but continuing...');
      }
    } catch (error) {
      console.log('⚠️ Error applying filters, continuing with current data');
    }
    setLoadingFilters(false);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      session: '',
      dateRange: '',
      company: '',
      employmentType: '',
      sourceType: '',
      jobTitle: ''
    });
    fetchAdminData(); // Reload all jobs
  };

  // Crawler functions
  const startEnhancedCrawler = async () => {
    try {
      setCrawlerLoading(true);
      setCrawlerStatus('running');
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('🚀 Starting enhanced crawler with config:', crawlerConfig);

      const response = await fetch('/api/crawler/enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...crawlerConfig,
          saveToDatabase: true
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Crawler request failed');
      }

      console.log('✅ Crawler completed successfully:', data);
      setCrawlerResults(data.data);
      setCrawlerStatus('completed');
      
      // Refresh jobs data to show newly crawled jobs
      await fetchAdminData();
      
    } catch (error) {
      console.error('❌ Crawler failed:', error);
      setCrawlerStatus('error');
      setCrawlerResults({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setCrawlerLoading(false);
    }
  };

  const testRobotsCompliance = async (url: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/crawler/test-robots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url })
      });

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error testing robots compliance:', error);
      return { crawlingAllowed: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  // User Management Functions
  const handleUserAction = async (action: string, userId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { 'Authorization': `Bearer ${token}` };

      switch (action) {
        case 'edit':
          const userToEdit = users.find(u => u.id === userId);
          if (userToEdit) {
            setEditingUser(userToEdit);
            setUserFormData({
              firstName: userToEdit.firstName || '',
              lastName: userToEdit.lastName || '',
              email: userToEdit.email || '',
              userType: userToEdit.userType || 'jobseeker',
              isVerified: userToEdit.isVerified || false,
              isActive: userToEdit.isActive !== false
            });
            setShowUserModal(true);
          }
          break;

        case 'delete':
          if (confirm('Are you sure you want to delete this user?')) {
            const response = await fetch(`/api/users/${userId}`, {
              method: 'DELETE',
              headers
            });
            if (response.ok) {
              setUsers(users.filter(u => u.id !== userId));
              alert('User deleted successfully');
            } else {
              alert('Failed to delete user');
            }
          }
          break;

        case 'password':
          const userForPassword = users.find(u => u.id === userId);
          if (userForPassword) setEditingUser(userForPassword);
          setShowPasswordModal(true);
          break;

        case 'access':
          const userForAccess = users.find(u => u.id === userId);
          if (userForAccess) setEditingUser(userForAccess);
          setShowAccessModal(true);
          break;
      }
    } catch (error) {
      console.error('Error handling user action:', error);
      alert('An error occurred');
    }
  };

  const saveUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { 'Authorization': `Bearer ${token}` };

      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(userFormData)
      });

      if (response.ok) {
        if (editingUser) {
          setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userFormData } : u));
        } else {
          const newUser = await response.json();
          setUsers([...users, newUser]);
        }
        setShowUserModal(false);
        setEditingUser(null);
        setUserFormData({
          firstName: '',
          lastName: '',
          email: '',
          userType: 'jobseeker',
          isVerified: false,
          isActive: true
        });
        alert(editingUser ? 'User updated successfully' : 'User created successfully');
      } else {
        alert('Failed to save user');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('An error occurred');
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (!editingUser) {
      alert('No user selected for password update');
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/users/${editingUser.id}/password`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });

      if (response.ok) {
        alert('Password updated successfully');
        setShowPasswordModal(false);
        setEditingUser(null);
      } else {
        alert('Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('An error occurred');
    }
  };

  const updateUserAccess = async (accessData: any) => {
    if (!editingUser) {
      alert('No user selected for access update');
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/users/${editingUser.id}/access`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(accessData)
      });

      if (response.ok) {
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...accessData } : u));
        alert('User access updated successfully');
        setShowAccessModal(false);
        setEditingUser(null);
      } else {
        alert('Failed to update user access');
      }
    } catch (error) {
      console.error('Error updating user access:', error);
      alert('An error occurred');
    }
  };

  const filteredUsers = () => {
    if (activeUserTab === 'all') return users;
    return users.filter(user => user.userType === activeUserTab);
  };

  const refreshCrawlerData = async () => {
    try {
      setRefreshing(true);
      await fetchAdminData();
      console.log('✅ Crawler data refreshed');
    } catch (error) {
      console.error('❌ Failed to refresh crawler data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const testCrawlerConnection = async () => {
    try {
      console.log('🔗 Testing crawler connection...');
      
      const response = await fetch('/api/crawler/test-connection');
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Crawler connection test successful:', data);
        alert(`Connection successful!\n\nBackend: ${data.message}\nFrontend: ${data.frontendTimestamp}\nBackend URL: ${data.backendUrl}`);
      } else {
        console.error('❌ Crawler connection test failed:', data);
        alert(`Connection failed!\n\nError: ${data.message}\nDetails: ${data.error}`);
      }
    } catch (error) {
      console.error('❌ Connection test error:', error);
      alert(`Connection test failed!\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Fetch dynamic crawler instances
  const fetchCrawlerInstances = async () => {
    try {
      setLoadingCrawlers(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('/api/crawler/instances', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setCrawlerInstances(data.data);
        console.log('✅ Crawler instances loaded:', data.data);
      } else {
        console.error('❌ Failed to load crawler instances:', data);
      }
    } catch (error) {
      console.error('❌ Error fetching crawler instances:', error);
    } finally {
      setLoadingCrawlers(false);
    }
  };

  // Add new crawler instance
  const addCrawlerInstance = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('/api/crawler/instances', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sources: ['linkedin', 'indeed'],
          searchTerms: ['software engineer'],
          locations: ['remote'],
          maxJobsPerSource: 25,
          respectRobots: true
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log('✅ New crawler instance created:', data.data);
        alert(`✅ Crawler ${data.data?.crawlerId || 'new'} created successfully!`);
        await fetchCrawlerInstances(); // Refresh the list
      } else {
        console.error('❌ Failed to create crawler instance:', data);
        const errorMessage = data.error || data.message || 'Unknown error occurred';
        const details = data.details ? `\n\nDetails: ${data.details}` : '';
        alert(`Failed to create crawler: ${errorMessage}${details}`);
      }
    } catch (error) {
      console.error('❌ Error creating crawler instance:', error);
      alert(`Error creating crawler: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Start crawler for a specific company
  const startCrawlerForCompany = async (crawlerId: string, company: Company) => {
    try {
      setCrawlerLoading(true);
      const token = localStorage.getItem('authToken');
      
      const crawlConfig = {
        sources: ['linkedin', 'indeed'], // Default sources
        searchTerms: ['software engineer', 'developer'], // Default search terms
        locations: ['remote'], // Default location
        companies: [company.url], // Specific company URL
        maxJobsPerSource: 25,
        respectRobots: true,
        saveToDatabase: true
      };

      console.log(`🚀 Starting crawler for company: ${company.name} (${company.url})`);

      const response = await fetch('/api/crawler/enhanced', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(crawlConfig)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log(`✅ Crawler started successfully for ${company.name}:`, data);
        setCrawlerStatus('running');
        setCrawlerResults(data.results || {});
        
        // Show success message
        alert(`✅ Crawler started for ${company.name}!\n\nJobs found: ${data.results?.totalJobs || 0}\nSessions: ${data.results?.sessions || 0}`);
        
        // Refresh crawler instances
        await fetchCrawlerInstances();
      } else {
        console.error(`❌ Failed to start crawler for ${company.name}:`, data);
        alert(`❌ Failed to start crawler for ${company.name}: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(`❌ Error starting crawler for ${company.name}:`, error);
      alert(`❌ Error starting crawler for ${company.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setCrawlerLoading(false);
    }
  };

  // Handle job application
  const handleApply = (job: Job) => {
    console.log('🎯 Applying to job:', job.title, 'at', job.company);
    
    if (job.externalUrl || job.sourceUrl) {
      // External job - open the original job posting
      window.open(job.externalUrl || job.sourceUrl, '_blank');
    } else {
      // Internal job - could implement internal application logic
      alert(`Application submitted for ${job.title} at ${job.company}!\n\n(This would normally redirect to an application form)`);
    }
  };

  // Show add company form
  const showAddCompanyForm = (crawlerId: string) => {
    setSelectedCrawlerForCompany(crawlerId);
    setNewCompany({
      name: '',
      url: '',
      level: 'All Levels',
      type: 'FTE',
      location: 'Remote'
    });
    setShowAddCompanyModal(true);
  };

  // Add company to crawler
  const addCompanyToCrawler = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!newCompany.name || !newCompany.url) {
        alert('Please fill in company name and URL');
        return;
      }

      // Test robots.txt for the URL
      let robotsAllowed = true;
      try {
        const robotsResponse = await fetch('/api/crawler/test-robots', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url: newCompany.url })
        });
        const robotsData = await robotsResponse.json();
        robotsAllowed = robotsData.allowed || false;
      } catch (error) {
        console.warn('Failed to check robots.txt:', error);
      }

      const companyToAdd = {
        name: newCompany.name,
        url: newCompany.url,
        robotsAllowed,
        jobs: 0, // Will be updated when crawling
        level: newCompany.level,
        type: newCompany.type,
        location: newCompany.location
      };

      const response = await fetch(`/api/crawler/instances/${selectedCrawlerForCompany}/companies`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(companyToAdd)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ Company added to crawler:', data);
        alert(`✅ Company "${newCompany.name}" added successfully!${!robotsAllowed ? '\\n⚠️ Note: This site blocks robots.txt' : ''}`);
        await fetchCrawlerInstances(); // Refresh the list
        setShowAddCompanyModal(false);
      } else {
        console.error('❌ Failed to add company:', data);
        alert(`❌ Failed to add company: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Error adding company:', error);
      alert(`❌ Error adding company: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Edit crawler configuration
  const editCrawlerConfig = (crawlerId: string) => {
    // TODO: Implement edit configuration modal
    alert(`Edit configuration for Crawler ${crawlerId} (Feature coming soon)`);
  };

  // Show job website selection modal
  const showJobWebsiteSelection = (crawlerId: string) => {
    setSelectedCrawlerForWebsites(crawlerId);
    // Initialize config for selected websites
    const initialConfig: Record<string, any> = {};
    jobWebsites.forEach(site => {
      initialConfig[site.id] = {
        enabled: false,
        maxJobs: 25,
        searchTerms: ['software engineer', 'developer'],
        locations: ['remote'],
        respectRobots: true
      };
    });
    setJobWebsiteConfig(initialConfig);
    setShowJobWebsiteModal(true);
  };

  // Update website configuration
  const updateWebsiteConfig = (websiteId: string, config: any) => {
    setJobWebsiteConfig(prev => ({
      ...prev,
      [websiteId]: { ...prev[websiteId], ...config }
    }));
  };

  // Handle button clicks with active state
  const handleButtonClick = (crawlerId: string, buttonType: string, action: () => void) => {
    const buttonKey = `${crawlerId}-${buttonType}`;
    
    // Set button as active temporarily
    setActiveButtons(prev => ({ ...prev, [buttonKey]: true }));
    
    // Execute the action
    action();
    
    // Reset button state after 2 seconds
    setTimeout(() => {
      setActiveButtons(prev => ({ ...prev, [buttonKey]: false }));
    }, 2000);
  };

  // Get button style based on active state
  const getButtonStyle = (crawlerId: string, buttonType: string, isActive = false) => {
    const buttonKey = `${crawlerId}-${buttonType}`;
    const isButtonActive = activeButtons[buttonKey] || isActive;
    
    return isButtonActive
      ? "px-2 py-1 bg-yellow-400 text-black rounded text-xs hover:bg-yellow-500 flex items-center transition-all duration-200"
      : "px-2 py-1 bg-white text-black border border-gray-300 rounded text-xs hover:bg-gray-100 flex items-center transition-all duration-200";
  };

  // Start crawling selected websites
  const startWebsiteCrawling = async () => {
    try {
      const selectedWebsites = Object.entries(jobWebsiteConfig)
        .filter(([_, config]) => config.enabled)
        .map(([websiteId, config]) => ({
          websiteId,
          website: jobWebsites.find(site => site.id === websiteId),
          ...config
        }));

      if (selectedWebsites.length === 0) {
        alert('Please select at least one website to crawl');
        return;
      }

      console.log('🚀 Starting crawling for websites:', selectedWebsites);
      
      // TODO: Implement backend call to start crawling selected websites
      alert(`Starting crawl for ${selectedWebsites.length} websites!\n\nSelected: ${selectedWebsites.map(w => w.website.name).join(', ')}`);
      
      setShowJobWebsiteModal(false);
    } catch (error) {
      console.error('❌ Error starting website crawling:', error);
      alert(`❌ Error starting crawling: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };



  // Delete crawler
  const deleteCrawler = async (crawlerId: string) => {
    if (!confirm('Are you sure you want to delete this crawler? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`/api/crawler/instances/${crawlerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ Crawler deleted:', crawlerId);
        alert('✅ Crawler deleted successfully!');
        await fetchCrawlerInstances(); // Refresh the list
      } else {
        console.error('❌ Failed to delete crawler:', data);
        alert(`❌ Failed to delete crawler: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Error deleting crawler:', error);
      alert(`❌ Error deleting crawler: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Generate crawler data using real backend instances
  const generateCrawlerData = () => {
    if (!crawlerInstances.length) {
      // Return empty array if no instances loaded yet
      return [];
    }

    return crawlerInstances.map((instance, index) => ({
      id: instance.crawlerId || index + 1,
      crawlerId: String(instance.crawlerId || `crawler-${index + 1}`),
      name: instance.name || `Crawler ${instance.crawlerId || index + 1}`,
      companies: instance.companies || [],
      status: instance.status || 'idle',
      totalJobs: (instance.companies || []).reduce((sum, company) => sum + (typeof company === 'object' && company && 'jobs' in company ? (company as any).jobs || 0 : 0), 0),
      configuration: instance.configuration || {},
      statistics: instance.statistics || {},
      lastRun: instance.lastRun,
      nextRun: instance.nextRun
    }));
  };

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAdminData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Job modal functions
  const openJobModal = (job: Job) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  const closeJobModal = () => {
    setSelectedJob(null);
    setIsJobModalOpen(false);
  };

  // Lazy loading for jobs
  const loadMoreJobs = useCallback(async () => {
    if (loadingMoreJobs || !hasMoreJobs) return;

    try {
      setLoadingMoreJobs(true);
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(`/api/admin/jobs?page=${jobsPage + 1}&limit=10`, { headers });
      if (response.ok) {
        const data = await response.json();
        const newJobs = Array.isArray(data.data) ? data.data : [];
        
        if (newJobs.length === 0) {
          setHasMoreJobs(false);
        } else {
          const formattedJobs = newJobs.map((job: any) => ({
            id: job._id || job.id,
            title: job.title || 'Untitled Job',
            company: job.company || 'Unknown Company',
            location: job.location || 'Location not specified',
            type: job.type || 'full-time',
            status: job.status || 'open',
            applications: job.applicants?.length || job.applicationTracking?.totalApplications || 0,
            postedDate: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Unknown',
            salary: typeof job.salary === 'object' && job.salary && job.salary.min !== null && job.salary.max !== null ? 
              `$${job.salary.min?.toLocaleString() || 0} - $${job.salary.max?.toLocaleString() || 0} ${job.salary.currency || 'USD'}` :
              typeof job.salary === 'string' ? job.salary :
              (job.compensation?.salaryMin && job.compensation?.salaryMax ? 
                `$${job.compensation.salaryMin.toLocaleString()} - $${job.compensation.salaryMax.toLocaleString()}` : 'Not specified'),
            description: job.description || '',
            // Real backend fields
            experience: job.experience,
            skills: job.skills,
            department: job.department,
            source: job.source || 'internal',
            datePosted: job.datePosted ? new Date(job.datePosted).toLocaleDateString() : null,
            isActive: job.isActive,
            maxApplications: job.maxApplications,
            applicationDeadline: job.applicationDeadline,
            // Job requirements
            education: job.jobRequirements?.education,
            yearsOfExperience: job.jobRequirements?.yearsOfExperience,
            certifications: job.jobRequirements?.certifications,
            languages: job.jobRequirements?.languages,
            // Benefits
            benefits: job.benefits,
            // Compensation details
            compensation: job.compensation,
            // External tracking
            externalUrl: job.externalUrl,
            sourceUrl: job.sourceUrl,
            crawledAt: job.crawledAt,
            tags: job.tags
          }));
          
          setJobs(prevJobs => [...prevJobs, ...formattedJobs]);
          setJobsPage(prevPage => prevPage + 1);
        }
      }
    } catch (error) {
      console.log('⚠️ Error loading more jobs, continuing with current data');
    } finally {
      setLoadingMoreJobs(false);
    }
  }, [jobsPage, loadingMoreJobs, hasMoreJobs]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (!jobsContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = jobsContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      loadMoreJobs();
    }
  }, [loadMoreJobs]);

  useEffect(() => {
    const container = jobsContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Get breadcrumb items based on active section
  const getBreadcrumbItems = () => {
    const items = [];
    
    // Add section-specific navigation - all sections clickable except current active one
    switch (activeSection) {
      case 'dashboard':
        items.push({ label: 'Admin Dashboard', active: true });
        break;
      case 'users':
        items.push({ label: 'Admin Dashboard', onClick: () => setActiveSection('dashboard'), active: false });
        items.push({ label: 'User Management', active: true });
        break;
      case 'jobs':
        items.push({ label: 'Admin Dashboard', onClick: () => setActiveSection('dashboard'), active: false });
        items.push({ label: 'Job Management', active: true });
        break;
      case 'crawler':
        items.push({ label: 'Admin Dashboard', onClick: () => setActiveSection('dashboard'), active: false });
        items.push({ label: 'Job Sourcer (Crawler)', active: true });
        break;
      case 'firms':
        items.push({ label: 'Admin Dashboard', onClick: () => setActiveSection('dashboard'), active: false });
        items.push({ label: 'Firm Management', active: true });
        break;
      case 'documents':
        items.push({ label: 'Admin Dashboard', onClick: () => setActiveSection('dashboard'), active: false });
        items.push({ label: 'Documents', active: true });
        break;
      case 'queries':
        items.push({ label: 'Admin Dashboard', onClick: () => setActiveSection('dashboard'), active: false });
        items.push({ label: 'Queries & Support', active: true });
        break;
      case 'settings':
        items.push({ label: 'Admin Dashboard', onClick: () => setActiveSection('dashboard'), active: false });
        items.push({ label: 'Settings', active: true });
        break;
      default:
        items.push({ label: 'Admin Dashboard', onClick: () => setActiveSection('dashboard'), active: false });
        items.push({ label: 'Settings', active: true });
    }
    
    return items;
  };

  const sidebarItems = [
    { id: 'dashboard', name: 'Admin Dashboard', icon: HomeIcon },
    { id: 'users', name: 'User Management', icon: UserGroupIcon },
    { id: 'jobs', name: 'Job Management', icon: BriefcaseIcon },
    { id: 'crawler', name: 'Job Sourcer (Crawler)', icon: MagnifyingGlassIcon },
    { id: 'firms', name: 'Firm Management', icon: BuildingOfficeIcon },
    { id: 'documents', name: 'Documents', icon: DocumentTextIcon },
    { id: 'queries', name: 'Queries & Support', icon: BellIcon },
    { id: 'settings', name: 'Settings', icon: CogIcon }
  ];

  const StatCard = ({ title, value, color = 'blue', icon: Icon }: { title: string; value: string | number; color?: string; icon: any }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
          </div>
        <div className={`p-2 bg-${color}-100 rounded-lg`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
            </div>
          </div>
    </div>
  );

  const renderDashboardContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Header with Breadcrumbs */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
              <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
              <div className="mb-4">
                <Breadcrumb items={getBreadcrumbItems()} theme="dark" />
        </div>
      </div>

            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Dashboard Overview</h2>
              <div className="flex space-x-3">
                <button 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
                >
                  <ArrowPathIcon className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
              </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} icon={UserGroupIcon} color="blue" />
              <StatCard title="Total Jobs" value={stats.totalJobs} icon={BriefcaseIcon} color="green" />
              <StatCard title="Active Jobs" value={stats.activeJobs} icon={ChartBarIcon} color="purple" />
              <StatCard title="Pending Approvals" value={stats.pendingApprovals} icon={ExclamationTriangleIcon} color="yellow" />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className={`w-2 h-2 rounded-full mr-3 ${
                          activity.level === 'error' ? 'bg-red-500' :
                          activity.level === 'warning' ? 'bg-yellow-500' :
                          activity.type === 'user_registration' ? 'bg-green-500' :
                          activity.type === 'job_posted' ? 'bg-blue-500' :
                          'bg-purple-500'
                        }`}></div>
                        <span className="text-gray-600 flex-1">{activity.message}</span>
                        <span className="text-xs text-gray-400 ml-2">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  ) : (
            <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                      <span className="text-gray-500">No recent activity</span>
            </div>
                  )}
          </div>
      </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Server Status</span>
                    <span className={`text-sm font-medium ${systemHealth.serverStatus === 'Online' ? 'text-green-600' : 'text-red-600'}`}>
                      {systemHealth.serverStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Database</span>
                    <span className={`text-sm font-medium ${systemHealth.database === 'Connected' ? 'text-green-600' : 'text-red-600'}`}>
                      {systemHealth.database}
                    </span>
                    </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">API Response</span>
                    <span className={`text-sm font-medium ${
                      systemHealth.apiResponse === 'Fast' ? 'text-green-600' : 
                      systemHealth.apiResponse === 'Slow' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {systemHealth.apiResponse}
                    </span>
                  </div>
                </div>
            </div>
          </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            {/* Header with Breadcrumbs */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
              <h1 className="text-2xl font-bold mb-4">User Management</h1>
              <div className="mb-4">
                <Breadcrumb items={getBreadcrumbItems()} theme="dark" />
            </div>
                  </div>
            
            {/* User Type Tabs */}
            <div className="bg-white border-b border-gray-200 mb-6">
              <div className="flex space-x-8 px-6">
                <button 
                  onClick={() => setActiveUserTab('all')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${
                    activeUserTab === 'all' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  All Users ({users.length})
                </button>
                <button 
                  onClick={() => setActiveUserTab('admin')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${
                    activeUserTab === 'admin' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Admins ({users.filter(u => u.userType === 'admin').length})
                </button>
                <button 
                  onClick={() => setActiveUserTab('jobseeker')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${
                    activeUserTab === 'jobseeker' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Job Seekers ({users.filter(u => u.userType === 'jobseeker').length})
                </button>
                <button 
                  onClick={() => setActiveUserTab('recruiter')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${
                    activeUserTab === 'recruiter' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Recruiters ({users.filter(u => u.userType === 'recruiter').length})
                </button>
                <button 
                  onClick={() => setActiveUserTab('consultant')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${
                    activeUserTab === 'consultant' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Consultants ({users.filter(u => u.userType === 'consultant').length})
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Manage Users</h2>
              <button 
                onClick={() => {
                  setEditingUser(null);
                  setUserFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    userType: 'jobseeker',
                    isVerified: false,
                    isActive: true
                  });
                  setShowUserModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add New User
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <div className="overflow-x-auto scrollbar-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center">
                          <ArrowPathIcon className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
                          <p className="text-gray-600">Loading users...</p>
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center">
                          <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No users found</p>
                          <p className="text-gray-400 text-sm">Users will appear here when they register</p>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers().map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">
                                {user.firstName?.[0] || 'U'}{user.lastName?.[0] || 'S'}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName || 'Unknown'} {user.lastName || 'User'}
                              </div>
                              <div className="text-sm text-gray-500">{user.email || 'No email'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.userType === 'admin' ? 'bg-purple-100 text-purple-800' :
                            user.userType === 'recruiter' ? 'bg-green-100 text-green-800' :
                            user.userType === 'consultant' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {user.userType?.replace('_', ' ') || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {user.isVerified ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircleIcon className="h-5 w-5 text-red-500" />
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleUserAction('edit', user.id)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                              title="Edit User"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleUserAction('password', user.id)}
                              className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                              title="Change Password"
                            >
                              <Cog6ToothIcon className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleUserAction('access', user.id)}
                              className="text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-purple-50"
                              title="Manage Access"
                            >
                              <CogIcon className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleUserAction('delete', user.id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                              title="Delete User"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'jobs':
        return (
          <div className="h-full flex flex-col">
                                    {/* Blue Header with Breadcrumbs */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6">
              <h1 className="text-2xl font-bold mb-4">Job Management</h1>
              <div className="mb-4">
                <Breadcrumb items={getBreadcrumbItems()} theme="dark" />
              </div>
              </div>

                        {/* Job Management Section */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Manage job listings</h3>
                <div className="relative">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center"
                  >
                    <FunnelIcon className="h-4 w-4 mr-2" />
                    Filter
                  </button>
                  
                  {/* Filter Dropdown */}
                  {showFilters && (
                    <div className="absolute right-0 top-12 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Admin View (Manage Jobs) Filters</h3>
                        <button 
                          onClick={() => setShowFilters(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </button>
            </div>

            <div className="space-y-4">
                        {/* Session */}
                  <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
                          <select 
                            value={filters.session}
                            onChange={(e) => handleFilterChange('session', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          >
                            <option value="">All Sessions</option>
                            <option value="morning">Morning</option>
                            <option value="afternoon">Afternoon</option>
                            <option value="evening">Evening</option>
                          </select>
            </div>
                        
                        {/* Date Range */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range (Written to our DB)</label>
                          <input 
                            type="date"
                            value={filters.dateRange}
                            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
          </div>
                        
                        {/* Company */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                          <select 
                            value={filters.company}
                            onChange={(e) => handleFilterChange('company', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          >
                            <option value="">All Companies</option>
                            {companies.map(company => (
                              <option key={company.id} value={company.name}>{company.name}</option>
                            ))}
                          </select>
      </div>

                        {/* Employment Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                          <select 
                            value={filters.employmentType}
                            onChange={(e) => handleFilterChange('employmentType', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          >
                            <option value="">All Types</option>
                            <option value="full-time">Full-time</option>
                            <option value="part-time">Part-time</option>
                            <option value="contract">Contract</option>
                            <option value="internship">Internship</option>
                            <option value="remote">Remote</option>
                          </select>
                  </div>
                        
                        {/* Source Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Source Type</label>
                          <select 
                            value={filters.sourceType}
                            onChange={(e) => handleFilterChange('sourceType', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          >
                            <option value="">All Sources</option>
                            <option value="internal">Internal</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="indeed">Indeed</option>
                            <option value="remoteok">RemoteOK</option>
                            <option value="wellfound">Wellfound</option>
                          </select>
                        </div>
                        
                        {/* Job Title */}
                  <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                          <input 
                            type="text"
                            placeholder="Search job title..."
                            value={filters.jobTitle}
                            onChange={(e) => handleFilterChange('jobTitle', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-3 mt-6">
                        <button 
                          onClick={applyFilters}
                          disabled={loadingFilters}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm disabled:opacity-50 flex items-center"
                        >
                          {loadingFilters && (
                            <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                          )}
                          {loadingFilters ? 'Applying...' : 'Apply Filters'}
                        </button>
                        <button 
                          onClick={clearFilters}
                          disabled={loadingFilters}
                          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm disabled:opacity-50"
                        >
                          Clear All
            </button>
                      </div>
                    </div>
                  )}
                </div>
          </div>

              {/* Tabs: Manage Jobs and Browse Jobs side by side */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={() => setActiveJobTab('manage')}
                    className={`font-medium pb-1 ${activeJobTab === 'manage' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Manage Jobs
                  </button>
                  <button 
                    onClick={() => setActiveJobTab('browse')}
                    className={`font-medium pb-1 ${activeJobTab === 'browse' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Browse Jobs
                  </button>
                </div>
                {activeJobTab === 'manage' && (
                  <button 
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 flex items-center disabled:opacity-50 text-sm border border-yellow-600"
                  >
                    <ArrowPathIcon className={`h-3 w-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                )}
              </div>
              

            </div>

                        {/* Main Content - Dynamic Layout */}
            <div className="flex-1 flex">
              {/* Job List - Full width when no job selected, 50% when job selected */}
            <div className={`${selectedJob ? 'w-1/2' : 'w-full'} transition-all duration-300 ${selectedJob ? 'border-r border-gray-200' : ''}`}>
                <div 
                  ref={jobsContainerRef}
                  className="h-full overflow-y-auto scrollbar-hidden"
                  style={{ 
                    scrollBehavior: 'smooth',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                >
                  {loading ? (
                    <div className="text-center py-8">
                      <ArrowPathIcon className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
                      <p className="text-gray-600">Loading jobs...</p>
                    </div>
                  ) : jobs.length === 0 ? (
                    <div className="text-center py-8">
                      <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No jobs found</p>
                      <p className="text-gray-400 text-sm">Jobs will appear here when they are posted</p>
                  </div>
                  ) : (
                    <div className="space-y-0">
                      {jobs.map((job, index) => (
                        <div 
                          key={job.id} 
                          className={`p-6 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectedJob?.id === job.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                          }`}
                          onClick={() => {
                            setSelectedJob(job);
                            console.log('Selected job:', job.title);
                          }}
                        >
                          {/* Job Title */}
                          <div className="mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {job.title}
                            </h3>
                          </div>
                          
                          {/* Company name + location */}
                          <div className="mb-3">
                            <p className="text-sm text-gray-600">
                              {job.company}, {job.location}
                            </p>
                          </div>

                          {/* Salary, Job Type, Duration */}
                          <div className="flex items-center space-x-3 text-sm text-gray-700 mb-3">
                            <span className="font-medium">{typeof job.salary === 'string' ? job.salary : (typeof job.salary === 'object' && job.salary ? `$${(job.salary as any).min || 0} - $${(job.salary as any).max || 0} ${(job.salary as any).currency || 'USD'}` : 'Not specified')}</span>
                            <span>•</span>
                            <span className="capitalize">{job.type}</span>
                            <span>•</span>
                            <span>{job.duration || 'Full-time'}</span>
                          </div>

                          {/* Applicants count + Posted date */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-900">
                              {job.applications} applicants
                            </span>
                            <span className="text-sm text-gray-500">
                              {job.postedDate}
                    </span>
                  </div>
                          
                          {/* Short job description or summarization */}
                          <div className="text-sm text-gray-700 mb-4 leading-relaxed">
                            {job.description ? 
                              <span>
                                {job.description.length > 120 
                                  ? job.description.substring(0, 120) + '...' 
                                  : job.description
                                }
                              </span> :
                              <span className="italic">Summarization of Job Description</span>
                            }
                          </div>
                          
                          {/* Metadata: Posted Date | Local Analytics: Views | Local Analytics: Clicked on Apply | Source */}
                          <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <span>Posted Date: {job.datePosted || job.postedDate}</span>
                              <span>|</span>
                              <span>Local Analytics: Views --</span>
                              <span>|</span>
                              <span>Local Analytics: Clicked on Apply --</span>
                              <span>|</span>
                              <span>Source: {job.source || 'Internal'}</span>
                            </div>
                          </div>

                          {/* Action Buttons - Only show when no job is selected */}
                          {!selectedJob && (
                            <div className="pt-3 border-t border-gray-100 mt-3" onClick={(e) => e.stopPropagation()}>
                              {activeJobTab === 'manage' ? (
                                /* Admin Actions */
                                <div className="flex flex-wrap gap-2">
                                  <div className="relative">
                                    <button className="px-3 py-1 bg-white text-black text-xs rounded border border-gray-300 hover:bg-yellow-400 hover:text-black flex items-center font-medium">
                                      Actions <ChevronDownIcon className="h-3 w-3 ml-1" />
                                    </button>
                                  </div>
                                  <button className="px-3 py-1 bg-white text-black text-xs rounded border border-gray-300 hover:bg-yellow-400 hover:text-black">
                                    Boost
                                  </button>
                                  <button className="px-3 py-1 bg-white text-black text-xs rounded border border-gray-300 hover:bg-yellow-400 hover:text-black">
                                    Highlight
                                  </button>
                                  <button className="px-3 py-1 bg-white text-black text-xs rounded border border-gray-300 hover:bg-yellow-400 hover:text-black">
                                    View
                                  </button>
                                  <button className="px-3 py-1 bg-white text-black text-xs rounded border border-gray-300 hover:bg-yellow-400 hover:text-black">
                                    Edit
                                  </button>
                                  <button className="px-3 py-1 bg-white text-black text-xs rounded border border-gray-300 hover:bg-yellow-400 hover:text-black">
                                    Suspend
                                  </button>
                                  <button className="px-3 py-1 bg-white text-black text-xs rounded border border-gray-300 hover:bg-yellow-400 hover:text-black">
                                    Delete
                                  </button>
                                </div>
                              ) : (
                                /* User Actions for Browse Jobs */
                                <div className="flex gap-2">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (job.externalUrl || job.sourceUrl) {
                                        window.open(job.externalUrl || job.sourceUrl, '_blank');
                                      }
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                  >
                                    Apply
                                  </button>
                                  <button className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300">
                                    Save for Later
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                </div>
              ))}
                      
                      {/* Loading more indicator */}
                      {loadingMoreJobs && (
                        <div className="text-center py-4">
                          <ArrowPathIcon className="h-6 w-6 animate-spin mx-auto text-blue-600 mb-2" />
                          <p className="text-sm text-gray-600">Loading more jobs...</p>
            </div>
                      )}
                      
                      {/* End of results indicator */}
                      {!hasMoreJobs && jobs.length > 0 && (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">No more jobs to load</p>
                        </div>
                      )}
                    </div>
                  )}
            </div>
          </div>

              {/* Right Side - Job Details (Only show when job is selected) */}
              {selectedJob && (
                <div className="w-1/2 bg-gray-50 animate-slide-in">
                  {/* Job Details Content */}
                  <div className="p-4 h-full overflow-y-auto scrollbar-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {/* Job Header with Close Button */}
                    <div className="mb-4 flex justify-between items-start">
                      <div>
                        <h2 className="text-base font-bold text-gray-900">{selectedJob.title}</h2>
                        <p className="text-xs text-gray-600 mt-1">
                          at {selectedJob.company}
                        </p>
            </div>
                      <button 
                        onClick={() => setSelectedJob(null)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Close job details"
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
            </button>
                  </div>

                    {/* Actions toolbar */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {activeJobTab === 'manage' ? (
                          /* Admin Actions */
                          <>
                            <div className="relative">
                              <button className="px-2 py-1 bg-white text-black text-xs rounded border border-gray-300 hover:bg-yellow-400 hover:text-black flex items-center font-medium">
                                Actions <ChevronDownIcon className="h-3 w-3 ml-1" />
                              </button>
                </div>
                            <button className="px-2 py-1 bg-white text-black text-xs rounded border border-gray-300 hover:bg-yellow-400 hover:text-black">
                              Boost
                            </button>
                            <button className="px-2 py-1 bg-white text-black text-xs rounded border border-gray-300 hover:bg-yellow-400 hover:text-black">
                              Highlight
                            </button>
                            <button className="px-2 py-1 bg-white text-black text-xs rounded border border-gray-300 hover:bg-yellow-400 hover:text-black">
                              View
                            </button>
                            <button className="px-2 py-1 bg-white text-black text-xs rounded border border-gray-300 hover:bg-yellow-400 hover:text-black">
                              Edit
                            </button>
                            <button className="px-2 py-1 bg-white text-black text-xs rounded border border-gray-300 hover:bg-yellow-400 hover:text-black">
                              Suspend
                            </button>
                            <button className="px-2 py-1 bg-white text-black text-xs rounded border border-gray-300 hover:bg-yellow-400 hover:text-black">
                              Delete
                            </button>
                            <button 
                              onClick={() => handleApply(selectedJob)}
                              className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 ml-2"
                            >
                              Apply
                            </button>
                          </>
                        ) : (
                          /* User Actions for Browse Jobs */
                          <>
                            <button 
                              onClick={() => handleApply(selectedJob)}
                              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                            >
                              Apply
                            </button>
                            <button className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded hover:bg-gray-300">
                              Save for Later
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Job Details Section */}
                    
                    {/* Summarization of Job Description */}
                    <div className="bg-white rounded-lg p-3 mb-3">
                      <h4 className="text-xs font-semibold text-gray-900 mb-2">Job Description</h4>
                      {selectedJob.description ? (
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {selectedJob.description}
                        </p>
                      ) : (
                        <div className="text-xs text-gray-500">
                          <p className="mb-2">No description available in the database.</p>
                          {selectedJob.sourceUrl && (
                            <button
                              onClick={() => window.open(selectedJob.sourceUrl, '_blank')}
                              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              View Full Job Details
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Skills required */}
                    <div className="bg-white rounded-lg p-3 mb-3">
                      <h4 className="text-xs font-semibold text-gray-900 mb-2">Skills</h4>
                      <div className="text-xs text-gray-700">
                        {selectedJob.skills && selectedJob.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {(Array.isArray(selectedJob.skills) ? selectedJob.skills : [selectedJob.skills]).map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No specific skills listed</p>
                        )}
            </div>
          </div>

                    {/* Seniority Level */}
                    <div className="bg-white rounded-lg p-3 mb-3">
                      <h4 className="text-xs font-semibold text-gray-900 mb-2">Seniority Level</h4>
                      <p className="text-xs text-gray-700">
                        {selectedJob.experience || selectedJob.yearsOfExperience ? 
                          `${selectedJob.experience} ${selectedJob.yearsOfExperience ? `(${selectedJob.yearsOfExperience} years)` : ''}` :
                          'Not specified'
                        }
                      </p>
            </div>

                    {/* Educational Qualifications */}
                    <div className="bg-white rounded-lg p-3 mb-3">
                      <h4 className="text-xs font-semibold text-gray-900 mb-2">Educational Qualifications</h4>
                      <div className="text-xs text-gray-700">
                        {selectedJob.education ? (
                          <p>{selectedJob.education}</p>
                        ) : (
                          <p className="text-gray-500 italic">No specific education requirements</p>
                        )}
                        {selectedJob.certifications && selectedJob.certifications.length > 0 && (
                          <div className="mt-1">
                            <span className="text-gray-600 font-medium">Certifications: </span>
                            <span>{selectedJob.certifications.join(', ')}</span>
                          </div>
                        )}
          </div>
        </div>

                    {/* Full/Detailed Job Description */}
                    <div className="bg-white rounded-lg p-3">
                      <h4 className="text-xs font-semibold text-gray-900 mb-2">Full/Detailed Job Description</h4>
                      <div className="text-xs text-gray-700 space-y-2">
                        <div>
                          {selectedJob.description || 'No detailed description available for this job.'}
                        </div>
                        
                        {/* Additional Job Information */}
                        {(selectedJob.benefits || selectedJob.compensation || selectedJob.applicationDeadline || selectedJob.languages) && (
                          <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                            
                            {selectedJob.languages && selectedJob.languages.length > 0 && (
                              <div>
                                <span className="text-gray-600 font-medium">Languages: </span>
                                <span>{selectedJob.languages.join(', ')}</span>
                              </div>
                            )}
                            
                            {selectedJob.benefits && (
                              <div>
                                <span className="text-gray-600 font-medium">Benefits: </span>
                                <span>
                                  {selectedJob.benefits.healthInsurance && 'Health Insurance, '}
                                  {selectedJob.benefits.dentalInsurance && 'Dental Insurance, '}
                                  {selectedJob.benefits.retirement401k && '401(k) Retirement Plan, '}
                                  {selectedJob.benefits.paidTimeOff && 'Paid Time Off, '}
                                  {selectedJob.benefits.workFromHome && 'Work From Home, '}
                                  {selectedJob.benefits.flexibleSchedule && 'Flexible Schedule, '}
                                  {selectedJob.benefits.professionalDevelopment && 'Professional Development'}
                                </span>
                              </div>
                            )}
                            
                            {selectedJob.compensation && (
                              <div>
                                <span className="text-gray-600 font-medium">Compensation: </span>
                                <span>
                                  {selectedJob.compensation.salaryMin && selectedJob.compensation.salaryMax ? 
                                    `$${selectedJob.compensation.salaryMin.toLocaleString()} - $${selectedJob.compensation.salaryMax.toLocaleString()}` :
                                    typeof selectedJob.salary === 'object' && selectedJob.salary ? 
                                      (selectedJob.salary && 'min' in selectedJob.salary && 'max' in selectedJob.salary ? 
                                        `$${(selectedJob.salary as any).min?.toLocaleString() || 0} - $${(selectedJob.salary as any).max?.toLocaleString() || 0} ${(selectedJob.salary as any).currency || 'USD'}` :
                                        'Not specified') :
                                      (typeof selectedJob.salary === 'string' ? selectedJob.salary : 'Not specified')
                                  }
                                </span>
                              </div>
                            )}
                            
                            {selectedJob.applicationDeadline && (
                              <div className="mb-2">
                                <span className="text-gray-500">Application Deadline: </span>
                                <span className="text-gray-900">{new Date(selectedJob.applicationDeadline).toLocaleDateString()}</span>
                              </div>
                            )}
                            
                            {selectedJob.benefits && (
                              <div className="mb-2">
                                <span className="text-gray-500 block mb-1">Benefits:</span>
                                <ul className="text-gray-900 ml-2">
                                  {selectedJob.benefits.healthInsurance && <li>• Health Insurance</li>}
                                  {selectedJob.benefits.dentalInsurance && <li>• Dental Insurance</li>}
                                  {selectedJob.benefits.retirement401k && <li>• 401(k) Retirement Plan</li>}
                                  {selectedJob.benefits.paidTimeOff && <li>• Paid Time Off</li>}
                                  {selectedJob.benefits.workFromHome && <li>• Work From Home</li>}
                                  {selectedJob.benefits.flexibleSchedule && <li>• Flexible Schedule</li>}
                                  {selectedJob.benefits.professionalDevelopment && <li>• Professional Development</li>}
                                </ul>
                              </div>
                            )}
                            
                            {selectedJob.tags && selectedJob.tags.length > 0 && (
                              <div className="mb-2">
                                <span className="text-gray-500 block mb-1">Tags:</span>
                                <span className="text-gray-900">{selectedJob.tags.join(', ')}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'crawler':
        // Only show crawler for admin users
        if (user?.userType !== 'admin') {
          return (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Access restricted to administrators only.</p>
            </div>
          );
        }
        return (
          <div className="h-full flex flex-col relative">
            {/* Header with Breadcrumbs */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6">
              <h1 className="text-2xl font-bold mb-4">Job Sourcer</h1>
              <div className="mb-4">
                <Breadcrumb items={getBreadcrumbItems()} theme="dark" />
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white border-b border-gray-200 mb-6">
              <div className="flex space-x-8 px-6">
                <button 
                  onClick={() => setActiveCrawlerTab('crawler-view')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${
                    activeCrawlerTab === 'crawler-view' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Crawler View
                </button>
                <button 
                  onClick={() => setActiveCrawlerTab('launch-pad-crawler')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${
                    activeCrawlerTab === 'launch-pad-crawler' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Launch Pad for Crawler
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1">
              {activeCrawlerTab === 'crawler-view' && (
        <div className="space-y-6">
                  {/* Filter Bar */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters & Analytics</h3>
                    
                    {/* Enhanced Filter Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Session ID
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option value="">All Sessions</option>
                          <option value="morning">Morning (6AM-12PM)</option>
                          <option value="afternoon">Afternoon (12PM-6PM)</option>
                          <option value="evening">Evening (6PM-12AM)</option>
                          <option value="night">Night (12AM-6AM)</option>
                        </select>
                      </div>
                      
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Date From
                        </label>
                        <input 
                          type="date" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Date To
                        </label>
                        <input 
                          type="date" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          Source Type
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                          <option value="">All Sources</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="indeed">Indeed</option>
                          <option value="glassdoor">Glassdoor</option>
                          <option value="company">Company Careers</option>
                          <option value="internal">Internal</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Additional Filter Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Company Filter
                        </label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                          placeholder="Search companies..."
                        />
                      </div>
                      
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                          </svg>
                          Employment Type
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                          <option value="">All Types</option>
                          <option value="full-time">Full Time</option>
                          <option value="part-time">Part Time</option>
                          <option value="contract">Contract</option>
                          <option value="internship">Internship</option>
                          <option value="temporary">Temporary</option>
                        </select>
                      </div>
                      
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          Job Category
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                          <option value="">All Categories</option>
                          <option value="it">IT & Technology</option>
                          <option value="hr">Human Resources</option>
                          <option value="finance">Finance & Accounting</option>
                          <option value="marketing">Marketing</option>
                          <option value="sales">Sales</option>
                          <option value="engineering">Engineering</option>
                          <option value="design">Design & Creative</option>
                          <option value="operations">Operations</option>
                        </select>
                      </div>
                    </div>
                    

                    
                    {/* Real-time Analytics Dashboard */}
                    <div className="mt-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Real-time Crawler Analytics
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Jobs per Hour</p>
                              <p className="text-2xl font-bold text-blue-600">24</p>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-full">
                              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                            </div>
                          </div>
                          <p className="text-xs text-green-600 mt-1">+12% from last hour</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Success Rate</p>
                              <p className="text-2xl font-bold text-green-600">94%</p>
                            </div>
                            <div className="p-2 bg-green-100 rounded-full">
                              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          </div>
                          <p className="text-xs text-green-600 mt-1">+2% from yesterday</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                              <p className="text-2xl font-bold text-purple-600">1.2s</p>
                            </div>
                            <div className="p-2 bg-purple-100 rounded-full">
                              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          </div>
                          <p className="text-xs text-red-600 mt-1">-0.3s from last week</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Active Crawlers</p>
                              <p className="text-2xl font-bold text-orange-600">3</p>
                            </div>
                            <div className="p-2 bg-orange-100 rounded-full">
                              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0V7a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2" />
                              </svg>
                            </div>
                          </div>
                          <p className="text-xs text-blue-600 mt-1">2 running, 1 idle</p>
                        </div>
                      </div>
                      
                      {/* Performance Chart Placeholder */}
                      <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="text-sm font-medium text-gray-700">Crawler Performance (Last 24 Hours)</h5>
                          <div className="flex space-x-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                              LinkedIn
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <span className="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
                              Indeed
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              <span className="w-2 h-2 bg-purple-400 rounded-full mr-1"></span>
                              Company Sites
                            </span>
                          </div>
                        </div>
                        <div className="h-32 bg-gray-50 rounded flex items-center justify-center">
                          <p className="text-gray-500 text-sm">Performance chart will be displayed here</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Two-Panel Layout */}
                  <div className="flex h-[600px]">
                    {/* Left Panel - Job List */}
                    <div className={`${selectedCrawlerJob ? 'w-1/2' : 'w-full'} transition-all duration-300 ${selectedCrawlerJob ? 'border-r border-gray-200' : ''}`}>
                      <div className="h-full overflow-y-auto bg-white rounded-l-xl shadow-md scrollbar-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <div className="p-4 border-b border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-900">Jobs List</h3>
                        </div>
                        <div className="space-y-0">
                          {jobs.slice(0, 15).map((job, index) => (
                            <div
                              key={job.id}
                              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                                selectedCrawlerJob?.id === job.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                              }`}
                              onClick={() => setSelectedCrawlerJob(job)}
                            >
                              {/* Job Title */}
                              <div className="mb-2">
                                <h3 className="text-base font-semibold text-gray-900">{job.title}</h3>
                              </div>

                              {/* Company */}
                              <div className="mb-2">
                                <p className="text-sm text-gray-600">{job.company}</p>
                              </div>

                              {/* Applicants + Posted Date */}
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-900">{job.applications} applicants</span>
                                <span className="text-sm text-gray-500">{job.postedDate}</span>
                              </div>

                              {/* Description Preview */}
                              <div className="mb-3">
                                <p className="text-sm text-gray-700 line-clamp-2">
                                  {job.description ? 
                                    (job.description.length > 100 ? job.description.substring(0, 100) + '...' : job.description) :
                                    'Job description preview...'
                                  }
                                </p>
                              </div>

                              {/* Metadata */}
                              <div className="text-xs text-gray-500 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span>Posted: {job.postedDate}</span>
                                  <span>•</span>
                                  <span>Views: {Math.floor(Math.random() * 100)}</span>
                                  <span>•</span>
                                  <span>Clicks: {Math.floor(Math.random() * 50)}</span>
                                </div>
                              </div>
                </div>
              ))}
            </div>
                      </div>
                    </div>

                    {/* Right Panel - Job Detail */}
                    {selectedCrawlerJob && (
                      <div className="w-1/2 bg-gray-50 rounded-r-xl shadow-md">
                        <div className="p-4 h-full overflow-y-auto scrollbar-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                          {/* Job Header */}
                          <div className="mb-4 flex justify-between items-start border-b border-gray-200 pb-4">
                            <div>
                              <h2 className="text-lg font-bold text-gray-900">{selectedCrawlerJob.title}</h2>
                              <p className="text-sm text-gray-600 mt-1">at {selectedCrawlerJob.company}</p>
                              <p className="text-sm text-gray-500 mt-1">{selectedCrawlerJob.location}</p>
                            </div>
                            <button 
                              onClick={() => setSelectedCrawlerJob(null)}
                              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
            </button>
          </div>

                          {/* Actions */}
                          <div className="mb-6">
                            <div className="flex flex-wrap gap-2">
                              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 active:bg-yellow-400 active:text-black">
                                Apply
                              </button>
                              <button className="px-3 py-2 bg-white text-black border border-gray-300 rounded hover:bg-gray-100 active:bg-yellow-400 active:text-black">
                                Boost
                              </button>
                              <button className="px-3 py-2 bg-white text-black border border-gray-300 rounded hover:bg-gray-100 active:bg-yellow-400 active:text-black">
                                Highlight
                              </button>
                              <button className="px-3 py-2 bg-white text-black border border-gray-300 rounded hover:bg-gray-100 active:bg-yellow-400 active:text-black">
                                View
                              </button>
                              <button className="px-3 py-2 bg-white text-black border border-gray-300 rounded hover:bg-gray-100 active:bg-yellow-400 active:text-black">
                                Edit
                              </button>
                              <button className="px-3 py-2 bg-white text-black border border-gray-300 rounded hover:bg-gray-100 active:bg-yellow-400 active:text-black">
                                Suspend
                              </button>
                              <button className="px-3 py-2 bg-white text-black border border-gray-300 rounded hover:bg-gray-100 active:bg-yellow-400 active:text-black">
                                Delete
                              </button>
                            </div>
                          </div>

                          {/* Job Details */}
            <div className="space-y-4">
                            {/* Posted Date & Analytics */}
                            <div className="bg-white rounded-lg p-4">
                              <h4 className="text-sm font-semibold text-gray-900 mb-2">Job Metadata</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Posted Date:</span>
                                  <span className="ml-2 font-medium">{selectedCrawlerJob.postedDate}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Views:</span>
                                  <span className="ml-2 font-medium">{Math.floor(Math.random() * 200)}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Clicks:</span>
                                  <span className="ml-2 font-medium">{Math.floor(Math.random() * 100)}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Source:</span>
                                  <span className="ml-2 font-medium">{selectedCrawlerJob.source}</span>
                                </div>
                              </div>
                            </div>

                            {/* Skills */}
                            <div className="bg-white rounded-lg p-4">
                              <h4 className="text-sm font-semibold text-gray-900 mb-2">Skills</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedCrawlerJob.skills && selectedCrawlerJob.skills.length > 0 ? (
                                  (Array.isArray(selectedCrawlerJob.skills) ? selectedCrawlerJob.skills : [selectedCrawlerJob.skills]).map((skill, index) => (
                                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                      {skill}
                    </span>
                                  ))
                                ) : (
                                  <p className="text-gray-500 text-sm">Skills not specified</p>
                                )}
                  </div>
                            </div>

                            {/* Seniority */}
                            <div className="bg-white rounded-lg p-4">
                              <h4 className="text-sm font-semibold text-gray-900 mb-2">Seniority Level</h4>
                              <p className="text-sm text-gray-700">
                                {selectedCrawlerJob.experience || selectedCrawlerJob.yearsOfExperience || 'Not specified'}
                              </p>
                            </div>

                            {/* Qualifications */}
                            <div className="bg-white rounded-lg p-4">
                              <h4 className="text-sm font-semibold text-gray-900 mb-2">Qualifications</h4>
                              <p className="text-sm text-gray-700">
                                {selectedCrawlerJob.education || 'Educational requirements not specified'}
                              </p>
                              {selectedCrawlerJob.certifications && selectedCrawlerJob.certifications.length > 0 && (
                                <div className="mt-2">
                                  <span className="text-xs text-gray-600">Certifications: </span>
                                  <span className="text-xs">{selectedCrawlerJob.certifications.join(', ')}</span>
                                </div>
                              )}
                            </div>

                            {/* Job Description */}
                            <div className="bg-white rounded-lg p-4">
                              <h4 className="text-sm font-semibold text-gray-900 mb-2">Job Description</h4>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {selectedCrawlerJob.description || 'No detailed description available'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Launch Pad for Crawler */}
              {activeCrawlerTab === 'launch-pad-crawler' && (
                <div className="space-y-6">


                  {/* Global Add Crawler Button */}
                  <div className="flex justify-end space-x-3 mb-6">
                    <button 
                      onClick={addCrawlerInstance}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                    >
                      ➕ Add Crawler
                    </button>
                  </div>

                  {/* Crawler Status */}
                  {crawlerStatus !== 'idle' && (
                    <div className={`rounded-lg p-4 mb-6 ${
                      crawlerStatus === 'running' ? 'bg-blue-50 border border-blue-200' :
                      crawlerStatus === 'completed' ? 'bg-green-50 border border-green-200' :
                      crawlerStatus === 'error' ? 'bg-red-50 border border-red-200' : ''
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            crawlerStatus === 'running' ? 'bg-blue-500 animate-pulse' :
                            crawlerStatus === 'completed' ? 'bg-green-500' :
                            crawlerStatus === 'error' ? 'bg-red-500' : ''
                          }`}></div>
                          <span className={`font-medium ${
                            crawlerStatus === 'running' ? 'text-blue-800' :
                            crawlerStatus === 'completed' ? 'text-green-800' :
                            crawlerStatus === 'error' ? 'text-red-800' : ''
                          }`}>
                            {crawlerStatus === 'running' ? 'Crawler Running...' :
                             crawlerStatus === 'completed' ? 'Crawler Completed Successfully' :
                             crawlerStatus === 'error' ? 'Crawler Failed' : ''}
                          </span>
                        </div>
                        {crawlerResults && (
                          <div className="text-sm text-gray-600">
                            {crawlerStatus === 'completed' && `${crawlerResults.totalJobsExtracted || 0} jobs extracted`}
                            {crawlerStatus === 'error' && crawlerResults.error}
                          </div>
                        )}
                      </div>
                      
                      {/* Results Summary */}
                      {crawlerStatus === 'completed' && crawlerResults && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="bg-white rounded-lg p-3">
                            <div className="text-gray-600">Jobs Extracted</div>
                            <div className="text-lg font-semibold text-blue-600">{crawlerResults.totalJobsExtracted || 0}</div>
                          </div>
                          {crawlerResults.saveResults && (
                            <>
                              <div className="bg-white rounded-lg p-3">
                                <div className="text-gray-600">Saved to DB</div>
                                <div className="text-lg font-semibold text-green-600">{crawlerResults.saveResults.saved || 0}</div>
                              </div>
                              <div className="bg-white rounded-lg p-3">
                                <div className="text-gray-600">Duplicates</div>
                                <div className="text-lg font-semibold text-yellow-600">{crawlerResults.saveResults.duplicates || 0}</div>
                              </div>
                              <div className="bg-white rounded-lg p-3">
                                <div className="text-gray-600">Errors</div>
                                <div className="text-lg font-semibold text-red-600">{crawlerResults.saveResults.errors || 0}</div>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                                    {/* Dynamic Pipeline Visualization */}
                  <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Pipeline Visualization</h3>
                      <span className="text-sm text-gray-500">
                        {loadingCrawlers ? 'Loading...' : `${crawlerInstances.length} Active Crawlers`}
                      </span>
                    </div>
                    
                    {loadingCrawlers ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-6 overflow-x-auto">
                        {crawlerInstances.map((crawler, index) => (
                          <div key={crawler.crawlerId} className="flex items-center">
                            {/* Crawler Node */}
                            <div className="flex flex-col items-center min-w-fit">
                              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                                crawler.status === 'running' ? 'bg-green-500 animate-pulse' :
                                crawler.status === 'idle' ? 'bg-blue-500' :
                                crawler.status === 'error' ? 'bg-red-500' :
                                'bg-gray-500'
                              }`}>
                                C{crawler.crawlerId}
                              </div>
                              <span className="text-sm text-gray-600 mt-2">{crawler.name}</span>
                              <span className={`text-xs px-2 py-1 rounded-full mt-1 ${
                                crawler.status === 'running' ? 'bg-green-100 text-green-800' :
                                crawler.status === 'idle' ? 'bg-blue-100 text-blue-800' :
                                crawler.status === 'error' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {crawler.status}
                              </span>
                            </div>
                            
                            {/* Connecting Line (except for last item) */}
                            {index < crawlerInstances.length - 1 && (
                              <div className="flex items-center mx-4">
                                <div className="w-12 h-0.5 bg-blue-400"></div>
                                <div className="w-0 h-0 border-l-4 border-l-blue-400 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                              </div>
                            )}
                </div>
              ))}
                        
                        {/* Add Crawler Button */}
                        <div className="flex flex-col items-center min-w-fit ml-6">
                          <button
                            onClick={addCrawlerInstance}
                            className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
                          >
                            <PlusIcon className="h-8 w-8" />
                          </button>
                          <span className="text-xs text-gray-500 mt-2">Add Crawler</span>
            </div>
                      </div>
                    )}
          </div>

                  {/* Real Crawler Sections */}
                  <div className="space-y-6">
                    {loadingCrawlers ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="text-gray-500 mt-2">Loading crawler instances...</p>
              </div>
                    ) : generateCrawlerData().length > 0 ? (
                      generateCrawlerData().map((crawler) => (
                        <div key={crawler.id} className="bg-white rounded-xl shadow-md p-6">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-semibold text-gray-900">{crawler.name}</h4>
                            <div className="flex items-center space-x-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                crawler.status === 'running' ? 'bg-green-100 text-green-800' :
                                crawler.status === 'idle' ? 'bg-blue-100 text-blue-800' :
                                crawler.status === 'error' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {crawler.status}
                              </span>
                              <span className="text-sm text-gray-500">
                                Total Jobs: {crawler.totalJobs}
                              </span>
                              
                              {/* Crawler Action Buttons */}
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => handleButtonClick('global', 'refresh', refreshCrawlerData)}
                                  disabled={refreshing}
                                  className={`${getButtonStyle('global', 'refresh')} disabled:opacity-50`}
                                  title="Refresh"
                                >
                                  <ArrowPathIcon className={`h-3 w-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                                  Refresh
                                </button>
                                                                <button
                                  onClick={() => handleButtonClick(crawler.crawlerId, 'start', () => startCrawlerForCompany(String(crawler.id), { id: String(crawler.id), name: crawler.name, url: 'auto', level: 'All Levels', type: 'FTE', location: 'Global' }))}
                                  disabled={crawlerLoading}
                                  className={`${getButtonStyle(crawler.crawlerId, 'start')} disabled:opacity-50`}
                                  title="Start Crawler"
                                >
                                  <PlayIcon className={`h-3 w-3 mr-1 ${crawlerLoading ? 'animate-spin' : ''}`} />
                                  Start
                                </button>
                                <button 
                                  onClick={() => handleButtonClick(crawler.crawlerId, 'add-jobs', () => showJobWebsiteSelection(String(crawler.id)))}
                                  className={getButtonStyle(crawler.crawlerId, 'add-jobs')}
                                  title="Add Jobs from Websites"
                                >
                                  <PlusIcon className="h-3 w-3 mr-1" />
                                  Add Jobs
                                </button>

                                <button
                                  onClick={() => handleButtonClick(crawler.crawlerId, 'add-company', () => showAddCompanyForm(String(crawler.id)))}
                                  className={getButtonStyle(crawler.crawlerId, 'add-company')}
                                  title="Add Company"
                                >
                                  <PlusIcon className="h-3 w-3 mr-1" />
                                  Add Company
                                </button>
                                <button
                                  onClick={() => handleButtonClick(crawler.crawlerId, 'edit', () => editCrawlerConfig(String(crawler.id)))}
                                  className={getButtonStyle(crawler.crawlerId, 'edit')}
                                  title="Edit Configuration"
                                >
                                  <PencilIcon className="h-3 w-3 mr-1" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteCrawler(String(crawler.id))}
                                  className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 flex items-center"
                                  title="Delete Crawler"
                                >
                                  <TrashIcon className="h-3 w-3 mr-1" />
                                  Delete
                                </button>
              </div>
            </div>
                          </div>
                          
                          {/* Table */}
                          <div className="overflow-hidden rounded-lg border border-gray-200">
                            <div className="grid grid-cols-8 gap-4 p-4 text-sm font-medium text-gray-700 bg-gray-50 border-b">
                              <div>Company</div>
                              <div>Careers URL</div>
                              <div>Robots.txt Evaluation</div>
                              <div>Number of Jobs</div>
                              <div>Employment Level</div>
                              <div>Employment Type</div>
                              <div>Location</div>
                              <div>Actions</div>
                            </div>
                            {crawler.companies.length > 0 ? (
                              crawler.companies.map((company, companyIndex) => {
                                // Handle both string and object company types
                                if (typeof company === 'string') {
                                  return (
                                    <div key={companyIndex} className="grid grid-cols-8 gap-4 p-4 text-sm text-gray-900 bg-white border-b border-gray-100 last:border-b-0">
                                      <div className="font-medium">{company}</div>
                                      <div className="text-gray-500">N/A</div>
                                      <div>
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                          Unknown
                                        </span>
                                      </div>
                                      <div className="font-medium">0</div>
                                      <div>All Levels</div>
                                      <div>FTE</div>
                                      <div>Global</div>
                                      <div>
                                        <button 
                                          onClick={() => startCrawlerForCompany(String(crawler.id), { id: company, name: company, url: '', level: 'All Levels', type: 'FTE', location: 'Global' })}
                                          className="px-3 py-1 bg-white text-black border border-gray-300 rounded text-xs hover:bg-gray-100 active:bg-yellow-400 active:text-black flex items-center"
                                        >
                                          Start Crawl <PlayIcon className="h-3 w-3 ml-1" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                }
                                
                                // Handle Company object type
                                const companyObj = company as Company;
                                return (
                                  <div key={companyIndex} className="grid grid-cols-8 gap-4 p-4 text-sm text-gray-900 bg-white border-b border-gray-100 last:border-b-0">
                                    <div className="font-medium">{companyObj.name}</div>
                                    <div className="text-blue-600 hover:underline cursor-pointer" onClick={() => window.open(companyObj.url, '_blank')}>
                                      {companyObj.url.replace('https://', '').replace('http://', '')}
                                    </div>
                                    <div>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        companyObj.robotsAllowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                      }`}>
                                        {companyObj.robotsAllowed ? 'Approved' : 'Blocked'}</span>
                                    </div>
                                    <div className="font-medium">{companyObj.jobs || 0}</div>
                                    <div>{companyObj.level || 'All Levels'}</div>
                                    <div>{companyObj.type || 'FTE'}</div>
                                    <div>{companyObj.location || 'Global'}</div>
                                    <div>
                                      <button 
                                        onClick={() => startCrawlerForCompany(String(crawler.id), companyObj)}
                                        className="px-3 py-1 bg-white text-black border border-gray-300 rounded text-xs hover:bg-gray-100 active:bg-yellow-400 active:text-black flex items-center"
                                      >
                                        Start Crawl <PlayIcon className="h-3 w-3 ml-1" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="p-4 text-center text-gray-500">
                                No companies configured for this crawler
                              </div>
                            )}
          </div>

                          {/* Configuration Summary */}
                          {crawler.configuration && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Configuration</h5>
                              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                                <div>
                                  <span className="font-medium">Sources:</span> {crawler.configuration.sources?.join(', ') || 'N/A'}
              </div>
                                <div>
                                  <span className="font-medium">Search Terms:</span> {crawler.configuration.searchTerms?.join(', ') || 'N/A'}
              </div>
                                <div>
                                  <span className="font-medium">Locations:</span> {crawler.configuration.locations?.join(', ') || 'N/A'}
              </div>
                                <div>
                                  <span className="font-medium">Max Jobs:</span> {crawler.configuration.maxJobsPerSource || 'N/A'}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No crawler instances found</p>
                        <button
                          onClick={addCrawlerInstance}
                          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Create First Crawler
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        );

            case 'firms':
        return (
          <div className="space-y-6">
            {/* Header with Breadcrumbs */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
              <h1 className="text-2xl font-bold mb-4">Firm Management</h1>
              <div className="mb-4">
                <Breadcrumb items={getBreadcrumbItems()} theme="dark" />
              </div>
            </div>
            
              <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Manage Firms</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add New Firm
              </button>
              </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Registered Firms</h3>
              <div className="text-center py-8">
                <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No firms registered yet</p>
                <p className="text-gray-400 text-sm">Firms will appear here when they register on the platform</p>
            </div>
          </div>
        </div>
        );

      default:
        return (
          <div className="space-y-6">
            {/* Header with Breadcrumbs */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
              <h1 className="text-2xl font-bold mb-4">{sidebarItems.find(item => item.id === activeSection)?.name || 'Settings'}</h1>
              <div className="mb-4">
                <Breadcrumb items={getBreadcrumbItems()} theme="dark" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-500">This section is under development.</p>
      </div>
    </div>
  );
}
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">Admin Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          ))}
        </nav>


      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto scrollbar-hidden">
        <div className="p-8">
          {renderDashboardContent()}
        </div>
      </div>
      
      {/* Job Detail Modal */}
      <JobDetailModal 
        job={selectedJob}
        isOpen={isJobModalOpen}
        onClose={closeJobModal}
      />

      {/* Add Company Modal */}
      {showAddCompanyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Company to Crawler</h3>
              <button
                onClick={() => setShowAddCompanyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Google, Microsoft, Amazon"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Careers URL</label>
                <input
                  type="url"
                  value={newCompany.url}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://careers.company.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Level</label>
                  <select
                    value={newCompany.level}
                    onChange={(e) => setNewCompany(prev => ({ ...prev, level: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All Levels">All Levels</option>
                    <option value="Entry">Entry</option>
                    <option value="Mid-Senior">Mid-Senior</option>
                    <option value="Senior">Senior</option>
                    <option value="Principal">Principal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                  <select
                    value={newCompany.type}
                    onChange={(e) => setNewCompany(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="FTE">FTE</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="FTE, Contract">FTE, Contract</option>
                    <option value="FTE, Internship">FTE, Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={newCompany.location}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Remote, San Francisco, Global"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddCompanyModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addCompanyToCrawler}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Company
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Website Selection Modal */}
      {showJobWebsiteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto scrollbar-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Job Websites to Crawl - Crawler {selectedCrawlerForWebsites}
              </h3>
              <button
                onClick={() => setShowJobWebsiteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {['All', 'General', 'Tech', 'Startup', 'Remote', 'Freelance', 'Corporate', 'Fintech', 'Aggregator'].map((category) => (
                    <button
                      key={category}
                      className="py-2 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    >
                      {category}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Website Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {jobWebsites.map((website) => (
                <div key={website.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`website-${website.id}`}
                        checked={jobWebsiteConfig[website.id]?.enabled || false}
                        onChange={(e) => updateWebsiteConfig(website.id, { enabled: e.target.checked })}
                        className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <label htmlFor={`website-${website.id}`} className="font-medium text-gray-900 cursor-pointer">
                          {website.name}
                        </label>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            website.category === 'General' ? 'bg-gray-100 text-gray-800' :
                            website.category === 'Tech' ? 'bg-blue-100 text-blue-800' :
                            website.category === 'Startup' ? 'bg-green-100 text-green-800' :
                            website.category === 'Remote' ? 'bg-purple-100 text-purple-800' :
                            website.category === 'Freelance' ? 'bg-yellow-100 text-yellow-800' :
                            website.category === 'Corporate' ? 'bg-indigo-100 text-indigo-800' :
                            website.category === 'Fintech' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-pink-100 text-pink-800'
                          }`}>
                            {website.category}
                          </span>
                          {website.premium && (
                            <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                              Premium
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Configuration options - only show when enabled */}
                  {jobWebsiteConfig[website.id]?.enabled && (
                    <div className="space-y-3 pt-3 border-t border-gray-100">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Max Jobs to Crawl
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          value={jobWebsiteConfig[website.id]?.maxJobs || 25}
                          onChange={(e) => updateWebsiteConfig(website.id, { maxJobs: parseInt(e.target.value) })}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Search Terms (comma separated)
                        </label>
                        <input
                          type="text"
                          value={jobWebsiteConfig[website.id]?.searchTerms?.join(', ') || 'software engineer, developer'}
                          onChange={(e) => updateWebsiteConfig(website.id, { 
                            searchTerms: e.target.value.split(',').map(term => term.trim()) 
                          })}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          placeholder="software engineer, developer, react"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Locations (comma separated)
                        </label>
                        <input
                          type="text"
                          value={jobWebsiteConfig[website.id]?.locations?.join(', ') || 'remote'}
                          onChange={(e) => updateWebsiteConfig(website.id, { 
                            locations: e.target.value.split(',').map(loc => loc.trim()) 
                          })}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          placeholder="remote, san francisco, new york"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`robots-${website.id}`}
                          checked={jobWebsiteConfig[website.id]?.respectRobots !== false}
                          onChange={(e) => updateWebsiteConfig(website.id, { respectRobots: e.target.checked })}
                          className="mr-2 h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`robots-${website.id}`} className="text-xs text-gray-700">
                          Respect robots.txt
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Summary and Actions */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Selected: {Object.values(jobWebsiteConfig).filter(config => config.enabled).length} websites | 
                  Total Jobs: {Object.values(jobWebsiteConfig).filter(config => config.enabled).reduce((sum, config) => sum + (config.maxJobs || 0), 0)}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowJobWebsiteModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={startWebsiteCrawling}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Start Crawling
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Management Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={userFormData.firstName}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={userFormData.lastName}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                <select
                  value={userFormData.userType}
                  onChange={(e) => setUserFormData(prev => ({ ...prev, userType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="jobseeker">Job Seeker</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="consultant">Consultant</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={userFormData.isVerified}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, isVerified: e.target.checked }))}
                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Verified User</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={userFormData.isActive}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Active User</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingUser ? 'Update User' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Update Modal */}
      {showPasswordModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Update Password for {editingUser.firstName} {editingUser.lastName}
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newPasswordInput = document.getElementById('newPassword') as HTMLInputElement;
                  const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;
                  if (newPasswordInput && confirmPasswordInput) {
                    const newPassword = newPasswordInput.value;
                    const confirmPassword = confirmPasswordInput.value;
                    if (newPassword === confirmPassword && newPassword.length >= 6) {
                      updatePassword(newPassword);
                    } else {
                      alert('Passwords do not match or are too short (minimum 6 characters)');
                    }
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Access Management Modal */}
      {showAccessModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Manage Access for {editingUser.firstName} {editingUser.lastName}
              </h3>
              <button
                onClick={() => setShowAccessModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                <select
                  id="accessUserType"
                  defaultValue={editingUser.userType}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="jobseeker">Job Seeker</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="consultant">Consultant</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    id="accessVerified"
                    defaultChecked={editingUser.isVerified}
                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Verified User</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    id="accessActive"
                    defaultChecked={editingUser.isActive !== false}
                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Active User</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAccessModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const userTypeSelect = document.getElementById('accessUserType') as HTMLSelectElement;
                  const verifiedCheckbox = document.getElementById('accessVerified') as HTMLInputElement;
                  const activeCheckbox = document.getElementById('accessActive') as HTMLInputElement;
                  if (userTypeSelect && verifiedCheckbox && activeCheckbox) {
                    const accessData = {
                      userType: userTypeSelect.value,
                      isVerified: verifiedCheckbox.checked,
                      isActive: activeCheckbox.checked
                    };
                    updateUserAccess(accessData);
                  }
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Update Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}