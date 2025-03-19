import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { useAI } from '../../context/AIContext';
import QuestionnaireButton from './QuestionnaireButton';
import { ChevronRight, ChevronLeft, Check, Award, ChevronRightCircle, X } from 'lucide-react';

interface OnboardingQuestionnaireProps {
  onComplete?: () => void;
}

const OnboardingQuestionnaire: React.FC<OnboardingQuestionnaireProps> = ({ onComplete }) => {
  const { completeQuestionnaire, updateUserProfile } = useUser();
  const { submitOnboardingData } = useAI();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState({
    experienceLevel: '',
    lastInteraction: '',
    challenges: [] as string[],
    attractionStyle: '',
    groupBehavior: '',
    approachedBefore: '',
    conversationLength: '',
    datingApps: '',
    datingAppStruggles: [] as string[],
    goals: [] as string[],
    trainingFrequency: ''
  });
  
  const questions = [
    {
      id: 'experienceLevel',
      question: "How would you describe your dating experience?",
      type: 'single',
      options: [
        { value: 'beginner', label: 'Beginner - I feel lost most of the time' },
        { value: 'novice', label: 'Novice - I have some basics but a lot to learn' },
        { value: 'intermediate', label: 'Intermediate - Occasional successes but not consistent' },
        { value: 'experienced', label: 'Experienced - I succeed often but looking to improve' }
      ]
    },
    {
      id: 'lastInteraction',
      question: "When was the last time you approached someone you were interested in?",
      type: 'single',
      options: [
        { value: 'never', label: 'Never' },
        { value: 'longAgo', label: 'More than 6 months ago' },
        { value: 'recent', label: 'In the last few months' },
        { value: 'veryRecent', label: 'This week' }
      ]
    },
    {
      id: 'challenges',
      question: "What are your biggest dating challenges? (multiple choice)",
      type: 'multiple',
      options: [
        { value: 'approach', label: 'Initial approach' },
        { value: 'conversation', label: 'Maintaining interesting conversation' },
        { value: 'confidence', label: 'Self-confidence' },
        { value: 'reading', label: 'Reading interest signals' },
        { value: 'escalation', label: 'Physical escalation' },
        { value: 'rejection', label: 'Fear of rejection' },
        { value: 'dating', label: 'Getting dates' },
        { value: 'texting', label: 'Messaging conversation' }
      ]
    },
    {
      id: 'attractionStyle',
      question: "Which aspect of your attractiveness do you want to develop the most?",
      type: 'single',
      options: [
        { value: 'humor', label: 'Humor and playfulness' },
        { value: 'confidence', label: 'Confidence and leadership' },
        { value: 'conversation', label: 'Conversation skills' },
        { value: 'nonverbal', label: 'Non-verbal communication' },
        { value: 'sexuality', label: 'Sexual expression' }
      ]
    },
    {
      id: 'goals',
      question: "What are your main goals? (multiple choice)",
      type: 'multiple',
      options: [
        { value: 'dates', label: 'Get more dates' },
        { value: 'confidence', label: 'Develop my social confidence' },
        { value: 'casual', label: 'Casual relationships' },
        { value: 'relationship', label: 'Find a serious relationship' },
        { value: 'skillBuilding', label: 'Improve my overall social skills' },
        { value: 'exPartner', label: 'Win back an ex' }
      ]
    }
  ];
  
  const handleSingleSelect = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const handleMultipleSelect = (questionId: string, value: string) => {
    setAnswers(prev => {
      const currentValues = prev[questionId as keyof typeof prev] as string[];
      
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [questionId]: currentValues.filter(v => v !== value)
        };
      } else {
        return {
          ...prev,
          [questionId]: [...currentValues, value]
        };
      }
    });
  };
  
  const currentQuestion = questions[currentStep];
  
  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final step - submit the questionnaire
      handleFinalSubmit();
    }
  };
  
  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    
    try {
      // Update user profile with questionnaire answers
      updateUserProfile(answers);
      
      // Mark questionnaire as completed
      completeQuestionnaire();
      
      // Try to submit data to AI, but don't block on possible errors
      try {
        submitOnboardingData({
          level: mapExperienceToLevel(answers.experienceLevel),
          goals: answers.goals,
          obstacles: answers.challenges,
          personality: determinePersonalityTraits(answers),
          socialStyle: answers.groupBehavior || answers.attractionStyle,
          dateCompleted: new Date()
        });
      } catch (error) {
        console.error("Error submitting to AI service:", error);
        // Continue anyway - don't block on AI service errors
      }
      
      // Call the onComplete callback to navigate away from questionnaire
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error completing questionnaire:", error);
    } finally {
      // Always mark as complete, even if there was an error
      setIsSubmitting(false);
      completeQuestionnaire();
      
      // Call onComplete again in finally to ensure navigation happens
      if (onComplete) {
        onComplete();
      }
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // We've fixed this function to ensure it works properly
  const skipQuestionnaire = () => {
    console.log("Skip questionnaire clicked");
    
    // Make sure to call completeQuestionnaire from UserContext
    completeQuestionnaire();
    
    // Directly invoke onComplete callback if provided
    if (onComplete) {
      console.log("Calling onComplete callback");
      onComplete();
    }
  };
  
  // Add keyboard shortcut to allow skipping with ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        skipQuestionnaire();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  const isNextDisabled = () => {
    const current = currentQuestion;
    if (current.type === 'single') {
      return !answers[current.id as keyof typeof answers];
    } else if (current.type === 'multiple') {
      const selectedOptions = answers[current.id as keyof typeof answers] as string[];
      return !selectedOptions || selectedOptions.length === 0;
    }
    return false;
  };
  
  // Utility functions for AI data transformation
  const mapExperienceToLevel = (experience: string): 'Beginner' | 'Intermediate' | 'Advanced' => {
    if (experience === 'beginner' || experience === 'novice') return 'Beginner';
    if (experience === 'intermediate') return 'Intermediate';
    return 'Advanced';
  };
  
  const determinePersonalityTraits = (userData: typeof answers): string[] => {
    const traits: string[] = [];
    
    if (userData.groupBehavior === 'introvert') traits.push('introverted');
    if (userData.groupBehavior === 'extrovert') traits.push('extraverted');
    if (userData.challenges.includes('confidence')) traits.push('lacks confidence');
    if (userData.attractionStyle === 'humor') traits.push('humorous');
    if (userData.attractionStyle === 'confidence') traits.push('assertive');
    
    return traits.length > 0 ? traits : ['balanced'];
  };

  return (
    <div className="relative bg-gradient-to-br from-[#f8f8f8] to-[#f3f3f3] p-6 max-w-2xl mx-auto rounded-xl shadow-lg overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-[var(--color-burgundy)] to-transparent opacity-5 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-t from-[var(--color-gold)] to-transparent opacity-5 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>
      
      {/* Skip button at the top - Improved with better positioning and z-index */}
      <div className="flex justify-end mb-2 relative z-50">
        <button
          onClick={skipQuestionnaire}
          type="button"
          className="text-gray-500 text-sm flex items-center hover:text-[var(--color-burgundy)] transition-colors py-2 px-3 rounded hover:bg-gray-100"
        >
          Skip for now
          <ChevronRightCircle className="ml-1 h-4 w-4" />
        </button>
      </div>
      
      <div className="mb-4 relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Personalization Questionnaire</h2>
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {questions.length}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className="bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-gold)] h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-6 relative z-10">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          {currentQuestion.question}
        </h3>
        
        <div className="space-y-3">
          {currentQuestion.type === 'single' && currentQuestion.options.map(option => (
            <QuestionnaireButton
              key={option.value}
              selected={answers[currentQuestion.id as keyof typeof answers] === option.value}
              onClick={() => handleSingleSelect(currentQuestion.id, option.value)}
              label={option.label}
            />
          ))}
          
          {currentQuestion.type === 'multiple' && currentQuestion.options.map(option => (
            <QuestionnaireButton
              key={option.value}
              selected={(answers[currentQuestion.id as keyof typeof answers] as string[])?.includes(option.value)}
              onClick={() => handleMultipleSelect(currentQuestion.id, option.value)}
              label={option.label}
              multiSelect
            />
          ))}
        </div>
      </div>
      
      <div className="flex justify-between relative z-10">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`flex items-center px-4 py-2 rounded-lg ${
            currentStep === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </button>
        
        <button
          onClick={nextStep}
          disabled={isNextDisabled() || isSubmitting}
          className={`flex items-center px-5 py-2 rounded-lg ${
            isNextDisabled() || isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : currentStep === questions.length - 1
                ? 'bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-gold)] text-white hover:opacity-90'
                : 'bg-[var(--color-burgundy)] text-white hover:opacity-90'
          }`}
        >
          {isSubmitting ? (
            'Processing...'
          ) : currentStep === questions.length - 1 ? (
            <>
              Finish
              <Check className="h-4 w-4 ml-1" />
            </>
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </>
          )}
        </button>
      </div>
      
      {currentStep === questions.length - 1 && (
        <div className="mt-6 pt-4 border-t border-gray-200 relative z-10">
          <div className="flex items-start">
            <div className="bg-amber-100 rounded-full p-2 mr-3">
              <Award className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Unlock your personalized experience</h4>
              <p className="text-sm text-gray-600 mt-1">
                By completing this questionnaire, our AI will specifically adapt its coaching to your profile and goals.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingQuestionnaire;
