import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import challengesRoutes from './routes/challenges.js';
import articlesRoutes from './routes/articles.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Init middleware
app.use(express.json());
app.use(cors());

// Initialize database connection
const db = new sqlite3.Database(path.join(__dirname, './data/inner-game.db'));

// Set up database tables if they don't exist
const initDb = async () => {
  try {
    // Users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        level INTEGER DEFAULT 1,
        xp INTEGER DEFAULT 0,
        joined_at TEXT NOT NULL,
        streak_days INTEGER DEFAULT 0,
        last_active TEXT,
        is_premium INTEGER DEFAULT 0,
        role TEXT DEFAULT 'user',
        has_completed_questionnaire INTEGER DEFAULT 0
      )
    `);

    // Challenges table
    db.exec(`
      CREATE TABLE IF NOT EXISTS challenges (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        steps TEXT NOT NULL,
        xp_reward INTEGER NOT NULL,
        time_estimate TEXT,
        required_level INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User challenges (relation between users and their challenges)
    db.exec(`
      CREATE TABLE IF NOT EXISTS user_challenges (
        user_id TEXT NOT NULL,
        challenge_id TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        completed_at TEXT,
        current_step INTEGER DEFAULT 0,
        PRIMARY KEY (user_id, challenge_id),
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (challenge_id) REFERENCES challenges (id)
      )
    `);

    // Skills table
    db.exec(`
      CREATE TABLE IF NOT EXISTS skills (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        max_level INTEGER DEFAULT 10,
        xp_multiplier REAL DEFAULT 1.0,
        category TEXT NOT NULL
      )
    `);

    // User skills (relation between users and their skills)
    db.exec(`
      CREATE TABLE IF NOT EXISTS user_skills (
        user_id TEXT NOT NULL,
        skill_id TEXT NOT NULL,
        level INTEGER DEFAULT 1,
        last_improved TEXT,
        PRIMARY KEY (user_id, skill_id),
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (skill_id) REFERENCES skills (id)
      )
    `);

    // Badges table
    db.exec(`
      CREATE TABLE IF NOT EXISTS badges (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT NOT NULL,
        category TEXT NOT NULL,
        rarity TEXT NOT NULL
      )
    `);

    // User badges (relation between users and their badges)
    db.exec(`
      CREATE TABLE IF NOT EXISTS user_badges (
        user_id TEXT NOT NULL,
        badge_id TEXT NOT NULL,
        earned_at TEXT NOT NULL,
        PRIMARY KEY (user_id, badge_id),
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (badge_id) REFERENCES badges (id)
      )
    `);

    // Journal entries
    db.exec(`
      CREATE TABLE IF NOT EXISTS journal_entries (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        thoughts TEXT,
        emotions TEXT,
        successes TEXT,
        challenges TEXT,
        keywords TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Articles table
    db.exec(`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT NOT NULL,
        author TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        image_url TEXT
      )
    `);

    // AI chat history
    db.exec(`
      CREATE TABLE IF NOT EXISTS ai_conversations (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS ai_messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES ai_conversations (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Insert default skills if they don't exist
    db.get('SELECT COUNT(*) as count FROM skills', [], (err, result) => {
      if (err) {
        console.error('Error checking skills:', err);
        return;
      }
      
      if (result.count === 0) {
        const defaultSkills = [
          { id: 'approach-confidence', name: 'Approach Confidence', description: 'Ability to approach new people without anxiety', max_level: 10, xp_multiplier: 1.2, category: 'approach' },
          { id: 'conversation-flow', name: 'Conversation Flow', description: 'Skill in maintaining smooth, engaging conversations', max_level: 10, xp_multiplier: 1.0, category: 'conversation' },
          { id: 'storytelling', name: 'Storytelling', description: 'Ability to tell compelling stories that create connection', max_level: 10, xp_multiplier: 1.1, category: 'conversation' },
          { id: 'text-game', name: 'Text Game', description: 'Skill in engaging text conversations that lead to dates', max_level: 10, xp_multiplier: 0.9, category: 'texting' },
          { id: 'date-planning', name: 'Date Planning', description: 'Ability to plan and execute memorable dates', max_level: 10, xp_multiplier: 1.0, category: 'dating' },
          { id: 'emotional-intelligence', name: 'Emotional Intelligence', description: 'Understanding and responding to emotions effectively', max_level: 10, xp_multiplier: 1.3, category: 'inner-game' },
          { id: 'body-language', name: 'Body Language', description: 'Awareness and control of non-verbal communication', max_level: 10, xp_multiplier: 1.1, category: 'approach' },
          { id: 'abundance-mindset', name: 'Abundance Mindset', description: 'Maintaining a positive outlook on dating opportunities', max_level: 10, xp_multiplier: 1.2, category: 'inner-game' },
        ];
        
        const insertSkill = db.prepare(`
          INSERT INTO skills (id, name, description, max_level, xp_multiplier, category)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        
        for (const skill of defaultSkills) {
          insertSkill.run(
            skill.id,
            skill.name,
            skill.description,
            skill.max_level,
            skill.xp_multiplier,
            skill.category
          );
        }
        
        console.log('Default skills inserted');
      }
    });

    // Insert default badges if they don't exist
    db.get('SELECT COUNT(*) as count FROM badges', [], (err, result) => {
      if (err) {
        console.error('Error checking badges:', err);
        return;
      }
      
      if (result.count === 0) {
        const defaultBadges = [
          { id: 'beginner', name: 'Beginner', description: 'Started your journey', icon: 'award', category: 'achievement', rarity: 'common' },
          { id: 'first-approach', name: 'First Approach', description: 'Completed your first approach challenge', icon: 'users', category: 'approach', rarity: 'common' },
          { id: 'approach-master', name: 'Approach Master', description: 'Completed 10 approach challenges', icon: 'users', category: 'approach', rarity: 'rare' },
          { id: 'conversation-starter', name: 'Conversation Starter', description: 'Completed your first conversation simulation', icon: 'message-circle', category: 'conversation', rarity: 'common' },
          { id: 'smooth-talker', name: 'Smooth Talker', description: 'Achieved a perfect score in a conversation simulation', icon: 'message-circle', category: 'conversation', rarity: 'epic' },
          { id: 'inner-work', name: 'Inner Work', description: 'Completed your first inner game routine', icon: 'target', category: 'inner-game', rarity: 'common' },
          { id: 'mind-master', name: 'Mind Master', description: 'Maintained a daily inner game routine for 30 days', icon: 'target', category: 'inner-game', rarity: 'legendary' },
          { id: 'text-guru', name: 'Text Guru', description: 'Analyzed 5 text conversations', icon: 'smartphone', category: 'conversation', rarity: 'uncommon' },
          { id: 'community-member', name: 'Community Member', description: 'Created your first forum post', icon: 'users', category: 'community', rarity: 'common' },
          { id: 'helpful-hand', name: 'Helpful Hand', description: 'Received 10 likes on your forum replies', icon: 'thumbs-up', category: 'community', rarity: 'uncommon' },
          { id: 'streak-master', name: 'Streak Master', description: 'Maintained a 30-day app streak', icon: 'zap', category: 'achievement', rarity: 'epic' },
          { id: 'date-champion', name: 'Date Champion', description: 'Successfully arranged 5 real dates', icon: 'calendar', category: 'dating', rarity: 'rare' },
        ];
        
        const insertBadge = db.prepare(`
          INSERT INTO badges (id, name, description, icon, category, rarity)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        
        for (const badge of defaultBadges) {
          insertBadge.run(
            badge.id,
            badge.name,
            badge.description,
            badge.icon,
            badge.category,
            badge.rarity
          );
        }
        
        console.log('Default badges inserted');
      }
    });

    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err.message);
  }
};

// Initialize database
initDb();

// Make DB available to routes
app.locals.db = db;

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/challenges', challengesRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/ai', aiRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Inner Game API Running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

// Handle server shutdown
process.on('SIGINT', () => {
  db.close();
  console.log('Database connection closed');
  process.exit(0);
});
