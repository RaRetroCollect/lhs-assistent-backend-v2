const jwt = require("jsonwebtoken");

const {
  getToken,
  getRefreshToken,
  COOKIE_OPTIONS,
} = require("../../authenticate");
const { updateRefreshToken, usernameExists } = require("../../utils/helper");

module.exports = async (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  if (refreshToken) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      const userId = payload.username;
      const user = await usernameExists(userId);

      if (user) {
        if (user.refreshtoken !== refreshToken) {
          res.statusCode = 401;
          res.send("Unauthorized");
        } else {
          const token = getToken({
            username: userId,
          });
          const newRefreshToken = getRefreshToken({
            username: userId,
          });

          await updateRefreshToken(userId, newRefreshToken);
          res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
          res.send({ succes: true, token });
        }
      } else {
        res.statusCode = 401;
        res.send("Unauthorized");
      }
    } catch (error) {
      console.log(error);
      res.statusCode = 401;
      res.send("Unauthorized");
    }
  } else {
    res.statusCode = 401;
    res.send("Unauthorized");
  }
};
