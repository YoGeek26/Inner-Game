import React from 'react';
import { useUser } from '../../context/UserContext';
import ProgressBar from '../common/ProgressBar';
import { TrendingUp, MessageCircle, Users, Smartphone, Calendar, Target, ArrowRight } from 'lucide-react';

const SkillsOverview: React.FC = () => {
  const { skills } = useUser();
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'approach':
        return <Users className="h-5 w-5 text-blue-600" />;
      case 'conversation':
        return <MessageCircle className="h-5 w-5 text-green-600" />;
      case 'texting':
        return <Smartphone className="h-5 w-5 text-purple-600" />;
      case 'dating':
        return <Calendar className="h-5 w-5 text-red-600" />;
      case 'inner-game':
        return <Target className="h-5 w-5 text-amber-600" />;
      default:
        return <TrendingUp className="h-5 w-5 text-gray-600" />;
    }
  };
  
  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);
  
  // Calculate category averages
  const categoryAverages = Object.keys(skillsByCategory).map(category => {
    const categorySkills = skillsByCategory[category];
    const average = categorySkills.reduce((sum, skill) => sum + skill.level, 0) / categorySkills.length;
    return {
      category,
      average,
      skills: categorySkills
    };
  });
  
  // Sort categories by average
  categoryAverages.sort((a, b) => b.average - a.average);

  return (
    <div className="luxury-card">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Skills Overview</h2>
        <p className="text-sm text-gray-600 mt-1">Your current skill levels</p>
      </div>
      
      <div className="p-4 space-y-5">
        {categoryAverages.map(({ category, average, skills: categorySkills }) => (
          <div key={category}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="bg-gray-100 rounded-full p-2 mr-2">
                  {getCategoryIcon(category)}
                </div>
                <h3 className="font-medium text-gray-900 capitalize">
                  {category.replace('-', ' ')}
                </h3>
              </div>
              <div className="text-sm font-medium">
                <span className="text-[var(--color-burgundy)]">{average.toFixed(1)}</span>
                <span className="text-gray-400">/10</span>
              </div>
            </div>
            
            <ProgressBar
              progress={(average / 10) * 100}
              height={6}
              color={
                category === 'approach' ? '#2563eb' :
                category === 'conversation' ? '#16a34a' :
                category === 'texting' ? '#9333ea' :
                category === 'dating' ? '#dc2626' :
                category === 'inner-game' ? '#d97706' :
                'var(--color-burgundy)'
              }
            />
            
            <div className="mt-2 grid grid-cols-2 gap-2">
              {categorySkills.map(skill => (
                <div key={skill.id} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{skill.name}</span>
                  <span className="text-xs font-medium text-gray-800">{skill.level}/{skill.maxLevel}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="pt-3 border-t border-gray-200">
          <button className="w-full text-center py-2 text-sm text-[var(--color-burgundy)] font-medium hover:bg-[var(--color-burgundy)]/5 rounded-lg flex items-center justify-center">
            View Detailed Skills
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillsOverview;
