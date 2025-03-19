import React, { useState } from 'react';
import { File, Plus, Edit, Trash, Eye, Search, Filter, ChevronDown } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'challenge' | 'simulation';
  category: string;
  status: 'published' | 'draft';
  lastUpdated: string;
  author: string;
}

const AdminContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'article' | 'challenge' | 'simulation'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  
  // Mock content data
  const contentItems: ContentItem[] = [
    {
      id: 'content-1',
      title: 'How to Master the Art of Conversation',
      type: 'article',
      category: 'Conversation',
      status: 'published',
      lastUpdated: '2023-09-15',
      author: 'Admin'
    },
    {
      id: 'content-2',
      title: 'Approach Anxiety: How to Overcome It',
      type: 'article',
      category: 'Inner Game',
      status: 'published',
      lastUpdated: '2023-09-12',
      author: 'Admin'
    },
    {
      id: 'content-3',
      title: 'Daily Approach Challenge',
      type: 'challenge',
      category: 'Approaching',
      status: 'published',
      lastUpdated: '2023-09-10',
      author: 'Admin'
    },
    {
      id: 'content-4',
      title: 'Coffee Shop Conversation Simulator',
      type: 'simulation',
      category: 'Conversation',
      status: 'published',
      lastUpdated: '2023-09-08',
      author: 'Admin'
    },
    {
      id: 'content-5',
      title: 'Body Language Mastery',
      type: 'article',
      category: 'Inner Game',
      status: 'draft',
      lastUpdated: '2023-09-05',
      author: 'Admin'
    },
    {
      id: 'content-6',
      title: 'Bar Approach Simulation',
      type: 'simulation',
      category: 'Approaching',
      status: 'draft',
      lastUpdated: '2023-09-01',
      author: 'Admin'
    }
  ];
  
  // Filter content
  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage articles, challenges, and simulations
          </p>
        </div>
        <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-burgundy)] hover:bg-opacity-90 focus:outline-none">
          <Plus className="h-4 w-4 mr-2" />
          Add Content
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
            placeholder="Search content..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Type filter */}
        <div className="relative w-40">
          <button
            className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm text-sm text-gray-700 hover:bg-gray-50"
          >
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              <span>
                {typeFilter === 'all' ? 'All Types' : 
                 typeFilter === 'article' ? 'Articles' : 
                 typeFilter === 'challenge' ? 'Challenges' : 'Simulations'}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>
          
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10 hidden">
            <ul className="py-1">
              <li>
                <button 
                  onClick={() => setTypeFilter('all')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  All Types
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setTypeFilter('article')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Articles
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setTypeFilter('challenge')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Challenges
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setTypeFilter('simulation')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Simulations
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
                 statusFilter === 'published' ? 'Published' : 'Draft'}
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
                  onClick={() => setStatusFilter('published')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Published
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setStatusFilter('draft')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Draft
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Content table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredContent.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-md ${
                      item.type === 'article' ? 'bg-blue-100' : 
                      item.type === 'challenge' ? 'bg-[var(--color-gold)] bg-opacity-20' : 
                      'bg-green-100'
                    } flex items-center justify-center`}>
                      <File className={`h-5 w-5 ${
                        item.type === 'article' ? 'text-blue-600' : 
                        item.type === 'challenge' ? 'text-[var(--color-gold)]' : 
                        'text-green-600'
                      }`} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      <div className="text-xs text-gray-500">by {item.author}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.type === 'article' ? 'bg-blue-100 text-blue-800' : 
                    item.type === 'challenge' ? 'bg-[var(--color-gold)] bg-opacity-20 text-[var(--color-gold)]' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.lastUpdated}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button className="text-gray-600 hover:text-gray-900">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-[var(--color-burgundy)] hover:text-[var(--color-midnight)]">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredContent.length === 0 && (
          <div className="px-6 py-10 text-center">
            <p className="text-gray-500">No content found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContent;
