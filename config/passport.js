// Import NPM modules
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Import local modules
const User = require("../db/models/User");

// Configure passport
function configurePassport(passport) {
  // Initialize
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Get user from database
          let user = await User.findOne({ googleID: profile.id });

          // Check if user exists
          if (user) {
            done(null, user);
          } else {
            // Create new user
            const newUser = new User({
              googleID: profile.id,
              displayName: profile.displayName,
              image: profile.photos[0].value,
            });

            // save user
            await newUser.save();
            return done(null, newUser);
          }
        } catch (err) {
          done(err);
        }
      }
    )
  );

  // Serialize and Deserialize User
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    await User.findById(id, (err, user) => done(err, user));
  });
}

// Export passport
module.exports = configurePassport;
