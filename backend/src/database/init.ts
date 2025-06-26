import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || './data/app.db';

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create database connection
export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database tables
export async function initializeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          google_id TEXT UNIQUE,
          first_name TEXT,
          last_name TEXT,
          phone_number TEXT,
          city TEXT,
          pincode TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating users table:', err);
          reject(err);
        }
      });

      // Profile updates history table
      db.run(`
        CREATE TABLE IF NOT EXISTS profile_updates (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          workflow_id TEXT NOT NULL,
          update_data TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating profile_updates table:', err);
          reject(err);
        }
      });

      // Create indexes for better performance
      db.run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)', (err) => {
        if (err) console.error('Error creating email index:', err);
      });

      db.run('CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)', (err) => {
        if (err) console.error('Error creating google_id index:', err);
      });

      db.run('CREATE INDEX IF NOT EXISTS idx_profile_updates_user_id ON profile_updates(user_id)', (err) => {
        if (err) console.error('Error creating user_id index:', err);
      });

      db.run('CREATE INDEX IF NOT EXISTS idx_profile_updates_workflow_id ON profile_updates(workflow_id)', (err) => {
        if (err) console.error('Error creating workflow_id index:', err);
      });

      resolve();
    });
  });
}

// Close database connection
export function closeDatabase(): void {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
  });
} 