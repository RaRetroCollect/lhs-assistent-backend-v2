const db = require("../../config/postgres");

module.exports = async (req, res) => {
  //TODO checken op organisatie
  try {
    const { pkey } = req.params;

    if (!pkey) {
      res.status(400).send("Niet alle verplichte velden zijn gevuld");
      return;
    }

    let result = await db.query(`SELECT * FROM users WHERE pkey = $1`, [pkey]);

    if (!result || result.rows.length === 0) {
      res.status(400).send("Gebruiker niet gevonden");
      return;
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
  }
};
