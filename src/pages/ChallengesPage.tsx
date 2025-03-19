import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import ChallengeCard from '../components/common/ChallengeCard';
import { Award, CheckCircle, Clock, TrendingUp, Filter, Search, Calendar, Users, MessageSquare, Target, BarChart4 } from 'lucide-react';
import ProgressBar from '../components/common/ProgressBar';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'approaching' | 'conversation' | 'dating' | 'inner-game' | 'texting';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: string[];
  xpReward: number;
  timeEstimate: string;
  isCompleted: boolean;
  isLocked: boolean;
  requiredLevel?: number;
  badgeReward?: {
    id: string;
    name: string;
    icon: string;
  };
  statistics?: {
    completionRate: number;
    averageTime: string;
    usersCompleted: number;
  };
}

const ChallengesPage: React.FC = () => {
  const { user, addXP, addBadge } = useUser();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeDifficulty, setActiveDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // Sample challenges data
  const challenges: Challenge[] = [
    {
      id: 'challenge-1',
      title: 'The 5-Day Approach Challenge',
      description: 'Approach 5 new people in 5 days to build your confidence and social skills.',
      category: 'approaching',
      difficulty: 'beginner',
      steps: [
        'Day 1: Ask a stranger for the time or directions.',
        'Day 2: Give a genuine compliment to 2 strangers.',
        'Day 3: Start a brief conversation with someone at a cafe or store.',
        'Day 4: Approach someone you find attractive and introduce yourself.',
        'Day 5: Have a 5+ minute conversation with someone new.'
      ],
      xpReward: 250,
      timeEstimate: '5 days',
      isCompleted: false,
      isLocked: false,
      statistics: {
        completionRate: 68,
        averageTime: '5.3 days',
        usersCompleted: 1452
      },
      badgeReward: {
        id: 'badge-approach-1',
        name: 'Approach Warrior',
        icon: 'users'
      }
    },
    {
      id: 'challenge-2',
      title: 'Conversation Thread Master',
      description: 'Learn and practice the art of threading conversations to avoid awkward silences.',
      category: 'conversation',
      difficulty: 'intermediate',
      steps: [
        'Study the concept of conversational threading in the linked article.',
        'Identify 3 threading opportunities in your next conversation.',
        'Practice with a friend, identifying at least 5 different threads.',
        'During a real interaction, maintain a conversation for 10+ minutes using threading.',
        'Reflect and note which threading techniques worked best for you.'
      ],
      xpReward: 350,
      timeEstimate: '1 week',
      isCompleted: false,
      isLocked: false,
      statistics: {
        completionRate: 42,
        averageTime: '8.5 days',
        usersCompleted: 875
      }
    },
    {
      id: 'challenge-3',
      title: 'Dating App Profile Optimization',
      description: 'Transform your dating app profile to maximize matches and responses.',
      category: 'dating',
      difficulty: 'beginner',
      steps: [
        'Take new profile photos following our guide.',
        'Craft an engaging bio using the provided templates.',
        'Set up A/B testing with two different profile versions.',
        'Run both profiles for 3 days and compare results.',
        'Implement the winning formula and track improvement in match rate.'
      ],
      xpReward: 200,
      timeEstimate: '1 week',
      isCompleted: true,
      isLocked: false,
      statistics: {
        completionRate: 78,
        averageTime: '6.2 days',
        usersCompleted: 2103
      }
    },
    {
      id: 'challenge-4',
      title: 'Confidence Building Routine',
      description: 'Develop daily habits that boost your inner confidence and self-esteem.',
      category: 'inner-game',
      difficulty: 'beginner',
      steps: [
        'Start a daily affirmation practice with the provided scripts.',
        'Implement a 15-minute confidence body language routine.',
        'Practice vocal tonality exercises for 3 days.',
        'Complete the rejection desensitization mini-challenge.',
        'Create and recite your personal empowerment statement daily.'
      ],
      xpReward: 300,
      timeEstimate: '2 weeks',
      isCompleted: false,
      isLocked: false,
      statistics: {
        completionRate: 65,
        averageTime: '16.8 days',
        usersCompleted: 1897
      },
      badgeReward: {
        id: 'badge-confidence-1',
        name: 'Inner Game Master',
        icon: 'target'
      }
    },
    {
      id: 'challenge-5',
      title: 'Advanced Text Game Challenge',
      description: 'Master the art of engaging, flirty texting that builds attraction.',
      category: 'texting',
      difficulty: 'advanced',
      steps: [
        'Analyze your current texting patterns using our framework.',
        'Implement the 2:1 message ratio guideline for 3 conversations.',
        'Practice using emotional spikes in your texts.',
        'Successfully plan and confirm a date primarily through text.',
        'Review and optimize based on response patterns.'
      ],
      xpReward: 400,
      timeEstimate: '10 days',
      isCompleted: false,
      isLocked: true,
      requiredLevel: 7,
      statistics: {
        completionRate: 31,
        averageTime: '12.4 days',
        usersCompleted: 643
      }
    },
    {
      id: 'challenge-6',
      title: 'Social Circle Expansion',
      description: 'Systematically grow your social network to create more dating opportunities.',
      category: 'approaching',
      difficulty: 'intermediate',
      steps: [
        'Identify 3 interest-based communities relevant to you.',
        'Attend at least 2 events or meetups from these communities.',
        'Make 3 new connections at each event (minimum 6 total).',
        'Follow up with your new connections within 48 hours.',
        'Plan a small gathering with at least 2 of your new connections.'
      ],
      xpReward: 350,
      timeEstimate: '3 weeks',
      isCompleted: false,
      isLocked: true,
      requiredLevel: 6,
      statistics: {
        completionRate: 38,
        averageTime: '24.5 days',
        usersCompleted: 724
      }
    },
    // New social interaction challenges
    {
      id: 'challenge-7',
      title: 'The Subtle Smile',
      description: 'Practice the power of a genuine smile to create positive social interactions.',
      category: 'approaching',
      difficulty: 'beginner',
      steps: [
        'Naturally smile at 5 strangers during the day.',
        'Note the reactions you get (positive, neutral, negative).',
        'Write down your feelings after each interaction in the app.',
        'Review your notes and identify patterns in reactions.',
        'Reflect on how this exercise affected your confidence and mood.'
      ],
      xpReward: 150,
      timeEstimate: '1 day',
      isCompleted: false,
      isLocked: false,
      statistics: {
        completionRate: 89,
        averageTime: '1.2 days',
        usersCompleted: 2587
      },
      badgeReward: {
        id: 'badge-smile-1',
        name: 'Smile Ambassador',
        icon: 'smile'
      }
    },
    {
      id: 'challenge-8',
      title: 'Simple Request',
      description: 'Master the art of making simple requests to strangers with confidence.',
      category: 'approaching',
      difficulty: 'beginner',
      steps: [
        'Choose 3 strangers in the street.',
        'Ask them a simple question (time, direction, recommendation).',
        'Maintain eye contact with a friendly smile.',
        'Record your experience and the reactions.',
        'Reflect on what you learned about yourself through this exercise.'
      ],
      xpReward: 200,
      timeEstimate: '1 day',
      isCompleted: false,
      isLocked: false,
      statistics: {
        completionRate: 82,
        averageTime: '1.5 days',
        usersCompleted: 2143
      }
    },
    {
      id: 'challenge-9',
      title: 'Authentic Compliment',
      description: 'Learn to give genuine, specific compliments that create connections.',
      category: 'conversation',
      difficulty: 'beginner',
      steps: [
        'Identify a unique characteristic in a stranger (style, accessory).',
        'Give them a specific and original compliment.',
        'Observe and note their reaction in the app.',
        'Try this with at least 3 different people.',
        'Compare the different reactions and identify what worked best.'
      ],
      xpReward: 200,
      timeEstimate: '2 days',
      isCompleted: false,
      isLocked: false,
      statistics: {
        completionRate: 76,
        averageTime: '2.1 days',
        usersCompleted: 1908
      }
    },
    {
      id: 'challenge-10',
      title: 'Innovative Opener',
      description: 'Create and test original conversation openers in dating apps.',
      category: 'texting',
      difficulty: 'intermediate',
      steps: [
        'Use a dating app.',
        'Send an original opener to 5 matches.',
        'Document the responses and evaluate their effectiveness.',
        'Identify patterns in what worked best.',
        'Get AI feedback on your most successful openers.'
      ],
      xpReward: 250,
      timeEstimate: '4 days',
      isCompleted: false,
      isLocked: false,
      statistics: {
        completionRate: 61,
        averageTime: '5.3 days',
        usersCompleted: 1457
      }
    },
    {
      id: 'challenge-11',
      title: 'Bold Compliment',
      description: 'Push your comfort zone by giving slightly daring but respectful compliments.',
      category: 'approaching',
      difficulty: 'intermediate',
      steps: [
        'Prepare several subtle yet daring compliment ideas.',
        'Give a bold compliment to a stranger.',
        'Note their reaction in detail.',
        'Record your confidence level before and after.',
        'Reflect on how this challenge expanded your comfort zone.'
      ],
      xpReward: 300,
      timeEstimate: '2 days',
      isCompleted: false,
      isLocked: false,
      statistics: {
        completionRate: 52,
        averageTime: '3.4 days',
        usersCompleted: 1209
      },
      badgeReward: {
        id: 'badge-bold-1',
        name: 'Fearless Flirter',
        icon: 'zap'
      }
    },
    {
      id: 'challenge-12',
      title: 'Express Storytelling',
      description: 'Master the art of engaging strangers with captivating stories.',
      category: 'conversation',
      difficulty: 'intermediate',
      steps: [
        'Prepare a captivating anecdote (less than a minute long).',
        'Spontaneously share it with a small group of 2-3 strangers.',
        'Observe their reactions and engagement.',
        'Evaluate which parts of your story resonated most.',
        'Share your feedback and learnings in the app.'
      ],
      xpReward: 300,
      timeEstimate: '3 days',
      isCompleted: false,
      isLocked: false,
      statistics: {
        completionRate: 47,
        averageTime: '4.2 days',
        usersCompleted: 967
      }
    },
    {
      id: 'challenge-13',
      title: 'Minimal Conversation',
      description: 'Practice maintaining engaging conversations with minimal effort.',
      category: 'conversation',
      difficulty: 'beginner',
      steps: [
        'Engage in a conversation of at least 2 minutes with a stranger.',
        'Use at least one open-ended question.',
        'Practice active listening more than speaking.',
        'Maintain comfortable eye contact throughout.',
        'Write down your impressions of the quality of the interaction.'
      ],
      xpReward: 250,
      timeEstimate: '2 days',
      isCompleted: false,
      isLocked: false,
      statistics: {
        completionRate: 72,
        averageTime: '2.7 days',
        usersCompleted: 1834
      }
    },
    {
      id: 'challenge-14',
      title: 'Humor & Wit',
      description: 'Develop your ability to respond with playful humor in social situations.',
      category: 'conversation',
      difficulty: 'intermediate',
      steps: [
        'Practice a humorous comeback in response to real or simulated teasing.',
        'Use the app to simulate potential teasing scenarios.',
        'Craft witty responses that are playful without being defensive.',
        'Post your best witty response in the app for community evaluation.',
        'Get feedback and refine your humor approach.'
      ],
      xpReward: 275,
      timeEstimate: '5 days',
      isCompleted: false,
      isLocked: false,
      statistics: {
        completionRate: 58,
        averageTime: '6.1 days',
        usersCompleted: 1432
      }
    },
    {
      id: 'challenge-15',
      title: 'Comfortable Silence',
      description: 'Master the art of comfortable silence in conversations to build connection and tension.',
      category: 'conversation',
      difficulty: 'advanced',
      steps: [
        'Engage in an interaction with a stranger or acquaintance.',
        'Intentionally insert a 5-second silence during the conversation.',
        'Maintain eye contact and relaxed body language during the silence.',
        'Observe their reaction, then naturally resume the conversation.',
        'Describe how you felt during the silence and what you learned.'
      ],
      xpReward: 350,
      timeEstimate: '3 days',
      isCompleted: false,
      isLocked: true,
      requiredLevel: 5,
      statistics: {
        completionRate: 39,
        averageTime: '4.8 days',
        usersCompleted: 782
      }
    },
    {
      id: 'challenge-16',
      title: 'Positive Rejection',
      description: 'Build rejection immunity by intentionally seeking small, harmless rejections.',
      category: 'inner-game',
      difficulty: 'intermediate',
      steps: [
        'Intentionally provoke a rejection by asking for something unlikely (while remaining respectful).',
        'Handle the response positively and with humor.',
        'Note your internal reaction and physical sensations during the interaction.',
        'Reflect on what you learned from the experience.',
        'Repeat the challenge with a different request and compare your reactions.'
      ],
      xpReward: 325,
      timeEstimate: '4 days',
      isCompleted: false,
      isLocked: false,
      statistics: {
        completionRate: 43,
        averageTime: '5.3 days',
        usersCompleted: 871
      },
      badgeReward: {
        id: 'badge-rejection-1',
        name: 'Rejection Proof',
        icon: 'shield'
      }
    },
    {
      id: 'challenge-17',
      title: 'Direct Invitation',
      description: 'Practice the art of direct, confident date invitations to build assertiveness.',
      category: 'dating',
      difficulty: 'advanced',
      steps: [
        'Identify someone you find attractive and would like to know better.',
        'Spontaneously invite them on a specific date with clear details.',
        'Maintain a relaxed attitude regardless of the outcome.',
        'Document your emotional response before, during, and after.',
        'Reflect on what you learned about yourself from this experience.'
      ],
      xpReward: 375,
      timeEstimate: '1 week',
      isCompleted: false,
      isLocked: true,
      requiredLevel: 6,
      statistics: {
        completionRate: 31,
        averageTime: '9.2 days',
        usersCompleted: 624
      }
    },
    {
      id: 'challenge-18',
      title: 'Solo Night Out',
      description: 'Build independence and social confidence by navigating social events on your own.',
      category: 'approaching',
      difficulty: 'advanced',
      steps: [
        'Identify a social event, party, or gathering you can attend.',
        'Attend the event alone without bringing friends as social support.',
        'Initiate at least 3 conversations with strangers during the event.',
        'Stay at the event for at least 90 minutes.',
        'Share your feelings and analyze your progress with AI assistance.'
      ],
      xpReward: 400,
      timeEstimate: '1 week',
      isCompleted: false,
      isLocked: true,
      requiredLevel: 5,
      statistics: {
        completionRate: 35,
        averageTime: '8.5 days',
        usersCompleted: 713
      },
      badgeReward: {
        id: 'badge-solo-1',
        name: 'Social Butterfly',
        icon: 'users'
      }
    },
    {
      id: 'challenge-19',
      title: 'Deep Compliment',
      description: 'Master the art of personality-based compliments that create meaningful connections.',
      category: 'conversation',
      difficulty: 'intermediate',
      steps: [
        'Observe someone you know or meet long enough to notice a personality trait.',
        'Give an original compliment based on their personality (not physical appearance).',
        'Observe how the person reacts to this deeper level of recognition.',
        'Notice how this type of compliment affects the connection quality.',
        'Write a detailed reflection on your feelings and the response received.'
      ],
      xpReward: 300,
      timeEstimate: '3 days',
      isCompleted: false,
      isLocked: false,
      statistics: {
        completionRate: 57,
        averageTime: '4.1 days',
        usersCompleted: 1132
      }
    },
    {
      id: 'challenge-20',
      title: 'The Phone Call',
      description: 'Practice the increasingly rare art of phone conversation to stand out from text-only communicators.',
      category: 'dating',
      difficulty: 'intermediate',
      steps: [
        'Get someone\'s phone number through a social interaction.',
        'Call them (instead of texting) to propose a specific meetup.',
        'Prepare your proposal naturally and confidently beforehand.',
        'Keep the call brief, positive, and purposeful.',
        'Write down your experience and what you learned about vocal communication.'
      ],
      xpReward: 325,
      timeEstimate: '5 days',
      isCompleted: false,
      isLocked: false,
      statistics: {
        completionRate: 48,
        averageTime: '6.7 days',
        usersCompleted: 952
      }
    },
    {
      id: 'challenge-21',
      title: 'The Surprise Letter',
      description: 'Use the power of unexpected written communication to create a memorable impression.',
      category: 'dating',
      difficulty: 'intermediate',
      steps: [
        'Write a short creative letter or message to someone you recently met.',
        'Make it personal, positive, and slightly intriguing (not overly romantic).',
        'Hand it to them or send it unexpectedly.',
        'Document their reaction to this uncommon gesture.',
        'Reflect on how this approach differs from digital communication.'
      ],
      xpReward: 275,
      timeEstimate: '3 days',
      isCompleted: false,
      isLocked: false,
      statistics: {
        completionRate: 52,
        averageTime: '4.3 days',
        usersCompleted: 867
      },
      badgeReward: {
        id: 'badge-letter-1',
        name: 'Creative Communicator',
        icon: 'pen'
      }
    },
    {
      id: 'challenge-22',
      title: 'Quick IRL Meetup',
      description: 'Master efficient and effective approaches that lead to real-life connections.',
      category: 'approaching',
      difficulty: 'advanced',
      steps: [
        'Start a quick conversation in the street or a café with someone attractive.',
        'Build rapport quickly through quality conversation techniques.',
        'Transition naturally to suggesting further contact.',
        'Try to get a number or social media within 3 minutes.',
        'Debrief your experience immediately afterward in the app.'
      ],
      xpReward: 400,
      timeEstimate: '1 week',
      isCompleted: false,
      isLocked: true,
      requiredLevel: 7,
      statistics: {
        completionRate: 29,
        averageTime: '10.2 days',
        usersCompleted: 583
      }
    },
    {
      id: 'challenge-23',
      title: 'Live Battle',
      description: 'Learn through friendly competition and real-time feedback from fellow app users.',
      category: 'approaching',
      difficulty: 'advanced',
      steps: [
        'Connect with another app user for this challenge.',
        'Meet at an agreed public location with social opportunities.',
        'Each of you approaches someone within view of the other.',
        'Observe and take mental notes on your partner\'s approach.',
        'Compare your approaches afterward and learn from the experience together.'
      ],
      xpReward: 450,
      timeEstimate: '1 week',
      isCompleted: false,
      isLocked: true,
      requiredLevel: 8,
      statistics: {
        completionRate: 24,
        averageTime: '9.8 days',
        usersCompleted: 412
      },
      badgeReward: {
        id: 'badge-battle-1',
        name: 'Social Warrior',
        icon: 'award'
      }
    },
    {
      id: 'challenge-24',
      title: 'Spontaneous Date',
      description: 'Master the art of spontaneous invitations that create immediate excitement and connection.',
      category: 'dating',
      difficulty: 'advanced',
      steps: [
        'Prepare several original activity ideas that could be done immediately.',
        'Approach a stranger you find interesting in an appropriate social setting.',
        'After establishing initial rapport, propose your spontaneous activity.',
        'If accepted, enjoy the spontaneous date; if declined, handle it gracefully.',
        'Analyze the reaction and your comfort level during the situation.'
      ],
      xpReward: 500,
      timeEstimate: '2 weeks',
      isCompleted: false,
      isLocked: true,
      requiredLevel: 9,
      statistics: {
        completionRate: 18,
        averageTime: '16.3 days',
        usersCompleted: 276
      },
      badgeReward: {
        id: 'badge-spontaneous-1',
        name: 'Carpe Diem Master',
        icon: 'zap'
      }
    }
  ];
  
  // Filter challenges based on active filters
  const filteredChallenges = challenges.filter(challenge => {
    const matchesCategory = activeCategory === 'all' || challenge.category === activeCategory;
    const matchesDifficulty = activeDifficulty === 'all' || challenge.difficulty === activeDifficulty;
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });
  
  const handleStartChallenge = (challenge: Challenge) => {
    if (challenge.isLocked) return;
    setActiveChallenge(challenge);
    setCurrentStep(0);
  };
  
  const handleCompleteStep = () => {
    if (!activeChallenge) return;
    
    if (currentStep < activeChallenge.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete the challenge
      addXP(activeChallenge.xpReward);
      
      // Award badge if applicable
      if (activeChallenge.badgeReward) {
        const { id, name, icon } = activeChallenge.badgeReward;
        addBadge({
          id,
          name,
          description: `Earned by completing the ${activeChallenge.title} challenge`,
          icon,
          earnedAt: new Date()
        });
      }
      
      // Reset and close the active challenge
      setActiveChallenge(null);
      setCurrentStep(0);
    }
  };
  
  // Stats for user's challenge history
  const challengeStats = {
    completed: challenges.filter(c => c.isCompleted).length,
    inProgress: 2,
    totalXPEarned: challenges.filter(c => c.isCompleted).reduce((sum, c) => sum + c.xpReward, 0),
    streak: 3
  };

  return (
    <div className="space-y-6">
      {activeChallenge ? (
        <div className="luxury-card p-6">
          <button
            onClick={() => setActiveChallenge(null)}
            className="text-[var(--color-burgundy)] mb-4 flex items-center hover:underline"
          >
            <Clock className="h-4 w-4 mr-1 transform rotate-180" />
            Back to challenges
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{activeChallenge.title}</h1>
              <p className="text-gray-600">{activeChallenge.description}</p>
              
              <div className="flex items-center space-x-3 mt-3">
                <div className={`text-xs px-2 py-1 rounded-full ${
                  activeChallenge.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  activeChallenge.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {activeChallenge.difficulty}
                </div>
                <div className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {activeChallenge.category.replace('-', ' ')}
                </div>
                <div className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {activeChallenge.timeEstimate}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-3 text-center">
              <div className="text-sm text-gray-600">Reward</div>
              <div className="text-xl font-bold text-[var(--color-burgundy)]">+{activeChallenge.xpReward} XP</div>
              {activeChallenge.badgeReward && (
                <div className="mt-1 text-xs text-gray-600 flex items-center justify-center">
                  <Award className="h-3 w-3 mr-1 text-[var(--color-gold)]" />
                  +1 Badge
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-medium text-gray-900">Progress</h2>
              <div className="text-sm text-gray-600">
                Step {currentStep + 1} of {activeChallenge.steps.length}
              </div>
            </div>
            
            <ProgressBar 
              progress={(currentStep / activeChallenge.steps.length) * 100}
              height={8}
              labelPosition="top"
              color="var(--color-burgundy)"
            />
          </div>
          
          <div className="mt-6">
            <h2 className="font-medium text-gray-900 mb-4">Challenge Steps</h2>
            <div className="space-y-4">
              {activeChallenge.steps.map((step, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    index < currentStep 
                      ? 'border-green-200 bg-green-50' 
                      : index === currentStep 
                      ? 'border-[var(--color-burgundy)] bg-[var(--color-burgundy)]/5' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                      index < currentStep 
                        ? 'bg-green-500 text-white' 
                        : index === currentStep 
                        ? 'bg-[var(--color-burgundy)] text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index < currentStep ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <p className={`${
                        index < currentStep 
                          ? 'text-green-800 line-through' 
                          : index === currentStep 
                          ? 'text-gray-900 font-medium' 
                          : 'text-gray-600'
                      }`}>
                        {step}
                      </p>
                      
                      {index === currentStep && (
                        <button
                          onClick={handleCompleteStep}
                          className="mt-3 px-4 py-2 bg-[var(--color-burgundy)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-burgundy)]/90 transition-colors"
                        >
                          Mark as Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {activeChallenge.statistics && (
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <BarChart4 className="h-4 w-4 mr-2 text-gray-500" />
                Challenge Statistics
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">                  <div className="text-sm text-gray-600 mb-1">Completion Rate</div>
                  <div className="text-xl font-bold text-gray-900">{activeChallenge.statistics.completionRate}%</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Avg. Time</div>
                  <div className="text-xl font-bold text-gray-900">{activeChallenge.statistics.averageTime}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Users Completed</div>
                  <div className="text-xl font-bold text-gray-900">{activeChallenge.statistics.usersCompleted.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-midnight)] rounded-lg p-5 text-white">
            <div className="flex items-center">
              <div className="mr-4">
                <Target className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Need help with this challenge?</h3>
                <p className="text-gray-200 mb-3">Get personalized guidance from our AI coach or connect with community members.</p>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-white text-[var(--color-burgundy)] rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    Ask AI Coach
                  </button>
                  <button className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors">
                    Community Forum
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="luxury-card p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Challenges</h1>
            <p className="text-gray-600">Complete these challenges to improve your skills and earn rewards</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-2 mr-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Completed</div>
                    <div className="text-xl font-bold text-gray-900">{challengeStats.completed}</div>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">In Progress</div>
                    <div className="text-xl font-bold text-gray-900">{challengeStats.inProgress}</div>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-center">
                  <div className="bg-purple-100 rounded-full p-2 mr-3">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">XP Earned</div>
                    <div className="text-xl font-bold text-gray-900">{challengeStats.totalXPEarned}</div>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-center">
                  <div className="bg-amber-100 rounded-full p-2 mr-3">
                    <TrendingUp className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Current Streak</div>
                    <div className="text-xl font-bold text-gray-900">{challengeStats.streak} days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="luxury-card p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
              <div className="flex overflow-x-auto space-x-2 pb-2 sm:pb-0">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
                    activeCategory === 'all'
                      ? 'bg-[var(--color-burgundy)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Categories
                </button>
                <button
                  onClick={() => setActiveCategory('approaching')}
                  className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
                    activeCategory === 'approaching'
                      ? 'bg-[var(--color-burgundy)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Users className="h-4 w-4 inline mr-1" />
                  Approaching
                </button>
                <button
                  onClick={() => setActiveCategory('conversation')}
                  className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
                    activeCategory === 'conversation'
                      ? 'bg-[var(--color-burgundy)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <MessageSquare className="h-4 w-4 inline mr-1" />
                  Conversation
                </button>
                <button
                  onClick={() => setActiveCategory('texting')}
                  className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
                    activeCategory === 'texting'
                      ? 'bg-[var(--color-burgundy)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <MessageSquare className="h-4 w-4 inline mr-1" />
                  Texting
                </button>
                <button
                  onClick={() => setActiveCategory('dating')}
                  className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
                    activeCategory === 'dating'
                      ? 'bg-[var(--color-burgundy)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Dating
                </button>
                <button
                  onClick={() => setActiveCategory('inner-game')}
                  className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
                    activeCategory === 'inner-game'
                      ? 'bg-[var(--color-burgundy)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Target className="h-4 w-4 inline mr-1" />
                  Inner Game
                </button>
              </div>
              
              <div className="flex space-x-2 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search challenges..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[var(--color-burgundy)] focus:border-[var(--color-burgundy)]"
                  />
                </div>
                
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={activeDifficulty}
                    onChange={(e) => setActiveDifficulty(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[var(--color-burgundy)] focus:border-[var(--color-burgundy)] appearance-none bg-white"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map(challenge => (
                <ChallengeCard
                  key={challenge.id}
                  title={challenge.title}
                  description={challenge.description}
                  difficulty={challenge.difficulty}
                  category={challenge.category}
                  xpReward={challenge.xpReward}
                  timeEstimate={challenge.timeEstimate}
                  steps={challenge.steps.length}
                  isCompleted={challenge.isCompleted}
                  isLocked={challenge.isLocked}
                  requiredLevel={challenge.requiredLevel}
                  hasBadgeReward={!!challenge.badgeReward}
                  onClick={() => handleStartChallenge(challenge)}
                />
              ))}
            </div>
            
            {filteredChallenges.length === 0 && (
              <div className="text-center py-10">
                <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-gray-800 font-medium text-lg">No challenges found</h3>
                <p className="text-gray-600 mt-1">Try adjusting your filters or search query</p>
              </div>
            )}
            
            <div className="mt-8 bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-midnight)] rounded-lg p-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="mb-4 md:mb-0 md:mr-6 md:flex-1">
                  <h3 className="text-xl font-bold mb-2">Daily Challenge Streak</h3>
                  <p className="text-gray-200 mb-2">Complete at least one challenge step every day to build your streak and earn bonus rewards.</p>
                  <div className="flex items-center">
                    <div className="bg-white/20 rounded-lg px-3 py-1 text-sm mr-3">
                      Current Streak: <span className="font-bold">{challengeStats.streak} days</span>
                    </div>
                    <div className="bg-white/20 rounded-lg px-3 py-1 text-sm">
                      Best Streak: <span className="font-bold">14 days</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 text-center md:w-1/4">
                  <p className="text-sm mb-1">Next Milestone</p>
                  <p className="text-xl font-bold mb-2">7 days</p>
                  <div className="bg-white/20 rounded-full px-3 py-1 text-xs inline-flex items-center">
                    <Award className="h-3 w-3 mr-1 text-[var(--color-gold)]" />
                    +100 XP Bonus
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChallengesPage;
