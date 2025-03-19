import React, { useState, useRef, useEffect } from 'react';
import { SimulationScenario } from '../../types';
import { useAI } from '../../context/AIContext';
import { useUser } from '../../context/UserContext';
import { Send, User, BarChart4, Clock, Award, MessageCircle, Zap } from 'lucide-react';

interface ConversationSimulatorProps {
  scenario: SimulationScenario;
  onComplete: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'character';
  characterId?: string;
  timestamp: Date;
}

const ConversationSimulator: React.FC<ConversationSimulatorProps> = ({ scenario, onComplete }) => {
  const { simulateConversation, isLoading } = useAI();
  const { user, addXP } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showTips, setShowTips] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [simulationScore, setSimulationScore] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Start the conversation with a contextual message
  useEffect(() => {
    const character = scenario.characters[0];
    const initialMessage: Message = {
      id: `char-init-${Date.now()}`,
      text: getInitialMessage(),
      sender: 'character',
      characterId: character.id,
      timestamp: new Date()
    };
    
    setMessages([initialMessage]);
  }, [scenario]);
  
  const getInitialMessage = (): string => {
    // Generate a contextual first message based on the scenario
    const character = scenario.characters[0];
    
    // Coffee shop scenario
    if (scenario.context.includes('coffee shop')) {
      return `*${character.name} glances up from their laptop as you approach*\nOh, hi there.`;
    }
    
    // Bar scenario
    if (scenario.context.includes('bar')) {
      return `*${character.name} makes eye contact with you across the bar*\n*They smile slightly before looking away*`;
    }
    
    // Dating app scenario
    if (scenario.context.includes('dating app')) {
      return `*You've matched with ${character.name}*\nHey! Nice to match with you. Your profile caught my eye.`;
    }
    
    // Group scenario
    if (scenario.context.includes('group')) {
      return `*You approach the group conversation*\n*${character.name} notices you and makes space in the circle*\nHey there! We were just talking about the best travel spots. Have you traveled much?`;
    }
    
    // Default generic opener
    return `*You approach ${character.name}*\nHi there!`;
  };
  
  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    
    try {
      // Get AI response
      const character = scenario.characters[0];
      const response = await simulateConversation(scenario, currentMessage);
      
      // Add character message
      const characterMessage: Message = {
        id: `char-${Date.now()}`,
        text: response,
        sender: 'character',
        characterId: character.id,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, characterMessage]);
      
      // Check if we should provide feedback
      if (messages.length >= 6) {
        const feedbackChance = Math.random();
        if (feedbackChance > 0.7) {
          generateFeedback();
        }
      }
      
      // Check if conversation should end (e.g., after X messages)
      if (messages.length >= 14) {
        handleComplete();
      }
      
    } catch (error) {
      console.error('Error getting response:', error);
      // Handle error - could show an error message
    }
  };
  
  const generateFeedback = () => {
    // In a real app, this would analyze the conversation and provide specific feedback
    const feedbackOptions = [
      "Try asking an open-ended question to learn more about them.",
      "Great job showing interest! Consider sharing something about yourself next.",
      "This is a good moment to suggest a specific activity or date.",
      "Try using some playful banter to create attraction.",
      "Good conversation flow! Keep balancing questions with statements."
    ];
    
    setFeedback(feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)]);
    
    // Auto-hide feedback after 8 seconds
    setTimeout(() => {
      setFeedback(null);
    }, 8000);
  };
  
  const handleComplete = () => {
    // Calculate a score based on the conversation
    const score = Math.floor(Math.random() * 30) + 70; // 70-100 range for demo
    setSimulationScore(score);
    setIsCompleted(true);
    
    // Award XP 
    if (user) {
      const xpAmount = scenario.completionXP || 75;
      addXP(xpAmount);
    }
  };
  
  const renderCharacterAvatar = (characterId: string) => {
    const character = scenario.characters.find(c => c.id === characterId);
    if (!character) return null;
    
    return (
      <div className="flex-shrink-0 mr-3">
        <img 
          src={character.avatar} 
          alt={character.name} 
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
    );
  };
  
  const renderCompletionScreen = () => {
    if (!simulationScore) return null;
    
    return (
      <div className="mt-6 p-5 bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-midnight)] rounded-lg text-white">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-1">Simulation Complete!</h3>
          <p className="text-gray-200">You've completed the "{scenario.title}" simulation.</p>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white rounded-full p-3">
              <BarChart4 className="h-6 w-6 text-[var(--color-burgundy)]" />
            </div>
          </div>
          
          <div className="text-center">
            <h4 className="font-medium mb-2">Your Score</h4>
            <div className="text-4xl font-bold mb-2">{simulationScore}</div>
            <div className="text-sm text-gray-200">
              {simulationScore >= 90 ? 'Outstanding!' : 
               simulationScore >= 80 ? 'Great job!' :
               simulationScore >= 70 ? 'Good effort!' :
               'Keep practicing!'}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-sm text-gray-200 mb-1">Messages Exchanged</div>
            <div className="text-xl font-bold">{messages.length}</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-sm text-gray-200 mb-1">XP Earned</div>
            <div className="text-xl font-bold">+{scenario.completionXP || 75}</div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-3">
          <button 
            onClick={() => onComplete()}
            className="px-4 py-2 bg-white text-[var(--color-burgundy)] rounded-lg font-medium flex items-center"
          >
            <Award className="h-4 w-4 mr-2" />
            Claim Reward
          </button>
          
          <button 
            onClick={() => {
              setMessages([messages[0]]); // Reset to just initial message
              setIsCompleted(false);
              setSimulationScore(null);
            }}
            className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium flex items-center"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="luxury-card">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {scenario.title}
        </h2>
        <p className="text-gray-600">
          {scenario.description}
        </p>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-1">Context</h3>
            <p className="text-gray-600 text-sm">{scenario.context}</p>
          </div>
        </div>
        
        {showTips && (
          <div className="mb-4 bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Zap className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900 mb-1">Simulation Tips</h3>
                <p className="text-blue-700 text-sm mb-2">
                  This is a safe environment to practice your conversation skills. Try to:
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Ask engaging questions that can't be answered with yes/no</li>
                  <li>• Share relevant details about yourself to create connection</li>
                  <li>• Listen to their responses and follow up on details they mention</li>
                  <li>• Be authentic and respectful in your approach</li>
                </ul>
                <button 
                  onClick={() => setShowTips(false)}
                  className="text-xs text-blue-600 underline mt-2"
                >
                  Hide tips
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-4 bg-white rounded-lg border border-gray-200 h-96 overflow-y-auto p-4">
          <div className="space-y-3">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'items-start'}`}
              >
                {message.sender === 'character' && message.characterId && renderCharacterAvatar(message.characterId)}
                
                <div 
                  className={`px-4 py-3 rounded-lg max-w-[80%] ${
                    message.sender === 'user' 
                      ? 'bg-[var(--color-burgundy)] text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">
                    {message.text}
                  </div>
                  <div className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                {message.sender === 'user' && (
                  <div className="flex-shrink-0 ml-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {feedback && (
          <div className="mb-4 bg-amber-50 rounded-lg p-3 border border-amber-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Zap className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
              </div>
              <div>
                <h3 className="font-medium text-amber-900 mb-1">Coach Feedback</h3>
                <p className="text-amber-700 text-sm">{feedback}</p>
              </div>
            </div>
          </div>
        )}
        
        {!isCompleted ? (
          <div className="flex space-x-2">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isLoading}
              className={`px-4 py-3 rounded-lg ${
                !currentMessage.trim() || isLoading
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[var(--color-burgundy)] text-white'
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        ) : (
          renderCompletionScreen()
        )}
      </div>
    </div>
  );
};

export default ConversationSimulator;
