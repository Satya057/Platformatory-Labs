import { db } from './init';

export interface User {
  id: number;
  email: string;
  google_id?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  city?: string;
  pincode?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdate {
  id: number;
  user_id: number;
  workflow_id: string;
  update_data: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export class UserRepository {
  // Find user by email
  static async findByEmail(email: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err: any, row: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(row as User || null);
          }
        }
      );
    });
  }

  // Find user by Google ID
  static async findByGoogleId(googleId: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE google_id = ?',
        [googleId],
        (err: any, row: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(row as User || null);
          }
        }
      );
    });
  }

  // Find user by ID
  static async findById(id: number): Promise<User | null> {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE id = ?',
        [id],
        (err: any, row: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(row as User || null);
          }
        }
      );
    });
  }

  // Create new user
  static async create(userData: Partial<User>): Promise<User> {
    return new Promise((resolve, reject) => {
      const { email, google_id, first_name, last_name, phone_number, city, pincode } = userData;
      
      db.run(
        `INSERT INTO users (email, google_id, first_name, last_name, phone_number, city, pincode)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [email, google_id, first_name, last_name, phone_number, city, pincode],
        function(err: any) {
          if (err) {
            reject(err);
          } else {
            // Fetch the created user
            this.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err: any, row: any) => {
              if (err) {
                reject(err);
              } else {
                resolve(row as User);
              }
            });
          }
        }
      );
    });
  }

  // Update user profile
  static async updateProfile(userId: number, profileData: Partial<User>): Promise<User> {
    return new Promise((resolve, reject) => {
      const { first_name, last_name, phone_number, city, pincode } = profileData;
      
      db.run(
        `UPDATE users 
         SET first_name = ?, last_name = ?, phone_number = ?, city = ?, pincode = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [first_name, last_name, phone_number, city, pincode, userId],
        function(err: any) {
          if (err) {
            reject(err);
          } else {
            // Fetch the updated user
            this.get('SELECT * FROM users WHERE id = ?', [userId], (err: any, row: any) => {
              if (err) {
                reject(err);
              } else {
                resolve(row as User);
              }
            });
          }
        }
      );
    });
  }

  // Create or update user from OAuth
  static async upsertFromOAuth(oauthData: {
    email: string;
    google_id: string;
    first_name?: string;
    last_name?: string;
  }): Promise<User> {
    return new Promise((resolve, reject) => {
      const { email, google_id, first_name, last_name } = oauthData;
      
      db.run(
        `INSERT OR REPLACE INTO users (email, google_id, first_name, last_name, updated_at)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [email, google_id, first_name, last_name],
        function(err: any) {
          if (err) {
            reject(err);
          } else {
            // Fetch the user
            this.get('SELECT * FROM users WHERE email = ?', [email], (err: any, row: any) => {
              if (err) {
                reject(err);
              } else {
                resolve(row as User);
              }
            });
          }
        }
      );
    });
  }

  // Create profile update record
  static async createProfileUpdate(updateData: {
    user_id: number;
    workflow_id: string;
    update_data: string;
  }): Promise<ProfileUpdate> {
    return new Promise((resolve, reject) => {
      const { user_id, workflow_id, update_data } = updateData;
      
      // First, insert the record
      db.run(
        `INSERT INTO profile_updates (user_id, workflow_id, update_data)
         VALUES (?, ?, ?)`,
        [user_id, workflow_id, update_data],
        function(err: any) {
          if (err) {
            reject(err);
          } else {
            // Now, fetch the created record using a new db.get call
            db.get('SELECT * FROM profile_updates WHERE id = ?', [this.lastID], (err: any, row: any) => {
              if (err) {
                reject(err);
              } else {
                resolve(row as ProfileUpdate);
              }
            });
          }
        }
      );
    });
  }

  // Update profile update status by workflow ID
  static async updateProfileUpdateStatus(workflowId: string, status: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE profile_updates 
         SET status = ?, updated_at = CURRENT_TIMESTAMP
         WHERE workflow_id = ?`,
        [status, workflowId],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  // Update profile update status by user ID
  static async updateProfileUpdateStatusByUserId(userId: number, status: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE profile_updates 
         SET status = ?, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ? AND status = 'pending'
         ORDER BY created_at DESC
         LIMIT 1`,
        [status, userId],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  // Get profile update by workflow ID
  static async getProfileUpdateByWorkflowId(workflowId: string): Promise<ProfileUpdate | null> {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM profile_updates WHERE workflow_id = ?',
        [workflowId],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row as ProfileUpdate || null);
          }
        }
      );
    });
  }
} 