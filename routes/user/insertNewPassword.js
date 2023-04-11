const db = require("../../config/postgres");
const bcrypt = require("bcrypt");

const saltRounds = 10;

module.exports = async (req, res) => {
  try {
    const { pkey, password } = req.body;

    if (!(password && pkey)) {
      res.status(400).send({ message: "Niet alle velden gevuld" });
      return;
    }

    // Voordat we het password opslaan, eerst encrypten
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    let result = await db.query(
      `UPDATE users SET password = $1 WHERE pkey = $2 RETURNING *`,
      [hashedPassword, pkey]
    );

    if (!result || result.rows.length === 0) {
      res.status(400).send({ message: "Aanpassen wachtwoord mislukt" });
      return;
    }

    res.status(200).send({ message: "Wachtwoord aangepast" });
  } catch (error) {
    res.status(400).send({ message: "Aanmaken nieuwe gebruiker mislukt" });
    console.log(error);
  }
};
