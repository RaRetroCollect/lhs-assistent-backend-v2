const db = require("../../config/postgres");

module.exports = async (req, res) => {
  try {
    let { organisatie } = req.query;

    // wanneer geen super mario, altijd alleen eigen organisatie
    if (req.user.role !== "superMario") {
      organisatie = req.user.organisationid;
    }

    let result;
    if (
      (!organisatie || organisatie === "Alles") &&
      req.user.role === "superMario"
    ) {
      result = await db.query(
        `SELECT u.pkey, u.username, u.email, u.role, u.firstname, u.lastname, u.sex, u.inactive, o.orgnaam as organisation FROM users u ` +
          `LEFT JOIN organisations o on u.organisationid = CAST(o.pkey AS varchar) ` +
          `WHERE u.role <> 'superMario' AND (u.deleted = false OR u.deleted ISNULL)`
      );
    } else {
      result = await db.query(
        `SELECT pkey, username, email, role, firstname, lastname, sex, inactive FROM users WHERE role <> 'superMario' AND (deleted = false OR deleted ISNULL) AND organisationid = $1;`,
        [organisatie]
      );
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
  }
};
