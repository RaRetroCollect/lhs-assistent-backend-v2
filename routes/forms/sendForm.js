const db = require("../../config/postgres");
const { generateReportPdf } = require("../../functions/generateReportPdf");
const jwt = require("jsonwebtoken");
const { tokenKey } = require("../../config/config");
const { getToken, getRefreshToken, COOKIE_OPTIONS } = require("../../authenticate");

module.exports = async (req, res) => {
  try {
    let startTijd = new Date(req.body.startTijd);
    let eindTijd = new Date(req.body.eindTijd);

    const getEmail = await db.query(`SELECT email FROM users WHERE pkey = $1`, [req.user.pkey]);

    const email = getEmail.rows[0].email;

    const rapportData = req.body;

    const user = {};

    if (req.user.sex === "male") {
      user.aanhef = "de heer";
    }

    if (user.sex === "female") {
      user.aanhef = "mevrouw";
    }

    user.lastname = req.user.lastname;

    if (
      rapportData.ernstq7a === "" ||
      rapportData.ernstq7a === undefined ||
      rapportData.ernstq7a === null
    ) {
      rapportData.ernstq7a = 0;
      rapportData.ernstq7aTekst = "niets";
    }

    // Gecalculeerde waarden ronden we af naar 2 decimalen
    let E1Calc = rapportData.E1Calc.toFixed(2);
    let E2Calc = rapportData.E2Calc.toFixed(2);
    let E3Calc = rapportData.E3Calc.toFixed(2);
    let E4Calc = rapportData.E4Calc.toFixed(2);
    let E5Calc = rapportData.E5Calc.toFixed(2);
    let E6Calc = rapportData.E6Calc.toFixed(2);
    let E7Calc = rapportData.E7Calc.toFixed(2);
    let E8Calc = rapportData.E8Calc.toFixed(2);
    let G1Calc = rapportData.G1Calc.toFixed(2);
    let G2Calc = rapportData.G2Calc.toFixed(2);
    let G3Calc = rapportData.G3Calc.toFixed(2);
    let G4Calc = rapportData.G4Calc.toFixed(2);
    let G5Calc = rapportData.G5Calc.toFixed(2);
    let G6Calc = rapportData.G6Calc.toFixed(2);
    let G7Calc = rapportData.G7Calc.toFixed(2);
    let GScoreTotal = rapportData.gscoreTotal.toFixed(2);
    let EscoreTotal = rapportData.escoreTotal.toFixed(2);

    let reviewed = true;
    let boaMailType;

    let boaScores = ["A4", "B4", "C4", "D4", "B3", "C3", "D3", "C2", "D2", "D1"];

    // wanneer volgens het advies de totaal score voorkomt in boaScores,
    // reviewed op false zetten en mail versturen naar BOA (type1)
    if (boaScores.includes(rapportData.gscoreLetter + rapportData.escoreCijfer)) {
      reviewed = false;
      boaMailType = 1;
    }

    // wanneer een toezichthouder afwijkt van het advies en kiest voor een boaScore
    // reviewed op false zetten en mail versturen naar BOA, (type2)
    if (boaScores.includes(rapportData.gAfwijking + rapportData.eAfwijking)) {
      reviewed = false;
      boaMailType = 2;
    }

    const insertQuery =
      `INSERT INTO rapporten (zaaknummer, medewerker, ` +
      `score_e1, score_multipl_e1, score_e2, score_multipl_e2, ` +
      `score_e3, score_multipl_e3, score_e4, score_multipl_e4, ` +
      `score_e5, score_multipl_e5, score_e6, score_multipl_e6, ` +
      `score_e7, score_multipl_e7, score_e7a, score_e8, score_multipl_e8, ` +
      `score_g1, score_multipl_g1, score_g2, score_multipl_g2, ` +
      `score_g3, score_multipl_g3, score_g4, score_multipl_g4, ` +
      `score_g5, score_multipl_g5, score_g6, score_multipl_g6, ` +
      `score_g7, score_multipl_g7, score_g8, score_g9, ` +
      `score_g10, score_e9, ` +
      `gscore_afwijken, gscore_calc_total, gscore_mutareden, ` +
      `escore_afwijken, escore_calc_total, escore_mutareden, ` +
      `datum, toelichting_e4, toelichting_e6, locatie, omschrijving , ` +
      `gscore_letter, escore_cijfer, ernstq7atekst, gedragq8tekst, ` +
      `gedragq9tekst, gemeenteid, userid, organisationid, starttijd, eindtijd, reviewed, ` +
      `gedragq7tekst) ` +
      `VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,` +
      `$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,` +
      `$31,$32,$33,$34,$35,$36,$37,$38,$39,$40,$41,$42,$43,$44,$45,$46,$47,$48,$49,$50,$51,$52,$53,$54,$55,$56,$57,$58,$59,$60) RETURNING *`;
    const insertValues = [
      rapportData.zaaknummer,
      rapportData.medewerker,
      rapportData.ernstq1,
      E1Calc,
      rapportData.ernstq2,
      E2Calc,
      rapportData.ernstq3,
      E3Calc,
      rapportData.ernstq4,
      E4Calc,
      rapportData.ernstq5,
      E5Calc,
      rapportData.ernstq6,
      E6Calc,
      rapportData.ernstq7,
      E7Calc,
      rapportData.ernstq7a,
      rapportData.ernstq8,
      E8Calc,
      rapportData.gedragq1,
      G1Calc,
      rapportData.gedragq2,
      G2Calc,
      rapportData.gedragq3,
      G3Calc,
      rapportData.gedragq4,
      G4Calc,
      rapportData.gedragq5,
      G5Calc,
      rapportData.gedragq6,
      G6Calc,
      rapportData.gedragq7,
      G7Calc,
      rapportData.gedragq8,
      rapportData.gedragq9,
      rapportData.gedragq10,
      rapportData.ernstq9,
      rapportData.gAfwijking,
      GScoreTotal,
      rapportData.gAfwijkingToelichting,
      rapportData.eAfwijking,
      EscoreTotal,
      rapportData.eAfwijkingToelichting,
      rapportData.constDat,
      rapportData.G4Toelichting,
      rapportData.G6Toelichting,
      rapportData.locatie,
      rapportData.omschrijving,
      rapportData.gscoreLetter,
      rapportData.escoreCijfer,
      rapportData.ernstq7aTekst,
      rapportData.gedragq8Tekst,
      rapportData.gedragq9Tekst,
      rapportData.gemeente,
      rapportData.userid,
      rapportData.organisationid,
      startTijd,
      eindTijd,
      reviewed,
      rapportData.gedragq7tekst,
    ];

    const result = await db.query(insertQuery, insertValues);

    const rapportPkeyRecord = result.rows[0].pkey;

    let boaMail = {
      mailtype: boaMailType,
      reviewed: reviewed,
      reportid: result.rows[0].pkey,
    };

    // wanneer reviewed op false gezet wordt, moeten we de bijbehorende BOA account ophalen
    // en voor dit account een token genereren om mee te sturen in de mail
    if (reviewed === false) {
      let boaData = await db.query(
        `SELECT * FROM users WHERE role = 'boa' AND organisationid = $1`,
        [req.user.organisationid]
      );

      let token = getToken({ username: boaData.rows[0].username });

      /*
      let emailToken = jwt.sign(
        {
          user_id: boaData.rows[0].username,
          userId: boaData.rows[0].pkey,
          role: boaData.rows[0].role,
          organisation: boaData.rows[0].organisation,
          organisationId: boaData.rows[0].organisationid,
          firstName: boaData.rows[0].firstname,
          lastName: boaData.rows[0].lastname,
        },
        tokenKey,
        { expiresIn: "24h" }
      );
      */

      boaMail.emailToken = token;

      // voor nu zijn de boa mailadressen gekoppeld aan de organisatie (dit kunnen meerdere adressen zijn)
      // er kan echter slechts 1 boa account per organisatie bestaan op deze manier.
      // anyhow mail adres(sen) halen we op uit de organisations tabel
      let boaMailadress = await db.query(`SELECT boamail FROM organisations WHERE pkey = $1`, [
        req.user.organisationid,
      ]);

      boaMail.email = boaMailadress.rows[0].boamail;
    }

    if (result.rowCount > 0) {
      await generateReportPdf(rapportPkeyRecord, email, boaMail, user);
      res.status(200).send("Test geslaagd");
    } else {
      res.status(400).send("Rapport indienden mislukt");
    }
  } catch (error) {
    console.log(error);
    console.error(error.message);
    res.status(500).json("Server Error");
  }
};
