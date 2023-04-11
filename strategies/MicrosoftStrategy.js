const passport = require("passport");
const MicrosoftStrategy = require("passport-microsoft").Strategy;
const jwt = require("jsonwebtoken");
const { ssoUserExists, createSsoUser, getUserById } = require("../utils/helper");

const clientId = process.env.AZURE_CLIENT_ID;
const clientSecret = process.env.AZURE_CLIENT_SECRET;

passport.use(
  new MicrosoftStrategy(
    {
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: "https://api.lhsassistent.nl/auth/login/azure/callback",
      scope: ["user.read"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const rawUserData = jwt.decode(accessToken);
        const tid = rawUserData.tid;

        profile._json.tid = tid;

        console.log(tid);

        const allowedTenants = [
          "d67d7683-72f7-45ff-9d1a-685e7fdccf6b",
          "05f12e53-e33f-43a5-8462-88fa8db6d676",
        ];

        if (allowedTenants.includes(tid)) {
          const userid = await ssoUserExists(profile.provider, profile.id);
          if (userid) {
            const user = await getUserById(userid);
            console.log("existing user:", user);
            return done(null, user);
          } else {
            //const user = await createSsoUser(profile);
            //console.log("new user", user);
            return done(null, false);
          }
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
