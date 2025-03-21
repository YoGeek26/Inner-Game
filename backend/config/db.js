import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';

// In production, use an absolute path for the database
const dbPath = isProduction 
  ? path.join('/tmp', 'inner-game.db') 
  : path.join(__dirname, '../data/inner-game.db');

// Make sure the data directory exists
if (!isProduction) {
  const fs = await import('fs');
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

const initializeDatabase = async () => {
  try {
    const db = new sqlite3.Database(dbPath);
    console.log(`Database initialized at ${dbPath}`);
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export default initializeDatabase;
