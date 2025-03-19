import axios from 'axios';
import { SimulationScenario, ConversationAnalysisResult, Message } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Call OpenAI API through our backend proxy
export const callOpenAI = async (messages: Message[], isPremium: boolean): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/ai/chat`, {
      messages: messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      isPremium
    });
    
    return response.data.message;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw new Error('Failed to generate AI response');
  }
};

// Simulate a conversation with a specific scenario
export const simulateConversation = async (scenario: SimulationScenario, userMessage: string): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/ai/simulate`, {
      scenario,
      userMessage
    });
    
    return response.data.response;
  } catch (error) {
    console.error('Error in conversation simulation:', error);
    throw new Error('Failed to simulate conversation');
  }
};

// Analyze a conversation history
export const analyzeConversation = async (conversation: string): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/ai/analyze`, {
      conversation
    });
    
    return response.data.analysis;
  } catch (error) {
    console.error('Error analyzing conversation:', error);
    throw new Error('Failed to analyze conversation');
  }
};

// Get detailed conversation analysis with structured data
export const getDetailedAnalysis = async (conversation: string): Promise<ConversationAnalysisResult> => {
  try {
    const response = await axios.post(`${API_URL}/ai/analyze/detailed`, {
      conversation
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting detailed analysis:', error);
    throw new Error('Failed to get detailed conversation analysis');
  }
};

// Generate personalized challenges
export const generateChallenges = async (category: string, difficulty: string): Promise<any[]> => {
  try {
    const response = await axios.post(`${API_URL}/ai/challenges/generate`, {
      category,
      difficulty
    });
    
    return response.data.challenges;
  } catch (error) {
    console.error('Error generating challenges:', error);
    throw new Error('Failed to generate challenges');
  }
};

// Get conversation advice on a specific topic
export const getConversationAdvice = async (topic: string, skillLevel: number): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/ai/advice`, {
      topic,
      skillLevel
    });
    
    return response.data.advice;
  } catch (error) {
    console.error('Error getting conversation advice:', error);
    throw new Error('Failed to get conversation advice');
  }
};

// Get a daily challenge suggestion
export const getDailyChallenge = async (): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/ai/challenges/daily`);
    
    return response.data.challenge;
  } catch (error) {
    console.error('Error getting daily challenge:', error);
    throw new Error('Failed to get daily challenge');
  }
};

// Créer un objet de service qui regroupe toutes les fonctions
const aiService = {
  callOpenAI,
  simulateConversation,
  analyzeConversation,
  getDetailedAnalysis,
  generateChallenges,
  getConversationAdvice,
  getDailyChallenge
};

// Exporter l'objet de service comme export par défaut
export default aiService;
