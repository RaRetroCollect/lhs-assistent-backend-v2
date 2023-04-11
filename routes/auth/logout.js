const { COOKIE_OPTIONS } = require("../../authenticate");
const { usernameExists, clearRefreshToken } = require("../../utils/helper");

module.exports = async (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  try {
    const user = await usernameExists(req.user.username);
    if (user) {
      if (user.refreshtoken !== refreshToken) {
        res.statusCode = 401;
        res.send("Unauthorized");
      } else {
        await clearRefreshToken(req.user.username);
        res.clearCookie("refreshToken", COOKIE_OPTIONS);
        res.send({ success: true });
      }
    } else {
      res.statusCode = 401;
      res.send("Unauthorized");
    }
  } catch (error) {
    res.statusCode = 500;
    console.log(error);
    res.send(error);
  }
};
