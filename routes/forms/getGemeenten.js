const db = require("../../config/postgres");

module.exports = async (req, res) => {
  try {
    let { organisatie } = req.query;

    // wanneer geen super mario, altijd alleen eigen organisatie
    if (req.user.role !== "superMario") {
      organisatie = req.user.organisationid;
    }

    // alleen super mario mag alle gemeentes opvragen
    if (
      (!organisatie || organisatie === "Alles") &&
      req.user.role === "superMario"
    ) {
      result = await db.query(`SELECT * from gemeentes ORDER BY gemeente`);
    } else {
      result = await db.query(
        `SELECT * from gemeentes where organisationid = $1 ORDER BY gemeente`,
        [organisatie]
      );
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
  }
};
