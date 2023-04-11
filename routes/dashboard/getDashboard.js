const db = require("../../config/postgres");

module.exports = async (req, res) => {
  try {
    const { peildatum, gemeente, organisatie, userid } = req.query;

    let params = [];

    let organisation;

    organisation = req.user.organisationid;

    // SuperUser moet als enige de mogelijkheid hebben om een andere organisatie te kiezen.
    if (req.user.role === "superMario" && organisatie !== undefined) {
      organisation = organisatie;
    }

    // Dashboard toont altijd de data vanaf peildatum tot en met 3 maanden daarvoor
    let peildatumParts = peildatum.split("-");

    let formatPeildatum = new Date(
      +peildatumParts[0],
      peildatumParts[1] - 1,
      +peildatumParts[2]
    );

    let startPeilDatum = formatPeildatum;

    startPeilDatum.setDate(startPeilDatum.getDate() - 90);

    let startDag = startPeilDatum.getDate();
    let startMaand = startPeilDatum.getMonth() + 1;
    let startJaar = startPeilDatum.getFullYear();

    // Even converteren naar readable format om in frontend te tonen
    let startDate =
      ("0" + startDag).slice(-2) +
      "-" +
      ("0" + startMaand).slice(-2) +
      "-" +
      startJaar.toString();

    let startDateDB =
      startJaar.toString() +
      "-" +
      ("0" + startMaand).slice(-2) +
      "-" +
      ("0" + startDag).slice(-2);

    // Peildatum ook converteren naar readable format om in frontend te tonen
    let endDate = formatPeildatum;

    endDate.setDate(endDate.getDate() + 90);

    let endDag = endDate.getDate();
    let endMaand = endDate.getMonth() + 1;
    let endJaar = endDate.getFullYear();

    endDate =
      ("0" + endDag).slice(-2) +
      "-" +
      ("0" + endMaand).slice(-2) +
      "-" +
      endJaar.toString();


    let scoreCard = {
      A1: 0,
      A2: 0,
      A3: 0,
      A4: 0,
      B1: 0,
      B2: 0,
      B3: 0,
      B4: 0,
      C1: 0,
      C2: 0,
      C3: 0,
      C4: 0,
      D1: 0,
      D2: 0,
      D3: 0,
      D4: 0,
      total: 0,
      recidiven: 0,
      gAfwijk: 0,
      eAfwijk: 0,
      startDate: startDate,
      peilDatum: endDate,
    };

    // Wanneer op de een of andere manier geen organisatie bekend is en user is geen superuser, geven we een lege scorecard terug
    if (
      req.user.role !== "superMario" &&
      (organisation === undefined ||
        organisation === null ||
        organisation === "")
    ) {
      res.status(200).json(scoreCard);
      return;
    }

    /*
    console.log("Peildatum: " + peildatum);
    console.log("startPeilDatumstring " + startDate);
    */

    switch (true) {
      case userid != undefined && gemeente != undefined:
        if (organisation == null && req.user.role === "superMario") {
          mainQuery =
            `select concat(gscore_letter, escore_cijfer) as score, ` +
            `count(concat(gscore_letter, escore_cijfer)) as aantal ` +
            `from rapporten where datum >= $1 and datum <= $2 and userid = $3 and gemeenteid = $4 ` +
            `group by concat(gscore_letter, escore_cijfer)`;

          recidivenQuery = `SELECT COUNT (*) AS recidiven FROM rapporten WHERE gedragq9tekst IN ('JaEenmaal', 'JaMeermaal') AND datum >= $1 AND datum <= $2 and userid = $3 and gemeenteid = $4`;
          gAfwijkQuery = `select count(*) as totalgafwijk from rapporten where length(gscore_afwijken) > 0 and datum >= $1 and datum <= $2 and userid = $3 and gemeenteid = $4`;
          eAfwijkQuery = `select count(*) as totaleafwijk from rapporten where length(escore_afwijken) > 0 and datum >= $1 and datum <= $2 and userid = $3 and gemeenteid = $4`;

          params = [startDateDB, peildatum, userid, gemeente];
        } else {
          mainQuery =
            `select concat(gscore_letter, escore_cijfer) as score, ` +
            `count(concat(gscore_letter, escore_cijfer)) as aantal ` +
            `from rapporten where organisationid = $1 and datum >= $2 and datum <= $3 and userid = $4 and gemeenteid = $5 ` +
            `group by concat(gscore_letter, escore_cijfer)`;

          recidivenQuery = `SELECT COUNT (*) AS recidiven FROM rapporten WHERE gedragq9tekst IN ('JaEenmaal', 'JaMeermaal') AND organisationid = $1 AND datum >= $2 AND datum <= $3 and userid = $4 and gemeenteid = $5`;
          gAfwijkQuery = `select count(*) as totalgafwijk from rapporten where length(gscore_afwijken) > 0 and organisationid = $1 and datum >= $2 and datum <= $3 and userid = $4 and gemeenteid = $5`;
          eAfwijkQuery = `select count(*) as totaleafwijk from rapporten where length(escore_afwijken) > 0 and organisationid = $1 and datum >= $2 and datum <= $3 and userid = $4 and gemeenteid = $5`;

          params = [organisation, startDateDB, peildatum, userid, gemeente];
        }

        break;
      case gemeente != undefined:
        if (organisation == null && req.user.role === "superMario") {
          mainQuery =
            `select concat(gscore_letter, escore_cijfer) as score, ` +
            `count(concat(gscore_letter, escore_cijfer)) as aantal ` +
            `from rapporten where datum >= $1 and datum <= $2 and gemeenteid = $3 ` +
            `group by concat(gscore_letter, escore_cijfer)`;

          recidivenQuery = `SELECT COUNT (*) AS recidiven FROM rapporten WHERE gedragq9tekst IN ('JaEenmaal', 'JaMeermaal') AND datum >= $1 AND datum <= $2 and gemeenteid = $3`;
          gAfwijkQuery = `select count(*) as totalgafwijk from rapporten where length(gscore_afwijken) > 0 and datum >= $1 and datum <= $2 and gemeenteid = $3`;
          eAfwijkQuery = `select count(*) as totaleafwijk from rapporten where length(escore_afwijken) > 0 and datum >= $1 and datum <= $2 and gemeenteid = $3`;

          params = [startDateDB, peildatum, gemeente];
        } else {
          mainQuery =
            `select concat(gscore_letter, escore_cijfer) as score, ` +
            `count(concat(gscore_letter, escore_cijfer)) as aantal ` +
            `from rapporten where organisationid = $1 and datum >= $2 and datum <= $3 and gemeenteid = $4 ` +
            `group by concat(gscore_letter, escore_cijfer)`;

          recidivenQuery = `SELECT COUNT (*) AS recidiven FROM rapporten WHERE gedragq9tekst IN ('JaEenmaal', 'JaMeermaal') AND organisationid = $1 AND datum >= $2 AND datum <= $3 and gemeenteid = $4`;
          gAfwijkQuery = `select count(*) as totalgafwijk from rapporten where length(gscore_afwijken) > 0 and organisationid = $1 and datum >= $2 and datum <= $3 and gemeenteid = $4`;
          eAfwijkQuery = `select count(*) as totaleafwijk from rapporten where length(escore_afwijken) > 0 and organisationid = $1 and datum >= $2 and datum <= $3 and gemeenteid = $4`;

          params = [organisation, startDateDB, peildatum, gemeente];
        }
        break;
      case userid != undefined:
        if (organisation == null && req.user.role === "superMario") {
          mainQuery =
            `select concat(gscore_letter, escore_cijfer) as score, ` +
            `count(concat(gscore_letter, escore_cijfer)) as aantal ` +
            `from rapporten where datum >= $1 and datum <= $2 and userid = $3 ` +
            `group by concat(gscore_letter, escore_cijfer)`;

          recidivenQuery = `SELECT COUNT (*) AS recidiven FROM rapporten WHERE gedragq9tekst IN ('JaEenmaal', 'JaMeermaal') AND datum >= $1 AND datum <= $2 and userid = $3`;
          gAfwijkQuery = `select count(*) as totalgafwijk from rapporten where length(gscore_afwijken) > 0 and datum >= $1 and datum <= $2 and userid = $3`;
          eAfwijkQuery = `select count(*) as totaleafwijk from rapporten where length(escore_afwijken) > 0 and datum >= $1 and datum <= $2 and userid = $3`;

          params = [startDateDB, peildatum, userid];
        } else {
          mainQuery =
            `select concat(gscore_letter, escore_cijfer) as score, ` +
            `count(concat(gscore_letter, escore_cijfer)) as aantal ` +
            `from rapporten where organisationid = $1 and datum >= $2 and datum <= $3 and userid = $4 ` +
            `group by concat(gscore_letter, escore_cijfer)`;

          recidivenQuery = `SELECT COUNT (*) AS recidiven FROM rapporten WHERE gedragq9tekst IN ('JaEenmaal', 'JaMeermaal') AND organisationid = $1 AND datum >= $2 AND datum <= $3 and userid = $4`;
          gAfwijkQuery = `select count(*) as totalgafwijk from rapporten where length(gscore_afwijken) > 0 and organisationid = $1 and datum >= $2 and datum <= $3 and userid = $4`;
          eAfwijkQuery = `select count(*) as totaleafwijk from rapporten where length(escore_afwijken) > 0 and organisationid = $1 and datum >= $2 and datum <= $3 and userid = $4`;

          params = [organisation, startDateDB, peildatum, userid];
        }
        break;
      default:
        if (organisation == null && req.user.role === "superMario") {
          mainQuery =
            `select concat(gscore_letter, escore_cijfer) as score, ` +
            `count(concat(gscore_letter, escore_cijfer)) as aantal ` +
            `from rapporten where datum >= $1 and datum <= $2 ` +
            `group by concat(gscore_letter, escore_cijfer)`;

          recidivenQuery = `SELECT COUNT (*) AS recidiven FROM rapporten WHERE gedragq9tekst IN ('JaEenmaal', 'JaMeermaal') AND datum >= $1 AND datum <= $2`;
          gAfwijkQuery = `select count(*) as totalgafwijk from rapporten where length(gscore_afwijken) > 0 and datum >= $1 and datum <= $2`;
          eAfwijkQuery = `select count(*) as totaleafwijk from rapporten where length(escore_afwijken) > 0 and datum >= $1 and datum <= $2`;

          params = [startDateDB, peildatum];
        } else {
          mainQuery =
            `select concat(gscore_letter, escore_cijfer) as score, ` +
            `count(concat(gscore_letter, escore_cijfer)) as aantal ` +
            `from rapporten where organisationid = $1 and datum >= $2 and datum <= $3 ` +
            `group by concat(gscore_letter, escore_cijfer)`;

          recidivenQuery = `SELECT COUNT (*) AS recidiven FROM rapporten WHERE gedragq9tekst IN ('JaEenmaal', 'JaMeermaal') AND organisationid = $1 AND datum >= $2 AND datum <= $3`;
          gAfwijkQuery = `select count(*) as totalgafwijk from rapporten where length(gscore_afwijken) > 0 and organisationid = $1 and datum >= $2 and datum <= $3`;
          eAfwijkQuery = `select count(*) as totaleafwijk from rapporten where length(escore_afwijken) > 0 and organisationid = $1 and datum >= $2 and datum <= $3`;

          params = [organisation, startDateDB, peildatum];
        }
        break;
    }

    let result = await db.query(mainQuery, params);
    let totalRecidiven = await db.query(recidivenQuery, params);
    let totalGAfwijk = await db.query(gAfwijkQuery, params);
    let totalEAfwijk = await db.query(eAfwijkQuery, params);

    // Wanneer er geen resultaten zijn, geven we een lege Scorecard terug
    if (!result || result.rows.length === 0) {
      res.status(200).json(scoreCard);
      return;
    }

    // Percentages van recidiven en afwijkende scores berekenen
    let total = 0;
    for (let i = 0; i < result.rows.length; i++) {
      total = total + result.rows[i].aantal * 1;
    }

    let recidiven = 0;

    try {
      recidiven =
        (((totalRecidiven.rows[0].recidiven * 1) / total) * 100).toFixed(0) * 1;
    } catch (error) {}

    let gAfwijk = 0;

    try {
      gAfwijk =
        (((totalGAfwijk.rows[0].totalgafwijk * 1) / total) * 100).toFixed(0) *
        1;
    } catch (error) {}

    let eAfwijk = 0;

    try {
      eAfwijk =
        (((totalEAfwijk.rows[0].totaleafwijk * 1) / total) * 100).toFixed(0) *
        1;
    } catch (error) {}

    scoreCard.total = total;
    scoreCard.recidiven = recidiven;
    scoreCard.gAfwijk = gAfwijk;
    scoreCard.eAfwijk = eAfwijk;

    for (let i = 0; i < result.rows.length; i++) {
      scoreCard[result.rows[i].score] =
        ((result.rows[i].aantal / total) * 100).toFixed(0) * 1;
    }

    res.status(200).json(scoreCard);
  } catch (error) {
    console.log(error);
  }
};
