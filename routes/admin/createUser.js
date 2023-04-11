const db = require("../../config/postgres");
const bcrypt = require("bcrypt");
const { sendMail } = require("../../functions/sendMail");

const saltRounds = 10;

module.exports = async (req, res) => {
  try {
    let {
      username,
      password,
      email,
      role,
      firstName,
      lastName,
      sex,
      organisation,
    } = req.body;

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

    if (
      !(
        username &&
        password &&
        email &&
        organisation &&
        role &&
        firstName &&
        lastName &&
        sex
      )
    ) {
      res.status(400).send({ message: "Niet alle velden gevuld" });
      return;
    }

    // username moet uniek zijn
    let check = await db.query(`SELECT * FROM users where username = $1`, [
      username,
    ]);

    if (check.rowCount > 0) {
      res.status(400).send({ message: "Gebruikersnaam al in gebruik" });
      return;
    }

    // Voordat we het password opslaan, eerst encrypten
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    let result = await db.query(
      `INSERT INTO users (username, password, email, role, firstname, lastname, sex, organisationid, ` +
        `deleted, inactive) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        username,
        hashedPassword,
        email,
        role,
        firstName,
        lastName,
        sex,
        organisationId,
        false,
        false,
      ]
    );

    if (!result || result.rows.length === 0) {
      res.status(400).send({ message: "Aanmaken nieuwe gebruiker mislukt" });
      return;
    }

    let html = `<!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <title>Account gegevens LHS Assistent</title>
                </head>
                <body>
                  <p>
                    Beste ${firstName},<br / >
                    <br />
                    Jij bent als ${role} toegevoegd aan de ${organisation} gebruikerslijst van de LHS-assistent app.<br / >
                    Het gebruik van de LHS-assistent is erg eenvoudig en wijst zichzelf grotendeels.<br />
                    <br />
                    Via <a href="https://app.lhsassistent.nl">https://app.lhsassistent.nl</a> kun je inloggen met de volgende gegevens:<br />
                    Gebruikersnaam: <b>${username}</b><br />
                    Wachtwoord: <b>${password}</b><br />
                    <br />
                    Als je bent ingelogd verschijnt het startmenu waarin je kunt aangeven dat je een nieuwe rapport wilt aanmaken.<br />
                    <br />
                    Afhankelijk van het apparaat waarop je inlogt geldt dat je op een bepaalde wijze kunt zorgen dat de assistent op jouw beginscherm<br />
                    vastgemaakt raakt. Zolang je dan niet uitlogt kun je gebruikmaken van de assistent.<br />
                    Vaak weet je al hoe je dit moet doen, soms geeft jouw apparaat daarbij vanzelf instructies. Lukt het je nou niet eenvoudig om de app op<br />
                    jouw beginscherm te krijgen neem dan een kijkje op <a href="https://lhsassistent.nl/devices">deze pagina</a> voor hulp.<br />
                    <br />
                    Succes!<br />
                    <br />
                    <br />
                    De LHS assistent
                  </p>
                </body>
              </html>`;

    sendMail(
      `LHS Assistent`,
      `noreply@lhsassistent.nl`,
      email,
      `Account gegevens LHS Assistent`,
      ``,
      html
    );

    res.status(200).send({ message: "Nieuwe gebruiker aangemaakt" });
  } catch (error) {
    res.status(400).send({ message: "Aanmaken nieuwe gebruiker mislukt" });
    console.log(error);
  }
};
