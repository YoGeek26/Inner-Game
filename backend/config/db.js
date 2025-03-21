import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always use /tmp for database in Railway environment
const dbPath = '/tmp/inner-game.db';

const initializeDatabase = async () => {
  try {
    // Ensure SQLite has proper permissions in the environment
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    console.log(`Database initialized at ${dbPath}`);
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export default initializeDatabase;
