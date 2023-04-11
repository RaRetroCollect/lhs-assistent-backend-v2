const db = require("../../config/postgres");

module.exports = async (req, res) => {
  try {
    let { gemeente, organisation } = req.body;

    let organisationId;

    if (organisation) {
      let organisationComplete = organisation.split("|");

      organisation = organisationComplete[0];
      organisationId = organisationComplete[1];
    }

    if (req.user.role !== "superMario") {
      // admin maakt altijd een user binnen de eigen organisatie aan
      organisation = req.user.organisation;
      organisationId = req.user.organisationid;
    }

    if (!(gemeente && organisation)) {
      res.status(400).send({ message: "Niet alle velden gevuld" });
      return;
    }

    // username moet uniek zijn
    let check = await db.query(`SELECT * FROM gemeentes where gemeente = $1`, [
      gemeente,
    ]);

    if (check.rowCount > 0) {
      res.status(400).send({ message: "Gemeente al in gebruik" });
      return;
    }

    let result = await db.query(
      `INSERT INTO gemeentes (gemeente, organisationid) VALUES ($1, $2) RETURNING *`,
      [gemeente, organisationId]
    );

    if (!result || result.rows.length === 0) {
      res.status(400).send({ message: "Aanmaken nieuwe gemeente mislukt" });
      return;
    }

    res.status(200).send({ message: "Nieuwe gemeente aangemaakt" });
  } catch (error) {
    res.status(400).send({ message: "Aanmaken nieuwe gemeente mislukt" });
    console.log(error);
  }
};
