const db = require("../../config/postgres");

module.exports = async (req, res) => {
  try {
    let {
      pkey,
      username,
      email,
      role,
      firstName,
      lastName,
      sex,
      organisationId,
    } = req.body;

    // admin kan altijd alleen een user binnen organisatie wijzigen
    if (req.user.role !== "superMario") {
      organisationId = req.user.organisationid;
    }

    if (
      !(
        username &&
        email &&
        organisationId &&
        role &&
        firstName &&
        lastName &&
        sex
      )
    ) {
      res.status(400).send({ message: "Niet alle velden gevuld" });
      return;
    }

    let result = await db.query(
      `UPDATE users set username = $2, email = $3, organisationid = $4, role = $5, firstname = $6, lastname = $7, sex = $8 WHERE pkey = $1 RETURNING *`,
      [pkey, username, email, organisationId, role, firstName, lastName, sex]
    );

    if (!result || result.rows.length === 0) {
      res
        .status(400)
        .send({ message: "Aanpassen gebruiker mislukt om onbekende reden" });
      return;
    }
    res.status(200).send({ message: `Gebruiker ${username} aangepast.` });
  } catch (error) {
    console.log(error);
  }
};
