"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.initializeDatabase = initializeDatabase;
exports.closeDatabase = closeDatabase;
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dbPath = process.env.DATABASE_PATH || './data/app.db';
const dataDir = path_1.default.dirname(dbPath);
if (!fs_1.default.existsSync(dataDir)) {
    fs_1.default.mkdirSync(dataDir, { recursive: true });
}
exports.db = new sqlite3_1.default.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    }
    else {
        console.log('Connected to SQLite database');
    }
});
async function initializeDatabase() {
    return new Promise((resolve, reject) => {
        exports.db.serialize(() => {
            exports.db.run(`
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
            exports.db.run(`
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
            exports.db.run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)', (err) => {
                if (err)
                    console.error('Error creating email index:', err);
            });
            exports.db.run('CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)', (err) => {
                if (err)
                    console.error('Error creating google_id index:', err);
            });
            exports.db.run('CREATE INDEX IF NOT EXISTS idx_profile_updates_user_id ON profile_updates(user_id)', (err) => {
                if (err)
                    console.error('Error creating user_id index:', err);
            });
            exports.db.run('CREATE INDEX IF NOT EXISTS idx_profile_updates_workflow_id ON profile_updates(workflow_id)', (err) => {
                if (err)
                    console.error('Error creating workflow_id index:', err);
            });
            resolve();
        });
    });
}
function closeDatabase() {
    exports.db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        }
        else {
            console.log('Database connection closed');
        }
    });
}
//# sourceMappingURL=init.js.map