const db = require("../../config/postgres");

module.exports = async (req, res) => {
  try {
    let organisationid = req.user.organisationid;

    let result = await db.query(
      `select r.datum, r.zaaknummer, r.medewerker, r.pkey, ge.gemeente, r.locatie, ` +
        `r.gscore_mutareden, r.escore_mutareden, r.toelichting_e4, r.toelichting_e6, ` +
        `r.omschrijving from rapporten r ` +
        `left join gemeentes ge on ge.pkey::text = r.gemeenteid ` +
        `where r.organisationid = $1 ORDER BY r.pkey desc`,
      [organisationid]
    );

    if (!result || result.rows.length === 0) {
      res.status(400).send("Geen openstaande rapporten gevonden.");
      return;
    }

    result = result.rows;

    result.forEach((element) => {
      let rawDate = new Date(element.datum);
      let dag_raw = rawDate.getDate();
      let maand_raw = rawDate.getMonth() + 1;
      let jaar = rawDate.getFullYear();
      let date, month;

      if (dag_raw < 10) {
        date = "0" + dag_raw.toString();
      } else {
        date = dag_raw.toString();
      }
      if (maand_raw < 10) {
        month = "0" + maand_raw.toString();
      } else {
        month = maand_raw.toString();
      }

      let constDat = date + "-" + month + "-" + jaar;

      element.datum = constDat;

      element.pkey = element.pkey * 1;
    });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};
