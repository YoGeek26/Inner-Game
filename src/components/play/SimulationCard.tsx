import React from 'react';
import { SimulationScenario } from '../../types';
import { MessageCircle, UserCircle, ChevronRight, GraduationCap } from 'lucide-react';

interface SimulationCardProps {
  scenario: SimulationScenario;
  onSelect: (scenario: SimulationScenario) => void;
}

const SimulationCard: React.FC<SimulationCardProps> = ({ scenario, onSelect }) => {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-amber-100 text-amber-800',
    advanced: 'bg-red-100 text-red-800'
  };
  
  const getCharacterPreview = () => {
    const character = scenario.characters[0];
    return (
      <div className="flex items-center">
        <div className="mr-2 relative">
          <img 
            src={character.avatar} 
            alt={character.name} 
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
        <div className="text-sm">{character.name}</div>
      </div>
    );
  };
  
  return (
    <div 
      className="border border-gray-200 rounded-lg bg-white overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(scenario)}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className={`text-xs px-2 py-1 rounded-full ${difficultyColors[scenario.difficulty]}`}>
            {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
          </div>
          
          {scenario.isLocked && (
            <div className="bg-gray-100 text-gray-600 rounded-full px-2 py-1 text-xs flex items-center">
              <GraduationCap className="h-3 w-3 mr-1" />
              Level {scenario.requiredLevel}+
            </div>
          )}
        </div>
        
        <h3 className="font-bold text-gray-900 mb-1">{scenario.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{scenario.description}</p>
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          {getCharacterPreview()}
          
          <button
            className="flex items-center px-3 py-1.5 text-sm text-[var(--color-burgundy)] hover:bg-[var(--color-burgundy)]/5 rounded-lg"
          >
            Practice
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationCard;
