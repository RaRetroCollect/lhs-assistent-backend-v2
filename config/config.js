require("dotenv").config({ path: require("find-config")(".env") });

module.exports = {
  pgUser: process.env.PG_USER,
  pgHost: process.env.PG_HOST,
  pgDatabase: process.env.PG_DATABASE,
  pgPassword: process.env.PG_PASSWORD,
  pgPort: process.env.PG_PORT,
  expressPort: process.env.EXPRESS_PORT,
  tokenKey: process.env.TOKEN_KEY,
  resetPwTokenKey: process.env.RESET_PW_TOKEN_KEY,
  lhsApiUrl: process.env.LHS_API_URL,
  lhsUrl: process.env.LHS_URL,
};
