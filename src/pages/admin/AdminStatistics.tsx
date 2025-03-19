import React, { useState } from 'react';
import { BarChart2, TrendingUp, Users, Award, MessageCircle, Calendar, Download, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';

const AdminStatistics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  
  // Mock statistics data
  const stats = {
    newUsers: { value: 142, change: 18.5, direction: 'up' },
    activeUsers: { value: 865, change: 7.2, direction: 'up' },
    completedChallenges: { value: 1287, change: 12.3, direction: 'up' },
    averageSessionTime: { value: '8m 32s', change: 5.1, direction: 'up' },
    chatMessages: { value: 4658, change: 24.7, direction: 'up' },
    engagementRate: { value: '72%', change: 3.2, direction: 'up' },
    conversationRate: { value: '6.8%', change: 1.9, direction: 'down' },
    retentionRate: { value: '64%', change: 2.5, direction: 'up' }
  };
  
  // Mock chart data (just for display)
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: {
      users: [58, 62, 55, 78, 75, 82, 80],
      challenges: [128, 135, 142, 130, 145, 150, 138],
      engagement: [72, 68, 74, 70, 75, 78, 76]
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>
          <p className="mt-1 text-sm text-gray-600">
            Monitor your app performance and user engagement
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <div className="relative">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
              {timeRange === '7d' ? 'Last 7 days' : 
               timeRange === '30d' ? 'Last 30 days' : 
               timeRange === '90d' ? 'Last 90 days' : 'Last year'}
              <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
            </button>
            
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10 hidden">
              <ul className="py-1">
                <li>
                  <button 
                    onClick={() => setTimeRange('7d')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Last 7 days
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setTimeRange('30d')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Last 30 days
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setTimeRange('90d')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Last 90 days
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setTimeRange('1y')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Last year
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="mr-2 h-4 w-4 text-gray-500" />
            Export
          </button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">New Users</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.newUsers.value}</div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stats.newUsers.direction === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stats.newUsers.direction === 'up' ? 
                        <ArrowUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" /> : 
                        <ArrowDown className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                      }
                      <span className="ml-1">{stats.newUsers.change}%</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-[var(--color-burgundy)] bg-opacity-10 rounded-md p-3">
                <Users className="h-6 w-6 text-[var(--color-burgundy)]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.activeUsers.value}</div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stats.activeUsers.direction === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stats.activeUsers.direction === 'up' ? 
                        <ArrowUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" /> : 
                        <ArrowDown className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                      }
                      <span className="ml-1">{stats.activeUsers.change}%</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-[var(--color-gold)] bg-opacity-10 rounded-md p-3">
                <Award className="h-6 w-6 text-[var(--color-gold)]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed Challenges</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.completedChallenges.value}</div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stats.completedChallenges.direction === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stats.completedChallenges.direction === 'up' ? 
                        <ArrowUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" /> : 
                        <ArrowDown className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                      }
                      <span className="ml-1">{stats.completedChallenges.change}%</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Engagement Rate</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.engagementRate.value}</div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stats.engagementRate.direction === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stats.engagementRate.direction === 'up' ? 
                        <ArrowUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" /> : 
                        <ArrowDown className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                      }
                      <span className="ml-1">{stats.engagementRate.change}%</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Chart */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900">User Activity Overview</h3>
        </div>
        <div className="p-5 pt-0">
          <div className="h-96 bg-white">
            <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <BarChart2 className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm text-center mb-4">
                Chart would be integrated here with real data from your analytics provider
              </p>
              
              {/* Mock chart for illustration */}
              <div className="relative w-full h-64">
                <div className="absolute bottom-0 left-0 right-0 h-64 flex items-end justify-between px-4">
                  {chartData.labels.map((label, index) => (
                    <div key={label} className="flex flex-col items-center space-y-1 relative h-full pt-4">
                      <div className="h-[60%] w-8 bg-blue-500 opacity-80 rounded-t relative">
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-blue-600 font-medium">
                          {chartData.datasets.users[index]}
                        </div>
                      </div>
                      <div className="h-[80%] w-8 bg-[var(--color-burgundy)] opacity-80 rounded-t ml-10 relative">
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-[var(--color-burgundy)] font-medium">
                          {chartData.datasets.challenges[index]}
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-6 mt-4">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-blue-500 rounded-sm mr-2"></div>
                  <span className="text-xs text-gray-600">Active Users</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-[var(--color-burgundy)] rounded-sm mr-2"></div>
                  <span className="text-xs text-gray-600">Completed Challenges</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Conversion Rates */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Key Metrics</h3>
          </div>
          <div className="p-5">
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col justify-between">
                <dt className="text-sm font-medium text-gray-500 truncate mb-1">Retention Rate</dt>
                <dd className="flex items-baseline">
                  <div className="text-xl font-semibold text-gray-900">{stats.retentionRate.value}</div>
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    stats.retentionRate.direction === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats.retentionRate.direction === 'up' ? 
                      <ArrowUp className="self-center flex-shrink-0 h-4 w-4" /> : 
                      <ArrowDown className="self-center flex-shrink-0 h-4 w-4" />
                    }
                    <span className="ml-1">{stats.retentionRate.change}%</span>
                  </div>
                </dd>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col justify-between">
                <dt className="text-sm font-medium text-gray-500 truncate mb-1">Conversion Rate</dt>
                <dd className="flex items-baseline">
                  <div className="text-xl font-semibold text-gray-900">{stats.conversationRate.value}</div>
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    stats.conversationRate.direction === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats.conversationRate.direction === 'up' ? 
                      <ArrowUp className="self-center flex-shrink-0 h-4 w-4" /> : 
                      <ArrowDown className="self-center flex-shrink-0 h-4 w-4" />
                    }
                    <span className="ml-1">{stats.conversationRate.change}%</span>
                  </div>
                </dd>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col justify-between">
                <dt className="text-sm font-medium text-gray-500 truncate mb-1">Avg. Session Time</dt>
                <dd className="flex items-baseline">
                  <div className="text-xl font-semibold text-gray-900">{stats.averageSessionTime.value}</div>
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    stats.averageSessionTime.direction === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats.averageSessionTime.direction === 'up' ? 
                      <ArrowUp className="self-center flex-shrink-0 h-4 w-4" /> : 
                      <ArrowDown className="self-center flex-shrink-0 h-4 w-4" />
                    }
                    <span className="ml-1">{stats.averageSessionTime.change}%</span>
                  </div>
                </dd>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col justify-between">
                <dt className="text-sm font-medium text-gray-500 truncate mb-1">Chat Messages</dt>
                <dd className="flex items-baseline">
                  <div className="text-xl font-semibold text-gray-900">{stats.chatMessages.value}</div>
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    stats.chatMessages.direction === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats.chatMessages.direction === 'up' ? 
                      <ArrowUp className="self-center flex-shrink-0 h-4 w-4" /> : 
                      <ArrowDown className="self-center flex-shrink-0 h-4 w-4" />
                    }
                    <span className="ml-1">{stats.chatMessages.change}%</span>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        {/* Device Breakdown */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">User Device Breakdown</h3>
          </div>
          <div className="p-5">
            <div className="h-72 flex flex-col justify-center items-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <BarChart2 className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm text-center mb-6">
                Device analytics would be displayed here
              </p>
              
              {/* Mock pie chart */}
              <div className="relative w-40 h-40 mb-6">
                <div className="absolute inset-0 rounded-full border-8 border-blue-500 border-r-[var(--color-burgundy)] border-b-green-500 border-l-[var(--color-gold)]"></div>
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-700">100%</span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-blue-500 rounded-sm mr-2"></div>
                  <span className="text-xs text-gray-600">Mobile (65%)</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-[var(--color-burgundy)] rounded-sm mr-2"></div>
                  <span className="text-xs text-gray-600">Desktop (25%)</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-green-500 rounded-sm mr-2"></div>
                  <span className="text-xs text-gray-600">Tablet (8%)</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-[var(--color-gold)] rounded-sm mr-2"></div>
                  <span className="text-xs text-gray-600">Other (2%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;
