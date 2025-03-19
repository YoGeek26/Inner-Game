import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Users, Award, Clock, BookOpen, UserPlus, MessageSquare, TrendingUp, Activity } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { currentAdmin } = useAdmin();
  
  // Mock statistics data
  const stats = {
    totalUsers: 1287,
    activeUsers: 865,
    engagementRate: '72%',
    challengesCompleted: 4752,
    questionsAsked: 9823,
    averageSessionTime: '8m 32s',
    conversionRate: '6.3%',
    userGrowth: '+18%',
    revenueGrowth: '+12%',
  };
  
  // Mock chart data (just for display)
  const chartData = {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    signups: [12, 19, 15, 25, 22, 30, 28],
    activeUsers: [58, 62, 55, 78, 75, 82, 80],
  };
  
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back, {currentAdmin?.username}! Here's what's happening with your app.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-burgundy)]">
            <Activity className="mr-2 h-5 w-5 text-gray-500" />
            Generate Report
          </button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-[var(--color-burgundy)] bg-opacity-10 rounded-md p-3">
                <Users className="h-6 w-6 text-[var(--color-burgundy)]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      {stats.userGrowth}
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Challenges Completed</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.challengesCompleted}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg. Session Time</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.averageSessionTime}</div>
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
                    <div className="text-2xl font-semibold text-gray-900">{stats.engagementRate}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chart (mockup) */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Weekly User Activity</h3>
        </div>
        <div className="p-5 pt-0">
          <div className="h-64 flex flex-col justify-center items-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="text-gray-500 text-sm mb-2 flex items-center">
              <BookOpen className="h-5 w-5 mr-1" />
              Chart would be rendered here with actual data
            </div>
            <div className="flex space-x-3">
              {chartData.days.map((day, index) => (
                <div key={day} className="flex flex-col items-center">
                  <div className="bg-[var(--color-burgundy)] rounded-t-sm" style={{ 
                    height: `${chartData.signups[index] * 2}px`, 
                    width: '12px' 
                  }}></div>
                  <div className="text-xs mt-1 text-gray-500">{day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Users */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Users</h3>
            <a href="/admin/users" className="text-sm text-[var(--color-burgundy)] hover:underline">View all</a>
          </div>
          <div className="p-3">
            <ul className="divide-y divide-gray-200">
              {[
                { id: 'user1', name: 'Alex Thompson', email: 'alex@example.com', date: '2 hours ago', level: 7 },
                { id: 'user2', name: 'Michael Carter', email: 'michael@example.com', date: '3 hours ago', level: 5 },
                { id: 'user3', name: 'David Wilson', email: 'david@example.com', date: '4 hours ago', level: 9 },
                { id: 'user4', name: 'James Miller', email: 'james@example.com', date: '5 hours ago', level: 3 }
              ].map((user) => (
                <li key={user.id} className="px-2 py-3 hover:bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--color-burgundy)] to-[var(--color-midnight)] flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-burgundy)] bg-opacity-10 text-[var(--color-burgundy)]">
                        Level {user.level}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">{user.date}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
            <a href="/admin/statistics" className="text-sm text-[var(--color-burgundy)] hover:underline">View all</a>
          </div>
          <div className="p-3">
            <ul className="divide-y divide-gray-200">
              {[
                { id: 'act1', type: 'challenge', text: 'John completed "First Approach" challenge', time: '1 hour ago', icon: <Award className="h-4 w-4 text-green-500" /> },
                { id: 'act2', type: 'question', text: 'Sarah asked a question to AI Coach', time: '2 hours ago', icon: <MessageSquare className="h-4 w-4 text-blue-500" /> },
                { id: 'act3', type: 'signup', text: 'New user Robert signed up', time: '3 hours ago', icon: <UserPlus className="h-4 w-4 text-[var(--color-burgundy)]" /> },
                { id: 'act4', type: 'badge', text: 'Thomas earned "Conversation Master" badge', time: '3 hours ago', icon: <Award className="h-4 w-4 text-[var(--color-gold)]" /> }
              ].map((activity) => (
                <li key={activity.id} className="px-2 py-3 hover:bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="mr-3">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.text}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
