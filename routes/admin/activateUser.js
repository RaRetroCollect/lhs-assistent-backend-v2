const db = require("../../config/postgres");
const { sendMail } = require("../../functions/sendMail");

module.exports = async (req, res) => {
  try {
    const { pkey } = req.body;
    const { status } = req.params;

    if (!pkey) {
      res.status(400).send({ message: "Geen pkey in bericht" });
      return;
    }

    let inactive;

    if (status === "true") {
      inactive = false;
    } else {
      inactive = true;
    }

    let getEmail = await db.query(
      `SELECT email, firstname, organisationid FROM users WHERE pkey = $1`,
      [pkey]
    );

    let email = getEmail.rows[0].email;
    let firstname = getEmail.rows[0].firstname;
    let organisationid = getEmail.rows[0].organisationid;

    let getAdmin = await db.query(
      `SELECT firstname, lastname FROM users WHERE role = 'admin' AND organisationid = $1`,
      [organisationid]
    );

    let admin = getAdmin.rows[0].firstname + " " + getAdmin.rows[0].lastname;

    let result = await db.query(
      `UPDATE users SET inactive = $1 WHERE pkey = $2 RETURNING *`,
      [inactive, pkey]
    );

    if (!result || result.rows.length === 0) {
      res.status(400).send({ message: "Verwijderen gebruiker mislukt" });
      return;
    }

    let html;

    if (inactive === true) {
      html = `<!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <title>Account LHS Assistent inactief</title>
                </head>
                <body>
                  <p>
                    Beste ${firstname},<br / >
                    <br />
                    Jouw account voor de LHS Assistent is op inactief gezet.<br />
                    Is dit niet juist of heb je er vragen over, neem dan even contact op met de beheerder van uw organisatie:<br />
                    ${admin}
                  </p><br />
                  Met vriendelijke groet,<br />
                  <br />
                  De LHS Assistent
                </body>
              </html>`;
      res.status(200).send({ message: "Gebruiker gedeactiveerd." });
    }

    if (inactive === false) {
      html = `<!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <title>Account LHS Assistent</title>
                </head>
                <body>
                  <p>
                    Beste ${firstname},<br / >
                    <br />
                    Jouw account voor de LHS Assistent is weer geactiveerd.<br />
                    Via <a href="https://app.lhsassistent.nl">https://app.lhsassistent.nl</a> kun je weer inloggen met de reeds bekende inlog gegevens.<br />
                    Is dit niet juist of heb je er vragen over, neem dan even contact op met de beheerder van uw organisatie:<br />
                    ${admin}
                  </p><br />
                  Met vriendelijke groet,<br />
                  <br />
                  De LHS Assistent
                </body>
              </html>`;

      res.status(200).send({ message: "Gebruiker geactiveerd." });
    }

    sendMail(
      `LHS Assistent`,
      `noreply@lhsassistent.nl`,
      email,
      `Account LHS Assistent`,
      ``,
      html
    );
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ message: "Activeren of deactiveren mislukt om onbekende reden" });
  }
};
