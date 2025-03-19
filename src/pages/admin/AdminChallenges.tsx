import React, { useState } from 'react';
import { Award, Plus, Edit, Trash, Eye, Search, Filter, ChevronDown, CheckCircle } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  xpReward: number;
  completionRate: number;
  status: 'active' | 'inactive';
  dateCreated: string;
}

const AdminChallenges: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  // Mock challenges data
  const challenges: Challenge[] = [
    {
      id: 'challenge-1',
      title: 'Daily Conversation Starter',
      description: 'Start a conversation with a stranger using a genuine compliment',
      difficulty: 'easy',
      category: 'Conversation',
      xpReward: 50,
      completionRate: 78,
      status: 'active',
      dateCreated: '2023-09-15'
    },
    {
      id: 'challenge-2',
      title: 'Coffee Shop Approach',
      description: 'Approach someone in a coffee shop with a situational opener',
      difficulty: 'medium',
      category: 'Approaching',
      xpReward: 100,
      completionRate: 45,
      status: 'active',
      dateCreated: '2023-09-12'
    },
    {
      id: 'challenge-3',
      title: 'Group Interaction Challenge',
      description: 'Approach and engage with a group of 3+ people for at least 5 minutes',
      difficulty: 'hard',
      category: 'Social Skills',
      xpReward: 200,
      completionRate: 22,
      status: 'active',
      dateCreated: '2023-09-10'
    },
    {
      id: 'challenge-4',
      title: 'Number Closing Challenge',
      description: 'Get a phone number from someone you find attractive',
      difficulty: 'medium',
      category: 'Approaching',
      xpReward: 150,
      completionRate: 35,
      status: 'active',
      dateCreated: '2023-09-08'
    },
    {
      id: 'challenge-5',
      title: 'Rejection Immunity',
      description: 'Get rejected 5 times in one day to build immunity',
      difficulty: 'hard',
      category: 'Inner Game',
      xpReward: 250,
      completionRate: 18,
      status: 'inactive',
      dateCreated: '2023-09-05'
    },
    {
      id: 'challenge-6',
      title: 'Daily Text Opener',
      description: 'Send an engaging first text to a new match',
      difficulty: 'easy',
      category: 'Texting',
      xpReward: 50,
      completionRate: 82,
      status: 'active',
      dateCreated: '2023-09-01'
    }
  ];
  
  // Filter challenges
  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || challenge.difficulty === difficultyFilter;
    const matchesStatus = statusFilter === 'all' || challenge.status === statusFilter;
    
    return matchesSearch && matchesDifficulty && matchesStatus;
  });
  
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Challenges</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create and manage challenges for your users
          </p>
        </div>
        <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-burgundy)] hover:bg-opacity-90 focus:outline-none">
          <Plus className="h-4 w-4 mr-2" />
          New Challenge
        </button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
        {/* Search */}
        <div className="relative flex-grow max-w-xs">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[var(--color-burgundy)] focus:border-[var(--color-burgundy)] sm:text-sm"
            placeholder="Search challenges..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Difficulty filter */}
        <div className="relative w-40">
          <button
            className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm text-sm text-gray-700 hover:bg-gray-50"
          >
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              <span>
                {difficultyFilter === 'all' ? 'All Difficulty' : 
                 difficultyFilter.charAt(0).toUpperCase() + difficultyFilter.slice(1)}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>
          
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10 hidden">
            <ul className="py-1">
              <li>
                <button 
                  onClick={() => setDifficultyFilter('all')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  All Difficulty
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setDifficultyFilter('easy')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Easy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setDifficultyFilter('medium')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Medium
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setDifficultyFilter('hard')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Hard
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Status filter */}
        <div className="relative w-40">
          <button
            className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm text-sm text-gray-700 hover:bg-gray-50"
          >
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              <span>
                {statusFilter === 'all' ? 'All Status' : 
                 statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>
          
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10 hidden">
            <ul className="py-1">
              <li>
                <button 
                  onClick={() => setStatusFilter('all')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  All Status
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setStatusFilter('active')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Active
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setStatusFilter('inactive')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Inactive
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Challenges grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredChallenges.map(challenge => (
          <div key={challenge.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-2 ${
                  challenge.difficulty === 'easy' ? 'bg-green-100' : 
                  challenge.difficulty === 'medium' ? 'bg-[var(--color-gold)] bg-opacity-20' : 
                  'bg-red-100'
                }`}>
                  <Award className={`h-5 w-5 ${
                    challenge.difficulty === 'easy' ? 'text-green-600' : 
                    challenge.difficulty === 'medium' ? 'text-[var(--color-gold)]' : 
                    'text-red-600'
                  }`} />
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900 truncate max-w-[180px]">{challenge.title}</h3>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                challenge.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
              </span>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{challenge.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                  <span className="font-medium mr-1">Difficulty:</span> 
                  <span className={
                    challenge.difficulty === 'easy' ? 'text-green-600' : 
                    challenge.difficulty === 'medium' ? 'text-[var(--color-gold)]' : 
                    'text-red-600'
                  }>
                    {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-1">XP:</span> {challenge.xpReward}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                  <span className="font-medium mr-1">Category:</span> {challenge.category}
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-1">Created:</span> {challenge.dateCreated}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">Completion rate: {challenge.completionRate}%</span>
                  <span className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                    {Math.round(challenges.length * challenge.completionRate / 100)} users
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${
                    challenge.difficulty === 'easy' ? 'bg-green-500' : 
                    challenge.difficulty === 'medium' ? 'bg-[var(--color-gold)]' : 
                    'bg-red-500'
                  }`} style={{ width: `${challenge.completionRate}%` }}></div>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs text-gray-700 bg-white hover:bg-gray-50">
                <Eye className="h-3 w-3 mr-1" />
                View
              </button>
              <button className="inline-flex items-center px-2 py-1 border border-[var(--color-burgundy)] rounded-md text-xs text-[var(--color-burgundy)] bg-white hover:bg-[var(--color-burgundy)] hover:bg-opacity-10">
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </button>
              <button className="inline-flex items-center px-2 py-1 border border-red-600 rounded-md text-xs text-red-600 bg-white hover:bg-red-50">
                <Trash className="h-3 w-3 mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredChallenges.length === 0 && (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">No challenges found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default AdminChallenges;
