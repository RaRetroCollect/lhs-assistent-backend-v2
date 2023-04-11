const jwt = require("jsonwebtoken");
const { resetPwTokenKey } = require("../config/config");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.token;

    if (!authHeader) {
      return res.status(403).json("Niet geautoriseerd.");
    }

    const token = authHeader.split(" ")[0];

    const payload = jwt.verify(token, resetPwTokenKey);

    if (payload) {
      next();
    } else {
      return res.status(403).json("Niet geautoriseerd.");
    }
  } catch (error) {
    return res.status(403).json("Niet geautoriseerd.");
  }
};
