import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import ForumPostCard from '../components/community/ForumPostCard';
import { ForumPost } from '../types';
import { MessageSquare, Filter, Search, PlusCircle, Users, TrendingUp, Bookmark, Bell, Check, Pin, Award } from 'lucide-react';

const CommunityPage: React.FC = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'forum' | 'events' | 'mentors'>('forum');
  const [forumCategory, setForumCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Sample forum posts data
  const forumPosts: ForumPost[] = [
    {
      id: 'post-1',
      title: 'Tips for approaching groups at bars?',
      content: 'I struggle with approaching groups, especially when there\'s a mix of guys and girls. Any strategies that have worked for you?',
      author: {
        id: 'user-1',
        name: 'DatingNewbie',
        level: 4,
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      category: 'approaching',
      tags: ['bars', 'groups', 'cold-approach'],
      createdAt: new Date('2023-09-18'),
      replies: 8,
      likes: 12,
      lastReply: {
        id: 'reply-1',
        author: {
          id: 'user-2',
          name: 'ApproachMaster'
        },
        createdAt: new Date('2023-09-20')
      }
    },
    {
      id: 'post-2',
      title: 'Building an abundance mindset - my journey',
      content: 'After struggling with oneitis for years, I\'ve finally developed a healthy abundance mindset. Here\'s what worked for me...',
      author: {
        id: 'user-3',
        name: 'MindsetGuru',
        level: 8,
        avatar: 'https://randomuser.me/api/portraits/men/44.jpg'
      },
      category: 'mindset',
      tags: ['inner-game', 'abundance', 'psychology'],
      createdAt: new Date('2023-09-15'),
      replies: 24,
      likes: 57,
      isPinned: true,
      lastReply: {
        id: 'reply-2',
        author: {
          id: 'user-4',
          name: 'PsychologyBuff'
        },
        createdAt: new Date('2023-09-22')
      }
    },
    {
      id: 'post-3',
      title: 'How to handle flaking after getting a number?',
      content: 'I\'ve been getting numbers, but about 70% of them flake when I text to set up a date. What am I doing wrong?',
      author: {
        id: 'user-5',
        name: 'TextingTrouble',
        level: 3,
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
      },
      category: 'texting',
      tags: ['flaking', 'numbers', 'follow-up'],
      createdAt: new Date('2023-09-21'),
      replies: 14,
      likes: 8,
      isResolved: true,
      lastReply: {
        id: 'reply-3',
        author: {
          id: 'user-6',
          name: 'TextingPro'
        },
        createdAt: new Date('2023-09-22')
      }
    },
    {
      id: 'post-4',
      title: 'First date ideas that create genuine connection',
      content: 'After experimenting with different first date ideas, here are the ones that consistently lead to great connections...',
      author: {
        id: 'user-7',
        name: 'DateDoctor',
        level: 9,
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
      },
      category: 'dating',
      tags: ['first-date', 'ideas', 'connection'],
      createdAt: new Date('2023-09-19'),
      replies: 32,
      likes: 65,
      lastReply: {
        id: 'reply-4',
        author: {
          id: 'user-8',
          name: 'RomancePro'
        },
        createdAt: new Date('2023-09-23')
      }
    },
    {
      id: 'post-5',
      title: 'Overcoming approach anxiety - what finally worked for me',
      content: 'After 6 months of consistent practice, I\'ve finally beaten my approach anxiety. Here\'s my step-by-step process...',
      author: {
        id: 'user-9',
        name: 'AnxietyConquerer',
        level: 6,
        avatar: 'https://randomuser.me/api/portraits/men/55.jpg'
      },
      category: 'approaching',
      tags: ['anxiety', 'fear', 'confidence'],
      createdAt: new Date('2023-09-17'),
      replies: 19,
      likes: 42,
      lastReply: {
        id: 'reply-5',
        author: {
          id: 'user-10',
          name: 'ConfidenceCoach'
        },
        createdAt: new Date('2023-09-23')
      }
    }
  ];
  
  // Filter posts based on category and search query
  const filteredPosts = forumPosts.filter(post => {
    const matchesCategory = forumCategory === 'all' || post.category === forumCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Sort posts: pinned first, then by date
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  // Mock events data
  const upcomingEvents = [
    {
      id: 'event-1',
      title: 'Workshop: Natural Conversation Flow',
      date: new Date('2023-10-15'),
      time: '7:00 PM - 9:00 PM',
      location: 'Online',
      attendees: 58,
      host: 'ConversationMaster',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80'
    },
    {
      id: 'event-2',
      title: 'Local Meetup: Practice Approaches',
      date: new Date('2023-10-22'),
      time: '2:00 PM - 5:00 PM',
      location: 'Central Park, NYC',
      attendees: 12,
      host: 'NYCApproachGroup',
      image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&q=80'
    },
    {
      id: 'event-3',
      title: 'Advanced Body Language Webinar',
      date: new Date('2023-10-28'),
      time: '6:00 PM - 7:30 PM',
      location: 'Online',
      attendees: 124,
      host: 'BodyLanguageExpert',
      isPremium: true,
      image: 'https://images.unsplash.com/photo-1519834103215-37011c980a71?auto=format&fit=crop&q=80'
    }
  ];
  
  // Mock mentors data
  const mentors = [
    {
      id: 'mentor-1',
      name: 'Michael Thompson',
      specialty: 'Conversation & Storytelling',
      level: 15,
      rating: 4.9,
      reviews: 127,
      hourlyRate: 'Free',
      availability: 'Open',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 'mentor-2',
      name: 'Sarah Johnson',
      specialty: 'Dating Psychology',
      level: 18,
      rating: 4.8,
      reviews: 95,
      hourlyRate: '$50',
      availability: 'Limited',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 'mentor-3',
      name: 'David Wilson',
      specialty: 'Cold Approach & Inner Game',
      level: 20,
      rating: 4.9,
      reviews: 215,
      hourlyRate: '$75',
      availability: 'Waitlist',
      image: 'https://randomuser.me/api/portraits/men/62.jpg'
    },
    {
      id: 'mentor-4',
      name: 'James Rodriguez',
      specialty: 'Dating App Optimization',
      level: 14,
      rating: 4.7,
      reviews: 83,
      hourlyRate: '$40',
      availability: 'Open',
      image: 'https://randomuser.me/api/portraits/men/22.jpg'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="luxury-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Community</h1>
            <p className="text-gray-600">Connect, learn, and grow with other members</p>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-2">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('forum')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'forum'
                    ? 'bg-white shadow text-[var(--color-burgundy)]'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <MessageSquare className="h-4 w-4 inline mr-1" />
                Forum
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'events'
                    ? 'bg-white shadow text-[var(--color-burgundy)]'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Users className="h-4 w-4 inline mr-1" />
                Events
              </button>
              <button
                onClick={() => setActiveTab('mentors')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'mentors'
                    ? 'bg-white shadow text-[var(--color-burgundy)]'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Award className="h-4 w-4 inline mr-1" />
                Mentors
              </button>
            </div>
          </div>
        </div>
        
        {activeTab === 'forum' && (
          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
              <div className="flex overflow-x-auto space-x-2 pb-2 sm:pb-0">
                <button
                  onClick={() => setForumCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
                    forumCategory === 'all'
                      ? 'bg-[var(--color-burgundy)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Topics
                </button>
                <button
                  onClick={() => setForumCategory('approaching')}
                  className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
                    forumCategory === 'approaching'
                      ? 'bg-[var(--color-burgundy)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Approaching
                </button>
                <button
                  onClick={() => setForumCategory('texting')}
                  className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
                    forumCategory === 'texting'
                      ? 'bg-[var(--color-burgundy)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Texting
                </button>
                <button
                  onClick={() => setForumCategory('dating')}
                  className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
                    forumCategory === 'dating'
                      ? 'bg-[var(--color-burgundy)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Dating
                </button>
                <button
                  onClick={() => setForumCategory('mindset')}
                  className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
                    forumCategory === 'mindset'
                      ? 'bg-[var(--color-burgundy)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Mindset
                </button>
              </div>
              
              <div className="flex space-x-2 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[var(--color-burgundy)] focus:border-[var(--color-burgundy)]"
                  />
                </div>
                
                <button className="px-4 py-2 bg-[var(--color-burgundy)] text-white rounded-lg text-sm font-medium whitespace-nowrap">
                  <PlusCircle className="h-4 w-4 inline mr-1" />
                  New Post
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {sortedPosts.map(post => (
                <ForumPostCard key={post.id} post={post} />
              ))}
              
              {sortedPosts.length === 0 && (
                <div className="text-center py-10 border border-gray-200 rounded-lg">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="text-gray-500 font-medium mb-1">No posts found</h3>
                  <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-midnight)] rounded-lg p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="mb-4 md:mb-0 md:mr-6">
                    <h3 className="text-xl font-bold mb-2">Community Guidelines</h3>
                    <p className="text-gray-200 mb-4">Our community thrives on respect, support, and valuable contributions.</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 mr-2 mt-0.5 text-[var(--color-gold)]" />
                        <span>Be respectful and supportive of others</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 mr-2 mt-0.5 text-[var(--color-gold)]" />
                        <span>Share authentic experiences and insights</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 mr-2 mt-0.5 text-[var(--color-gold)]" />
                        <span>Keep content ethical and legal</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border-t pt-4 md:border-t-0 md:border-l md:pl-6 md:pt-0">
                    <h4 className="font-medium mb-2">Get More Involved</h4>
                    <div className="space-y-3">
                      <button className="w-full px-4 py-2 bg-white text-[var(--color-burgundy)] rounded-lg font-medium text-sm flex items-center justify-center">
                        <Bell className="h-4 w-4 mr-2" />
                        Subscribe to Forum Updates
                      </button>
                      <button className="w-full px-4 py-2 bg-white/20 text-white rounded-lg font-medium text-sm flex items-center justify-center hover:bg-white/30">
                        <Users className="h-4 w-4 mr-2" />
                        Join Weekly Discussion Group
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'events' && (
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Upcoming Events</h2>
              <button className="px-4 py-2 bg-[var(--color-burgundy)] text-white rounded-lg text-sm font-medium">
                View Calendar
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {upcomingEvents.map(event => (
                <div 
                  key={event.id} 
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-40">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                    
                    {event.isPremium && (
                      <div className="absolute top-2 right-2 bg-[var(--color-gold)] text-[var(--color-midnight)] px-2 py-1 rounded text-xs font-bold">
                        Premium
                      </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 p-4">
                      <div className="bg-white rounded px-2 py-1 text-xs text-gray-800 font-medium inline-block mb-2">
                        {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {event.time}
                      </div>
                      <h3 className="text-white font-bold mb-1">{event.title}</h3>
                      <p className="text-gray-200 text-sm flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {event.attendees} attending
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="bg-gray-100 rounded-full p-1.5">
                          <Users className="h-4 w-4 text-gray-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-800 ml-2">Hosted by {event.host}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{event.location}</span>
                      <button className="px-3 py-1.5 text-sm font-medium bg-[var(--color-burgundy)] text-white rounded-lg">
                        Register
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border border-gray-200 rounded-lg p-5 mb-6">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="mb-4 md:mb-0 md:mr-6 md:flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Host Your Own Event</h3>
                  <p className="text-gray-600">Share your knowledge by creating a workshop, meetup, or webinar for the community.</p>
                </div>
                
                <button className="px-4 py-2 border border-[var(--color-burgundy)] text-[var(--color-burgundy)] rounded-lg text-sm font-medium hover:bg-[var(--color-burgundy)] hover:text-white transition-colors">
                  Submit Event Proposal
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Event Topics</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border border-gray-200 rounded-lg p-3 bg-white text-center">
                  <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <h4 className="font-medium text-gray-800">Social Skills</h4>
                  <p className="text-xs text-gray-500 mt-1">12 upcoming events</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-3 bg-white text-center">
                  <div className="bg-purple-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <MessageSquare className="h-6 w-6 text-purple-500" />
                  </div>
                  <h4 className="font-medium text-gray-800">Conversation</h4>
                  <p className="text-xs text-gray-500 mt-1">8 upcoming events</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-3 bg-white text-center">
                  <div className="bg-red-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="h-6 w-6 text-red-500" />
                  </div>
                  <h4 className="font-medium text-gray-800">Inner Game</h4>
                  <p className="text-xs text-gray-500 mt-1">15 upcoming events</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-3 bg-white text-center">
                  <div className="bg-green-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Bookmark className="h-6 w-6 text-green-500" />
                  </div>
                  <h4 className="font-medium text-gray-800">Dating Skills</h4>
                  <p className="text-xs text-gray-500 mt-1">10 upcoming events</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'mentors' && (
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Available Mentors</h2>
                <p className="text-sm text-gray-600 mt-1">Learn from experienced members who've achieved dating success</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm appearance-none bg-white">
                    <option>All Specialties</option>
                    <option>Approaching</option>
                    <option>Conversation</option>
                    <option>Dating Psychology</option>
                    <option>Dating Apps</option>
                    <option>Inner Game</option>
                  </select>
                </div>
                <button className="px-4 py-2 bg-[var(--color-burgundy)] text-white rounded-lg text-sm font-medium">
                  Become a Mentor
                </button>
              </div>
            </div>            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {mentors.map(mentor => (
                <div key={mentor.id} className="border border-border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                        <img 
                          src={mentor.image} 
                          alt={mentor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium text-gray-900">{mentor.name}</h3>
                          <div className="ml-2 px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded-full">
                            Level {mentor.level}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{mentor.specialty}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                className={`h-3 w-3 ${i < Math.floor(mentor.rating) ? 'text-[var(--color-gold)]' : 'text-gray-300'}`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">({mentor.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-700">Rate: <span className={mentor.hourlyRate === 'Free' ? 'text-green-600' : 'text-gray-900'}>{mentor.hourlyRate}</span></div>
                        <div className={`text-xs ${
                          mentor.availability === 'Open' ? 'text-green-600' : 
                          mentor.availability === 'Limited' ? 'text-amber-600' : 
                          'text-red-600'
                        } mt-1`}>
                          {mentor.availability} availability
                        </div>
                      </div>
                      
                      <button 
                        className={`px-4 py-2 text-sm font-medium rounded-lg ${
                          mentor.availability === 'Waitlist' 
                            ? 'bg-gray-100 text-gray-600' 
                            : 'bg-[var(--color-burgundy)] text-white'
                        }`}
                      >
                        {mentor.availability === 'Waitlist' ? 'Join Waitlist' : 'Book Session'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-midnight)] rounded-lg p-6 text-white mb-6">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="mb-4 md:mb-0 md:mr-6 md:flex-1">
                  <h3 className="text-xl font-bold mb-2">Become a Mentor</h3>
                  <p className="text-gray-200">Share your knowledge and experience with others who are on their journey.</p>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-0.5 text-[var(--color-gold)]" />
                      <span>Help others improve their dating skills</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-0.5 text-[var(--color-gold)]" />
                      <span>Earn recognition in the community</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-0.5 text-[var(--color-gold)]" />
                      <span>Optional: set your own rates for sessions</span>
                    </li>
                  </ul>
                </div>
                
                <div className="text-center md:text-left">
                  <div className="bg-white/20 rounded-lg p-4 inline-block">
                    <p className="text-sm mb-1">Requirements</p>
                    <div className="font-bold text-xl mb-3">Level 12+</div>
                    <button className="px-4 py-2 bg-white text-[var(--color-burgundy)] rounded-lg text-sm font-medium">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">How Mentoring Works</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="bg-amber-50 rounded-full w-10 h-10 flex items-center justify-center mb-3">
                    <span className="text-amber-700 font-bold">1</span>
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">Browse Mentors</h4>
                  <p className="text-sm text-gray-600">Find mentors who specialize in the areas you want to improve</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="bg-amber-50 rounded-full w-10 h-10 flex items-center justify-center mb-3">
                    <span className="text-amber-700 font-bold">2</span>
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">Book a Session</h4>
                  <p className="text-sm text-gray-600">Schedule a time that works for both you and your mentor</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="bg-amber-50 rounded-full w-10 h-10 flex items-center justify-center mb-3">
                    <span className="text-amber-700 font-bold">3</span>
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">Meet & Learn</h4>
                  <p className="text-sm text-gray-600">Connect via video call for personalized guidance and feedback</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
