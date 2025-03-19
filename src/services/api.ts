import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const register = async (userData: { name: string; email: string; password: string }) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const login = async (userData: { email: string; password: string }) => {
  const response = await api.post('/auth/login', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Users API
export const getUserProgress = async () => {
  const response = await api.get('/users/progress');
  return response.data;
};

export const addJournalEntry = async (entryData: { 
  thoughts: string; 
  emotions: string[]; 
  successes: string[]; 
  challenges: string[] 
}) => {
  const response = await api.post('/users/journal', entryData);
  return response.data;
};

export const updateUserChallenge = async (challengeData: { 
  challengeId: string; 
  completed: boolean 
}) => {
  const response = await api.put('/users/challenges', challengeData);
  return response.data;
};

export const updateUserProfile = async (profileData: { 
  name: string; 
  email: string 
}) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

export const updateUserQuestionnaire = async (data: { 
  hasCompletedQuestionnaire: boolean 
}) => {
  const response = await api.put('/users/questionnaire', data);
  return response.data;
};

export const updateUserXP = async (data: { xpAmount: number }) => {
  const response = await api.put('/users/xp', data);
  return response.data;
};

export const updateUserStreak = async () => {
  const response = await api.put('/users/streak');
  return response.data;
};

export const getUserSkills = async () => {
  const response = await api.get('/users/skills');
  return response.data;
};

export const updateUserSkill = async (skillData: { 
  skillId: string; 
  level: number 
}) => {
  const response = await api.put('/users/skills', skillData);
  return response.data;
};

export const getUserBadges = async () => {
  const response = await api.get('/users/badges');
  return response.data;
};

export const awardUserBadge = async (data: { badgeId: string }) => {
  const response = await api.post('/users/badges', data);
  return response.data;
};

// Challenges API
export const getAllChallenges = async () => {
  const response = await api.get('/challenges');
  return response.data;
};

export const getChallengeById = async (id: string) => {
  const response = await api.get(`/challenges/${id}`);
  return response.data;
};

export const getUserChallenges = async () => {
  const response = await api.get('/challenges/user/challenges');
  return response.data;
};

export const addChallenge = async (challengeData: {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  steps: string[];
  xp_reward: number;
  time_estimate?: string;
  required_level?: number;
}) => {
  const response = await api.post('/challenges', challengeData);
  return response.data;
};

export const updateChallenge = async (id: string, challengeData: any) => {
  const response = await api.put(`/challenges/${id}`, challengeData);
  return response.data;
};

export const deleteChallenge = async (id: string) => {
  const response = await api.delete(`/challenges/${id}`);
  return response.data;
};

// Articles API
export const getAllArticles = async (category?: string) => {
  const params = category ? { category } : {};
  const response = await api.get('/articles', { params });
  return response.data;
};

export const getArticleById = async (id: string) => {
  const response = await api.get(`/articles/${id}`);
  return response.data;
};

export const addArticle = async (articleData: {
  title: string;
  content: string;
  category: string;
  author: string;
  image_url?: string;
}) => {
  const response = await api.post('/articles', articleData);
  return response.data;
};

export const updateArticle = async (id: string, articleData: any) => {
  const response = await api.put(`/articles/${id}`, articleData);
  return response.data;
};

export const deleteArticle = async (id: string) => {
  const response = await api.delete(`/articles/${id}`);
  return response.data;
};

// AI API
export const getAiResponse = async (data: { 
  message: string;
  conversationId?: string;
}) => {
  const response = await api.post('/ai/chat', data);
  return response.data;
};

export const createConversation = async (data: { title?: string }) => {
  const response = await api.post('/ai/conversations', data);
  return response.data;
};

export const getConversations = async () => {
  const response = await api.get('/ai/conversations');
  return response.data;
};

export const getConversationMessages = async (id: string) => {
  const response = await api.get(`/ai/conversations/${id}`);
  return response.data;
};

export const addMessageToConversation = async (id: string, data: { 
  content: string;
  role: string;
}) => {
  const response = await api.post(`/ai/conversations/${id}/messages`, data);
  return response.data;
};

export default api;
