const passport = require("passport");
const AzureAdOAuth2Strategy = require("passport-azure-ad-oauth2").Strategy;
const jwt = require("jsonwebtoken");

const clientId = process.env.AZURE_CLIENT_ID;
const clientSecret = process.env.AZURE_CLIENT_SECRET;

passport.use(
  new AzureAdOAuth2Strategy(
    {
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: "/users/login/azure/callback",
      useCommonEndpoint: true,
    },
    async (accessToken, refreshToken, params, profile, done) => {
      try {
        const rawUserData = jwt.decode(params.id_token);
        const user = rawUserData.email;
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
