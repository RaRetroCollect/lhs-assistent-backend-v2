const db = require("../../config/postgres");

module.exports = async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM organisations`);

    if (!result || result.rows.length === 0) {
      res.status(400).send("Aanmaken nieuwe gebruiker mislukt");
      return;
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
  }
};
