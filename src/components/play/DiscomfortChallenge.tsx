import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { ChevronRight, CheckCircle, Zap, Clock, Star, Target, Users, ArrowRight, ArrowLeft, MessageCircle, Award } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';

const DiscomfortChallenge: React.FC = () => {
  const { user, addXP } = useUser();
  const [activeChallenge, setActiveChallenge] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Mock challenge data
  const challenges = [
    {
      id: 1,
      title: "Rejection Therapy",
      description: "Get rejected once per day for 5 days to become desensitized to rejection",
      category: "inner-game",
      levels: 3,
      currentLevel: 1,
      progressPercent: 20,
      steps: [
        "Ask for a discount at a store or coffee shop",
        "Ask someone to take a photo of you in a public place",
        "Ask a stranger for a small favor",
        "Invite someone you know but rarely talk to for coffee",
        "Ask for a phone number from someone you find attractive"
      ],
      benefits: [
        "Reduced fear of rejection",
        "Increased social confidence",
        "Better ability to handle 'no'"
      ],
      xpReward: 200
    },
    {
      id: 2,
      title: "Eye Contact Challenge",
      description: "Practice maintaining comfortable eye contact in conversations",
      category: "approaching",
      levels: 3,
      currentLevel: 2,
      progressPercent: 60,
      steps: [
        "Hold eye contact for 3 seconds with strangers as you pass by",
        "Practice 'triangle gazing' (eyes and mouth) when talking to someone",
        "Hold eye contact through an entire conversation with a friend",
        "Maintain eye contact while approaching someone new",
        "Practice looking away occasionally in a natural pattern"
      ],
      benefits: [
        "Increased perceived confidence",
        "Stronger connections in conversation",
        "Better ability to read social cues"
      ],
      xpReward: 150
    },
    {
      id: 3,
      title: "Social Volume Challenge",
      description: "Gradually increase your vocal presence in social settings",
      category: "conversation",
      levels: 3,
      currentLevel: 1,
      progressPercent: 40,
      steps: [
        "Record yourself speaking to hear your baseline volume",
        "Practice speaking 10% louder than your comfort zone",
        "Order at a restaurant with a confident, clear voice",
        "Share a story in a group setting without lowering your volume",
        "Maintain your volume even when others are louder around you"
      ],
      benefits: [
        "Increased social presence",
        "More attention when you speak",
        "Greater conversation control"
      ],
      xpReward: 175
    }
  ];
  
  const handleCompleteStep = () => {
    if (activeChallenge === null) return;
    
    const challenge = challenges.find(c => c.id === activeChallenge);
    if (!challenge) return;
    
    if (currentStep < challenge.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Challenge completed
      if (user) {
        addXP(challenge.xpReward);
      }
      
      // Reset and close
      setActiveChallenge(null);
      setCurrentStep(0);
    }
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'inner-game':
        return <Target className="h-4 w-4 text-purple-600" />;
      case 'approaching':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'conversation':
        return <MessageCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Star className="h-4 w-4 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {activeChallenge === null ? (
        <>
          {challenges.map(challenge => (
            <div 
              key={challenge.id}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-100 rounded-full p-1.5">
                      {getCategoryIcon(challenge.category)}
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      {challenge.category.replace('-', ' ')}
                    </div>
                  </div>
                  
                  <div className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 flex items-center">
                    <Zap className="h-3 w-3 mr-1" />
                    Level {challenge.currentLevel}/{challenge.levels}
                  </div>
                </div>
                
                <h3 className="font-bold text-gray-900 mb-1">{challenge.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1 text-xs text-gray-500">
                    <span>Progress</span>
                    <span>{challenge.progressPercent}%</span>
                  </div>
                  <ProgressBar progress={challenge.progressPercent} height={6} />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-[var(--color-burgundy)]/10 rounded-full p-1.5 mr-2">
                      <Award className="h-4 w-4 text-[var(--color-burgundy)]" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Reward</div>
                      <div className="text-sm font-bold text-[var(--color-burgundy)]">+{challenge.xpReward} XP</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setActiveChallenge(challenge.id)}
                    className="px-4 py-2 bg-[var(--color-burgundy)] text-white rounded-lg text-sm font-medium flex items-center"
                  >
                    View Challenge
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div className="p-6">
            <button
              onClick={() => setActiveChallenge(null)}
              className="text-[var(--color-burgundy)] mb-4 flex items-center hover:underline"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to challenges
            </button>
            
            {(() => {
              const challenge = challenges.find(c => c.id === activeChallenge);
              if (!challenge) return null;
              
              return (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{challenge.title}</h2>
                      <p className="text-gray-600">{challenge.description}</p>
                      
                      <div className="flex items-center mt-2 space-x-3">
                        <div className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 flex items-center">
                          {getCategoryIcon(challenge.category)}
                          <span className="ml-1">{challenge.category.replace('-', ' ')}</span>
                        </div>
                        <div className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 flex items-center">
                          <Zap className="h-3 w-3 mr-1" />
                          Level {challenge.currentLevel}/{challenge.levels}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-100 rounded-lg p-3 text-center">
                      <div className="text-sm text-gray-600">Reward</div>
                      <div className="text-xl font-bold text-[var(--color-burgundy)]">+{challenge.xpReward} XP</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-100 mb-6">
                    <h3 className="font-medium text-amber-800 mb-2 flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-amber-600" />
                      Benefits of This Challenge
                    </h3>
                    <ul className="space-y-1">
                      {challenge.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-amber-700 flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-amber-600" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-900">Progress</h3>
                      <div className="text-sm text-gray-600">
                        Step {currentStep + 1} of {challenge.steps.length}
                      </div>
                    </div>
                    
                    <ProgressBar 
                      progress={(currentStep / challenge.steps.length) * 100}
                      height={8}
                      showPercentage
                      labelPosition="top"
                      color="var(--color-burgundy)"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-4">Challenge Steps</h3>
                    <div className="space-y-4">
                      {challenge.steps.map((step, index) => (
                        <div 
                          key={index}
                          className={`p-4 rounded-lg border ${
                            index < currentStep 
                              ? 'border-green-200 bg-green-50' 
                              : index === currentStep 
                              ? 'border-[var(--color-burgundy)] bg-[var(--color-burgundy)]/5' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                              index < currentStep 
                                ? 'bg-green-500 text-white' 
                                : index === currentStep 
                                ? 'bg-[var(--color-burgundy)] text-white' 
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {index < currentStep ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <span className="text-xs">{index + 1}</span>
                              )}
                            </div>
                            <div>
                              <p className={`${
                                index < currentStep 
                                  ? 'text-green-800 line-through' 
                                  : index === currentStep 
                                  ? 'text-gray-900 font-medium' 
                                  : 'text-gray-600'
                              }`}>
                                {step}
                              </p>
                              
                              {index === currentStep && (
                                <button
                                  onClick={handleCompleteStep}
                                  className="mt-3 px-4 py-2 bg-[var(--color-burgundy)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-burgundy)]/90 transition-colors"
                                >
                                  Mark as Completed
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-blue-600" />
                      Challenge Tips
                    </h3>
                    <ul className="space-y-1">
                      <li className="text-sm text-blue-700 flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
                        <span>Complete one step per day for consistent progress</span>
                      </li>
                      <li className="text-sm text-blue-700 flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
                        <span>Journal your experiences after each challenge step</span>
                      </li>
                      <li className="text-sm text-blue-700 flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
                        <span>Remember that discomfort is the path to growth</span>
                      </li>
                    </ul>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscomfortChallenge;
