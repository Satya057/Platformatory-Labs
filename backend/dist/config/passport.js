"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const userRepository_1 = require("../database/userRepository");
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await userRepository_1.UserRepository.findById(id);
        done(null, user || false);
    }
    catch (error) {
        done(error, false);
    }
});
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/auth/google/callback',
    scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        if (!profile.emails || !profile.emails[0]) {
            return done(new Error('No email found in Google profile'), false);
        }
        const email = profile.emails[0].value;
        const googleId = profile.id;
        const firstName = profile.name?.givenName;
        const lastName = profile.name?.familyName;
        let user = await userRepository_1.UserRepository.findByGoogleId(googleId);
        if (!user) {
            user = await userRepository_1.UserRepository.findByEmail(email);
            if (user) {
                user = await userRepository_1.UserRepository.upsertFromOAuth({
                    email,
                    google_id: googleId,
                    first_name: firstName,
                    last_name: lastName
                });
            }
            else {
                user = await userRepository_1.UserRepository.create({
                    email,
                    google_id: googleId,
                    first_name: firstName,
                    last_name: lastName
                });
            }
        }
        return done(null, user);
    }
    catch (error) {
        return done(error, false);
    }
}));
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map