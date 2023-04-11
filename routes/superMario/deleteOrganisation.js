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

    // eerst controleren of er nog gebruikers niet verwijderd zijn
    let checkActiveUsers = await db.query(
      `SELECT COUNT(*) FROM users WHERE organisationid = $1 AND (deleted ISNULL or deleted = false)`,
      [pkey]
    );

    if (checkActiveUsers.rows[0].count > 0) {
      res.status(400).send({
        message:
          "Er zijn nog niet verwijderde gebruikers voor deze organisatie",
      });
      return;
    }

    let result = await db.query(
      `DELETE FROM organisations WHERE pkey = $1 RETURNING *`,
      [pkey]
    );

    if (!result || result.rows.length === 0) {
      res.status(400).send({ message: "Verwijderen organisatie mislukt" });
      return;
    }
    res.status(200).send({ message: "Organisatie verwijderd." });
  } catch (error) {
    console.log(error);
  }
};
