import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import ProgressBar from '../components/common/ProgressBar';
import DailyChallenge from '../components/dashboard/DailyChallenge';
import SkillsOverview from '../components/dashboard/SkillsOverview';
import RecentBadges from '../components/dashboard/RecentBadges';
import AiCoachPreview from '../components/dashboard/AiCoachPreview';
import OnboardingQuestionnaire from '../components/onboarding/OnboardingQuestionnaire';
import OnboardingPromoButton from '../components/onboarding/OnboardingPromoButton';
import MorningRoutine from '../components/innerGame/MorningRoutine';
import { Challenge, Skill, Badge } from '../types';
import { Trophy, ArrowRight, Star, Quote, Calendar, Zap, Clock, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const DAILY_QUOTES = [
  'The greatest seducer is not the one with the best lines, but the one who listens with true presence.',
  'Self-confidence is the most attractive quality a person can have. How can others see how amazing you are if you don\'t see it yourself?',
  'Approach each interaction with genuine curiosity rather than expectations, and watch how people respond differently.',
  'The art of seduction is knowing what she truly desires and giving it to her slowly in a way that takes her on a journey.',
  'True charm comes from authenticity. When you\'re comfortable in your own skin, others naturally find you captivating.',
  'Growth happens outside your comfort zone. Every approach, regardless of outcome, builds your confidence.',
  'The most powerful way to impress someone is to be genuinely interested in them rather than trying to be interesting.',
];

// Mock data for development
const MOCK_USER = {
  id: 'mock-user',
  name: 'Demo User',
  email: 'demo@example.com',
  level: 5,
  xp: 1250,
  joinedAt: new Date(),
  streak: 3,
  isPremium: false,
  role: 'user',
  skills: [
    {
      id: 'skill-1',
      name: 'Approach Confidence',
      level: 4,
      maxLevel: 10,
      category: 'approach'
    },
    {
      id: 'skill-2',
      name: 'Conversation Flow',
      level: 7,
      maxLevel: 10,
      category: 'conversation'
    },
    {
      id: 'skill-3',
      name: 'Dating Strategy',
      level: 3,
      maxLevel: 10,
      category: 'dating'
    }
  ],
  badges: [
    {
      id: 'badge-1',
      name: 'First Approach',
      description: 'Completed your first approach',
      icon: 'message-circle',
      earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'badge-2',
      name: 'Social Butterfly',
      description: 'Completed 10 social challenges',
      icon: 'users',
      earnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  ]
};

const HomePage: React.FC = () => {
  const { user, addXP, hasCompletedQuestionnaire, completeQuestionnaire } = useUser();
  const [showQuestionnaire, setShowQuestionnaire] = useState<boolean>(false);
  const [dailyChallenge, setDailyChallenge] = useState<Challenge>({
    id: 'daily-1',
    title: 'Approach Challenge',
    description: 'Give a sincere compliment to a stranger today',
    difficulty: 'medium',
    xpReward: 50,
    completed: false,
    category: 'daily',
    icon: 'message-circle'
  });
  const [showMorningRoutine, setShowMorningRoutine] = useState<boolean>(false);
  const [socialChallenge, setSocialChallenge] = useState<Challenge>({
    id: 'social-1',
    title: 'Extended Eye Contact',
    description: 'Maintain eye contact with 5 strangers for 2 seconds with a slight smile',
    difficulty: 'easy',
    xpReward: 30,
    completed: false,
    category: 'social',
    icon: 'eye'
  });

  // Get today's quote based on the day of the year
  const [quote, setQuote] = useState("");
  
  // Use real user or mock user for development
  const currentUser = user || MOCK_USER;
  
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const quoteIndex = dayOfYear % DAILY_QUOTES.length;
    setQuote(DAILY_QUOTES[quoteIndex]);
    
    // Only show morning routine prompt if it's before 12pm
    const currentHour = today.getHours();
    if (currentHour < 12) {
      setShowMorningRoutine(true);
    }
  }, []);

  const handleCompleteChallenge = () => {
    setDailyChallenge({
      ...dailyChallenge,
      completed: true
    });
    
    if (user) {
      addXP(dailyChallenge.xpReward);
    }
  };
  
  const handleCompleteSocialChallenge = () => {
    setSocialChallenge({
      ...socialChallenge,
      completed: true
    });
    
    if (user) {
      addXP(socialChallenge.xpReward);
    }
  };

  const handleOpenQuestionnaire = () => {
    setShowQuestionnaire(true);
  };

  const handleCloseQuestionnaire = () => {
    setShowQuestionnaire(false);
  };

  const handleCompleteQuestionnaire = () => {
    completeQuestionnaire();
    setShowQuestionnaire(false);
  };
  
  const handleDismissMorningRoutine = () => {
    setShowMorningRoutine(false);
  };

  return (
    <div className="space-y-6">
      {!user && (
        <div className="luxury-card p-6 bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-midnight)] text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Welcome to Inner Game!</h1>
              <p className="text-white text-opacity-90">
                Please sign in to track your progress and access all features.
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <Star className="h-5 w-5 text-[var(--color-gold)]" />
            </div>
          </div>
        </div>
      )}

      {!user ? null : !hasCompletedQuestionnaire && !showQuestionnaire && (
        <OnboardingPromoButton onClick={handleOpenQuestionnaire} />
      )}

      {showQuestionnaire && (
        <OnboardingQuestionnaire onComplete={handleCompleteQuestionnaire} />
      )}

      <div className="luxury-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentUser.name}!</h1>
            <p className="text-gray-600">Continue your seduction journey</p>
          </div>
          <div className="bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-midnight)] rounded-lg p-2">
            <Trophy className="h-6 w-6 text-[var(--color-gold)]" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Level {currentUser.level}</span>
              <span className="elite-badge">{currentUser.xp} XP</span>
            </div>
            <span className="text-sm text-gray-500">{1000 - (currentUser.xp % 1000)} XP to Level {currentUser.level + 1}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="luxury-progress-bar" style={{ width: `${(currentUser.xp % 1000) / 10}%` }}></div>
          </div>
        </div>
      </div>
      
      {/* Daily Quote */}
      <div className="luxury-card p-6">
        <div className="flex items-start space-x-4">
          <div className="rounded-full bg-amber-100 p-2 flex-shrink-0">
            <Quote className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Daily Wisdom</h3>
            <p className="text-gray-700 italic">{quote}</p>
          </div>
        </div>
      </div>
      
      {/* Today's Challenges */}
      <div className="luxury-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Today's Challenges</h2>
          <Link to="/challenges" className="text-sm text-[var(--color-burgundy)] font-medium flex items-center">
            View all <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="rounded-full bg-blue-100 p-2 mr-3 flex-shrink-0">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900">{dailyChallenge.title}</h3>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                    {dailyChallenge.xpReward} XP
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{dailyChallenge.description}</p>
                <button
                  onClick={handleCompleteChallenge}
                  disabled={dailyChallenge.completed || !user}
                  className={`px-4 py-2 text-sm rounded-lg w-full ${
                    dailyChallenge.completed || !user
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-[var(--color-burgundy)] text-white hover:opacity-90'
                  }`}
                >
                  {!user ? 'Sign in to complete' : dailyChallenge.completed ? 'Completed' : 'Mark as Complete'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="rounded-full bg-violet-100 p-2 mr-3 flex-shrink-0">
                <Zap className="h-5 w-5 text-violet-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900">{socialChallenge.title}</h3>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                    {socialChallenge.xpReward} XP
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{socialChallenge.description}</p>
                <button
                  onClick={handleCompleteSocialChallenge}
                  disabled={socialChallenge.completed || !user}
                  className={`px-4 py-2 text-sm rounded-lg w-full ${
                    socialChallenge.completed || !user
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-[var(--color-burgundy)] text-white hover:opacity-90'
                  }`}
                >
                  {!user ? 'Sign in to complete' : socialChallenge.completed ? 'Completed' : 'Mark as Complete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Skills Overview */}
      <div className="luxury-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Skills Overview</h2>
          <Link to="/profile" className="text-sm text-[var(--color-burgundy)] font-medium flex items-center">
            See all skills <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {currentUser.skills && currentUser.skills.length > 0 ? (
            currentUser.skills.slice(0, 3).map((skill: Skill) => (
              <div key={skill.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                  <span className="text-xs text-gray-500">Level {skill.level}/{skill.maxLevel}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-gold)] h-2 rounded-full" 
                    style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">Complete challenges to level up your skills</p>
          )}
          
          {!user && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Sign in to track your skill progress
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* AI Coach Preview */}
      <div className="luxury-card p-6 bg-gradient-to-br from-[var(--color-midnight)] to-[var(--color-burgundy)] text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Your AI Seduction Coach</h2>
          <div className="rounded-full bg-white bg-opacity-20 p-1">
            <Star className="h-4 w-4 text-[var(--color-gold)]" />
          </div>
        </div>
        
        <p className="text-white text-opacity-90 mb-4">
          Get personalized advice from your AI coach, tailored to your specific situation.
        </p>
        
        <Link 
          to={user ? "/ai-coach" : "/login"} 
          className="block w-full py-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg text-center font-medium backdrop-blur-sm transition"
        >
          {user ? "Start a Coaching Session" : "Sign in to Access AI Coach"}
        </Link>
      </div>
      
      {/* Morning Routine Prompt */}
      {showMorningRoutine && (
        <div className="luxury-card p-6">
          <div className="flex items-start">
            <div className="rounded-full bg-green-100 p-2 mr-3 flex-shrink-0">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">Morning Power Routine</h3>
              <p className="text-sm text-gray-600 mb-3">
                Start your day with a confidence-building routine to maximize your social energy.
              </p>
              <div className="flex space-x-3">
                <Link 
                  to="/inner-game" 
                  className="px-4 py-2 text-sm rounded-lg bg-[var(--color-burgundy)] text-white hover:opacity-90 flex-1 text-center"
                >
                  Start Routine
                </Link>
                <button
                  onClick={handleDismissMorningRoutine}
                  className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Recent Badges */}
      <div className="luxury-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Achievements</h2>
          <Link to="/profile" className="text-sm text-[var(--color-burgundy)] font-medium flex items-center">
            View all <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-2 hide-scrollbar">
          {currentUser.badges && currentUser.badges.length > 0 ? (
            currentUser.badges.slice(0, 3).map((badge: Badge) => (
              <div 
                key={badge.id} 
                className="flex-shrink-0 w-24 flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-burgundy)] to-[var(--color-gold)] flex items-center justify-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                    <ShieldAlert className="h-6 w-6 text-[var(--color-burgundy)]" />
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-900">{badge.name}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">Complete challenges to earn badges</p>
          )}
          
          {!user && (
            <div className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Sign in to view your achievements
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
