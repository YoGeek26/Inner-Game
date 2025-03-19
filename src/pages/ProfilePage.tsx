import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Skill, Badge } from '../types';
import { User, Settings, Award, BarChart4, Clock, BookOpen, Calendar, ChevronRight, Edit, CheckCircle, Share2, Download, Upload, Eye, Link, ArrowUpRight, Mail, Lock, LogIn } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, loginUser, registerUser, isLoading, error: userError, createGuestUser } = useUser();
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'badges' | 'stats' | 'settings'>('overview');
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [name, setName] = useState('');
  const [skippingAuth, setSkippingAuth] = useState(false);

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      await loginUser(email, password);
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  // Handle register form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    try {
      await registerUser(name, email, password);
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  // Handle "Skip for now" action
  const handleSkip = async () => {
    setSkippingAuth(true);
    try {
      await createGuestUser();
    } catch (err) {
      setError('Failed to create guest session. Please try again.');
    } finally {
      setSkippingAuth(false);
    }
  };

  // Check if user exists before accessing properties
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto mt-12">
        <div className="w-full luxury-card p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[var(--color-burgundy)] to-[var(--color-midnight)] flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">{showRegister ? 'Create an Account' : 'Sign In to Your Account'}</h2>
            <p className="text-gray-500 mt-1 text-center">
              {showRegister 
                ? 'Join FlirtPlay and start your personal development journey' 
                : 'Access your profile, track progress, and unlock achievements'}
            </p>
          </div>
          
          {(error || userError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error || userError}</p>
            </div>
          )}
          
          {showRegister ? (
            // Registration form
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[var(--color-burgundy)] focus:border-[var(--color-burgundy)] sm:text-sm"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[var(--color-burgundy)] focus:border-[var(--color-burgundy)] sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[var(--color-burgundy)] focus:border-[var(--color-burgundy)] sm:text-sm"
                    placeholder="Create a password"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters</p>
              </div>
              
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-midnight)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-burgundy)]"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
              
              <div className="flex items-center justify-between mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowRegister(false)}
                  className="text-sm text-[var(--color-burgundy)] hover:underline"
                >
                  Already have an account? Sign in
                </button>
                
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={skippingAuth}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  {skippingAuth ? 'Skipping...' : 'Skip for now'}
                </button>
              </div>
            </form>
          ) : (
            // Login form
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[var(--color-burgundy)] focus:border-[var(--color-burgundy)] sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[var(--color-burgundy)] focus:border-[var(--color-burgundy)] sm:text-sm"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="flex justify-end mt-1">
                  <a href="#" className="text-xs text-[var(--color-burgundy)] hover:underline">
                    Forgot password?
                  </a>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-midnight)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-burgundy)]"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign in
                  </span>
                )}
              </button>
              
              <div className="flex items-center justify-between mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowRegister(true)}
                  className="text-sm text-[var(--color-burgundy)] hover:underline"
                >
                  Don't have an account? Create one
                </button>
                
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={skippingAuth}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  {skippingAuth ? 'Skipping...' : 'Skip for now'}
                </button>
              </div>
            </form>
          )}
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
              </button>
              
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22,12c0-5.523-4.477-10-10-10S2,6.477,2,12c0,4.991,3.657,9.128,8.438,9.878v-6.987h-2.54V12h2.54V9.797c0-2.506,1.492-3.89,3.777-3.89c1.094,0,2.238,0.195,2.238,0.195v2.46h-1.26c-1.243,0-1.63,0.771-1.63,1.562V12h2.773l-0.443,2.89h-2.33v6.988C18.343,21.128,22,16.991,22,12z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>By signing in, you agree to our <a href="#" className="text-[var(--color-burgundy)] hover:underline">Terms of Service</a> and <a href="#" className="text-[var(--color-burgundy)] hover:underline">Privacy Policy</a></p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Why create an account?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="w-10 h-10 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Award className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Track Progress</h4>
              <p className="text-sm text-gray-600">Monitor your growth and see your improvements</p>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="w-10 h-10 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Personalized Experience</h4>
              <p className="text-sm text-gray-600">Get content tailored to your specific needs</p>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="w-10 h-10 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                <Settings className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Save Your Settings</h4>
              <p className="text-sm text-gray-600">Never lose your preferences and progress</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate time since first badge
  const firstBadgeDate = user.badges?.reduce((earliest, badge) => 
    badge.earnedAt < earliest ? badge.earnedAt : earliest, 
    new Date()
  ) || new Date();
  
  const daysSinceStart = Math.floor((new Date().getTime() - firstBadgeDate.getTime()) / (1000 * 3600 * 24));
  
  // Group skills by category
  const skillsByCategory = user.skills?.reduce((acc, skill) => {
    const category = skill.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>) || {};

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="luxury-card p-6">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-b from-[var(--color-burgundy)] to-[var(--color-midnight)] flex items-center justify-center text-white text-3xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <div className="ml-2 px-2 py-1 bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-gold)] text-white text-xs rounded-full">
                Level {user.level}
              </div>
            </div>
            <p className="text-gray-600 mt-1">{user.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="text-xs bg-gray-100 rounded-full px-2 py-1 text-gray-600 flex items-center">
                <Award className="h-3 w-3 mr-1" />
                {user.badges?.length || 0} Badges
              </div>
              <div className="text-xs bg-gray-100 rounded-full px-2 py-1 text-gray-600 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Member for {daysSinceStart} days
              </div>
              <div className="text-xs bg-gray-100 rounded-full px-2 py-1 text-gray-600 flex items-center">
                <BarChart4 className="h-3 w-3 mr-1" />
                {user.xp} XP Total
              </div>
            </div>
          </div>
          <div className="ml-auto flex space-x-2">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <Share2 className="h-5 w-5 text-gray-700" />
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <Edit className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
        
        {/* XP progress */}
        <div className="mt-6 bg-gray-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">XP Progress</p>
            <p className="text-sm text-gray-500">{user.xp % 1000}/1000 to level {user.level + 1}</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-gold)] h-2.5 rounded-full" 
              style={{ width: `${(user.xp % 1000) / 10}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-500">Level {user.level}</p>
            <p className="text-xs text-gray-500">Level {user.level + 1}</p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 px-4 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-[var(--color-burgundy)] text-[var(--color-burgundy)]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`pb-2 px-4 text-sm font-medium ${
                activeTab === 'skills'
                  ? 'border-b-2 border-[var(--color-burgundy)] text-[var(--color-burgundy)]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Skills
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`pb-2 px-4 text-sm font-medium ${
                activeTab === 'badges'
                  ? 'border-b-2 border-[var(--color-burgundy)] text-[var(--color-burgundy)]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Badges
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`pb-2 px-4 text-sm font-medium ${
                activeTab === 'stats'
                  ? 'border-b-2 border-[var(--color-burgundy)] text-[var(--color-burgundy)]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Statistics
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-2 px-4 text-sm font-medium ${
                activeTab === 'settings'
                  ? 'border-b-2 border-[var(--color-burgundy)] text-[var(--color-burgundy)]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Settings
            </button>
          </div>
        </div>
        
        {/* Tab content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Progress summary cards */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">Conversation</h3>
                    <div className="bg-blue-100 text-blue-800 text-xs rounded-full px-2 py-0.5">
                      {user.progress?.conversation || 0}%
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${user.progress?.conversation || 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">Inner Game</h3>
                    <div className="bg-purple-100 text-purple-800 text-xs rounded-full px-2 py-0.5">
                      {user.progress?.innerGame || 0}%
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${user.progress?.innerGame || 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">Approach</h3>
                    <div className="bg-green-100 text-green-800 text-xs rounded-full px-2 py-0.5">
                      {user.progress?.approach || 0}%
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${user.progress?.approach || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Recent achievements */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Recent Achievements</h3>
                <div className="space-y-3">
                  {(user.badges || []).slice(0, 3).map(badge => (
                    <div key={badge.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                      <div className="bg-[var(--color-gold)] rounded-full p-2 mr-3">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{badge.name}</p>
                        <p className="text-sm text-gray-600">{badge.description}</p>
                      </div>
                      <div className="ml-auto text-xs text-gray-500">
                        {badge.earnedAt.toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  
                  {(!user.badges || user.badges.length === 0) && (
                    <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                      <div className="bg-gray-200 rounded-full p-2 mr-3">
                        <Award className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">No badges yet</p>
                        <p className="text-sm text-gray-600">Complete challenges to earn badges</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Next level benefits */}
              <div className="bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-midnight)] rounded-lg p-5 text-white">
                <h3 className="font-medium mb-3">Unlock                at Level {user.level + 1}</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 text-[var(--color-gold)]" />
                    <p>Advanced conversation simulation scenarios</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 text-[var(--color-gold)]" />
                    <p>Exclusive AI Coach topic options</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 text-[var(--color-gold)]" />
                    <p>Limited-edition profile badges</p>
                  </div>
                </div>
                <button className="mt-4 w-full py-2 bg-white text-[var(--color-burgundy)] rounded-lg font-medium">
                  Complete more activities to level up
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'skills' && (
            <div>
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category} className="mb-6">
                  <h3 className="font-medium text-gray-900 capitalize mb-3">{category} Skills</h3>
                  
                  <div className="space-y-4">
                    {skills.map(skill => (
                      <div key={skill.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{skill.name}</h4>
                          <div className="text-xs font-medium bg-[var(--color-burgundy)] text-white rounded-full px-2 py-0.5">
                            Level {skill.level}/{skill.maxLevel}
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className="bg-[var(--color-burgundy)] h-2 rounded-full" 
                            style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                          ></div>
                        </div>
                        
                        <p className="text-sm text-gray-600">
                          {skill.level === skill.maxLevel ? (
                            <span className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Mastered
                            </span>
                          ) : (
                            `${skill.maxLevel - skill.level} more levels to master`
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {Object.keys(skillsByCategory).length === 0 && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <BarChart4 className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">No Skills Yet</h3>
                  <p className="text-gray-500 text-sm">Complete activities to gain skills</p>
                </div>
              )}
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Unlock More Skills</h3>
                    <p className="text-sm text-gray-600 mt-1">Complete challenges and earn XP to unlock advanced skills</p>
                  </div>
                  <button className="px-4 py-2 bg-[var(--color-burgundy)] text-white rounded-lg text-sm font-medium">
                    View Challenges
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'badges' && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {(user.badges || []).map(badge => (
                  <div key={badge.id} className="border border-gray-200 rounded-lg p-4 text-center">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-gold)] rounded-full flex items-center justify-center mb-3">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{badge.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                    <p className="text-xs text-gray-500">{badge.earnedAt.toLocaleDateString()}</p>
                  </div>
                ))}
                
                {/* Placeholder for locked badges */}
                {[1, 2, 3, 4].map(i => (
                  <div key={`locked-${i}`} className="border border-gray-200 rounded-lg p-4 text-center bg-gray-50">
                    <div className="w-12 h-12 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-3">
                      <Award className="h-6 w-6 text-gray-400" />
                    </div>
                    <h4 className="font-medium text-gray-400 mb-1">Locked Badge</h4>
                    <p className="text-xs text-gray-400 mb-2">Complete more challenges to unlock</p>
                    <p className="text-xs text-gray-400">???</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-[var(--color-burgundy)] text-white rounded-lg p-5 mt-6">
                <h3 className="font-medium mb-3">Special Achievement Badges</h3>
                <p className="text-sm text-gray-200 mb-4">Complete special challenges to earn these rare badges</p>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="w-10 h-10 mx-auto rounded-full bg-[var(--color-gold)] flex items-center justify-center mb-2">
                      <Award className="h-5  w-5 text-[var(--color-midnight)]" />
                    </div>
                    <h5 className="text-sm font-medium mb-1">Dating Master</h5>
                    <p className="text-xs text-gray-300">Complete 10 dates</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="w-10 h-10 mx-auto rounded-full bg-[var(--color-gold)] flex items-center justify-center mb-2">
                      <Award className="h-5 w-5 text-[var(--color-midnight)]" />
                    </div>
                    <h5 className="text-sm font-medium mb-1">Social Butterfly</h5>
                    <p className="text-xs text-gray-300">Approach 50 people</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="w-10 h-10 mx-auto rounded-full bg-[var(--color-gold)] flex items-center justify-center mb-2">
                      <Award className="h-5 w-5 text-[var(--color-midnight)]" />
                    </div>
                    <h5 className="text-sm font-medium mb-1">Elite Member</h5>
                    <p className="text-xs text-gray-300">Reach Level 20</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'stats' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Clock className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="font-medium text-gray-900">Activity Time</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">37 hours</p>
                  <p className="text-sm text-gray-600">Total time spent on activities</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <BookOpen className="h-5 w-5 text-purple-500 mr-2" />
                    <h3 className="font-medium text-gray-900">Articles Read</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">24</p>
                  <p className="text-sm text-gray-600">Out of 52 available articles</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="font-medium text-gray-900">Challenges</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">15</p>
                  <p className="text-sm text-gray-600">Challenges completed</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Category Breakdown</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-gray-700">Conversations</p>
                      <p className="text-sm font-medium text-gray-900">65%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-gray-700">Dating</p>
                      <p className="text-sm font-medium text-gray-900">42%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-gray-700">Psychology</p>
                      <p className="text-sm font-medium text-gray-900">78%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-gray-700">Self-Improvement</p>
                      <p className="text-sm font-medium text-gray-900">51%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '51%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Download className="h-5 w-5 text-gray-700 mr-2" />
                  <h3 className="font-medium text-gray-900">Export Statistics</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Download your progress data in CSV format</p>
                <div className="flex space-x-2">
                  <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                    Last 30 days
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                    Complete history
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Account Information</h3>
                      <p className="text-sm text-gray-600 mt-1">Update your personal details</p>
                    </div>
                    <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                      <Edit className="h-5 w-5 text-gray-700" />
                    </button>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Privacy Settings</h3>
                      <p className="text-sm text-gray-600 mt-1">Control what data is visible to others</p>
                    </div>
                    <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                      <Eye className="h-5 w-5 text-gray-700" />
                    </button>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Notifications</h3>
                      <p className="text-sm text-gray-600 mt-1">Manage how you receive alerts</p>
                    </div>
                    <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                      <Settings className="h-5 w-5 text-gray-700" />
                    </button>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Data Management</h3>
                      <p className="text-sm text-gray-600 mt-1">Export or delete your account data</p>
                    </div>
                    <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                      <Link className="h-5 w-5 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div>
                    <h3 className="font-medium text-red-800">Delete Account</h3>
                    <p className="text-sm text-red-600 mt-1">This action cannot be undone. All your data will be permanently removed.</p>
                    <button className="mt-3 px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50">
                      Request account deletion
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
