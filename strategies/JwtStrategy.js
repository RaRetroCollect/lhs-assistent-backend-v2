const passport = require("passport");
const { usernameExists } = require("../utils/helper");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromHeader("token");
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await usernameExists(jwt_payload.username);
      delete user.refreshtoken;
      delete user.password;
      if (!user) return done(null, false);
      if (user) return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);
