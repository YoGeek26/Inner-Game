import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { Calendar, Trophy, CheckCircle2, Clock, BadgeCheck } from 'lucide-react';
import { RoutineCompletion } from '../../types';
import { getRoutineHistory, getRoutineStreak } from '../../services/userDataService';

interface RoutineTrackerProps {
  routineType: 'morning' | 'evening';
}

const RoutineTracker: React.FC<RoutineTrackerProps> = ({ routineType }) => {
  const { user } = useUser();
  const [streakCount, setStreakCount] = useState<number>(0);
  const [completions, setCompletions] = useState<RoutineCompletion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    totalCompletions: 0,
    weeklyCompletions: 0,
    longestStreak: 0
  });
  
  // Fetch routine history and stats
  useEffect(() => {
    const fetchRoutineData = async () => {
      try {
        setLoading(true);
        const history = await getRoutineHistory();
        const streak = await getRoutineStreak();
        
        // Filter completions by routine type
        const filteredCompletions = history.filter(
          completion => completion.routineId.includes(routineType)
        );
        
        setCompletions(filteredCompletions);
        setStreakCount(streak);
        
        // Calculate stats
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const weeklyCompletions = filteredCompletions.filter(
          completion => new Date(completion.date) >= oneWeekAgo
        ).length;
        
        setStats({
          totalCompletions: filteredCompletions.length,
          weeklyCompletions,
          longestStreak: Math.max(streak, user?.streakCount || 0)
        });
      } catch (error) {
        console.error('Error fetching routine data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoutineData();
  }, [routineType, user?.streakCount]);
  
  // Generate last 30 days for calendar display
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Check if this day has a completion
      const hasCompletion = completions.some(completion => {
        const completionDate = new Date(completion.date);
        return (
          completionDate.getDate() === date.getDate() &&
          completionDate.getMonth() === date.getMonth() &&
          completionDate.getFullYear() === date.getFullYear()
        );
      });
      
      days.push({
        date,
        hasCompletion
      });
    }
    
    return days;
  };
  
  const calendarDays = generateCalendarDays();
  
  if (loading) {
    return (
      <div className="animate-pulse p-4 bg-gray-50 rounded-lg">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Calendar className="h-5 w-5 mr-2 text-[var(--color-burgundy)]" />
        {routineType === 'morning' ? 'Morning' : 'Evening'} Routine Progress
      </h3>
      
      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-[var(--color-burgundy)]">{stats.totalCompletions}</div>
          <div className="text-xs text-gray-500">Total Completions</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-[var(--color-burgundy)]">{stats.weeklyCompletions}</div>
          <div className="text-xs text-gray-500">This Week</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-[var(--color-burgundy)]">{stats.longestStreak}</div>
          <div className="text-xs text-gray-500">Longest Streak</div>
        </div>
      </div>
      
      {/* Current streak */}
      <div className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-lg p-3 mb-5">
        <div className="flex items-center">
          <Trophy className="h-5 w-5 text-amber-500 mr-2" />
          <span className="font-medium text-amber-800">Current Streak</span>
        </div>
        <div className="flex items-center">
          <span className="text-xl font-bold text-amber-700 mr-1">{streakCount}</span>
          <span className="text-amber-600 text-sm">days</span>
        </div>
      </div>
      
      {/* Calendar view */}
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Last 30 Days:</div>
        <div className="grid grid-cols-15 gap-1 sm:grid-cols-15 md:grid-cols-15 lg:grid-cols-15">
          {calendarDays.map((day, index) => (
            <div 
              key={index} 
              className={`aspect-square rounded-sm flex items-center justify-center text-xs ${
                day.hasCompletion 
                ? 'bg-[var(--color-burgundy)] text-white' 
                : 'bg-gray-100 text-gray-400'
              }`}
              title={day.date.toLocaleDateString()}
            >
              {day.date.getDate()}
            </div>
          ))}
        </div>
      </div>
      
      {/* Achievement badges */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <BadgeCheck className="h-4 w-4 mr-1.5 text-[var(--color-burgundy)]" />
          Achievements
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className={`border rounded-lg p-3 flex items-center ${stats.totalCompletions >= 1 ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-50'}`}>
            <div className={`rounded-full p-2 mr-3 ${stats.totalCompletions >= 1 ? 'bg-green-100' : 'bg-gray-100'}`}>
              <CheckCircle2 className={`h-4 w-4 ${stats.totalCompletions >= 1 ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <div className="text-sm font-medium">First Step</div>
              <div className="text-xs text-gray-500">Complete 1 routine</div>
            </div>
          </div>
          
          <div className={`border rounded-lg p-3 flex items-center ${stats.totalCompletions >= 7 ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-50'}`}>
            <div className={`rounded-full p-2 mr-3 ${stats.totalCompletions >= 7 ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Clock className={`h-4 w-4 ${stats.totalCompletions >= 7 ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <div className="text-sm font-medium">First Week</div>
              <div className="text-xs text-gray-500">Complete 7 routines</div>
            </div>
          </div>
          
          <div className={`border rounded-lg p-3 flex items-center ${stats.totalCompletions >= 30 ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-50'}`}>
            <div className={`rounded-full p-2 mr-3 ${stats.totalCompletions >= 30 ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Calendar className={`h-4 w-4 ${stats.totalCompletions >= 30 ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <div className="text-sm font-medium">Monthly Master</div>
              <div className="text-xs text-gray-500">Complete 30 routines</div>
            </div>
          </div>
          
          <div className={`border rounded-lg p-3 flex items-center ${stats.longestStreak >= 7 ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-50'}`}>
            <div className={`rounded-full p-2 mr-3 ${stats.longestStreak >= 7 ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Trophy className={`h-4 w-4 ${stats.longestStreak >= 7 ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <div className="text-sm font-medium">Streak Week</div>
              <div className="text-xs text-gray-500">7-day streak</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom motivation */}
      <div className="mt-5 text-center">
        <p className="text-sm text-gray-600 italic">
          {streakCount > 0
            ? `Keep your streak going! Consistency is key to transformation.`
            : `Start your journey today. Every routine strengthens your mindset.`}
        </p>
      </div>
    </div>
  );
};

export default RoutineTracker;
