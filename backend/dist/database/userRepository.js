"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const init_1 = require("./init");
class UserRepository {
    static async findByEmail(email) {
        return new Promise((resolve, reject) => {
            init_1.db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(row || null);
                }
            });
        });
    }
    static async findByGoogleId(googleId) {
        return new Promise((resolve, reject) => {
            init_1.db.get('SELECT * FROM users WHERE google_id = ?', [googleId], (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(row || null);
                }
            });
        });
    }
    static async findById(id) {
        return new Promise((resolve, reject) => {
            init_1.db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(row || null);
                }
            });
        });
    }
    static async create(userData) {
        return new Promise((resolve, reject) => {
            const { email, google_id, first_name, last_name, phone_number, city, pincode } = userData;
            init_1.db.run(`INSERT INTO users (email, google_id, first_name, last_name, phone_number, city, pincode)
         VALUES (?, ?, ?, ?, ?, ?, ?)`, [email, google_id, first_name, last_name, phone_number, city, pincode], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    this.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, row) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(row);
                        }
                    });
                }
            });
        });
    }
    static async updateProfile(userId, profileData) {
        return new Promise((resolve, reject) => {
            const { first_name, last_name, phone_number, city, pincode } = profileData;
            init_1.db.run(`UPDATE users 
         SET first_name = ?, last_name = ?, phone_number = ?, city = ?, pincode = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`, [first_name, last_name, phone_number, city, pincode, userId], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    this.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(row);
                        }
                    });
                }
            });
        });
    }
    static async upsertFromOAuth(oauthData) {
        return new Promise((resolve, reject) => {
            const { email, google_id, first_name, last_name } = oauthData;
            init_1.db.run(`INSERT OR REPLACE INTO users (email, google_id, first_name, last_name, updated_at)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`, [email, google_id, first_name, last_name], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    this.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(row);
                        }
                    });
                }
            });
        });
    }
    static async createProfileUpdate(updateData) {
        return new Promise((resolve, reject) => {
            const { user_id, workflow_id, update_data } = updateData;
            init_1.db.run(`INSERT INTO profile_updates (user_id, workflow_id, update_data)
         VALUES (?, ?, ?)`, [user_id, workflow_id, update_data], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    this.get('SELECT * FROM profile_updates WHERE id = ?', [this.lastID], (err, row) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(row);
                        }
                    });
                }
            });
        });
    }
    static async updateProfileUpdateStatus(workflowId, status) {
        return new Promise((resolve, reject) => {
            init_1.db.run(`UPDATE profile_updates 
         SET status = ?, updated_at = CURRENT_TIMESTAMP
         WHERE workflow_id = ?`, [status, workflowId], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    static async updateProfileUpdateStatusByUserId(userId, status) {
        return new Promise((resolve, reject) => {
            init_1.db.run(`UPDATE profile_updates 
         SET status = ?, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ? AND status = 'pending'
         ORDER BY created_at DESC
         LIMIT 1`, [status, userId], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    static async getProfileUpdateByWorkflowId(workflowId) {
        return new Promise((resolve, reject) => {
            init_1.db.get('SELECT * FROM profile_updates WHERE workflow_id = ?', [workflowId], (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(row || null);
                }
            });
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=userRepository.js.map