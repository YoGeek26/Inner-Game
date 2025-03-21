import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import challengesRoutes from './routes/challenges.js';
import articlesRoutes from './routes/articles.js';
import aiRoutes from './routes/ai.js';
import initializeDatabase from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Init middleware
app.use(express.json());
app.use(cors());

// Add health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Initialize database connection
const initApp = async () => {
  try {
    const db = await initializeDatabase();
    
    // Set up database tables if they don't exist
    await setupDatabase(db);
    
    // Make DB available to routes
    app.locals.db = db;
    
    // Define routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', usersRoutes);
    app.use('/api/challenges', challengesRoutes);
    app.use('/api/articles', articlesRoutes);
    app.use('/api/ai', aiRoutes);
    
    // Check if we're in production
    if (process.env.NODE_ENV === 'production') {
      const distPath = path.join(__dirname, '../dist');
      
      // Verify that the dist directory exists
      if (fs.existsSync(distPath)) {
        console.log('Static directory exists, serving frontend files from:', distPath);
        
        // Serve static files
        app.use(express.static(distPath));
        
        // Send all other requests to index.html
        app.get('*', (req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      } else {
        console.error('Error: Frontend build directory does not exist at:', distPath);
        app.get('/', (req, res) => {
          res.send('API running, but frontend files are not available. Please build the frontend.');
        });
      }
    } else {
      // Basic route for development
      app.get('/', (req, res) => {
        res.send('Inner Game API Running in Development Mode');
      });
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
  } catch (err) {
    console.error('Server initialization error:', err);
    process.exit(1);
  }
};

// Set up database tables (existing setupDatabase function remains unchanged)
const setupDatabase = async (db) => {
  // Your existing setupDatabase code
  try {
    // Users table
    await db.exec(`
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

    // Existing tables setup...
    // (rest of your existing database setup code)
    
    console.log('Database tables initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err.message);
    throw err;
  }
};

// Start the application
initApp();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

// Handle server shutdown
process.on('SIGINT', () => {
  if (app.locals.db) {
    app.locals.db.close();
    console.log('Database connection closed');
  }
  process.exit(0);
});
