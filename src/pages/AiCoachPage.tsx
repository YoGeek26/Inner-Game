import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import ChatWindow from '../components/aiCoach/ChatWindow';
import EnhancedChatWindow from '../components/aiCoach/EnhancedChatWindow';
import { Sparkles, Bookmark, CalendarRange, BarChart, Download, Lightbulb, Zap, Lock, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock user for development and non-authenticated state
const MOCK_USER = {
  id: 'mock-user',
  name: 'Demo User',
  email: 'demo@example.com',
  level: 5,
  xp: 1250,
  joinedAt: new Date(),
  streak: 3,
  isPremium: false,
  role: 'user'
};

const AiCoachPage: React.FC = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'chat' | 'history' | 'exercises'>('chat');
  
  // Use enhanced chat window with AI architecture
  const useEnhancedAI = true;
  
  // Use real user or mock user
  const currentUser = user || MOCK_USER;
  
  // Mock data for conversation history
  const conversationHistory = [
    {
      id: 'conv-1',
      title: 'Approaching at bars',
      preview: 'We discussed strategies for approaching...',
      date: new Date('2023-09-15'),
      insights: ['Be authentic', 'Create curiosity', 'Exit gracefully']
    },
    {
      id: 'conv-2',
      title: 'Texting strategies',
      preview: 'How to maintain interest through text...',
      date: new Date('2023-09-12'),
      insights: ['Keep messages concise', 'Use callback humor', 'Don\'t double text']
    },
    {
      id: 'conv-3',
      title: 'First date anxiety',
      preview: 'Techniques to reduce nervousness...',
      date: new Date('2023-09-05'),
      insights: ['Preparation reduces anxiety', 'Focus on them, not yourself', 'Choose the right venue']
    }
  ];
  
  // Mock data for exercises
  const coachingExercises = [
    {
      id: 'ex-1',
      title: 'Confidence Building',
      description: 'Daily exercises to build inner confidence',
      duration: '5-10 min',
      difficulty: 'beginner',
      locked: false
    },
    {
      id: 'ex-2',
      title: 'Conversation Mastery',
      description: 'Learn to lead engaging conversations effortlessly',
      duration: '10-15 min',
      difficulty: 'intermediate',
      locked: false
    },
    {
      id: 'ex-3',
      title: 'Reading Body Language',
      description: 'Advanced techniques to interpret non-verbal cues',
      duration: '15-20 min',
      difficulty: 'advanced',
      locked: currentUser.level < 7
    },
    {
      id: 'ex-4',
      title: 'Creating Sexual Tension',
      description: 'Subtle methods to build attraction and chemistry',
      duration: '20-30 min',
      difficulty: 'advanced',
      locked: currentUser.level < 8
    },
  ];

  return (
    <div className="space-y-6">
      {!user && (
        <div className="luxury-card p-6 bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-gold)] text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">AI Seduction Coach Preview</h1>
              <p className="text-white text-opacity-90">
                Please sign in to chat with your AI coach and save your conversations.
              </p>
            </div>
            <Link to="/login" className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm transition">
              Sign In <ArrowRight className="h-4 w-4 inline ml-1" />
            </Link>
          </div>
        </div>
      )}
      
      <div className="luxury-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">AI Seduction Coach</h1>
            <p className="text-gray-600">Your personal coach for dating and social skills</p>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-2">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'chat'
                    ? 'bg-white shadow text-[var(--color-burgundy)]'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'history'
                    ? 'bg-white shadow text-[var(--color-burgundy)]'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                History
              </button>
              <button
                onClick={() => setActiveTab('exercises')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'exercises'
                    ? 'bg-white shadow text-[var(--color-burgundy)]'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Exercises
              </button>
            </div>
          </div>
        </div>
        
        {activeTab === 'chat' && (
          <div className="border-t border-gray-200 pt-4">
            {useEnhancedAI ? <EnhancedChatWindow /> : <ChatWindow />}
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Conversation History</h2>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <CalendarRange className="h-4 w-4 inline mr-1" />
                  Filter
                </button>
                <button className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="h-4 w-4 inline mr-1" />
                  Export
                </button>
              </div>
            </div>
            
            {!user ? (
              <div className="text-center py-10 border border-gray-200 rounded-lg">
                <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <BarChart className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-gray-800 font-medium text-lg">Sign in to view history</h3>
                <p className="text-gray-600 mt-1">Your conversations will be saved when logged in</p>
                <Link to="/login" className="mt-4 inline-block px-4 py-2 bg-[var(--color-burgundy)] text-white rounded-lg text-sm font-medium">
                  Sign In
                </Link>
              </div>
            ) : conversationHistory.length === 0 ? (
              <div className="text-center py-10">
                <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <BarChart className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-gray-800 font-medium text-lg">No conversations yet</h3>
                <p className="text-gray-600 mt-1">Start chatting with your AI Coach to see history</p>
              </div>
            ) : (
              <div className="space-y-4">
                {conversationHistory.map(conversation => (
                  <div key={conversation.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900">{conversation.title}</h3>
                      <span className="text-xs text-gray-500">
                        {conversation.date.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{conversation.preview}</p>
                    
                    <div className="mt-4">
                      <p className="text-xs font-medium text-gray-700 flex items-center mb-2">
                        <Lightbulb className="h-3 w-3 mr-1 text-[var(--color-gold)]" />
                        Key Insights
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {conversation.insights.map((insight, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded-full">
                            {insight}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
                        Continue
                      </button>
                      <button className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 flex items-center">
                        <Bookmark className="h-3 w-3 mr-1" />
                        Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'exercises' && (
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Coaching Exercises</h2>
              <div className="bg-[var(--color-burgundy)] text-white px-3 py-1 rounded-full text-xs">
                {currentUser.level < 8 ? `${coachingExercises.filter(ex => !ex.locked).length}/${coachingExercises.length} Available` : 'All Available'}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coachingExercises.map(exercise => (
                <div 
                  key={exercise.id}
                  className={`border ${exercise.locked ? 'border-gray-200 bg-gray-50' : 'border-gray-200'} rounded-lg p-4 ${!exercise.locked && 'hover:bg-gray-50'} transition-colors`}
                >
                  <div className="flex justify-between">
                    <h3 className={`font-medium ${exercise.locked ? 'text-gray-500' : 'text-gray-900'}`}>{exercise.title}</h3>
                    {exercise.locked ? (
                      <Lock className="h-4 w-4 text-gray-400" />
                    ) : (
                      <div className={`text-xs rounded-full px-2 py-0.5 ${
                        exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        exercise.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {exercise.difficulty}
                      </div>
                    )}
                  </div>
                  
                  <p className={`text-sm mt-1 ${exercise.locked ? 'text-gray-400' : 'text-gray-600'}`}>
                    {exercise.description}
                  </p>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-xs ${exercise.locked ? 'text-gray-400' : 'text-gray-500'}`}>
                      {exercise.duration}
                    </span>
                    
                    {exercise.locked ? (
                      <div className="text-xs text-gray-500 flex items-center">
                        <Lock className="h-3 w-3 mr-1" />
                        Unlock at Level {exercise.title.includes('Sexual') ? '8' : '7'}
                      </div>
                    ) : !user ? (
                      <Link to="/login" className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg flex items-center">
                        Sign in to access
                      </Link>
                    ) : (
                      <button className="px-3 py-1 text-xs bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-gold)] text-white rounded-lg flex items-center">
                        <Zap className="h-3 w-3 mr-1" />
                        Start Exercise
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="bg-[var(--color-gold)] rounded-full p-2 mr-4 mt-1">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Personalized Exercise Plan</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Get a customized 30-day exercise plan designed specifically for your goals and experience level.
                  </p>
                  
                  {!user ? (
                    <div className="mt-3 flex items-center">
                      <Lock className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="text-sm text-gray-500">Sign in to access premium features</span>
                    </div>
                  ) : currentUser.level < 10 ? (
                    <div className="mt-3 flex items-center">
                      <Lock className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="text-sm text-gray-500">Available at Level 10</span>
                    </div>
                  ) : (
                    <button className="mt-3 px-4 py-2 bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-gold)] text-white rounded-lg text-sm font-medium">
                      Create Your Plan
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiCoachPage;
