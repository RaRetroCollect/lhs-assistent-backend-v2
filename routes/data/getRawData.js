const excel = require("exceljs");
const db = require("../../config/postgres");

module.exports = async (req, res) => {
  let organisationId = req.user.organisationid;

  let startDate = req.query.fromdate;
  let endDate = req.query.tilldate;
  let type = req.query.type;

  let role = req.user.role;

  if (!type) {
    res.status(400).send("Type is verplicht");
  }

  let query, params;
  let placeholder = 1;

  // wanneer we geen start- en einddatum hebben, alles ophalen
  if (
    (!startDate || startDate === null || startDate === undefined) &&
    (!endDate || endDate === null || endDate === undefined)
  ) {
    if (role === "superMario") {
      query = `SELECT * from rapporten WHERE 1 = $1`;
      params = [placeholder];
    }

    if (role !== "superMario") {
      query = `SELECT * FROM rapporten WHERE organisationid = $1`;
      params = [organisationId];
    }
  }

  // wanneer we alleen een einddatum hebben
  if (
    endDate &&
    (!startDate || startDate === null || startDate === undefined)
  ) {
    if (role === "superMario") {
      query = `SELECT * FROM rapporten WHERE 1 = $1 AND datum <= $2`;
      params = [placeholder, endDate];
    }

    if (role !== "superMario") {
      query = `SELECT * FROM rapporten WHERE organisationid = $1 AND datum <= $2`;
      params = [organisationId, endDate];
    }
  }

  // wanneer we alleen een startdatum hebben
  if (startDate && (!endDate || endDate === null || endDate === undefined)) {
    if (role === "superMario") {
      query = `SELECT * FROM rapporten WHERE 1 = $1 AND datum >= $2`;
      params = [placeholder, startDate];
    }

    if (role !== "superMario") {
      query = `SELECT * FROM rapporten WHERE organisationid = $1 AND datum >= $2`;
      params = [organisationId, startDate];
    }
  }

  // wanneer we alle velden hebben
  if (startDate && endDate) {
    if (role === "superMario") {
      query = `SELECT * FROM rapporten WHERE 1 = $1 AND datum >= $2 AND datum <= $3`;
      params = [placeholder, startDate, endDate];
    }

    if (role !== "superMario") {
      query = `SELECT * FROM rapporten WHERE organisationid = $1 AND datum >= $2 AND datum <= $3`;
      params = [organisationId, startDate, endDate];
    }
  }

  const result = await db.query(query, params);

  rapportenRows = result.rows;

  noRapporten = rapportenRows.length;

  // Wanneer niets gevonden foutmelding terug geven.
  if (noRapporten === 0 || noRapporten === undefined) {
    res.status(200).send({
      message: "Geen rapporten gevonden binnen selectie",
    });
    return;
  }

  if (type === "excel") {
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Rapporten");

    //TODO Refactor, door resultaat kolommen heen 'loopen' zodat een nieuwe kolom ook gelijk toegevoegd wordt.
    worksheet.columns = [
      { header: "datum", key: "datum", width: 15 },
      { header: "pkey", key: "pkey", width: 5 },
      { header: "zaaknummer", key: "zaaknummer", width: 15 },
      { header: "medewerker", key: "medewerker", width: 25 },
      { header: "score_e1", key: "score_e1", width: 10 },
      { header: "score_multipl_e1", key: "score_multipl_e1", width: 20 },
      { header: "score_e2", key: "score_e2", width: 10 },
      { header: "score_multipl_e2", key: "score_multipl_e2", width: 20 },
      { header: "score_e3", key: "score_e3", width: 10 },
      { header: "score_multipl_e3", key: "score_multipl_e3", width: 20 },
      { header: "score_e4", key: "score_e4", width: 10 },
      { header: "score_multipl_e4", key: "score_multipl_e4", width: 20 },
      { header: "score_e5", key: "score_e5", width: 10 },
      { header: "score_multipl_e5", key: "score_multipl_e5", width: 20 },
      { header: "score_e6", key: "score_e6", width: 10 },
      { header: "score_multipl_e6", key: "score_multipl_e6", width: 20 },
      { header: "score_e7", key: "score_e7", width: 10 },
      { header: "score_multipl_e7", key: "score_multipl_e7", width: 20 },
      { header: "score_e7a", key: "score_e7a", width: 10 },
      { header: "score_e8", key: "score_e8", width: 10 },
      { header: "score_multipl_e8", key: "score_multipl_e8", width: 20 },
      { header: "score_g1", key: "score_g1", width: 10 },
      { header: "score_multipl_g1", key: "score_multipl_g1", width: 20 },
      { header: "score_g2", key: "score_g2", width: 10 },
      { header: "score_multipl_g2", key: "score_multipl_g2", width: 20 },
      { header: "score_g3", key: "score_g3", width: 10 },
      { header: "score_multipl_g3", key: "score_multipl_g3", width: 20 },
      { header: "score_g4", key: "score_g4", width: 10 },
      { header: "score_multipl_g4", key: "score_multipl_g4", width: 20 },
      { header: "score_g5", key: "score_g5", width: 10 },
      { header: "score_multipl_g5", key: "score_multipl_g5", width: 20 },
      { header: "score_g6", key: "score_g6", width: 10 },
      { header: "score_multipl_g6", key: "score_multipl_g6", width: 20 },
      { header: "score_g7", key: "score_g7", width: 10 },
      { header: "score_multipl_g7", key: "score_multipl_g7", width: 20 },
      { header: "score_g8", key: "score_g8", width: 10 },
      { header: "score_g9", key: "score_g9", width: 10 },
      { header: "score_g10", key: "score_g10", width: 10 },
      { header: "score_e9", key: "score_e9", width: 10 },
      { header: "gscore_afwijken", key: "gscore_afwijken", width: 15 },
      { header: "gscore_calc_total", key: "gscore_calc_total", width: 20 },
      { header: "escore_afwijken", key: "escore_afwijken", width: 15 },
      { header: "escore_calc_total", key: "escore_calc_total", width: 20 },
      { header: "gscore_mutareden", key: "gscore_mutareden", width: 20 },
      { header: "escore_mutareden", key: "escore_mutareden", width: 20 },
      { header: "org", key: "org", width: 10 },
      { header: "toelichting_e4", key: "toelichting_e4", width: 30 },
      { header: "toelichting_e6", key: "toelichting_e6", width: 30 },
      { header: "locatie", key: "locatie", width: 15 },
      { header: "omschrijving", key: "omschrijving", width: 30 },
      { header: "gscore_letter", key: "gscore_letter", width: 15 },
      { header: "escore_cijfer", key: "escore_cijfer", width: 15 },
      { header: "ernstq7atekst", key: "ernstq7atekst", width: 15 },
      { header: "gedragq8tekst", key: "gedragq8tekst", width: 15 },
      { header: "gedragq9tekst", key: "gedragq9tekst", width: 15 },
      { header: "gemeenteid", key: "gemeenteid", width: 10 },
      { header: "userid", key: "userid", width: 10 },
      { header: "organisationid", key: "organisationid", width: 10 },
      { header: "starttijd", key: "starttijd", width: 25 },
      { header: "eindtijd", key: "eindtijd", width: 25 },
      { header: "score_s1", key: "score_s1", width: 25 },
      { header: "score_multipl_s1", key: "score_multipl_s1", width: 25 },
      { header: "score_s2", key: "score_s2", width: 25 },
      { header: "score_multipl_s2", key: "score_multipl_s2", width: 25 },
      { header: "score_s3", key: "score_s3", width: 25 },
      { header: "score_multipl_s3", key: "score_multipl_s3", width: 25 },
      { header: "score_s4", key: "score_s4", width: 25 },
      { header: "score_multipl_s4", key: "score_multipl_s4", width: 25 },
      { header: "score_s5", key: "score_s5", width: 25 },
      { header: "score_multipl_s5", key: "score_multipl_s5", width: 25 },
      { header: "score_s6", key: "score_s6", width: 25 },
      { header: "score_multipl_s6", key: "score_multipl_s6", width: 25 },
      { header: "score_s7", key: "score_s7", width: 25 },
      { header: "score_multipl_s7", key: "score_multipl_s7", width: 25 },
      { header: "reviewed", key: "reviewed", width: 25 },
      { header: "s4_tekst", key: "s4_tekst", width: 15 },
      { header: "s5_toelichting", key: "s5_toelichting", width: 15 },
      { header: "gedragq7tekst", key: "gedragq7tekst", width: 15 },
      { header: "formdesk_id", key: "formdesk_id", width: 15 },
    ];

    for (let i = 0; i < rapportenRows.length; i++) {
      let dagnr = rapportenRows[i].datum.getDate();
      let maand = rapportenRows[i].datum.getMonth() + 1;
      let jaar = rapportenRows[i].datum.getFullYear();

      let datum = `${jaar}-${maand}-${dagnr}`;
      worksheet.addRow({
        pkey: rapportenRows[i].pkey,
        zaaknummer: rapportenRows[i].zaaknummer,
        medewerker: rapportenRows[i].medewerker,
        score_e1: rapportenRows[i].score_e1,
        score_multipl_e1: rapportenRows[i].score_multipl_e1,
        score_e2: rapportenRows[i].score_e2,
        score_multipl_e2: rapportenRows[i].score_multipl_e2,
        score_e3: rapportenRows[i].score_e3,
        score_multipl_e3: rapportenRows[i].score_multipl_e3,
        score_e4: rapportenRows[i].score_e4,
        score_multipl_e4: rapportenRows[i].score_multipl_e4,
        score_e5: rapportenRows[i].score_e5,
        score_multipl_e5: rapportenRows[i].score_multipl_e5,
        score_e6: rapportenRows[i].score_e6,
        score_multipl_e6: rapportenRows[i].score_multipl_e6,
        score_e7: rapportenRows[i].score_e7,
        score_multipl_e7: rapportenRows[i].score_multipl_e7,
        score_e7a: rapportenRows[i].score_e7a,
        score_e8: rapportenRows[i].score_e8,
        score_multipl_e8: rapportenRows[i].score_multipl_e8,
        score_g1: rapportenRows[i].score_g1,
        score_multipl_g1: rapportenRows[i].score_multipl_g1,
        score_g2: rapportenRows[i].score_g2,
        score_multipl_g2: rapportenRows[i].score_multipl_g2,
        score_g3: rapportenRows[i].score_g3,
        score_multipl_g3: rapportenRows[i].score_multipl_g3,
        score_g4: rapportenRows[i].score_g4,
        score_multipl_g4: rapportenRows[i].score_multipl_g4,
        score_g5: rapportenRows[i].score_g5,
        score_multipl_g5: rapportenRows[i].score_multipl_g5,
        score_g6: rapportenRows[i].score_g6,
        score_multipl_g6: rapportenRows[i].score_multipl_g6,
        score_g7: rapportenRows[i].score_g7,
        score_multipl_g7: rapportenRows[i].score_multipl_g7,
        score_g8: rapportenRows[i].score_g8,
        score_g9: rapportenRows[i].score_g9,
        score_g10: rapportenRows[i].score_g10,
        score_e9: rapportenRows[i].score_e9,
        gscore_afwijken: rapportenRows[i].gscore_afwijken,
        gscore_calc_total: rapportenRows[i].gscore_calc_total,
        escore_afwijken: rapportenRows[i].escore_afwijken,
        escore_calc_total: rapportenRows[i].escore_calc_total,
        gscore_mutareden: rapportenRows[i].gscore_mutareden,
        escore_mutareden: rapportenRows[i].escore_mutareden,
        org: rapportenRows[i].org,
        datum: datum,
        toelichting_e4: rapportenRows[i].toelichting_e4,
        toelichting_e6: rapportenRows[i].toelichting_e6,
        locatie: rapportenRows[i].locatie,
        omschrijving: rapportenRows[i].omschrijving,
        gscore_letter: rapportenRows[i].gscore_letter,
        escore_cijfer: rapportenRows[i].escore_cijfer,
        ersntq7atekst: rapportenRows[i].ernstq7atekst,
        gedragq8tekst: rapportenRows[i].gedragq8tekst,
        gedragq9tekst: rapportenRows[i].gedragq9tekst,
        gemeenteid: rapportenRows[i].gemeenteid,
        userid: rapportenRows[i].userid,
        organisationid: rapportenRows[i].organisationid,
        starttijd: rapportenRows[i].starttijd,
        eindtijd: rapportenRows[i].eindtijd,
        score_s1: rapportenRows[i].score_s1,
        score_multipl_s1: rapportenRows[i].score_multipl_s1,
        score_s2: rapportenRows[i].score_s2,
        score_multipl_s2: rapportenRows[i].score_multipl_s2,
        score_s3: rapportenRows[i].score_s3,
        score_multipl_s3: rapportenRows[i].score_multipl_s3,
        score_s4: rapportenRows[i].score_s4,
        score_multipl_s4: rapportenRows[i].score_multipl_s4,
        score_s5: rapportenRows[i].score_s5,
        score_multipl_s5: rapportenRows[i].score_multipl_s5,
        score_s6: rapportenRows[i].score_s6,
        score_multipl_s6: rapportenRows[i].score_multipl_s6,
        score_s7: rapportenRows[i].score_s7,
        score_multipl_s7: rapportenRows[i].score_multipl_s7,
        reviewed: rapportenRows[i].reviewed,
        s4_tekst: rapportenRows[i].s4_tekst,
        s5_toelichting: rapportenRows[i].s5_toelichting,
        gedragq7tekst: rapportenRows[i].gedragq7tekst,
        formdesk_id: rapportenRows[i].formdesk_id,
      });
    }

    // res is a Stream object
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=" + "data.xlsx");

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  }

  if (type === "json") {
    res.status(200).json(rapportenRows);
  }
};
