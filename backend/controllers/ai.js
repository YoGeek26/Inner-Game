import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Configuration for OpenRouter API
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Models
const STANDARD_MODEL = 'anthropic/claude-3-opus'; // High quality but expensive
const PREMIUM_MODEL = 'anthropic/claude-3-opus'; // Premium users get the best model
const FALLBACK_MODEL = 'anthropic/claude-3-haiku'; // Faster, cheaper fallback

// @desc    Chat with AI
// @route   POST /api/ai/chat
export const chat = async (req, res) => {
  const { messages, isPremium } = req.body;
  
  // Validate input
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages format' });
  }
  
  try {
    // Choose model based on user status
    const model = isPremium ? PREMIUM_MODEL : STANDARD_MODEL;
    
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: model,
        messages: messages,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:5000',
          'X-Title': 'Inner Game App'
        }
      }
    );
    
    const aiMessage = response.data.choices[0].message.content;
    
    res.json({ message: aiMessage });
  } catch (error) {
    console.error('OpenRouter API error:', error.response?.data || error.message);
    
    // Try fallback model if the main model fails
    try {
      const fallbackResponse = await axios.post(
        OPENROUTER_URL,
        {
          model: FALLBACK_MODEL,
          messages: messages,
          max_tokens: 800
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.APP_URL || 'http://localhost:5000',
            'X-Title': 'Inner Game App'
          }
        }
      );
      
      const fallbackMessage = fallbackResponse.data.choices[0].message.content;
      
      res.json({ 
        message: fallbackMessage, 
        notice: 'Using fallback model due to service issues.'
      });
    } catch (fallbackError) {
      console.error('Fallback model error:', fallbackError.response?.data || fallbackError.message);
      res.status(500).json({ error: 'Failed to generate AI response' });
    }
  }
};

// @desc    Simulate conversation
// @route   POST /api/ai/simulate
export const simulateConversation = async (req, res) => {
  const { scenario, userMessage } = req.body;
  
  // Validate input
  if (!scenario || !userMessage) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    // Create prompt with scenario context
    const systemPrompt = `You are roleplaying as ${scenario.otherPersonName}, a person with the following personality: ${scenario.otherPersonPersonality}. 
    The scenario is: ${scenario.context}. You are at ${scenario.location}. 
    ${scenario.situationDetails}
    
    Your responses should be realistic, conversational, and reflect how a real person would respond in this situation. 
    Keep responses to 1-3 sentences generally.
    Don't be too eager or too difficult - respond naturally based on the personality and context.`;
    
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];
    
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: FALLBACK_MODEL, // Using faster model for simulations
        messages: messages,
        max_tokens: 300
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:5000',
          'X-Title': 'Inner Game App'
        }
      }
    );
    
    const simulatedResponse = response.data.choices[0].message.content;
    
    res.json({ response: simulatedResponse });
  } catch (error) {
    console.error('Simulation error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to simulate conversation' });
  }
};

// @desc    Analyze conversation
// @route   POST /api/ai/analyze
export const analyzeConversation = async (req, res) => {
  const { conversation } = req.body;
  
  // Validate input
  if (!conversation) {
    return res.status(400).json({ error: 'Missing conversation text' });
  }
  
  try {
    const systemPrompt = `
    You are an expert dating and social skills coach. Analyze the following conversation from a dating app or text exchange.
    The conversation format will have "You:" for the user's messages and "Them:" for the other person's messages.
    
    Provide helpful, actionable feedback on:
    1. Overall impression and effectiveness
    2. Specific strengths in the conversation
    3. Areas that could be improved 
    4. Practical suggestions to improve future conversations
    
    Be direct but supportive in your analysis. Focus on the most important patterns rather than every single message.`;
    
    const messages = [
      { role: 'system', content: systemPrompt },
      { role:  'user', content: `Please analyze this conversation and provide feedback:\n\n${conversation}` }
    ];
    
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: STANDARD_MODEL,
        messages: messages,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:5000',
          'X-Title': 'Inner Game App'
        }
      }
    );
    
    const analysis = response.data.choices[0].message.content;
    
    res.json({ analysis });
  } catch (error) {
    console.error('Analysis error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to analyze conversation' });
  }
};

// @desc    Get detailed conversation analysis
// @route   POST /api/ai/analyze/detailed
export const getDetailedAnalysis = async (req, res) => {
  const { conversation } = req.body;
  
  // Validate input
  if (!conversation) {
    return res.status(400).json({ error: 'Missing conversation text' });
  }
  
  try {
    const systemPrompt = `
    You are an expert dating and social skills coach. Analyze the following conversation from a dating app or text exchange in detail.
    
    Provide a structured JSON response with the following format:
    {
      "overallScore": number, // 0-100 score for the overall conversation quality
      "categories": {
        "opening": number, // 0-100 score for conversation opening
        "engagement": number, // how well they built engagement
        "storytelling": number, // storytelling ability
        "questioning": number, // quality and timing of questions
        "humor": number, // appropriate use of humor
        "confidence": number, // projected confidence level
        "closing": number // how well they handled wrapping up or asking out
      },
      "strengths": ["strength1", "strength2", ...], // array of specific strengths identified
      "weaknesses": ["weakness1", "weakness2", ...], // array of areas for improvement
      "suggestions": ["suggestion1", "suggestion2", ...], // specific actionable advice
      "statistics": {
        "messageCount": {
          "user": number, // count of user messages
          "other": number, // count of other person's messages
          "ratio": number // ratio of user:other messages
        },
        "averageLength": {
          "user": number, // average character length of user messages
          "other": number // average character length of other messages
        },
        "responseTime": {
          "average": number, // estimated average response time in minutes
          "consistent": boolean // whether response timing was consistent
        },
        "questionRatio": number // what portion of user messages contained questions (0-1)
      }
    }
    
    For each category score, use these guidelines:
    - 0-40: Poor performance
    - 41-60: Average performance
    - 61-80: Good performance
    - 81-100: Excellent performance
    
    Use the actual conversation to reasonably estimate statistics like message counts and lengths. For response times, make a reasonable estimate based on context clues, or set to null if not inferrable.`;
    
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analyze this conversation and provide the detailed JSON response:\n\n${conversation}` }
    ];
    
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: PREMIUM_MODEL, // Using premium model for detailed analysis
        messages: messages,
        max_tokens: 1500,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:5000',
          'X-Title': 'Inner Game App'
        }
      }
    );
    
    let analysisResult;
    
    try {
      // Try to parse the result as JSON
      analysisResult = JSON.parse(response.data.choices[0].message.content);
    } catch (parseError) {
      // If parsing fails, try to extract JSON from the text
      const content = response.data.choices[0].message.content;
      const jsonMatch = content.match(/({[\s\S]*})/);
      if (jsonMatch) {
        try {
          analysisResult = JSON.parse(jsonMatch[0]);
        } catch (extractError) {
          throw new Error('Failed to parse analysis result');
        }
      } else {
        throw new Error('Failed to extract JSON from analysis result');
      }
    }
    
    res.json(analysisResult);
  } catch (error) {
    console.error('Detailed analysis error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get detailed conversation analysis' });
  }
};

// @desc    Generate personalized challenges
// @route   POST /api/ai/challenges/generate
export const generateChallenges = async (req, res) => {
  const { category, difficulty, userLevel } = req.body;
  
  // Validate input
  if (!category || !difficulty) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const systemPrompt = `
    You are an expert dating and social skills coach. Generate 3 personalized challenges for a user focused on the category "${category}" with difficulty level "${difficulty}".
    
    Create challenges in this JSON format:
    [
      {
        "id": "unique-id", // Generate a unique ID
        "title": "Challenge Title",
        "description": "Brief description of the challenge goal",
        "category": "${category}", // Use the provided category
        "difficulty": "${difficulty}", // Use the provided difficulty
        "steps": [
          {
            "id": "step-1",
            "description": "First step description"
          },
          // More steps (3-5 total)
        ],
        "xpReward": number, // Suggested XP value based on difficulty
        "timeEstimate": "Time estimate string",
        "requiredLevel": number, // Suggested required level based on difficulty
        "badgeReward": { // Optional badge reward
          "id": "badge-id",
          "name": "Badge Name",
          "icon": "appropriate-icon-name",
          "rarity": "common|uncommon|rare|epic|legendary"
        }
      }
      // 2 more challenges
    ]
    
    For challenge difficulty:
    - "beginner": simple tasks, lower risk, minimal social discomfort, requiredLevel 1-3, xpReward 100-200
    - "intermediate": moderate difficulty, some social risk, requiredLevel 4-6, xpReward 200-300
    - "advanced": challenging tasks, higher social risk, requiredLevel 7+, xpReward 300-500
    
    For categories, focus on:
    - "approaching": challenges about initiating contact with new people
    - "conversation": challenges about improving conversation skills
    - "dating": challenges about dating scenarios and planning
    - "inner-game": challenges about confidence, mindset, and psychology
    - "texting": challenges about messaging and digital communication
    
    Make each challenge practical, specific, and actionable with clear steps.`;
    
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate 3 ${difficulty} challenges for the "${category}" category. The user's current level is ${userLevel || 'unspecified'}.` }
    ];
    
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: STANDARD_MODEL,
        messages: messages,
        max_tokens: 1200,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:5000',
          'X-Title': 'Inner Game App'
        }
      }
    );
    
    let challenges;
    
    try {
      const content = response.data.choices[0].message.content;
      challenges = JSON.parse(content);
      
      // Ensure it's an array
      if (!Array.isArray(challenges)) {
        if (challenges.challenges && Array.isArray(challenges.challenges)) {
          challenges = challenges.challenges;
        } else {
          throw new Error('Invalid challenge format');
        }
      }
    } catch (parseError) {
      console.error('Parse error for challenges:', parseError);
      res.status(500).json({ error: 'Failed to parse challenge data' });
      return;
    }
    
    res.json({ challenges });
  } catch (error) {
    console.error('Challenge generation error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate challenges' });
  }
};

// @desc    Get daily challenge
// @route   GET /api/ai/challenges/daily
export const getDailyChallenge = async (req, res) => {
  try {
    const userId = req.user?.id;
    const userLevel = req.user?.level || 1;
    
    // In a real app, we would check if user already has a daily challenge
    // and return that if it exists. For now, we'll generate a new one each time.
    
    const categories = ['approaching', 'conversation', 'texting', 'inner-game', 'dating'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // Determine difficulty based on user level
    let difficulty;
    if (userLevel <= 3) {
      difficulty = 'beginner';
    } else if (userLevel <= 6) {
      difficulty = 'intermediate';
    } else {
      difficulty = 'advanced';
    }
    
    const systemPrompt = `
    You are an expert dating and social skills coach. Generate a single daily challenge for a user 
    focused on the category "${randomCategory}" with difficulty level "${difficulty}".
    
    Create the challenge in this JSON format:
    {
      "id": "daily-${new Date().toISOString().split('T')[0]}",
      "title": "Challenge Title",
      "description": "Brief description that explains the challenge goal",
      "category": "${randomCategory}", 
      "difficulty": "${difficulty}",
      "steps": [
        {
          "id": "step-1",
          "description": "First step description"
        },
        // 2-3 steps total
      ],
      "xpReward": number, // XP reward for completion
      "timeEstimate": "1 day", // Always "1 day" for daily challenges
      "requiredLevel": ${Math.max(1, userLevel - 1)}, // Slightly below user level
      "tips": [
        "Helpful tip 1",
        "Helpful tip 2"
      ]
    }
    
    Make the challenge practical, specific, and achievable within a single day.
    For daily challenges, focus on small actions that build habits.`;
    
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate a daily challenge for a level ${userLevel} user in the "${randomCategory}" category.` }
    ];
    
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: FALLBACK_MODEL, // Using faster model for daily challenges
        messages: messages,
        max_tokens: 800,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:5000',
          'X-Title': 'Inner Game App'
        }
      }
    );
    
    let challenge;
    
    try {
      challenge = JSON.parse(response.data.choices[0].message.content);
    } catch (parseError) {
      console.error('Parse error for daily challenge:', parseError);
      
      // Fallback to a pre-defined challenge
      challenge = {
        id: `daily-${new Date().toISOString().split('T')[0]}`,
        title: "Quick Conversation Starter",
        description: "Practice starting a conversation with a simple, friendly opener",
        category: randomCategory,
        difficulty: difficulty,
        steps: [
          {
            id: "step-1",
            description: "Find an appropriate social situation today"
          },
          {
            id: "step-2",
            description: "Start a brief conversation with someone new using a simple opener"
          },
          {
            id: "step-3",
            description: "Reflect on the interaction and note what you learned"
          }
        ],
        xpReward: 50,
        timeEstimate: "1 day",
        requiredLevel: Math.max(1, userLevel - 1),
        tips: [
          "Keep it simple and genuine",
          "Focus on the process, not the outcome",
          "Remember that brief interactions still count as success"
        ]
      };
    }
    
    res.json({ challenge });
  } catch (error) {
    console.error('Daily challenge error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate daily challenge' });
  }
};

// @desc    Get conversation advice
// @route   POST /api/ai/advice
export const getConversationAdvice = async (req, res) => {
  const { topic, skillLevel } = req.body;
  
  // Validate input
  if (!topic) {
    return res.status(400).json({ error: 'Missing topic' });
  }
  
  try {
    const level = skillLevel || 5; // Default to intermediate level
    
    const systemPrompt = `
    You are an expert dating and social skills coach. Provide specific, actionable advice about the topic "${topic}"
    tailored to a user with skill level ${level} (on a scale of 1-10, where 1 is complete beginner and 10 is expert).
    
    Include:
    - Practical techniques they can apply immediately
    - Common pitfalls to avoid
    - 1-2 example scenarios or dialogues demonstrating the advice
    - Next steps for continued improvement
    
    Be concise but thorough. Focus on actionable advice rather than just theory.
    Adapt the complexity of your advice to match their skill level.`;
    
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `I need advice about "${topic}" for my dating/social life. My skill level is ${level}/10.` }
    ];
    
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: STANDARD_MODEL,
        messages: messages,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:5000',
          'X-Title': 'Inner Game App'
        }
      }
    );
    
    const advice = response.data.choices[0].message.content;
    
    res.json({ advice });
  } catch (error) {
    console.error('Advice error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get conversation advice' });
  }
};
