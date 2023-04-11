const jwt = require("jsonwebtoken");
const { tokenKey } = require("../config/config");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.token;

    if (!authHeader) {
      return res.status(403).json("Niet geautoriseerd.");
    }

    const token = authHeader.split(" ")[0];

    const payload = jwt.verify(token, tokenKey);

    res.locals.user = {
      userid: payload.user_id,
      userId: payload.userId,
      role: payload.role,
      organisation: payload.organisation,
      organisationName: payload.organisationName,
      organisationId: payload.organisationId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      sex: payload.sex,
    };

    next();
  } catch (error) {
    return res.status(403).json("Niet geautoriseerd.");
  }
};
