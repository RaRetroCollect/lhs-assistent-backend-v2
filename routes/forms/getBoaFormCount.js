const db = require("../../config/postgres");

module.exports = async (req, res) => {
  try {
    let organisationid = req.user.organisationid;

    let result = await db.query(
      `SELECT COUNT(*) from rapporten where organisationid = $1 and reviewed = false`,
      [organisationid]
    );

    if (!result || result.rows.length === 0) {
      res.status(400).send("Geen openstaande rapporten gevonden.");
      return;
    }

    result = result.rows;

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};
