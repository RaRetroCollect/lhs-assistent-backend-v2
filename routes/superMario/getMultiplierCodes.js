const db = require("../../config/postgres");

module.exports = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT DISTINCT multipliercode FROM multipliers`
    );

    if (!result || result.rows.length === 0) {
      res.status(400).send("Geen multipliers gevonden");
      return;
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
  }
};
