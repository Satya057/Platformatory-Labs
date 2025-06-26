import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserRepository, User } from '../database/userRepository';
import { generateToken } from '../middleware/auth';

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await UserRepository.findById(id);
    done(null, user || false);
  } catch (error) {
    done(error, false);
  }
});

// Google OAuth2 Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/auth/google/callback',
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile.emails || !profile.emails[0]) {
          return done(new Error('No email found in Google profile'), false);
        }

        const email = profile.emails[0].value;
        const googleId = profile.id;
        const firstName = profile.name?.givenName;
        const lastName = profile.name?.familyName;

        // Check if user exists
        let user = await UserRepository.findByGoogleId(googleId);
        
        if (!user) {
          // Check if user exists by email
          user = await UserRepository.findByEmail(email);
          
          if (user) {
            // Update existing user with Google ID
            user = await UserRepository.upsertFromOAuth({
              email,
              google_id: googleId,
              first_name: firstName,
              last_name: lastName
            });
          } else {
            // Create new user
            user = await UserRepository.create({
              email,
              google_id: googleId,
              first_name: firstName,
              last_name: lastName
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport; 