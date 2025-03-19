import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { MessageCircle, ThumbsUp, User, ArrowRight, Clock, ArrowLeft, CheckCircle, Trophy } from 'lucide-react';

const BattleDerepartie: React.FC = () => {
  const { user } = useUser();
  const [activeBattle, setActiveBattle] = useState<number | null>(null);
  
  // Mock battle data
  const battles = [
    {
      id: 1,
      title: "Dating App Opening",
      description: "You matched with someone attractive. Craft an engaging first message that stands out.",
      prompt: "You've matched with Alex on a dating app. Their profile shows they love travel, cooking, and hiking. Write an opening message that's more likely to get a response than 'Hey, how are you?'",
      participants: 28,
      timeLeft: "2 days",
      status: 'active',
      voted: false
    },
    {
      id: 2,
      title: "Handling a Test",
      description: "Someone challenges your confidence. Respond with wit and charm.",
      prompt: "You're talking to someone attractive at a bar who says: 'You're not really my type, but I'll give you a chance to impress me.' How do you respond?",
      participants: 42,
      timeLeft: "1 day",
      status: 'active',
      voted: true
    },
    {
      id: 3,
      title: "Number Close Recovery",
      description: "They declined to give their number. Turn it around smoothly.",
      prompt: "You asked for their number and they said: 'I don't give my number to people I just met.' What's your comeback?",
      participants: 36,
      timeLeft: "5 hours",
      status: 'active',
      voted: false
    },
    {
      id: 4,
      title: "Group Attention Grabber",
      description: "Stand out positively in a group conversation.",
      prompt: "You join a conversation where 5 people are discussing travel. How do you enter the conversation and make a memorable impression?",
      participants: 24,
      timeLeft: "Complete",
      status: 'complete',
      winner: {
        name: "ConversationKing",
        response: "I'd wait for a natural pause and say, 'Sorry to jump in, but I couldn't help overhearing you mention Bali. I was there during their New Year's celebration when the entire island goes silent for 24 hours - no electricity, no talking, no leaving your home. It was the most peaceful and strange travel experience I've ever had.' Then I'd ask which travel experiences changed their perspective the most."
      },
      voted: true
    }
  ];
  
  // Mock responses for the first battle
  const mockResponses = [
    {
      id: 'resp-1',
      user: {
        name: 'TravelEnthusiast',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      text: "If we were to go hiking together, would you prefer a trail with stunning views or one that leads to a hidden waterfall? (I'm personally torn between the two based on your profile!)",
      votes: 18,
      hasVoted: false
    },
    {
      id: 'resp-2',
      user: {
        name: 'CharmMaster',
        avatar: 'https://randomuser.me/api/portraits/men/44.jpg'
      },
      text: "I'm imagining you cooking a meal inspired by one of your travel adventures while telling hiking stories. What's the most memorable dish you've recreated from your travels?",
      votes: 24,
      hasVoted: true
    },
    {
      id: 'resp-3',
      user: {
        name: 'WittyReplies',
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
      },
      text: "I was planning my next hike when your profile popped up - clearly the universe thinks we should swap travel stories over some homemade pasta. Coincidence or excellent algorithm?",
      votes: 12,
      hasVoted: false
    }
  ];
  
  const [userResponse, setUserResponse] = useState('');
  const [responses, setResponses] = useState(mockResponses);
  
  const handleSubmitResponse = () => {
    if (!userResponse.trim()) return;
    
    // Add user's response to the list
    const newResponse = {
      id: `resp-${Date.now()}`,
      user: {
        name: user?.name || 'You',
        avatar: user?.avatar || ''
      },
      text: userResponse,
      votes: 0,
      hasVoted: false
    };
    
    setResponses([...responses, newResponse]);
    setUserResponse('');
  };
  
  const handleVote = (responseId: string) => {
    setResponses(prev => 
      prev.map(response => 
        response.id === responseId 
          ? { ...response, votes: response.votes + 1, hasVoted: true } 
          : response
      )
    );
  };
  
  return (
    <div className="luxury-card">
      {activeBattle === null ? (
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Current Battles</h3>
          
          <div className="space-y-4">
            {battles.map(battle => (
              <div 
                key={battle.id}
                className={`border rounded-lg overflow-hidden transition-shadow hover:shadow-md cursor-pointer ${
                  battle.status === 'complete' ? 'border-gray-200 bg-gray-50' : 'border-gray-200 bg-white'
                }`}
                onClick={() => setActiveBattle(battle.id)}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900">{battle.title}</h4>
                    <div className={`text-xs px-2 py-1 rounded-full flex items-center ${
                      battle.status === 'active' 
                        ? battle.voted ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {battle.status === 'active' ? (
                        battle.voted ? (
                          <>
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Voted
                          </>
                        ) : (
                          <>
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Respond
                          </>
                        )
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{battle.description}</p>
                  
                  <div className="flex items-center text-xs text-gray-500 space-x-3 mb-3">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {battle.participants} participants
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {battle.timeLeft}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button className="flex items-center text-sm text-[var(--color-burgundy)]">
                      View Details
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6">
          <button
            onClick={() => setActiveBattle(null)}
            className="text-[var(--color-burgundy)] mb-4 flex items-center hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to battles
          </button>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {battles.find(b => b.id === activeBattle)?.title}
            </h3>
            <p className="text-gray-600 mb-4">
              {battles.find(b => b.id === activeBattle)?.description}
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Prompt</h4>
              <p className="text-gray-700">
                {battles.find(b => b.id === activeBattle)?.prompt}
              </p>
            </div>
            
            {battles.find(b => b.id === activeBattle)?.status === 'active' && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-800 mb-2">Your Response</h4>
                <textarea
                  rows={3}
                  placeholder="Write your witty response here..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent mb-3"
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                ></textarea>
                <div className="flex justify-end">
                  <button
                    onClick={handleSubmitResponse}
                    disabled={!userResponse.trim()}
                    className={`px-4 py-2 rounded-lg text-sm flex items-center ${
                      !userResponse.trim()
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-[var(--color-burgundy)] text-white'
                    }`}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Submit Response
                  </button>
                </div>
              </div>
            )}
            
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">
                  {battles.find(b => b.id === activeBattle)?.status === 'complete'
                    ? 'Winning Response'
                    : 'Current Responses'}
                </h4>
                {battles.find(b => b.id === activeBattle)?.status === 'active' && (
                  <div className="text-sm text-gray-500">
                    Vote for the best responses
                  </div>
                )}
              </div>
              
              {battles.find(b => b.id === activeBattle)?.status === 'complete' ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-green-800">
                        {battles.find(b => b.id === activeBattle)?.winner?.name}
                      </div>
                      <p className="text-green-700 mt-1">
                        {battles.find(b => b.id === activeBattle)?.winner?.response}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {responses.map(response => (
                    <div key={response.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          {response.user.avatar ? (
                            <img
                              src={response.user.avatar}
                              alt={response.user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {response.user.name}
                          </div>
                          <p className="text-gray-700 mt-1 mb-3">
                            {response.text}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              {response.votes} votes
                            </div>
                            <button
                              onClick={() => handleVote(response.id)}
                              disabled={response.hasVoted}
                              className={`px-3 py-1 rounded-lg text-xs flex items-center ${
                                response.hasVoted
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-[var(--color-burgundy)] text-white'
                              }`}
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {response.hasVoted ? 'Voted' : 'Vote'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleDerepartie;
