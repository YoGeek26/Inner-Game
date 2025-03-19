import React from 'react';
import { Challenge } from '../../types';
import { CheckCircle, MessageCircle, Star, ArrowRight } from 'lucide-react';

interface DailyChallengeProps {
  challenge: Challenge;
  onComplete: () => void;
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({ challenge, onComplete }) => {
  return (
    <div className="luxury-card p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-gray-900">Daily Challenge</h2>
        <span className="elite-badge flex items-center">
          <Star className="h-3 w-3 mr-1 text-[var(--color-midnight)]" />
          {challenge.xpReward} XP
        </span>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">{challenge.title}</h3>
        <p className="text-gray-600">{challenge.description}</p>
        
        <div className="mt-4">
          {challenge.completed ? (
            <div className="flex items-center text-green-600 font-medium">
              <CheckCircle className="h-5 w-5 mr-2" />
              Challenge Completed!
            </div>
          ) : (
            <button
              onClick={onComplete}
              className="w-full px-4 py-3 luxury-gradient text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex justify-center items-center"
            >
              Mark as Complete
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyChallenge;
