const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: "/users/login/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        return done(null, profile.emails[0].value);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
