const db = require("../../config/postgres");

module.exports = async (req, res) => {
  try {
    const { pkey } = req.params;

    if (!pkey) {
      res.status(400).send("Niet alle verplichte velden zijn gevuld");
      return;
    }

    let result = await db.query(`SELECT * FROM organisations WHERE pkey = $1`, [
      pkey,
    ]);

    if (!result || result.rows.length === 0) {
      res.status(400).send("Ophalen organisatie mislukt");
      return;
    }

    console.log(result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
  }
};
