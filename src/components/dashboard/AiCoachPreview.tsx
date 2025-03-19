import React, { useState, useEffect } from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AIService from '../../services/aiService'; // Import the service directly
import { useUser } from '../../context/UserContext';

const AiCoachPreview: React.FC = () => {
  const [previewMessage, setPreviewMessage] = useState<string>("Would you like me to review your last conversation and suggest improvements?");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useUser();

  useEffect(() => {
    // Get a sample preview message when component mounts
    const getPreviewMessage = async () => {
      try {
        setIsLoading(true);
        // Create a sample message to get a preview response
        const sampleMessages = [
          {
            id: 'preview-1',
            content: 'How can I improve my confidence?',
            sender: 'user',
            timestamp: new Date()
          }
        ];
        
        // Get a preview response using our AIService
        const response = await AIService.callOpenAI(sampleMessages, user?.isPremium || false);
        
        // Use just the first sentence for the preview
        const firstSentence = response.split('.')[0] + '.';
        setPreviewMessage(firstSentence);
      } catch (error) {
        console.error('Error getting preview message:', error);
        // Fallback to default message if there's an error
        setPreviewMessage("Would you like me to help improve your social and dating skills?");
      } finally {
        setIsLoading(false);
      }
    };
    
    getPreviewMessage();
  }, [user?.isPremium]);

  return (
    <div className="luxury-card overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-900">Your AI Coach</h2>
          <div className="bg-blue-100 rounded-full p-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">Get personalized advice and feedback from your AI seduction coach</p>
        
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              {isLoading ? (
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              ) : (
                <p className="text-gray-800">{previewMessage}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Powered by OpenAI GPT-4o</p>
            </div>
          </div>
        </div>
        
        <Link 
          to="/ai-coach" 
          className="inline-flex items-center px-4 py-2 luxury-gradient text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Talk to Your Coach
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default AiCoachPreview;
