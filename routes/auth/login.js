const {
  getToken,
  getRefreshToken,
  COOKIE_OPTIONS,
} = require("../../authenticate");
const { updateRefreshToken, usernameExists } = require("../../utils/helper");

module.exports = async (req, res) => {
  try {
    const token = getToken({ username: req.user.username });
    const refreshToken = getRefreshToken({ username: req.user.username });
    await updateRefreshToken(req.user.username, refreshToken);
    const user = await usernameExists(req.user.username);

    if (!user) {
      res.status(400).send({
        message: "Gebruiker niet gevonden.",
        description: "Geef de juiste gebruikersnaam op.",
      });
    } else {
      res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
      res.status(200).json(token);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
