const db = require("../../config/postgres");

module.exports = async (req, res) => {
  try {
    let { pkey, gemeente, organisationId } = req.body;

    // admin kan altijd alleen een user binnen organisatie wijzigen
    if (req.user.role !== "superMario") {
      organisationId = req.user.organisationid;
    }

    if (!(gemeente && organisationId)) {
      res.status(400).send({ message: "Niet alle velden gevuld" });
      return;
    }

    let result = await db.query(
      `UPDATE gemeentes set gemeente = $2, organisationid = $3 WHERE pkey = $1 RETURNING *`,
      [pkey, gemeente, organisationId]
    );

    if (!result || result.rows.length === 0) {
      res
        .status(400)
        .send({ message: "Aanpassen gemeente mislukt om onbekende reden" });
      return;
    }
    res.status(200).send({ message: `Gemeente ${gemeente} aangepast.` });
  } catch (error) {
    console.log(error);
  }
};
