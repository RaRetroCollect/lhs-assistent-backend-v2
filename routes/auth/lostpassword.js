const db = require("../../config/postgres");
const jwt = require("jsonwebtoken");
const { resetPwTokenKey } = require("../../config/config");
const { sendMail } = require("../../functions/sendMail");

module.exports = async (req, res) => {
  try {
    let { email } = req.body;

    if (email) {
      email = email.toLowerCase();
    }

    if (!email) {
      res.status(400).send({ message: "Geef een geldig emailadres op." });
      return;
    }

    let result = await db.query(`SELECT pkey, role FROM users WHERE LOWER(email) = $1`, [email]);

    console.log(result);

    // wanneer een emailadres vaker voorkomt filteren op rol van user en dit account wijzigen
    if (result.rowCount > 1) {
      result.rows = result.rows.filter((obj) => {
        return obj.role === `user`;
      });
    }

    // wanneer na het filteren nog steeds meerdere account gevonden worden, niets doen.
    if (result.rowCount > 1 && email !== "ramonvandelft@gmail.com") {
      res.status(200).send("Mislukt neem contact op met administrator");
      return;
    }

    if (result.rowCount === 1 || ["mario@stap2.nl", "ramonvandelft@gmail.com"].includes(email)) {
      result = result.rows[0].pkey;

      console.log(result);

      const resetToken = jwt.sign(
        {
          userId: result,
        },
        resetPwTokenKey,
        {
          expiresIn: "1h",
        }
      );

      const html = `  <!DOCTYPE html>
                    <html lang="en">
                    <head>
                    <meta charset="utf-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Nieuw wachtwoord LHS Assistent</title>
                    </head>
                    <body>
                    Goedendag,<br />
                    <br />
                    Via onderstaande link kun je een nieuw wachtwoord instellen om weer toegang te krijgen tot de LHS Assistent. <br />
                    Heb je daar niet zelf om verzocht? Dan kun je dit bericht negeren. <br />
                    <br />
                    <a href="https://app.lhsassistent.nl/password-reset?userid=${result}&token=${resetToken}">Link om een nieuw wachtwoord in te stellen</a>
                    </body>
                    </html>
                    `;

      console.log(html);

      sendMail(
        `LHS Assistent`,
        `info@lhsassistent.nl`,
        email,
        `Instellen nieuw wachtwoord LHS Assistent`,
        ``,
        html
      );
    }

    res.status(200).send("resetlink verstuurd");
    return;
  } catch (error) {
    console.log(error);
    res.status(200).send();
  }
};
