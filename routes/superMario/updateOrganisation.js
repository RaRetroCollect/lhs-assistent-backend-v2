const db = require("../../config/postgres");

module.exports = async (req, res) => {
  try {
    const {
      pkey,
      orgnaam,
      orgcode,
      multipliercode,
      contact,
      contactmail,
      boamail,
    } = req.body;

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

    let result = await db.query(
      `UPDATE organisations set orgnaam = $2, orgcode = $3, multipliercode = $4, contactpersoon = $5, contactmail = $6, boamail = $7 WHERE pkey = $1 RETURNING *`,
      [pkey, orgnaam, orgcode, multipliercode, contact, contactmail, boamail]
    );

    if (!result || result.rows.length === 0) {
      res
        .status(400)
        .send({ message: "Aanpassen organisatie mislukt om onbekende reden" });
      return;
    }
    res.status(200).send({ message: `Organisatie ${orgnaam} aangepast.` });
  } catch (error) {
    console.log(error);
  }
};
