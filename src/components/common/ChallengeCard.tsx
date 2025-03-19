import React from 'react';
import { Award, Clock, User, Star, Calendar, Target, MessageSquare, Users, Lock, ChevronRight, ArrowRight } from 'lucide-react';

interface ChallengeCardProps {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'approaching' | 'conversation' | 'dating' | 'inner-game' | 'texting';
  xpReward: number;
  timeEstimate: string;
  steps: number;
  isCompleted: boolean;
  isLocked: boolean;
  requiredLevel?: number;
  hasBadgeReward: boolean;
  onClick: () => void;
  progress?: number;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  title,
  description,
  difficulty,
  category,
  xpReward,
  timeEstimate,
  steps,
  isCompleted,
  isLocked,
  requiredLevel,
  hasBadgeReward,
  onClick,
  progress
}) => {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-amber-100 text-amber-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getCategoryIcon = () => {
    switch (category) {
      case 'approaching':
        return <Users className="h-4 w-4 mr-1" />;
      case 'conversation':
        return <MessageSquare className="h-4 w-4 mr-1" />;
      case 'dating':
        return <Calendar className="h-4 w-4 mr-1" />;
      case 'inner-game':
        return <Target className="h-4 w-4 mr-1" />;
      case 'texting':
        return <MessageSquare className="h-4 w-4 mr-1" />;
      default:
        return <Star className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div 
      className={`border ${isLocked ? 'border-gray-200 bg-gray-50' : 'border-gray-200 hover:border-[var(--color-burgundy)] bg-white'} rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer ${isCompleted ? 'border-green-200 bg-green-50' : ''}`}
      onClick={isLocked ? undefined : onClick}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className={`font-medium text-lg ${isLocked ? 'text-gray-500' : 'text-gray-900'}`}>
            {title}
          </h3>
          
          {isCompleted && (
            <div className="bg-green-100 rounded-full p-1">
              <Award className="h-5 w-5 text-green-600" />
            </div>
          )}
          
          {isLocked && (
            <div className="bg-gray-200 rounded-full p-1">
              <Lock className="h-5 w-5 text-gray-500" />
            </div>
          )}
        </div>
        
        <p className={`text-sm mb-4 line-clamp-2 ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
          {description}
        </p>
        
        {progress !== undefined && progress > 0 && progress < 100 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div 
                className="bg-[var(--color-burgundy)] h-2 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          <div className={`text-xs px-2 py-1 rounded-full flex items-center ${isLocked ? 'bg-gray-200 text-gray-500' : getDifficultyColor()}`}>
            {difficulty}
          </div>
          
          <div className={`text-xs px-2 py-1 rounded-full flex items-center ${isLocked ? 'bg-gray-200 text-gray-500' : 'bg-gray-100 text-gray-700'}`}>
            {getCategoryIcon()}
            {category.replace('-', ' ')}
          </div>
          
          <div className={`text-xs px-2 py-1 rounded-full flex items-center ${isLocked ? 'bg-gray-200 text-gray-500' : 'bg-gray-100 text-gray-700'}`}>
            <Clock className="h-4 w-4 mr-1" />
            {timeEstimate}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className={`${isLocked ? 'text-gray-400' : 'text-[var(--color-burgundy)]'} font-medium flex items-center`}>
            {isLocked ? (
              <span className="text-sm">Level {requiredLevel} required</span>
            ) : (
              <>
                <Award className="h-4 w-4 mr-1" />
                <span>+{xpReward} XP</span>
                {hasBadgeReward && (
                  <div className="ml-2 bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">
                    +Badge
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="text-xs text-gray-500 flex items-center">
            {steps} steps
            {!isLocked && (
              <ChevronRight className="h-4 w-4 ml-1" />
            )}
          </div>
        </div>
      </div>
      
      {isCompleted && (
        <div className="bg-green-100 text-green-800 py-2 px-4 text-sm font-medium flex items-center justify-center">
          <Award className="h-4 w-4 mr-1" />
          Completed
        </div>
      )}
      
      {!isCompleted && !isLocked && (
        <div 
          className={`${progress !== undefined && progress > 0 ? 'bg-[var(--color-burgundy)] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} py-2 px-4 text-sm font-medium flex items-center justify-center`}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          {progress !== undefined && progress > 0 ? (
            <>
              Continue Challenge
              <ArrowRight className="h-4 w-4 ml-1" />
            </>
          ) : (
            <>
              Start Challenge
              <ArrowRight className="h-4 w-4 ml-1" />
            </>
          )}
        </div>
      )}
      
      {isLocked && (
        <div className="bg-gray-200 text-gray-500 py-2 px-4 text-sm font-medium flex items-center justify-center">
          <Lock className="h-4 w-4 mr-1" />
          Locked
        </div>
      )}
    </div>
  );
};

export default ChallengeCard;
