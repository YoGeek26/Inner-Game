import React from 'react';
import { Award, Star, MessageCircle, Users, Target, Calendar, Lock } from 'lucide-react';
import { Badge as BadgeType } from '../../types';

interface BadgeProps {
  badge: BadgeType;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  isLocked?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ 
  badge, 
  size = 'md', 
  showDetails = false,
  isLocked = false 
}) => {
  const getBadgeIcon = () => {
    switch (badge.icon) {
      case 'award':
        return <Award className="h-full w-full" />;
      case 'star':
        return <Star className="h-full w-full" />;
      case 'message-circle':
        return <MessageCircle className="h-full w-full" />;
      case 'users':
        return <Users className="h-full w-full" />;
      case 'target':
        return <Target className="h-full w-full" />;
      case 'calendar':
        return <Calendar className="h-full w-full" />;
      default:
        return <Award className="h-full w-full" />;
    }
  };
  
  const getBadgeColor = () => {
    // Colors based on rarity
    if (isLocked) return 'bg-gray-200 text-gray-400';
    
    switch (badge.rarity) {
      case 'common':
        return 'bg-blue-100 text-blue-700';
      case 'uncommon':
        return 'bg-green-100 text-green-700';
      case 'rare':
        return 'bg-purple-100 text-purple-700';
      case 'epic':
        return 'bg-amber-100 text-amber-700';
      case 'legendary':
        return 'bg-gradient-to-br from-amber-100 to-amber-300 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  const dimensions = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };
  
  const iconSize = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-5'
  };

  return (
    <div className={`flex ${showDetails ? 'flex-col items-center' : 'items-center'}`}>
      <div className={`relative ${dimensions[size]} rounded-full ${getBadgeColor()} ${iconSize[size]} flex items-center justify-center`}>
        {getBadgeIcon()}
        
        {isLocked && (
          <div className="absolute -bottom-1 -right-1 bg-gray-500 rounded-full p-1">
            <Lock className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} color="white" />
          </div>
        )}
      </div>
      
      {showDetails && (
        <div className="mt-2 text-center">
          <div className={`font-medium ${size === 'sm' ? 'text-xs' : 'text-sm'} ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
            {badge.name}
          </div>
          {size !== 'sm' && (
            <div className={`text-xs mt-0.5 ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>
              {isLocked ? 'Locked' : badge.rarity?.charAt(0).toUpperCase() + badge.rarity?.slice(1)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Badge;
