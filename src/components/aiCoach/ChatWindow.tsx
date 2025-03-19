import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../../context/UserContext';
import { Message } from '../../types';
import { Send, Sparkles, ArrowRight, Share, BookmarkPlus, Lightbulb, Info, CheckCheck } from 'lucide-react';
import { callOpenAI } from '../../services/aiService'; // Updated import to use aiService instead of api

const ChatWindow: React.FC = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Seduction Coach. I'm here to help you improve your dating skills and confidence. What would you like to work on today?",
      sender: 'assistant',
      timestamp: new Date(),
      isTyping: false
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      isTyping: false
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setNewMessage('');
    setIsAiTyping(true);
    setShowSuggestions(false);
    
    try {
      // Get AI response
      const updatedMessages = [...messages, userMessage];
      const aiResponse = await callOpenAI(updatedMessages, user.level > 10);
      
      // Add AI message
      const aiMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        content: aiResponse,
        sender: 'assistant',
        timestamp: new Date(),
        isTyping: false
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      
      // Show suggestions again after AI responds
      setTimeout(() => {
        setShowSuggestions(true);
      }, 1000);
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Add error message
      const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        sender: 'assistant',
        timestamp: new Date(),
        isTyping: false
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsAiTyping(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleTopicSelect = (topic: string) => {
    setNewMessage(topic);
    setSelectedTopic(topic);
  };
  
  const commonTopics = [
    "How can I approach someone at a bar?",
    "What are good conversation starters?",
    "How do I maintain confidence when dating?",
    "Tips for creating an attractive dating profile?",
    "How to handle rejection gracefully?",
    "What are signs someone is interested in me?"
  ];
  
  const aiContextualTopics = [
    "Tell me about the 3-second rule for approaching",
    "What's the best way to transition from texting to a date?",
    "How do I create sexual tension in conversation?",
    "What body language signals show interest?",
    "How do I recover from an awkward silence?"
  ];

  return (
    <div className="luxury-card h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-gold)] flex items-center justify-center text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="ml-3">
            <h3 className="font-bold text-gray-900">AI Seduction Coach</h3>
            <div className="flex items-center text-xs text-gray-500">
              <span className="flex items-center">
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Active now
              </span>
              <span className="mx-2">•</span>
              <span>Powered by GPT-4o</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Info className="h-5 w-5 text-gray-500" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Share className="h-5 w-5 text-gray-500" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <BookmarkPlus className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-2xl p-4 ${
                message.sender === 'user' 
                  ? 'bg-[var(--color-burgundy)] text-white rounded-tr-none' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
              }`}
            >
              {message.isTyping ? (
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              ) : (
                <div className="prose prose-sm">
                  {message.content.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < message.content.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              )}
              
              {message.sender === 'assistant' && (
                <div className="mt-2 text-xs text-gray-500 flex items-center">
                  <CheckCheck className="h-3 w-3 mr-1" />
                  AI Coach
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isAiTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl p-4 bg-gray-100 text-gray-800 rounded-tl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {showSuggestions && messages.length < 4 && (
        <div className="px-4 py-3 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">
            <Lightbulb className="h-4 w-4 inline mr-1 text-[var(--color-gold)]" />
            What would you like to talk about?
          </p>
          <div className="flex flex-wrap gap-2">
            {commonTopics.map((topic, index) => (
              <button
                key={index}
                onClick={() => handleTopicSelect(topic)}
                className={`px-3 py-1.5 text-sm rounded-full border ${
                  selectedTopic === topic
                    ? 'bg-[var(--color-burgundy)] text-white border-transparent'
                    : 'border-gray-300 hover:bg-gray-100 text-gray-700'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
          
          {user.level >= 5 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Sparkles className="h-4 w-4 mr-1 text-[var(--color-gold)]" />
                Advanced Topics
              </p>
              <div className="flex flex-wrap gap-2">
                {aiContextualTopics.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => handleTopicSelect(topic)}
                    className={`px-3 py-1.5 text-sm rounded-full border ${
                      selectedTopic === topic
                        ? 'bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-gold)] text-white border-transparent'
                        : 'border-gray-300 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-end space-x-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 resize-none border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent"
            rows={1}
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isAiTyping}
            className={`p-2 rounded-full ${
              !newMessage.trim() || isAiTyping
                ? 'bg-gray-200 text-gray-400'
                : 'bg-[var(--color-burgundy)] text-white hover:bg-[var(--color-gold)] transition-colors'
            }`}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        
        {user.level < 10 && (
          <div className="mt-3 bg-amber-50 rounded-lg p-3 text-sm text-amber-800 flex items-start">
            <Sparkles className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
            <div>
              <p className="font-medium">Premium AI Coach</p>
              <p className="text-amber-700">Upgrade to Level 10 for unlimited AI conversations and personalized coaching.</p>
              <button className="mt-2 px-3 py-1 bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-gold)] text-white rounded-lg text-xs font-medium flex items-center">
                <ArrowRight className="h-3 w-3 mr-1" />
                Complete more activities to level up
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
