import React, { useState } from 'react';
import { useAI } from '../../context/AIContext';
import { useUser } from '../../context/UserContext';
import { Clipboard, CheckCircle, AlertCircle, ArrowRightCircle, Sparkles, Loader, BarChart4, TrendingUp, ChevronDown, ChevronUp, Award } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';
import { ConversationAnalysisResult } from '../../types';

const ConversationAnalyzer: React.FC = () => {
  const { analyzeConversation, getDetailedAnalysis, isLoading } = useAI();
  const { user, addXP, addBadge } = useUser();
  const [conversation, setConversation] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [detailedAnalysis, setDetailedAnalysis] = useState<ConversationAnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('simple');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [analysisCount, setAnalysisCount] = useState<number>(user ? 0 : 0);

  // Define focus areas
  const possibleFocusAreas = ['Opening lines', 'Building rapport', 'Asking questions', 'Humor', 'Creating interest', 'Closing/asking out'];

  const toggleFocusArea = (area: string) => {
    if (focusAreas.includes(area)) {
      setFocusAreas(focusAreas.filter(a => a !== area));
    } else {
      setFocusAreas([...focusAreas, area]);
    }
  };

  const handleAnalyze = async () => {
    if (!conversation.trim()) {
      setError('Please paste a conversation to analyze.');
      return;
    }
    
    try {
      setError(null);
      setAnalysis(null);
      setDetailedAnalysis(null);
      
      if (viewMode === 'simple') {
        const result = await analyzeConversation(conversation);
        setAnalysis(result);
      } else {
        const result = await getDetailedAnalysis(conversation);
        setDetailedAnalysis(result);
      }
      
      // Update analysis count
      setAnalysisCount(prev => prev + 1);
      
      // Award XP and badges for first-time analysis
      if (user && analysisCount === 0) {
        await addXP(50); // Bonus XP for first analysis
      } else if (user) {
        await addXP(20); // Regular XP for analysis
      }

      // Award badge for multiple analyses
      if (user && analysisCount === 4) {
        await addBadge({
          id: 'text-guru',
          name: 'Text Guru',
          description: 'Analyzed 5 conversations to master texting',
          icon: 'message-circle',
          earnedAt: new Date(),
          rarity: 'uncommon'
        });
      }

    } catch (err) {
      setError('Failed to analyze the conversation. Please try again.');
      console.error('Analysis error:', err);
    }
  };
  
  const handleCopy = () => {
    if (analysis) {
      navigator.clipboard.writeText(analysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderCategoriesChart = () => {
    if (!detailedAnalysis) return null;
    
    const categories = detailedAnalysis.categories;
    const categoryNames = {
      opening: 'Opening',
      engagement: 'Engagement',
      storytelling: 'Storytelling',
      questioning: 'Questioning',
      humor: 'Humor',
      confidence: 'Confidence',
      closing: 'Closing'
    };
    
    return (
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Category Scores</h4>
        <div className="space-y-3">
          {Object.entries(categories).map(([key, score]) => (
            <div key={key}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">{categoryNames[key as keyof typeof categoryNames]}</span>
                <span className="text-xs font-medium" style={{ 
                  color: score >= 80 ? 'green' : 
                         score >= 60 ? '#d97706' : 'red' 
                }}>
                  {score}/100
                </span>
              </div>
              <ProgressBar 
                progress={score} 
                height={4}
                color={
                  score >= 80 ? 'green' : 
                  score >= 60 ? '#d97706' : 'red'
                }
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStatistics = () => {
    if (!detailedAnalysis) return null;
    
    const { statistics } = detailedAnalysis;
    
    return (
      <div className="mt-6">
        <div 
          className="flex justify-between items-center cursor-pointer" 
          onClick={() => setShowStats(!showStats)}
        >
          <h4 className="text-sm font-medium text-gray-900">Conversation Statistics</h4>
          {showStats ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
        </div>
        
        {showStats && (
          <div className="mt-2 bg-gray-50 p-3 rounded-lg text-sm">
            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
              <div>
                <div className="text-xs text-gray-500">Message Count</div>
                <div className="flex items-center justify-between">
                  <span>You: {statistics.messageCount.user}</span>
                  <span>Them: {statistics.messageCount.other}</span>
                </div>
                <div className="text-xs mt-1">
                  Ratio: <span className={statistics.messageCount.ratio > 1.3 || statistics.messageCount.ratio < 0.7 ? 'text-amber-600 font-medium' : 'text-green-600 font-medium'}>
                    {statistics.messageCount.ratio.toFixed(1)}:1
                  </span>
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500">Avg. Message Length</div>
                <div className="flex items-center justify-between">
                  <span>You: {Math.round(statistics.averageLength.user)} chars</span>
                  <span>Them: {Math.round(statistics.averageLength.other)} chars</span>
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500">Response Time</div>
                <div>~{statistics.responseTime.average} mins</div>
                <div className="text-xs mt-1">
                  Consistency: <span className={statistics.responseTime.consistent ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
                    {statistics.responseTime.consistent ? 'Good' : 'Varied'}
                  </span>
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500">Question Ratio</div>
                <div>{Math.round(statistics.questionRatio * 100)}% of your messages</div>
                <div className="text-xs mt-1">
                  Rating: <span className={
                    statistics.questionRatio > 0.7 ? 'text-amber-600 font-medium' : 
                    statistics.questionRatio < 0.2 ? 'text-amber-600 font-medium' : 
                    'text-green-600 font-medium'
                  }>
                    {statistics.questionRatio > 0.7 ? 'Too many questions' : 
                     statistics.questionRatio < 0.2 ? 'Too few questions' : 
                     'Good balance'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSimpleAnalysis = () => {
    if (!analysis) return null;
    
    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="prose prose-sm max-w-none">
          {analysis.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < analysis.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderDetailedAnalysis = () => {
    if (!detailedAnalysis) return null;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-gray-100 rounded-full p-2 mr-3">
              <BarChart4 className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Overall Score</h3>
              <div className="flex items-center mt-1">
                <span className="text-2xl font-bold" style={{ 
                  color: detailedAnalysis.overallScore >= 80 ? 'green' : 
                         detailedAnalysis.overallScore >= 60 ? '#d97706' : 'red' 
                }}>
                  {detailedAnalysis.overallScore}
                </span>
                <span className="text-gray-500 ml-1">/100</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-xs text-gray-500">Conversation Quality</span>
            <div className="font-medium" style={{ 
              color: detailedAnalysis.overallScore >= 80 ? 'green' : 
                     detailedAnalysis.overallScore >= 60 ? '#d97706' : 'red' 
            }}>
              {detailedAnalysis.overallScore >= 80 ? 'Excellent' : 
               detailedAnalysis.overallScore >= 70 ? 'Good' :
               detailedAnalysis.overallScore >= 60 ? 'Average' :
               'Needs Improvement'}
            </div>
          </div>
        </div>
        
        {renderCategoriesChart()}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="border border-green-100 bg-green-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-green-800 mb-2">Strengths</h4>
            <ul className="space-y-1">
              {detailedAnalysis.strengths.map((strength, index) => (
                <li key={index} className="text-sm text-green-700 flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="border border-amber-100 bg-amber-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-amber-800 mb-2">Areas to Improve</h4>
            <ul className="space-y-1">
              {detailedAnalysis.weaknesses.map((weakness, index) => (
                <li key={index} className="text-sm text-amber-700 flex items-start">
                  <TrendingUp className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border border-blue-100 bg-blue-50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Actionable Suggestions</h4>
          <ul className="space-y-1">
            {detailedAnalysis.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-blue-700 flex items-start">
                <Sparkles className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {renderStatistics()}
      </div>
    );
  };

  return (
    <div className="luxury-card">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Conversation Analyzer</h2>
        <p className="text-gray-600 mt-1">
          Paste your conversation history from dating apps and get expert feedback on your conversation skills
        </p>
        {analysisCount > 0 && (
          <div className="mt-2 text-sm text-gray-700">
            <span className="font-medium">Conversations analyzed:</span> {analysisCount}
          </div>
        )}
      </div>
      
      <div className="p-6">
        {!analysis && !detailedAnalysis ? (
          <>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="conversation" className="block text-sm font-medium text-gray-700">
                  Paste your conversation
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode('simple')}
                    className={`px-3 py-1 text-xs rounded-full ${
                      viewMode === 'simple' 
                        ? 'bg-[var(--color-burgundy)] text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Simple Analysis
                  </button>
                  <button
                    onClick={() => setViewMode('detailed')}
                    className={`px-3 py-1 text-xs rounded-full ${
                      viewMode === 'detailed' 
                        ? 'bg-[var(--color-burgundy)] text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Detailed Analysis
                  </button>
                </div>
              </div>
              <textarea
                id="conversation"
                rows={10}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent"
                placeholder="Paste your conversation here... Format it like:
You: Hey there, I noticed you like hiking too!
Them: Yeah, I love the outdoors. What's your favorite trail?
You: I really enjoy the mountain trails near Lake Tahoe.
..."
                value={conversation}
                onChange={(e) => setConversation(e.target.value)}
              ></textarea>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Focus areas (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {possibleFocusAreas.map(area => (
                  <button
                    key={area}
                    onClick={() => toggleFocusArea(area)}
                    className={`px-3 py-1.5 text-sm rounded-full ${
                      focusAreas.includes(area)
                        ? 'bg-[var(--color-burgundy)] text-white'
                        : 'border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !conversation.trim()}
              className={`w-full py-3 rounded-lg flex items-center justify-center ${
                isLoading || !conversation.trim()
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-gold)] text-white'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Analyze Conversation
                </>
              )}
            </button>
            
            <p className="text-xs text-gray-500 mt-2 text-center">
              {user?.isPremium 
                ? 'Premium members have unlimited analysis credits' 
                : 'Free users can analyze up to 3 conversations per month'}
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900">Analysis Results</h3>
              <div className="flex space-x-2">
                {viewMode === 'simple' && (
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-100 flex items-center"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Clipboard className="h-4 w-4 mr-1" />
                        Copy Analysis
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => {
                    setAnalysis(null);
                    setDetailedAnalysis(null);
                  }}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-100 flex items-center"
                >
                  <ArrowRightCircle className="h-4 w-4 mr-1" />
                  New Analysis
                </button>
              </div>
            </div>
            
            {viewMode === 'simple' ? renderSimpleAnalysis() : renderDetailedAnalysis()}
            
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <h4 className="text-amber-800 font-medium flex items-center mb-2">
                <Sparkles className="h-5 w-5 mr-2 text-amber-600" />
                Ready to improve?
              </h4>
              <p className="text-amber-700 mb-3">
                Practice with our AI coach to implement these suggestions and develop better conversation skills.
              </p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button className="sm:flex-1 py-2 bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-gold)] text-white rounded-lg">
                  Practice with AI Coach
                </button>
                <button className="sm:flex-1 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg">
                  Try Conversation Simulator
                </button>
              </div>
            </div>
            
            {analysisCount >= 5 && (
              <div className="mt-4 flex items-center justify-center bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-lg border border-amber-200">
                <Award className="h-6 w-6 text-amber-500 mr-2" />
                <span className="text-sm text-amber-800 font-medium">
                  You've unlocked the "Text Guru" badge for analyzing 5 conversations!
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConversationAnalyzer;
