import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { CheckCircle, ChevronRight, Moon, Pencil, BarChart3, Star } from 'lucide-react';

const EveningRoutine: React.FC = () => {
  const { user, addXP, improveSkill } = useUser();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [reflections, setReflections] = useState({
    wins: '',
    improvements: '',
    gratitude: ''
  });
  
  const totalSteps = 3;
  
  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeRoutine();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleInputChange = (field: keyof typeof reflections, value: string) => {
    setReflections({
      ...reflections,
      [field]: value
    });
  };
  
  const completeRoutine = () => {
    setCompleted(true);
    addXP(25); // Award XP for completing the routine
    improveSkill('skill-mindset', 10); // Improve mindset skill
  };
  
  if (completed) {
    return (
      <div className="luxury-card p-6">
        <div className="flex flex-col items-center text-center py-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Evening Routine Completed!</h2>
          <p className="text-gray-600 mb-6">
            You've successfully completed your evening reflection routine. 
            You've earned 25 XP and boosted your Mindset skill.
          </p>
          <div className="bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-midnight)] text-white px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center text-sm font-medium">
              <Star className="h-4 w-4 text-[var(--color-gold)] mr-2" />
              <span>+25 XP gained</span>
              <span className="mx-2">•</span>
              <span>Mindset skill +10</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 max-w-md">
            Your reflections have been saved. Tonight, your mind will process these learnings as you sleep,
            strengthening neural pathways for even better performance tomorrow.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="luxury-card p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Evening Reflection Routine</h2>
      <p className="text-gray-600 mb-6">
        This quick reflection routine helps integrate today's experiences and prepare your mind for improvement while you sleep.
      </p>
      
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          ></div>
        </div>
        <span className="text-sm font-medium text-gray-600 ml-4">
          {currentStep + 1} of {totalSteps}
        </span>
      </div>
      
      {/* Step content */}
      <div className="mb-8">
        {currentStep === 0 && (
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-indigo-100 rounded-full p-2 mr-3 flex-shrink-0">
                <Moon className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Step 1: Today's Wins</h3>
            </div>
            <p className="text-gray-700">
              Reflect on 2-3 positive social interactions or personal wins from today, no matter how small.
              Acknowledging your successes reinforces positive neural pathways.
            </p>
            <textarea
              value={reflections.wins}
              onChange={(e) => handleInputChange('wins', e.target.value)}
              placeholder="What went well today? (Example: I maintained eye contact during a difficult conversation...)"
              className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        )}
        
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                <Pencil className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Step 2: Areas for Growth</h3>
            </div>
            <p className="text-gray-700 mb-2">
              Identify 1-2 moments that could have gone better and how you'd improve them next time.
              Frame these as learning opportunities, not failures.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mb-4">
              <p className="text-gray-700 italic text-sm">
                "Rather than 'I failed to approach that person', think 'Next time, I'll take a deep breath first and remember my conversation starters'."
              </p>
            </div>
            <textarea
              value={reflections.improvements}
              onChange={(e) => handleInputChange('improvements', e.target.value)}
              placeholder="What could have gone better, and how will you improve next time?"
              className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-2 mr-3 flex-shrink-0">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Step 3: Gratitude & Tomorrow's Intention</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Express gratitude for something that happened today and set one clear intention for tomorrow.
              This primes your subconscious mind for positivity and purpose.
            </p>
            <textarea
              value={reflections.gratitude}
              onChange={(e) => handleInputChange('gratitude', e.target.value)}
              placeholder="What are you grateful for today? What's your intention for tomorrow?"
              className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        )}
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            currentStep === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium flex items-center"
        >
          {currentStep < totalSteps - 1 ? (
            <>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </>
          ) : (
            'Complete Routine'
          )}
        </button>
      </div>
    </div>
  );
};

export default EveningRoutine;
