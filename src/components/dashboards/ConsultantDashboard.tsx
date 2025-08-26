'use client';

import { useState, useEffect } from 'react';
import { 
  UserGroupIcon,
  BriefcaseIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  CalendarDaysIcon,
  PhoneIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  StarIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
}

interface ConsultantDashboardProps {
  user: User;
}

export default function ConsultantDashboard({ user }: ConsultantDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState({
    activeClients: 0,
    totalEarnings: 0,
    completedSessions: 0,
    upcomingAppointments: 0
  });

  useEffect(() => {
    fetchConsultantData();
  }, []);

  const fetchConsultantData = async () => {
    // Mock data - replace with actual API calls
    setStats({
      activeClients: 24,
      totalEarnings: 15750,
      completedSessions: 89,
      upcomingAppointments: 8
    });

    setClients([
      {
        id: '1',
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        status: 'Active',
        joinDate: '2024-01-15',
        totalSessions: 12,
        nextAppointment: '2024-01-25 10:00 AM',
        service: 'Career Coaching',
        notes: 'Looking to transition into tech industry'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@company.com',
        phone: '+1 (555) 987-6543',
        status: 'Active',
        joinDate: '2024-01-10',
        totalSessions: 8,
        nextAppointment: '2024-01-26 2:00 PM',
        service: 'Resume Review',
        notes: 'Senior marketing professional seeking new opportunities'
      },
      {
        id: '3',
        name: 'Mike Chen',
        email: 'mike@startup.com',
        phone: '+1 (555) 456-7890',
        status: 'Completed',
        joinDate: '2023-12-20',
        totalSessions: 15,
        nextAppointment: null,
        service: 'Interview Preparation',
        notes: 'Successfully landed job at tech startup'
      }
    ]);

    setAppointments([
      {
        id: '1',
        clientName: 'John Smith',
        service: 'Career Coaching',
        date: '2024-01-25',
        time: '10:00 AM',
        duration: '60 min',
        type: 'Video Call',
        status: 'Confirmed',
        fee: 150
      },
      {
        id: '2',
        clientName: 'Sarah Johnson',
        service: 'Resume Review',
        date: '2024-01-26',
        time: '2:00 PM',
        duration: '45 min',
        type: 'Phone Call',
        status: 'Confirmed',
        fee: 100
      },
      {
        id: '3',
        clientName: 'Alex Brown',
        service: 'Mock Interview',
        date: '2024-01-27',
        time: '11:00 AM',
        duration: '90 min',
        type: 'Video Call',
        status: 'Pending',
        fee: 200
      }
    ]);

    setServices([
      {
        id: '1',
        name: 'Career Coaching',
        description: 'One-on-one career guidance and planning sessions',
        duration: '60 minutes',
        price: 150,
        bookings: 45,
        rating: 4.8,
        isActive: true
      },
      {
        id: '2',
        name: 'Resume Review',
        description: 'Professional resume analysis and improvement suggestions',
        duration: '45 minutes',
        price: 100,
        bookings: 32,
        rating: 4.9,
        isActive: true
      },
      {
        id: '3',
        name: 'Interview Preparation',
        description: 'Mock interviews and preparation strategies',
        duration: '90 minutes',
        price: 200,
        bookings: 28,
        rating: 4.7,
        isActive: true
      },
      {
        id: '4',
        name: 'LinkedIn Optimization',
        description: 'Profile optimization for better visibility',
        duration: '30 minutes',
        price: 75,
        bookings: 18,
        rating: 4.6,
        isActive: false
      }
    ]);
  };

  const StatCard = ({ title, value, icon: Icon, color = 'blue', prefix = '', suffix = '' }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600 mt-2`}>
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
        </div>
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const ClientCard = ({ client }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <span className="text-blue-600 font-semibold">
              {client.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
            <p className="text-gray-600 text-sm">{client.service}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          client.status === 'Active' ? 'bg-green-100 text-green-800' : 
          client.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {client.status}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <PhoneIcon className="h-4 w-4 mr-2" />
          <span>{client.phone}</span>
        </div>
        <div className="flex items-center">
          <CalendarDaysIcon className="h-4 w-4 mr-2" />
          <span>{client.totalSessions} sessions completed</span>
        </div>
        {client.nextAppointment && (
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-2" />
            <span>Next: {client.nextAppointment}</span>
          </div>
        )}
      </div>
      
      <p className="text-gray-600 text-sm mb-4 italic">"{client.notes}"</p>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Client since {client.joinDate}</span>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
            <EyeIcon className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg">
            <PhoneIcon className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg">
            <VideoCameraIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const AppointmentRow = ({ appointment }) => (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">{appointment.clientName}</div>
        <div className="text-sm text-gray-500">{appointment.service}</div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        <div>{appointment.date}</div>
        <div className="text-gray-500">{appointment.time}</div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">{appointment.duration}</td>
      <td className="px-6 py-4">
        <div className="flex items-center text-sm text-gray-900">
          {appointment.type === 'Video Call' ? (
            <VideoCameraIcon className="h-4 w-4 mr-2 text-blue-600" />
          ) : (
            <PhoneIcon className="h-4 w-4 mr-2 text-green-600" />
          )}
          {appointment.type}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
          appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {appointment.status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">${appointment.fee}</td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
          <button className="text-green-600 hover:text-green-800 text-sm">Join</button>
        </div>
      </td>
    </tr>
  );

  const ServiceCard = ({ service }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
          <p className="text-gray-600 text-sm mb-3">{service.description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{service.duration}</span>
            <span>•</span>
            <span className="font-medium text-gray-900">${service.price}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(service.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-1 text-sm text-gray-600">{service.rating}</span>
          </div>
          <p className="text-sm text-gray-500">{service.bookings} bookings</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {service.isActive ? 'Active' : 'Inactive'}
        </span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-blue-600 border border-blue-600 rounded text-sm hover:bg-blue-50">
            Edit
          </button>
          <button className={`px-3 py-1 rounded text-sm ${
            service.isActive 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}>
            {service.isActive ? 'Deactivate' : 'Activate'}
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
          <h1 className="text-3xl font-bold text-gray-900">Consultant Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.firstName}! Manage your consulting business.</p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
              <p className="text-gray-600 text-sm">Manage your consulting services efficiently</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <PlusIcon className="h-4 w-4 mr-2" />
                New Appointment
              </button>
              <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Create Service
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Active Clients" 
            value={stats.activeClients} 
            icon={UserGroupIcon}
            color="blue"
          />
          <StatCard 
            title="Total Earnings" 
            value={stats.totalEarnings} 
            icon={CurrencyDollarIcon}
            color="green"
            prefix="$"
          />
          <StatCard 
            title="Completed Sessions" 
            value={stats.completedSessions} 
            icon={CheckCircleIcon}
            color="purple"
          />
          <StatCard 
            title="Upcoming Appointments" 
            value={stats.upcomingAppointments} 
            icon={CalendarDaysIcon}
            color="yellow"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
                { id: 'clients', name: 'Clients', icon: UserGroupIcon },
                { id: 'appointments', name: 'Appointments', icon: CalendarDaysIcon },
                { id: 'services', name: 'Services', icon: BriefcaseIcon },
                { id: 'earnings', name: 'Earnings', icon: CurrencyDollarIcon }
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
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Business Overview</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Recent Activity</h4>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                        <span className="text-gray-600">Completed session with John Smith</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        <span className="text-gray-600">New client Sarah Johnson booked consultation</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                        <span className="text-gray-600">Payment received: $150</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Today's Schedule</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Career Coaching</p>
                          <p className="text-sm text-gray-600">John Smith</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-blue-600">10:00 AM</p>
                          <p className="text-xs text-gray-500">60 min</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Resume Review</p>
                          <p className="text-sm text-gray-600">Sarah Johnson</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-blue-600">2:00 PM</p>
                          <p className="text-xs text-gray-500">45 min</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'clients' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Clients</h3>
                  <div className="flex gap-2">
                    <div className="relative">
                      <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search clients..."
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                      Add Client
                    </button>
                  </div>
                </div>
                <div className="grid gap-6">
                  {clients.map((client) => (
                    <ClientCard key={client.id} client={client} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
                  <div className="flex gap-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>All Appointments</option>
                      <option>Today</option>
                      <option>This Week</option>
                      <option>This Month</option>
                    </select>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                      Schedule New
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client & Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) => (
                        <AppointmentRow key={appointment.id} appointment={appointment} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Services</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create New Service
                  </button>
                </div>
                <div className="grid gap-6">
                  {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Earnings & Analytics</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Monthly Earnings</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">January 2024</span>
                        <span className="text-sm font-medium text-gray-900">$4,250</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">December 2023</span>
                        <span className="text-sm font-medium text-gray-900">$3,800</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">November 2023</span>
                        <span className="text-sm font-medium text-gray-900">$3,950</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm font-medium text-gray-900">Growth</span>
                        <span className="text-sm font-medium text-green-600">+11.8%</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Service Performance</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Career Coaching</span>
                        <span className="text-sm font-medium text-gray-900">$6,750</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Interview Preparation</span>
                        <span className="text-sm font-medium text-gray-900">$5,600</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Resume Review</span>
                        <span className="text-sm font-medium text-gray-900">$3,200</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">LinkedIn Optimization</span>
                        <span className="text-sm font-medium text-gray-900">$1,350</span>
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