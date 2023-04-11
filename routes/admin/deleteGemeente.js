const db = require("../../config/postgres");

module.exports = async (req, res) => {
  try {
    const { pkey } = req.body;

    if (!pkey) {
      res
        .status(400)
        .send({ message: "Niet alle verplichte velden zijn gevuld" });
      return;
    }

    let result = await db.query(
      `DELETE FROM gemeentes WHERE pkey = $1 RETURNING *`,
      [pkey]
    );

    if (!result || result.rows.length === 0) {
      res.status(400).send({ message: "Verwijderen gemeente mislukt" });
      return;
    }

    res.status(200).send({ message: "Gemeente verwijderd." });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Verwijderen gemeente mislukt" });
  }
};
