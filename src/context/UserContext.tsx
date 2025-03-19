import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Badge, UserStats, LevelSystem, Challenge, ChallengeStep, InProgressChallenge } from '../types';
import { getUserData, updateUserData } from '../services/userDataService';

// Define the level progression system
const levelSystem: LevelSystem[] = [
  { level: 1, xpRequired: 0, title: 'Beginner' },
  { level: 2, xpRequired: 150, title: 'Novice' },
  { level: 3, xpRequired: 400, title: 'Apprentice' },
  { level: 4, xpRequired: 800, title: 'Student' },
  { level: 5, xpRequired: 1500, title: 'Adept' },
  { level: 6, xpRequired: 2500, title: 'Skilled' },
  { level: 7, xpRequired: 4000, title: 'Expert' },
  { level: 8, xpRequired: 6000, title: 'Master' },
  { level: 9, xpRequired: 8500, title: 'Grandmaster' },
  { level: 10, xpRequired: 11500, title: 'Legendary' },
  { level: 11, xpRequired: 15000, title: 'Socialite' },
  { level: 12, xpRequired: 19000, title: 'Charisma Master' },
  { level: 13, xpRequired: 23500, title: 'Social Virtuoso' },
  { level: 14, xpRequired: 28500, title: 'Dating Sage' },
  { level: 15, xpRequired: 34000, title: 'Connection Guru' },
  { level: 16, xpRequired: 40000, title: 'Attraction Expert' },
  { level: 17, xpRequired: 47000, title: 'Relationship Wizard' },
  { level: 18, xpRequired: 55000, title: 'Social Architect' },
  { level: 19, xpRequired: 65000, title: 'Interaction Master' },
  { level: 20, xpRequired: 80000, title: 'Legend' },
];

interface UserContextType {
  user: User | null;
  userStats: UserStats | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: any) => void;
  addXP: (amount: number) => Promise<{newXP: number, levelUp: boolean, newLevel?: number}>;
  addBadge: (badge: Badge) => void;
  completeQuestionnaire: () => void;
  startChallenge: (challengeId: string) => Promise<void>;
  completeStep: (challengeId: string, stepId: string) => Promise<{
    stepCompleted: boolean,
    challengeCompleted: boolean,
    xpEarned: number,
    badgeEarned?: Badge
  }>;
  abandonChallenge: (challengeId: string) => Promise<void>;
  getActiveChallenges: () => InProgressChallenge[];
  getCurrentLevel: () => number;
  getNextLevelXP: () => number;
  getLevelProgress: () => number;
  updateStreak: () => Promise<{
    streakUpdated: boolean,
    currentStreak: number,
    bonus?: {
      xp: number,
      badge?: Badge
    }
  }>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user data on component mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getUserData();
        if (userData) {
          setUser(userData);
          calculateAndSetUserStats(userData);
        }
      } catch (err) {
        console.error('Error loading user data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Calculate user statistics
  const calculateAndSetUserStats = (userData: User) => {
    if (!userData) return;
    
    const stats: UserStats = {
      challengesCompleted: userData.completedChallenges.length,
      totalXP: userData.xp,
      levelProgress: calculateLevelProgress(userData.level, userData.xp),
      currentStreak: userData.streak?.current || 0,
      longestStreak: userData.streak?.longest || 0,
      activeDays: calculateActiveDays(userData),
      skills: userData.skills.map(skill => ({
        name: skill.name,
        level: skill.level
      }))
    };
    
    setUserStats(stats);
  };
  
  const calculateLevelProgress = (currentLevel: number, currentXP: number): number => {
    const currentLevelData = levelSystem.find(level => level.level === currentLevel);
    const nextLevelData = levelSystem.find(level => level.level === currentLevel + 1);
    
    if (!currentLevelData || !nextLevelData) return 100;
    
    const xpForCurrentLevel = currentLevelData.xpRequired;
    const xpForNextLevel = nextLevelData.xpRequired;
    const xpRange = xpForNextLevel - xpForCurrentLevel;
    const userProgress = currentXP - xpForCurrentLevel;
    
    return Math.min(Math.floor((userProgress / xpRange) * 100), 100);
  };
  
  const calculateActiveDays = (userData: User): number => {
    // This is a placeholder. In a real app, this would calculate active days from activity logs
    // For now, we'll use a random number based on join date
    const joinDate = new Date(userData.joinDate);
    const today = new Date();
    const totalPossibleDays = Math.floor((today.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.min(Math.floor(totalPossibleDays * 0.7), totalPossibleDays);
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mocking login for now
      // In a real app, this would call an auth API and set user state on success
      const userData = await getUserData();
      setUser(userData);
      calculateAndSetUserStats(userData);
      
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setUserStats(null);
    // In a real app, this would also clear auth tokens, etc.
    localStorage.removeItem('token');
  };

  // Update user profile
  const updateUserProfile = async (data: any) => {
    if (!user) return;
    
    try {
      const updatedUser = {
        ...user,
        ...data
      };
      
      await updateUserData(updatedUser);
      setUser(updatedUser);
      calculateAndSetUserStats(updatedUser);
      
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError('Failed to update profile');
    }
  };

  // Add XP and handle level ups
  const addXP = async (amount: number) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const currentLevel = user.level;
      const newXP = user.xp + amount;
      
      // Check if user leveled up
      let newLevel = currentLevel;
      let levelUp = false;
      
      for (let i = 0; i < levelSystem.length; i++) {
        if (levelSystem[i].level > currentLevel && newXP >= levelSystem[i].xpRequired) {
          newLevel = levelSystem[i].level;
          levelUp = true;
        }
      }
      
      // Update user data
      const updatedUser = {
        ...user,
        xp: newXP,
        level: newLevel
      };
      
      await updateUserData(updatedUser);
      setUser(updatedUser);
      calculateAndSetUserStats(updatedUser);
      
      return {
        newXP,
        levelUp,
        newLevel: levelUp ? newLevel : undefined
      };
      
    } catch (err) {
      console.error('Error adding XP:', err);
      throw new Error('Failed to add XP');
    }
  };

  // Add badge
  const addBadge = async (badge: Badge) => {
    if (!user) return;
    
    try {
      // Check if user already has this badge
      if (user.badges.some(b => b.id === badge.id)) {
        return;
      }
      
      const updatedUser = {
        ...user,
        badges: [...user.badges, badge]
      };
      
      await updateUserData(updatedUser);
      setUser(updatedUser);
      
    } catch (err) {
      console.error('Error adding badge:', err);
      setError('Failed to add badge');
    }
  };

  // Complete questionnaire
  const completeQuestionnaire = async () => {
    if (!user) return;
    
    try {
      const updatedUser = {
        ...user,
        questionnaire: {
          ...user.questionnaire,
          completed: true,
          completedAt: new Date()
        }
      };
      
      await updateUserData(updatedUser);
      setUser(updatedUser);
      
    } catch (err) {
      console.error('Error completing questionnaire:', err);
    }
  };

  // Challenge system functions
  const startChallenge = async (challengeId: string) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      // Check if challenge is already in progress
      if (user.inProgressChallenges.some(c => c.challengeId === challengeId)) {
        throw new Error('Challenge already in progress');
      }
      
      // Fetch challenge data (would come from an API in a real app)
      // For now, we'll mock a challenge structure
      const challengeData = {
        id: challengeId,
        steps: [
          { id: 'step-1', description: 'First step', isCompleted: false },
          { id: 'step-2', description: 'Second step', isCompleted: false },
          { id: 'step-3', description: 'Third step', isCompleted: false },
        ]
      };
      
      // Create in-progress challenge
      const newInProgressChallenge: InProgressChallenge = {
        challengeId,
        startedAt: new Date(),
        currentStep: 0,
        steps: challengeData.steps.map(step => ({
          stepId: step.id,
          isCompleted: false
        }))
      };
      
      const updatedUser = {
        ...user,
        inProgressChallenges: [...user.inProgressChallenges, newInProgressChallenge]
      };
      
      await updateUserData(updatedUser);
      setUser(updatedUser);
      
    } catch (err) {
      console.error('Error starting challenge:', err);
      throw new Error('Failed to start challenge');
    }
  };

  const completeStep = async (challengeId: string, stepId: string) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      // Find challenge in progress
      const challengeIndex = user.inProgressChallenges.findIndex(c => c.challengeId === challengeId);
      if (challengeIndex === -1) {
        throw new Error('Challenge not found or not in progress');
      }
      
      const challenge = user.inProgressChallenges[challengeIndex];
      
      // Find step
      const stepIndex = challenge.steps.findIndex(s => s.stepId === stepId);
      if (stepIndex === -1) {
        throw new Error('Step not found');
      }
      
      // Mark step as completed
      const updatedSteps = [...challenge.steps];
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        isCompleted: true,
        completedAt: new Date()
      };
      
      // Update current step if this is the current step
      let currentStep = challenge.currentStep;
      if (stepIndex === currentStep && currentStep < updatedSteps.length - 1) {
        currentStep++;
      }
      
      // Check if all steps are completed
      const allStepsCompleted = updatedSteps.every(step => step.isCompleted);
      
      // Update challenge in user data
      const updatedChallenges = [...user.inProgressChallenges];
      updatedChallenges[challengeIndex] = {
        ...challenge,
        steps: updatedSteps,
        currentStep
      };
      
      // If challenge is completed, move to completed challenges
      let completedChallenges = [...user.completedChallenges];
      let result = {
        stepCompleted: true,
        challengeCompleted: allStepsCompleted,
        xpEarned: 25, // XP for completing a step
        badgeEarned: undefined as Badge | undefined
      };
      
      if (allStepsCompleted) {
        // Add to completed challenges
        completedChallenges.push(challengeId);
        
        // Remove from in-progress challenges
        updatedChallenges.splice(challengeIndex, 1);
        
        // Add bonus XP for completing the entire challenge
        result.xpEarned += 100;
        
        // Add badge if applicable (mocked for now)
        if (Math.random() > 0.7) {
          result.badgeEarned = {
            id: `badge-${Date.now()}`,
            name: 'Challenge Master',
            description: 'Completed a challenging task',
            icon: 'award',
            earnedAt: new Date(),
            rarity: 'uncommon'
          };
        }
      }
      
      // Update user data
      const updatedUser = {
        ...user,
        inProgressChallenges: updatedChallenges,
        completedChallenges
      };
      
      await updateUserData(updatedUser);
      setUser(updatedUser);
      
      // Add XP
      await addXP(result.xpEarned);
      
      // Add badge if earned
      if (result.badgeEarned) {
        await addBadge(result.badgeEarned);
      }
      
      return result;
      
    } catch (err) {
      console.error('Error completing challenge step:', err);
      throw new Error('Failed to complete challenge step');
    }
  };

  const abandonChallenge = async (challengeId: string) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      // Find and remove the challenge
      const updatedChallenges = user.inProgressChallenges.filter(c => c.challengeId !== challengeId);
      
      // Update user data
      const updatedUser = {
        ...user,
        inProgressChallenges: updatedChallenges
      };
      
      await updateUserData(updatedUser);
      setUser(updatedUser);
      
    } catch (err) {
      console.error('Error abandoning challenge:', err);
      throw new Error('Failed to abandon challenge');
    }
  };

  const getActiveChallenges = (): InProgressChallenge[] => {
    if (!user) return [];
    return user.inProgressChallenges;
  };

  // Level and progression functions
  const getCurrentLevel = (): number => {
    if (!user) return 1;
    return user.level;
  };

  const getNextLevelXP = (): number => {
    if (!user) return 150; // XP for level 2
    
    const nextLevelData = levelSystem.find(level => level.level === user.level + 1);
    return nextLevelData ? nextLevelData.xpRequired : Infinity;
  };

  const getLevelProgress = (): number => {
    if (!user) return 0;
    
    return calculateLevelProgress(user.level, user.xp);
  };

  // Daily streak system
  const updateStreak = async () => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const today = new Date();
      const lastActivity = user.streak?.lastActivity ? new Date(user.streak.lastActivity) : null;
      
      // Check if the streak should be updated
      if (!lastActivity || !isSameDay(lastActivity, today)) {
        const isConsecutiveDay = lastActivity && isDayBefore(lastActivity, today);
        
        const currentStreak = isConsecutiveDay ? (user.streak?.current || 0) + 1 : 1;
        const longestStreak = Math.max(currentStreak, user.streak?.longest || 0);
        
        // Check for streak bonuses
        let bonusXP = 0;
        let bonusBadge: Badge | undefined;
        
        // Streak milestone bonuses
        if (currentStreak === 3) {
          bonusXP = 50;
        } else if (currentStreak === 7) {
          bonusXP = 100;
        } else if (currentStreak === 14) {
          bonusXP = 200;
        } else if (currentStreak === 30) {
          bonusXP = 500;
          bonusBadge = {
            id: 'badge-30-day-streak',
            name: 'Consistency Master',
            description: 'Maintained a 30-day streak',
            icon: 'award',
            earnedAt: new Date(),
            rarity: 'rare'
          };
        } else if (currentStreak === 100) {
          bonusXP = 1000;
          bonusBadge = {
            id: 'badge-100-day-streak',
            name: 'Legendary Consistency',
            description: 'Maintained a 100-day streak',
            icon: 'award',
            earnedAt: new Date(),
            rarity: 'legendary'
          };
        }
        
        // Update user streak data
        const updatedUser = {
          ...user,
          streak: {
            current: currentStreak,
            longest: longestStreak,
            lastActivity: today
          }
        };
        
        await updateUserData(updatedUser);
        setUser(updatedUser);
        
        // Award XP bonus if applicable
        if (bonusXP > 0) {
          await addXP(bonusXP);
        }
        
        // Award badge if applicable
        if (bonusBadge) {
          await addBadge(bonusBadge);
        }
        
        return {
          streakUpdated: true,
          currentStreak,
          bonus: bonusXP > 0 ? {
            xp: bonusXP,
            badge: bonusBadge
          } : undefined
        };
      }
      
      return {
        streakUpdated: false,
        currentStreak: user.streak?.current || 0
      };    } catch (err) {
      console.error('Error updating streak:', err);
      throw new Error('Failed to update streak');
    }
  };
  
  // Helper functions for date comparison
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  };
  
  const isDayBefore = (date1: Date, date2: Date): boolean => {
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const diffInMs = date2.getTime() - date1.getTime();
    return diffInMs > 0 && diffInMs <= oneDayInMs * 2; // Allow for some flexibility
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userStats,
        loading,
        error,
        login,
        logout,
        updateUserProfile,
        addXP,
        addBadge,
        completeQuestionnaire,
        startChallenge,
        completeStep,
        abandonChallenge,
        getActiveChallenges,
        getCurrentLevel,
        getNextLevelXP,
        getLevelProgress,
        updateStreak
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
