import React, { useState } from 'react';
import ConversationSimulator from '../components/play/ConversationSimulator';
import ConversationAnalyzer from '../components/play/ConversationAnalyzer';
import BattleDerepartie from '../components/play/BattleDerepartie';
import DiscomfortChallenge from '../components/play/DiscomfortChallenge';
import ComebackRankings from '../components/play/ComebackRankings';
import SimulationCard from '../components/play/SimulationCard';
import { SimulationScenario } from '../types';
import { useUser } from '../context/UserContext';
import { Sparkles, MessageCircle, Brain, Zap, Trophy, UserPlus, ArrowLeft } from 'lucide-react';

const PlayPage: React.FC = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'simulations' | 'analyzer' | 'challenges' | 'battle'>('simulations');
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario | null>(null);
  
  // Mock simulation scenarios
  const mockScenarios: SimulationScenario[] = [
    {
      id: 'scenario-1',
      title: 'Coffee Shop Approach',
      description: 'Practice approaching someone at a coffee shop and turning it into a meaningful conversation.',
      difficulty: 'beginner',
      context: 'You notice an attractive person sitting alone at a coffee shop, working on their laptop.',
      characters: [
        {
          id: 'char-1',
          name: 'Alex',
          description: 'A friendly graphic designer who loves travel',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          personality: 'open and creative, but busy with work'
        }
      ]
    },
    {
      id: 'scenario-2',
      title: 'Bar Conversation',
      description: 'Navigate a conversation at a busy bar, demonstrating value and creating attraction.',
      difficulty: 'intermediate',
      context: 'You\'re at a bar with friends when you notice someone looking your way occasionally.',
      characters: [
        {
          id: 'char-2',
          name: 'Jordan',
          description: 'A confident professional who enjoys nightlife',
          avatar: 'https://randomuser.me/api/portraits/men/35.jpg',
          personality: 'slightly skeptical but interested'
        }
      ]
    },
    {
      id: 'scenario-3',
      title: 'Dating App Match',
      description: 'Convert a dating app match into a date through engaging messaging.',
      difficulty: 'beginner',
      context: 'You just matched with someone attractive on a dating app. Their profile mentions hiking and photography.',
      characters: [
        {
          id: 'char-3',
          name: 'Taylor',
          description: 'An outdoor enthusiast with a creative side',
          avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
          personality: 'adventurous but cautious about meeting'
        }
      ]
    },
    {
      id: 'scenario-4',
      title: 'Group Interaction',
      description: 'Navigate a social gathering and stand out positively in a group setting.',
      difficulty: 'advanced',
      context: 'You\'re at a friend\'s house party where you only know the host. You notice an interesting group conversation.',
      characters: [
        {
          id: 'char-4a',
          name: 'Riley',
          description: 'The social connector who knows everyone',
          avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
          personality: 'extroverted and welcoming'
        },
        {
          id: 'char-4b',
          name: 'Morgan',
          description: "The person you're attracted to in the group",
          avatar: 'https://randomuser.me/api/portraits/women/75.jpg',
          personality: 'witty and observant'
        },
        {
          id: 'char-4c',
          name: 'Casey',
          description: 'The skeptical friend',
          avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
          personality: 'protective and slightly competitive'
        }
      ]
    }
  ];
  
  const handleSelectScenario = (scenario: SimulationScenario) => {
    setSelectedScenario(scenario);
    // In a real implementation, this would navigate to the simulator with the selected scenario
  };
  
  const handleBackToScenarios = () => {
    setSelectedScenario(null);
  };

  return (
    <div className="space-y-6">
      <div className="luxury-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Let's Play</h1>
            <p className="text-gray-600">Practice your social and seduction skills in a safe environment</p>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-2">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('simulations')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'simulations'
                    ? 'bg-white shadow text-[var(--color-burgundy)]'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <MessageCircle className="h-4 w-4 inline mr-1" />
                Simulations
              </button>
              <button
                onClick={() => setActiveTab('analyzer')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'analyzer'
                    ? 'bg-white shadow text-[var(--color-burgundy)]'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Brain className="h-4 w-4 inline mr-1" />
                Analyzer
              </button>
              <button
                onClick={() => setActiveTab('challenges')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'challenges'
                    ? 'bg-white shadow text-[var(--color-burgundy)]'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Zap className="h-4 w-4 inline mr-1" />
                Challenges
              </button>
              <button
                onClick={() => setActiveTab('battle')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'battle'
                    ? 'bg-white shadow text-[var(--color-burgundy)]'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Trophy className="h-4 w-4 inline mr-1" />
                Battle
              </button>
            </div>
          </div>
        </div>
        
        {activeTab === 'simulations' && !selectedScenario && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Conversation Simulations</h2>
              <p className="text-gray-600">
                Practice realistic conversations in different scenarios to build your skills and confidence.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockScenarios.map(scenario => (
                <SimulationCard 
                  key={scenario.id} 
                  scenario={scenario} 
                  onSelect={handleSelectScenario} 
                />
              ))}
            </div>
            
            <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-start">
                <div className="bg-blue-500 rounded-full p-2 mr-4">
                  <UserPlus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Introducing AI Social Simulations</h3>
                  <p className="text-gray-600 text-sm mt-1 mb-4">
                    Our new AI-powered simulations let you practice real conversations with virtual characters that respond 
                    naturally. It's the safest way to build your social skills before trying them in the real world.
                  </p>
                  
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-2 py-1 bg-white rounded-full text-blue-700 border border-blue-200">
                      Safe environment
                    </span>
                    <span className="px-2 py-1 bg-white rounded-full text-blue-700 border border-blue-200">
                      Realistic responses
                    </span>
                    <span className="px-2 py-1 bg-white rounded-full text-blue-700 border border-blue-200">
                      Personalized feedback
                    </span>
                    <span className="px-2 py-1 bg-white rounded-full text-blue-700 border border-blue-200">
                      Multiple scenarios
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'simulations' && selectedScenario && (
          <div>
            <button 
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
              onClick={handleBackToScenarios}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to scenarios
            </button>
            
            <ConversationSimulator 
              scenario={selectedScenario} 
              onComplete={() => {
                // Award XP, badges, etc.
                setSelectedScenario(null);
              }} 
            />
          </div>
        )}
        
        {activeTab === 'analyzer' && (
          <ConversationAnalyzer />
        )}
        
        {activeTab === 'challenges' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Real-World Challenges</h2>
              <p className="text-gray-600">
                Step out of your comfort zone with real-world exercises that build confidence and social skills.
              </p>
            </div>
            
            <DiscomfortChallenge />
          </div>
        )}
        
        {activeTab === 'battle' && (
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Battle de Repartie</h2>
                <p className="text-gray-600">
                  Test your wit and charm in conversation battles. Learn to think quickly and respond skillfully.
                </p>
              </div>
              
              <button className="px-4 py-2 bg-[var(--color-burgundy)] text-white rounded-lg text-sm font-medium flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                New Battle
              </button>
            </div>
            
            <div className="space-y-6">
              <BattleDerepartie />
              <ComebackRankings />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayPage;
