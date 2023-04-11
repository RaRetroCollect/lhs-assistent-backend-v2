const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { usernameExists, matchPassword } = require("../utils/helper");

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await usernameExists(username);
        if (!user) return done(null, false);
        const isMatch = await matchPassword(password, user.password);
        if (!isMatch) return done(null, false);
        if (user && isMatch) {
          delete user.password;
          return done(null, user);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
