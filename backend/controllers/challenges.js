import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Get all challenges
// @route   GET /api/challenges
export const getAllChallenges = async (req, res) => {
  try {
    // Query params for filtering
    const category = req.query.category;
    const difficulty = req.query.difficulty;
    const userId = req.user.id;
    
    // Get challenges collection
    const challenges = await db.collection('challenges').find({}).toArray();
    
    // Get user data to check completed/locked challenges
    const user = await db.collection('users').findOne({ _id: userId });
    
    // Apply filters if specified
    let filteredChallenges = challenges;
    
    if (category && category !== 'all') {
      filteredChallenges = filteredChallenges.filter(challenge => challenge.category === category);
    }
    
    if (difficulty && difficulty !== 'all') {
      filteredChallenges = filteredChallenges.filter(challenge => challenge.difficulty === difficulty);
    }
    
    // Augment challenges with completion/locked status
    const augmentedChallenges = filteredChallenges.map(challenge => {
      const isCompleted = user.completedChallenges.includes(challenge.id);
      const isLocked = challenge.requiredLevel && user.level < challenge.requiredLevel;
      
      // Check if challenge is in progress
      const inProgress = user.inProgressChallenges.find(c => c.challengeId === challenge.id);
      const currentStep = inProgress ? inProgress.currentStep : 0;
      
      return {
        ...challenge,
        isCompleted,
        isLocked,
        inProgress: !!inProgress,
        currentStep: inProgress ? currentStep : 0
      };
    });
    
    res.json(augmentedChallenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
};

// @desc    Get a single challenge
// @route   GET /api/challenges/:id
export const getChallenge = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const userId = req.user.id;
    
    // Get challenge data
    const challenge = await db.collection('challenges').findOne({ id: challengeId });
    
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    // Get user data to check completion status
    const user = await db.collection('users').findOne({ _id: userId });
    
    // Determine challenge status
    const isCompleted = user.completedChallenges.includes(challengeId);
    const isLocked = challenge.requiredLevel && user.level < challenge.requiredLevel;
    
    // Check if challenge is in progress
    const inProgressChallenge = user.inProgressChallenges.find(c => c.challengeId === challengeId);
    
    const augmentedChallenge = {
      ...challenge,
      isCompleted,
      isLocked,
      inProgress: !!inProgressChallenge,
      currentStep: inProgressChallenge ? inProgressChallenge.currentStep : 0,
      steps: challenge.steps.map((step, index) => {
        // Mark steps as completed if the challenge is in progress
        if (inProgressChallenge) {
          const stepInProgress = inProgressChallenge.steps.find(s => s.stepId === step.id);
          return {
            ...step,
            isCompleted: stepInProgress ? stepInProgress.isCompleted : false,
            completedAt: stepInProgress && stepInProgress.isCompleted ? stepInProgress.completedAt : null
          };
        }
        
        // If challenge is completed, mark all steps as completed
        if (isCompleted) {
          return {
            ...step,
            isCompleted: true,
            completedAt: null // We don't have this data
          };
        }
        
        return {
          ...step,
          isCompleted: false
        };
      })
    };
    
    res.json(augmentedChallenge);
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({ error: 'Failed to fetch challenge' });
  }
};

// @desc    Start a challenge
// @route   POST /api/challenges/:id/start
export const startChallenge = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const userId = req.user.id;
    
    // Get challenge data
    const challenge = await db.collection('challenges').findOne({ id: challengeId });
    
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    // Get user data
    const user = await db.collection('users').findOne({ _id: userId });
    
    // Check if challenge is already completed or in progress
    if (user.completedChallenges.includes(challengeId)) {
      return res.status(400).json({ error: 'Challenge already completed' });
    }
    
    if (user.inProgressChallenges.some(c => c.challengeId === challengeId)) {
      return res.status(400).json({ error: 'Challenge already in progress' });
    }
    
    // Check if challenge is locked
    if (challenge.requiredLevel && user.level < challenge.requiredLevel) {
      return res.status(403).json({ error: 'Challenge is locked. Reach the required level first.' });
    }
    
    // Create in-progress challenge
    const newInProgressChallenge = {
      challengeId,
      startedAt: new Date(),
      currentStep: 0,
      steps: challenge.steps.map(step => ({
        stepId: step.id,
        isCompleted: false
      }))
    };
    
    // Update user data
    await db.collection('users').updateOne(
      { _id: userId },
      { $push: { inProgressChallenges: newInProgressChallenge } }
    );
    
    res.status(201).json({ 
      message: 'Challenge started successfully',
      challenge: {
        ...challenge,
        isCompleted: false,
        isLocked: false,
        inProgress: true,
        currentStep: 0
      }
    });
  } catch (error) {
    console.error('Error starting challenge:', error);
    res.status(500).json({ error: 'Failed to start challenge' });
  }
};

// @desc    Complete a challenge step
// @route   POST /api/challenges/:id/steps/:stepId/complete
export const completeStep = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const stepId = req.params.stepId;
    const userId = req.user.id;
    
    // Get user data
    const user = await db.collection('users').findOne({ _id: userId });
    
    // Check if challenge is in progress
    const challengeIndex = user.inProgressChallenges.findIndex(c => c.challengeId === challengeId);
    
    if (challengeIndex === -1) {
      return res.status(404).json({ error: 'Challenge not found or not in progress' });
    }
    
    const challenge = user.inProgressChallenges[challengeIndex];
    
    // Check if step exists and is not already completed
    const stepIndex = challenge.steps.findIndex(s => s.stepId === stepId);
    
    if (stepIndex === -1) {
      return res.status(404).json({ error: 'Step not found' });
    }
    
    if (challenge.steps[stepIndex].isCompleted) {
      return res.status(400).json({ error: 'Step already completed' });
    }
    
    // Get challenge data for XP and badge rewards
    const challengeData = await db.collection('challenges').findOne({ id: challengeId });
    
    if (!challengeData) {
      return res.status(404).json({ error: 'Challenge data not found' });
    }
    
    // Calculate XP reward for this step
    const stepXP = challengeData.steps[stepIndex].xpReward || 25; // Default 25 XP per step
    
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
    
    // Prepare response data
    const result = {
      stepCompleted: true,
      challengeCompleted: allStepsCompleted,
      xpEarned: stepXP,
      badgeEarned: null
    };
    
    // If challenge is completed, add completion bonus
    if (allStepsCompleted) {
      // Add challenge completion XP
      result.xpEarned += challengeData.xpReward || 100;
      
      // Check for badge reward
      if (challengeData.badgeReward) {
        const badge = {
          id: challengeData.badgeReward.id,
          name: challengeData.badgeReward.name,
          description: `Earned by completing the ${challengeData.title} challenge`,
          icon: challengeData.badgeReward.icon,
          rarity: challengeData.badgeReward.rarity || 'common',
          earnedAt: new Date()
        };
        
        // Add badge to user
        await db.collection('users').updateOne(
          { _id: userId },
          { $push: { badges: badge } }
        );
        
        result.badgeEarned = badge;
      }
      
      // Move challenge to completed challenges
      await db.collection('users').updateOne(
        { _id: userId },
        { 
          $pull: { inProgressChallenges: { challengeId } },
          $push: { completedChallenges: challengeId }
        }
      );
    } else {
      // Update in-progress challenge
      await db.collection('users').updateOne(
        { _id: userId, "inProgressChallenges.challengeId": challengeId },
        { 
          $set: { 
            "inProgressChallenges.$.steps": updatedSteps,
            "inProgressChallenges.$.currentStep": currentStep
          }
        }
      );
    }
    
    // Add XP to user
    await db.collection('users').updateOne(
      { _id: userId },
      { $inc: { xp: result.xpEarned } }
    );
    
    // Check if user leveled up
    const levelSystem = [
      { level: 1, xpRequired: 0 },
      { level: 2, xpRequired: 150 },
      { level: 3, xpRequired: 400 },
      { level: 4, xpRequired: 800 },
      { level: 5, xpRequired: 1500 },
      { level: 6, xpRequired: 2500 },
      { level: 7, xpRequired: 4000 },
      { level: 8, xpRequired: 6000 },
      { level: 9, xpRequired: 8500 },
      { level: 10, xpRequired: 11500 },
      // ... more levels ...
    ];
    
    const newTotalXP = user.xp + result.xpEarned;
    const currentLevel = user.level;
    let newLevel = currentLevel;
    
    for (let i = 0; i < levelSystem.length; i++) {
      if (levelSystem[i].level > currentLevel && newTotalXP >= levelSystem[i].xpRequired) {
        newLevel = levelSystem[i].level;
      }
    }
    
    if (newLevel > currentLevel) {
      await db.collection('users').updateOne(
        { _id: userId },
        { $set: { level: newLevel } }
      );
      
      result.levelUp = true;
      result.newLevel = newLevel;
    }
    
    // Update streak if it hasn't been updated today
    const today = new Date();
    const lastActivityDate = user.streak?.lastActivity ? new Date(user.streak.lastActivity) : null;
    
    if (!lastActivityDate || !isSameDay(lastActivityDate, today)) {
      const isConsecutiveDay = lastActivityDate && isDayBefore(lastActivityDate, today);
      const currentStreak = isConsecutiveDay ? (user.streak?.current || 0) + 1 : 1;
      const longestStreak = Math.max(currentStreak, user.streak?.longest || 0);
      
      await db.collection('users').updateOne(
        { _id: userId },
        { 
          $set: { 
            "streak.current": currentStreak,
            "streak.longest": longestStreak,
            "streak.lastActivity": today
          }
        }
      );
      
      result.streakUpdated = true;
      result.currentStreak = currentStreak;
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error completing challenge step:', error);
    res.status(500).json({ error: 'Failed to complete challenge step' });
  }
};

// @desc    Abandon a challenge
// @route   DELETE /api/challenges/:id/abandon
export const abandonChallenge = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const userId = req.user.id;
    
    // Check if challenge is in progress
    const user = await db.collection('users').findOne({ _id: userId });
    const challengeExists = user.inProgressChallenges.some(c => c.challengeId === challengeId);
    
    if (!challengeExists) {
      return res.status(404).json({ error: 'Challenge not found or not in progress' });
    }
    
    // Remove challenge from in-progress challenges
    await db.collection('users').updateOne(
      { _id: userId },
      { $pull: { inProgressChallenges: { challengeId } } }
    );
    
    res.json({ message: 'Challenge abandoned successfully' });
  } catch (error) {
    console.error('Error abandoning challenge:', error);
    res.status(500).json({ error: 'Failed to abandon challenge' });
  }
};

// @desc    Get all challenge categories
// @route   GET /api/challenges/categories
export const getCategories = async (req, res) => {
  try {
    const categories = [
      { id: 'approaching', name: 'Approaching', icon: 'users' },
      { id: 'conversation', name: 'Conversation', icon: 'message-square' },
      { id: 'dating', name: 'Dating', icon: 'calendar' },
      { id: 'inner-game', name: 'Inner Game', icon: 'target' },
      { id: 'texting', name: 'Texting', icon: 'message-circle' }
    ];
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// @desc    Get user's challenge progress
// @route   GET /api/challenges/progress
export const getChallengeProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user data
    const user = await db.collection('users').findOne({ _id: userId });
    
    // Get all challenges for reference
    const allChallenges = await db.collection('challenges').find({}).toArray();
    
    // Calculate statistics
    const stats = {
      completed: user.completedChallenges.length,
      inProgress: user.inProgressChallenges.length,
      totalXPEarned: calculateChallengeXP(user.completedChallenges, allChallenges),
      streak: user.streak?.current || 0,
      categories: calculateCategoryCompletion(user.completedChallenges, allChallenges)
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching challenge progress:', error);
    res.status(500).json({ error: 'Failed to fetch challenge progress' });
  }
};

// Helper function to calculate XP earned from challenges
const calculateChallengeXP = (completedChallengeIds, allChallenges) => {
  let totalXP = 0;
  
  completedChallengeIds.forEach(id => {
    const challenge = allChallenges.find(c => c.id === id);
    if (challenge) {
      totalXP += challenge.xpReward || 0;
      // Add XP from steps
      challenge.steps.forEach(step => {
        totalXP += step.xpReward || 25; // Default 25 XP per step
      });
    }
  });
  
  return totalXP;
};

// Helper function to calculate completion by category
const calculateCategoryCompletion = (completedChallengeIds, allChallenges) => {
  // Group challenges by category
  const challengesByCategory = allChallenges.reduce((acc, challenge) => {
    if (!acc[challenge.category]) {
      acc[challenge.category] = [];
    }
    acc[challenge.category].push(challenge);
    return acc;
  }, {});
  
  // Calculate completion for each category
  const categoryStats = {};
  
  Object.keys(challengesByCategory).forEach(category => {
    const totalInCategory = challengesByCategory[category].length;
    const completedInCategory = challengesByCategory[category].filter(
      challenge => completedChallengeIds.includes(challenge.id)
    ).length;
    
    categoryStats[category] = {
      total: totalInCategory,
      completed: completedInCategory,
      percentage: Math.round((completedInCategory / totalInCategory) * 100)
    };
  });
  
  return categoryStats;
};

// Helper functions for date comparison
const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
};

const isDayBefore = (date1, date2) => {
  const oneDayInMs = 24 * 60 * 60 * 1000;
  const diffInMs = date2.getTime() - date1.getTime();
  return diffInMs > 0 && diffInMs <= oneDayInMs * 2; // Allow for some flexibility
};
