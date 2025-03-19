import React from 'react';
import { Trophy, Medal, User } from 'lucide-react';

const ComebackRankings: React.FC = () => {
  // Mock top comeback users data
  const topUsers = [
    {
      id: 'user-1',
      name: 'WitMaster',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      score: 256,
      wins: 12,
      rank: 1,
      title: 'Comeback King'
    },
    {
      id: 'user-2',
      name: 'ReplyChamp',
      avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
      score: 231,
      wins: 9,
      rank: 2,
      title: 'Word Wizard'
    },
    {
      id: 'user-3',
      name: 'SmoothTalker',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
      score: 219,
      wins: 7,
      rank: 3,
      title: 'Silver Tongue'
    },
    {
      id: 'user-4',
      name: 'BanterPro',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      score: 187,
      wins: 5,
      rank: 4
    },
    {
      id: 'user-5',
      name: 'CharismaCoach',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      score: 162,
      wins: 4,
      rank: 5
    }
  ];
  
  // User's ranking (mock data)
  const userRanking = {
    rank: 18,
    score: 86,
    wins: 1,
    percentile: 75 // top 25%
  };
  
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-[var(--color-gold)]" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />; // Silver
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />; // Bronze
    return <span className="font-bold text-gray-500">#{rank}</span>;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Top Comeback Artists</h3>
        <p className="text-gray-600 text-sm mt-1">
          Weekly leaderboard of the wittiest responders
        </p>
      </div>
      
      <div className="p-6">
        <div className="space-y-4 mb-6">
          {topUsers.map(user => (
            <div 
              key={user.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                user.rank <= 3 ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center mr-3">
                  {getRankIcon(user.rank)}
                </div>
                
                <div className="flex items-center">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover mr-3" 
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                  
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    {user.title && (
                      <div className="text-xs text-gray-500">{user.title}</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-gray-900">{user.score} pts</div>
                <div className="text-xs text-gray-500">{user.wins} wins</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between p-3 bg-[var(--color-burgundy)]/5 rounded-lg border border-[var(--color-burgundy)]/20">
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center mr-3">
                <span className="font-bold text-gray-500">#{userRanking.rank}</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[var(--color-burgundy)] text-white flex items-center justify-center mr-3">
                  <User className="h-6 w-6" />
                </div>
                
                <div>
                  <div className="font-medium text-gray-900">You</div>
                  <div className="text-xs text-gray-500">Top {100 - userRanking.percentile}%</div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-bold text-gray-900">{userRanking.score} pts</div>
              <div className="text-xs text-gray-500">{userRanking.wins} wins</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComebackRankings;
