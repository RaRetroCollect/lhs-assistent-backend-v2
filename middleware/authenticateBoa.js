module.exports = async (req, res, next) => {
  try {
    if (["admin", "superMario", "boa"].includes(req.user.role)) {
      next();
    } else {
      return res.status(403).json("BOA kon niet geverifieerd worden");
    }
  } catch (error) {
    console.log(error);
    return res.status(403).json("BOA kon niet geverifieerd worden");
  }
};
