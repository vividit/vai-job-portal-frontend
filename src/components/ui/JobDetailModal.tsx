'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  XMarkIcon, 
  MapPinIcon, 
  CurrencyDollarIcon, 
  ClockIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

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

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobDetailModal({ job, isOpen, onClose }: JobDetailModalProps) {
  if (!job) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <Dialog.Title as="h2" className="text-xl font-bold">
                        {job.title}
                      </Dialog.Title>
                      <div className="flex items-center space-x-4 mt-2 text-blue-100">
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          <span className="capitalize">{job.type}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="rounded-md bg-white/10 p-2 hover:bg-white/20 transition-colors"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Job Description</h3>
                        <div className="prose prose-sm max-w-none text-gray-600">
                          {job.description ? (
                            <div dangerouslySetInnerHTML={{ __html: job.description }} />
                          ) : (
                            <div>
                              <p className="mb-4">
                                About {job.company}: {job.company} is transforming private market investing by enabling RIAs and family offices to seamlessly discover, analyze, and allocate to private markets.
                              </p>
                              <p className="mb-4">
                                <strong>Job Description:</strong> We are looking for a {job.title} to join our team! There's a significant need for a developer with broad skills who can jump right in to help us lay the technical foundation for our company's future.
                              </p>
                              <p className="mb-4">
                                <strong>Key Responsibilities:</strong>
                              </p>
                              <ul className="list-disc pl-6 mb-4">
                                <li>Design and implement new features and endpoints</li>
                                <li>Design and implement schema changes to support new features</li>
                                <li>Participate in an Agile-based development environment</li>
                                <li>Work as an independent, cross-functional squad to deliver critical features</li>
                              </ul>
                              <p>
                                <strong>Requirements:</strong> Bachelor's degree in Computer Science or related field, 3+ years of experience in software development, proficiency in modern web technologies.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Analytics Section */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Analytics</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Posted Date</span>
                            <p className="font-medium">{job.postedDate}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Local Analytics: Views</span>
                            <p className="font-medium">1,234</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Local Analytics: Clicked on Apply</span>
                            <p className="font-medium">56</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                      <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Job Details</h4>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Salary</span>
                            <span className="text-sm font-medium text-gray-900">{job.salary}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Duration</span>
                            <span className="text-sm font-medium text-gray-900">Full-time</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Applications</span>
                            <span className="text-sm font-medium text-gray-900">{job.applications} applicants</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Status</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {job.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Posted</span>
                            <span className="text-sm font-medium text-gray-900">{job.postedDate}</span>
                          </div>
                        </div>

                        <div className="mt-6 space-y-3">
                          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center">
                            Apply
                          </button>
                          
                          <div className="grid grid-cols-6 gap-2">
                            <button className="px-3 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600">
                              Actions
                            </button>
                            <button className="px-3 py-2 text-gray-600 border border-gray-300 rounded text-sm hover:bg-gray-50">
                              Boost
                            </button>
                            <button className="px-3 py-2 text-gray-600 border border-gray-300 rounded text-sm hover:bg-gray-50">
                              Highlight
                            </button>
                            <button className="px-3 py-2 text-gray-600 border border-gray-300 rounded text-sm hover:bg-gray-50">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button className="px-3 py-2 text-gray-600 border border-gray-300 rounded text-sm hover:bg-gray-50">
                              Edit
                            </button>
                            <button className="px-3 py-2 text-gray-600 border border-gray-300 rounded text-sm hover:bg-gray-50">
                              Suspend
                            </button>
                          </div>
                          
                          <button className="w-full px-3 py-2 text-red-600 border border-red-300 rounded text-sm hover:bg-red-50">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
