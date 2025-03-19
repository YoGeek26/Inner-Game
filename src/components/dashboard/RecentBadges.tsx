import React from 'react';
import { useUser } from '../../context/UserContext';
import Badge from '../common/Badge';
import { Award, ChevronRight } from 'lucide-react';

const RecentBadges: React.FC = () => {
  const { badges } = useUser();
  
  // Sort badges by earned date and take the most recent 5
  const recentBadges = [...badges]
    .sort((a, b) => {
      if (!a.earnedAt) return 1;
      if (!b.earnedAt) return -1;
      return new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime();
    })
    .slice(0, 5);
  
  // Next badges to earn (mock data)
  const nextBadges = [
    {
      id: 'social-butterfly',
      name: 'Social Butterfly',
      description: 'Attend 3 community events',
      icon: 'users',
      rarity: 'uncommon'
    },
    {
      id: 'smooth-operator',
      name: 'Smooth Operator',
      description: 'Get 3 phone numbers in one week',
      icon: 'star',
      rarity: 'rare'
    }
  ];

  return (
    <div className="luxury-card">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Recent Badges</h2>
        <p className="text-sm text-gray-600 mt-1">Your earned achievements</p>
      </div>
      
      <div className="p-4">
        {recentBadges.length > 0 ? (
          <div className="grid grid-cols-5 gap-2">
            {recentBadges.map(badge => (
              <Badge 
                key={badge.id} 
                badge={badge} 
                size="sm"
                showDetails 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="bg-gray-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Award className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-700 mb-1">No badges yet</h3>
            <p className="text-sm text-gray-500">Complete challenges to earn badges</p>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Next Badges to Earn</h3>
          
          <div className="space-y-3">
            {nextBadges.map(badge => (
              <div key={badge.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <Badge 
                    badge={badge as any}
                    size="sm"
                    isLocked
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">{badge.name}</div>
                    <div className="text-xs text-gray-500">{badge.description}</div>
                  </div>
                </div>
                
                <button className="text-[var(--color-burgundy)] hover:text-[var(--color-burgundy)]/80">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <button className="text-sm text-[var(--color-burgundy)] font-medium hover:underline">
              View All Badges
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentBadges;
