const db = require("../../config/postgres");
const sql = require("sql-tag");

module.exports = async (req, res) => {
  try {
    let organisationid = req.user.organisationid;

    let result = await db.query(
      sql`SELECT  r.datum, r.zaaknummer, r.pkey, ge.gemeente, r.locatie, 
                  r.gscore_letter, r.escore_cijfer 
          FROM rapporten r
          LEFT JOIN gemeentes ge ON ge.pkey::text = r.gemeenteid
          WHERE r.organisationid = ${1} AND r.reviewed = false ORDER BY datum desc;`,
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
      element.score = element.gscore_letter + element.escore_cijfer;

      // Sortering van de rapportages op matrix waarden
      switch (true) {
        case ["A1"].includes(element.score):
          element.scoreSort = 1;
          break;
        case ["A2", "B1"].includes(element.score):
          element.scoreSort = 2;
          break;
        case ["A3", "B2", "C1"].includes(element.score):
          element.scoreSort = 3;
          break;
        case ["A4", "B3", "C2", "D1"].includes(element.score):
          element.scoreSort = 4;
          break;
        case ["B4", "C3", "D2"].includes(element.score):
          element.scoreSort = 5;
          break;
        case ["C4", "D3"].includes(element.score):
          element.scoreSort = 6;
          break;
        case ["D4"].includes(element.score):
          element.scoreSort = 7;
          break;
        default:
          break;
      }

      element.scoreSort = element.scoreSort + "|" + element.score;
    });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};
