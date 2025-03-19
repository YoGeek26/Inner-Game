// Types related to user
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  isAdmin?: boolean;
  achievements?: Achievement[];
  level?: number;
  xp?: number;
  skills?: Skill[];
  badges?: Badge[];
  premium?: boolean;
  profileImage?: string;
  bio?: string;
  socialLinks?: SocialLink[];
  completedChallenges?: string[];
  savedArticles?: string[];
  routineHistory?: RoutineCompletion[];
  streakCount?: number;
}

export interface SocialLink {
  platform: string;
  url: string;
}

// Types related to authentication
export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Types related to chat and AI
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface Conversation {
  id: string;
  messages: Message[];
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  context: string;
}

export interface ConversationAnalysisResult {
  strengths: string[];
  weaknesses: string[];
  improvementTips: string[];
  overallScore: number;
  detailedScores: {
    clarity: number;
    engagement: number;
    empathy: number;
    assertiveness: number;
    authenticity: number;
  };
  suggestedResponses?: string[];
}

// Types related to challenges
export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: ChallengeCategory;
  xpReward: number;
  duration?: number; // in days
  steps?: ChallengeStep[];
  completionCriteria?: string;
  tags?: string[];
  relatedSkills?: string[];
}

export type ChallengeCategory = 'approach' | 'conversation' | 'dating' | 'relationship' | 'inner-game' | 'social';

export interface ChallengeStep {
  id: string;
  description: string;
  isCompleted: boolean;
}

export interface DailyChallenge extends Challenge {
  date: Date;
}

// Types related to gamification
export interface Achievement {
  id: string;
  name: string;
  description: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
  icon?: string;
  xpReward?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  category?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  icon?: string;
  category?: string;
  description?: string;
}

// Types related to the community
export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt?: Date;
  likes: number;
  comments: Comment[];
  tags?: string[];
  isPinned?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt?: Date;
  likes: number;
  parentId?: string; // For nested comments
}

// Types related to content and articles
export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: Date;
  category: ArticleCategory;
  tags: string[];
  readTime: number;
  premiumOnly: boolean;
  imageUrl?: string;
  summary?: string;
  sections?: ArticleSection[];
}

export type ArticleCategory = 'mindset' | 'psychology' | 'techniques' | 'success-stories' | 'science' | 'pnl' | 'neurosciences';

export interface ArticleSection {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
}

// Types for routines
export interface Routine {
  id: string;
  name: string;
  type: 'morning' | 'evening';
  steps: RoutineStep[];
  duration: number; // in minutes
  description: string;
}

export interface RoutineStep {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  completed: boolean;
}

export interface RoutineCompletion {
  routineId: string;
  date: Date;
  completed: boolean;
  notes?: string;
}

// Types for admin
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  totalChallenges: number;
  totalArticles: number;
  userGrowth: {
    labels: string[];
    data: number[];
  };
}
