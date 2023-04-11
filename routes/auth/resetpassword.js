const db = require("../../config/postgres");
const bcrypt = require("bcrypt");

const saltRounds = 10;

module.exports = async (req, res) => {
  try {
    const { userid, password } = req.body;

    // Zijn zowel userid als password gevuld?
    if (!(userid && password)) {
      res.status(400).send({ message: "Niet alle velden gevuld" });
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const useridInt = userid * 1;

    let result = await db.query(
      `UPDATE users SET password = $1 WHERE pkey = $2 RETURNING *`,
      [hashedPassword, useridInt]
    );

    console.log(result);

    if (!result || result.rows.length === 0) {
      res
        .status(400)
        .send({ message: "Aanpassen wachtwoord mislukt om onbekende reden" });
      return;
    }

    res.status(200).send({ message: `wachtwoord succesvol aangepast` });
    return;
  } catch (error) {
    console.log(error);
    res.status(200).send();
  }
};
