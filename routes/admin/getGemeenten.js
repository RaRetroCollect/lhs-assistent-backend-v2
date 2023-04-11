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
        `SELECT g.pkey, g.gemeente, o.orgnaam as organisation FROM gemeentes g ` +
          `LEFT JOIN organisations o on g.organisationid = CAST(o.pkey AS varchar) ` +
          `ORDER BY g.gemeente;`
      );
    } else {
      result = await db.query(
        `SELECT pkey, gemeente FROM gemeentes WHERE organisationid = $1 ORDER BY gemeente;`,
        [organisatie]
      );
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
  }
};
