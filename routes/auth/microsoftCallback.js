const { getRefreshToken, COOKIE_OPTIONS } = require("../../authenticate");
const { updateRefreshToken, usernameExists } = require("../../utils/helper");

module.exports = async (req, res, next) => {
  try {
    const refreshToken = getRefreshToken({ username: req.user.username });
    await updateRefreshToken(req.user.username, refreshToken);
    const user = await usernameExists(req.user.username);

    if (!user) {
      console.log("HIERO");
      res.statusCode = 500;
      //TODO onderstaan redirecten naar login niet gelukt!
      res.send();
    } else {
      res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
      //TODO onderstaande naar juiste URL
      res
        .status(200)
        .send(`<script>window.location.href="${process.env.LHS_URL}"</script>`);
    }
  } catch (error) {
    console.log(error);
  }
};
