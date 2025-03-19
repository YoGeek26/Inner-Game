import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import * as aiService from '../services/aiService';
import { SimulationScenario, ConversationAnalysisResult, Message } from '../types';
import { useUser } from './UserContext';

// Define mock coaches
const mockCoaches = [
  {
    id: 'coach-1',
    name: 'Alex',
    avatar: null,
    personality: 'friendly',
    specialties: ['conversation-skills', 'confidence-building', 'approach-anxiety'],
    introduction: 'I\'m here to help you develop better social and dating skills. I focus on practical advice and step-by-step improvement.'
  },
  {
    id: 'coach-2',
    name: 'Sophia',
    avatar: null,
    personality: 'direct',
    specialties: ['dating-strategy', 'attraction-psychology', 'relationship-building'],
    introduction: 'I specialize in understanding attraction dynamics and building meaningful connections. I\'ll give you straightforward advice without sugarcoating.'
  },
  {
    id: 'coach-3',
    name: 'Eli',
    avatar: null,
    personality: 'analytical',
    specialties: ['body-language', 'social-intelligence', 'emotional-awareness'],
    introduction: 'As your coach, I focus on the science of human interaction and non-verbal communication. I\'ll help you become more socially intelligent.'
  }
];

// Define mock conversations
const mockConversations = [
  {
    id: 'conv-1',
    title: 'Approaching at bars',
    coachId: 'coach-1',
    messages: [],
    createdAt: new Date('2023-09-10'),
    updatedAt: new Date('2023-09-15')
  },
  {
    id: 'conv-2',
    title: 'Dating app strategy',
    coachId: 'coach-2',
    messages: [],
    createdAt: new Date('2023-09-05'),
    updatedAt: new Date('2023-09-08')
  }
];

interface AIContextType {
  isLoading: boolean;
  error: string | null;
  simulateConversation: (scenario: SimulationScenario, userMessage: string) => Promise<string>;
  analyzeConversation: (conversation: string) => Promise<string>;
  getDetailedAnalysis: (conversation: string) => Promise<ConversationAnalysisResult>;
  generateChallenges: (category: string, difficulty: string) => Promise<any[]>;
  getConversationAdvice: (topic: string, skillLevel: number) => Promise<string>;
  getDailyChallenge: () => Promise<any>;
  submitOnboardingData: (data: any) => Promise<void>;
  
  // Chat interface functionality
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  conversations: any[];
  createNewConversation: () => void;
  loadConversation: (id: string) => void;
  currentConversation: any;
  selectedCoach: typeof mockCoaches[0] | null;
  setSelectedCoach: (coach: typeof mockCoaches[0]) => void;
  availableCoaches: typeof mockCoaches;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user, addXP } = useUser();
  
  // Chat interface state
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<any[]>(mockConversations);
  const [currentConversation, setCurrentConversation] = useState<any>(null);
  const [selectedCoach, setSelectedCoach] = useState<typeof mockCoaches[0] | null>(mockCoaches[0]);
  const [availableCoaches] = useState<typeof mockCoaches>(mockCoaches);

  // Initialize a conversation when a coach is selected
  useEffect(() => {
    if (selectedCoach && !currentConversation) {
      createNewConversation();
    }
  }, [selectedCoach]);

  const simulateConversation = async (scenario: SimulationScenario, userMessage: string): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await aiService.simulateConversation(scenario, userMessage);
      
      // Award some XP for using the simulator
      if (user) {
        await addXP(5); // Small XP amount for each interaction
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to simulate conversation';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeConversation = async (conversation: string): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await aiService.analyzeConversation(conversation);
      
      // Award XP for analyzing a conversation
      if (user) {
        await addXP(40);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze conversation';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getDetailedAnalysis = async (conversation: string): Promise<ConversationAnalysisResult> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await aiService.getDetailedAnalysis(conversation);
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get detailed analysis';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const generateChallenges = async (category: string, difficulty: string): Promise<any[]> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await aiService.generateChallenges(category, difficulty);
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate challenges';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getConversationAdvice = async (topic: string, skillLevel: number): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await aiService.getConversationAdvice(topic, skillLevel);
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get conversation advice';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getDailyChallenge = async (): Promise<any> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await aiService.getDailyChallenge();
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get daily challenge';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Add the submitOnboardingData function
  const submitOnboardingData = async (data: any): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Here you would typically send this data to an API
      // For now, we'll just log it and simulate a successful submission
      console.log('Submitting onboarding data:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Award XP for completing onboarding
      if (user) {
        await addXP(100); // Significant XP for completing onboarding
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit onboarding data';
      setError(errorMessage);
      console.error('Error submitting onboarding data:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Chat functionality
  const sendMessage = async (content: string): Promise<void> => {
    try {
      // Add user message to the messages array
      const userMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      
      // Call AI service to get a response
      const aiResponse = await aiService.callOpenAI(
        [...messages, userMessage], 
        user?.isPremium || false
      );
      
      // Add AI response to the messages array
      const aiMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Update conversation if there is one
      if (currentConversation) {
        const updatedConversation = {
          ...currentConversation,
          messages: [...currentConversation.messages, userMessage, aiMessage],
          updatedAt: new Date()
        };
        
        // Update conversation in conversations array
        setConversations(prev => 
          prev.map(conv => 
            conv.id === currentConversation.id ? updatedConversation : conv
          )
        );
        
        setCurrentConversation(updatedConversation);
      }
      
      // Award XP for conversation
      if (user) {
        await addXP(2);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const createNewConversation = () => {
    // Create a new conversation
    const newConversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: 'New Conversation',
      coachId: selectedCoach?.id || 'coach-1',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add to conversations array
    setConversations(prev => [newConversation, ...prev]);
    
    // Set as current conversation
    setCurrentConversation(newConversation);
    
    // Clear messages
    setMessages([]);
  };
  
  const loadConversation = (id: string) => {
    // Find conversation by ID
    const conversation = conversations.find(conv => conv.id === id);
    
    if (conversation) {
      // Set as current conversation
      setCurrentConversation(conversation);
      
      // Load messages from conversation
      setMessages(conversation.messages);
      
      // Ensure coach is selected
      const coach = availableCoaches.find(c => c.id === conversation.coachId);
      if (coach) {
        setSelectedCoach(coach);
      }
    }
  };

  return (
    <AIContext.Provider value={{
      isLoading,
      error,
      simulateConversation,
      analyzeConversation,
      getDetailedAnalysis,
      generateChallenges,
      getConversationAdvice,
      getDailyChallenge,
      submitOnboardingData,
      
      // Chat interface functionality
      messages,
      sendMessage,
      conversations,
      createNewConversation,
      loadConversation,
      currentConversation,
      selectedCoach,
      setSelectedCoach,
      availableCoaches
    }}>
      {children}
    </AIContext.Provider>
  );
};

// Add AIContextProvider as an alias for AIProvider
export const AIContextProvider = AIProvider;

export const useAI = (): AIContextType => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
