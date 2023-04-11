const db = require("../../config/postgres");

module.exports = async (req, res) => {
  try {
    const { orgnaam, orgcode, multipliercode, contact, contactmail, boamail } =
      req.body;

    if (req.user.role !== "superMario") {
      res.status(401).send({ message: "Niet geautoriseerd" });
    }

    if (
      !(
        orgnaam &&
        orgcode &&
        multipliercode &&
        contact &&
        contactmail &&
        boamail
      )
    ) {
      res.status(400).send({ message: "Niet alle velden gevuld" });
      return;
    }

    // orgcode moet uniek zijn
    let check = await db.query(
      `SELECT * FROM organisations where orgcode = $1`,
      [orgcode]
    );

    if (check.rowCount > 0) {
      res.status(400).send({ message: "Organisatie code al in gebruik" });
      return;
    }

    let result = await db.query(
      `INSERT INTO organisations (orgnaam, orgcode, multipliercode, contactpersoon, contactmail, boamail) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [orgnaam, orgcode, multipliercode, contact, contactmail, boamail]
    );

    if (!result || result.rows.length === 0) {
      res.status(400).send({ message: "Aanmaken nieuwe organisatie mislukt" });
      return;
    }

    res.status(200).send({ message: "Nieuwe organisatie aangemaakt" });
  } catch (error) {
    res.status(400).send({ message: "Aanmaken nieuwe organisatie mislukt" });
    console.log(error);
  }
};
