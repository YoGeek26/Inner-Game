import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { CheckCircle, ChevronRight, Sun, Sparkles, Brain, Shield, Star } from 'lucide-react';

const MorningRoutine: React.FC = () => {
  const { user, addXP, improveSkill } = useUser();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [affirmations, setAffirmations] = useState<string[]>([
    "I am naturally confident in all social situations",
    "People are drawn to my authentic self-expression",
    "I add value to every interaction and conversation",
    "I am deserving of amazing connections and relationships",
    "I approach with confidence, regardless of the outcome"
  ]);
  const [customAffirmation, setCustomAffirmation] = useState<string>("");
  
  const totalSteps = 4;
  
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
  
  const addCustomAffirmation = () => {
    if (customAffirmation.trim()) {
      setAffirmations([...affirmations, customAffirmation]);
      setCustomAffirmation("");
    }
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
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Morning Routine Completed!</h2>
          <p className="text-gray-600 mb-6">
            You've successfully completed your morning power routine. 
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
            Continue your day with confidence and purpose. Remember that consistency 
            is key - come back tomorrow for another morning boost!
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="luxury-card p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Morning Power Routine</h2>
      <p className="text-gray-600 mb-6">
        Complete this 5-minute routine to start your day with confidence and powerful energy.
      </p>
      
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-gold)] h-2 rounded-full transition-all duration-300"
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
              <div className="bg-amber-100 rounded-full p-2 mr-3 flex-shrink-0">
                <Sun className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Step 1: Center Yourself</h3>
            </div>
            <p className="text-gray-700">
              Take 10 deep breaths. Inhale for 4 counts, hold for 2, exhale for 6. 
              Clear your mind and focus only on your breathing.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-600 italic text-sm">
                "Begin right now. Close your eyes if possible. Breathe in... hold... and exhale slowly. 
                Feel your body becoming more relaxed and your mind becoming clearer with each breath."
              </p>
            </div>
          </div>
        )}
        
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                <Brain className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Step 2: Daily Affirmations</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Read each affirmation below out loud. Feel the truth of these statements as you say them.
              You can also add your own personal affirmations.
            </p>
            <div className="space-y-3 mb-4">
              {affirmations.map((affirmation, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-700"
                >
                  {affirmation}
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={customAffirmation}
                onChange={(e) => setCustomAffirmation(e.target.value)}
                placeholder="Add your own affirmation..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
              />
              <button
                onClick={addCustomAffirmation}
                disabled={!customAffirmation.trim()}
                className="px-4 py-2 bg-[var(--color-burgundy)] text-white rounded-lg disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-2 mr-3 flex-shrink-0">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Step 3: Visualization</h3>
            </div>
            <p className="text-gray-700 mb-2">
              Spend 60 seconds visualizing yourself succeeding in a challenging social situation today.
              Make it as vivid and detailed as possible.
            </p>
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-100 mb-4">
              <p className="text-gray-700 italic text-sm">
                "Imagine yourself approaching someone with complete confidence. Notice your relaxed body language, 
                hear your calm and assured voice, see their positive response to you. Feel the confidence flowing through you."
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Pro tip:</span> For maximum effectiveness, engage all your senses in the visualization. 
                What do you see, hear, and feel in this successful interaction?
              </p>
            </div>
          </div>
        )}
        
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Step 4: Set Your Intention</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Choose one specific intention to focus on today. This will guide your social interactions and keep you centered.
            </p>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg bg-white">
                <input type="radio" name="intention" className="mr-3" />
                <div>
                  <span className="font-medium text-gray-900">Be fully present</span>
                  <p className="text-sm text-gray-600">I will be completely present in every conversation today</p>
                </div>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg bg-white">
                <input type="radio" name="intention" className="mr-3" />
                <div>
                  <span className="font-medium text-gray-900">Take social risks</span>
                  <p className="text-sm text-gray-600">I will step out of my comfort zone at least twice today</p>
                </div>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg bg-white">
                <input type="radio" name="intention" className="mr-3" />
                <div>
                  <span className="font-medium text-gray-900">Express authenticity</span>
                  <p className="text-sm text-gray-600">I will express my genuine thoughts and feelings without filters</p>
                </div>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg bg-white">
                <input type="radio" name="intention" className="mr-3" />
                <div>
                  <span className="font-medium text-gray-900">Bring positive energy</span>
                  <p className="text-sm text-gray-600">I will be the most positive person in every room today</p>
                </div>
              </label>
            </div>
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
          className="px-6 py-2 bg-[var(--color-burgundy)] text-white rounded-lg text-sm font-medium flex items-center"
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

export default MorningRoutine;
