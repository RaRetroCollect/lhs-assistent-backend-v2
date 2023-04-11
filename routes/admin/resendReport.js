const { jsPDF } = require("jspdf");
const db = require("../../config/postgres");
const { sendMail } = require("../../functions/sendMail");
const puppeteer = require("puppeteer");
const path = require("path");

module.exports = async (req, res) => {
  try {
    const rapportPkeyRecord = req.params.pkey;
    // User data Ophalen
    const getUserQuery = `select email, firstname, lastname, sex, organisationid  from users where pkey = (select cast(userid as bigint) from rapporten where pkey=($1))`;
    const getUserParams = [rapportPkeyRecord];

    let userResult = await db.query(getUserQuery, getUserParams);

    const firstname = userResult.rows[0].firstname;
    const lastname = userResult.rows[0].lastname;
    const sex = userResult.rows[0].sex;
    let aanhef;
    if (sex === `male`) {
      aanhef = `Dhr.`;
    }
    if (sex === `female`) {
      aanhef = `Mevr.`;
    }

    const user = { firstname, lastname, aanhef };

    const email = userResult.rows[0].email;

    console.log(email);

    const boaMail = { reviewed: true, type: 2 };

    const query =
      `SELECT r.pkey, r.score_e1 , r.score_e2 , r.score_e3 , r.score_e4 , ` +
      `r.score_e5 , r.score_e6 , r.score_e7 , r.score_e8 , ` +
      `r.score_g1 , r.score_g2 , r.score_g3 , r.score_g4 , ` +
      `r.score_g5 , r.score_g6 , r.score_g7, r.datum , r.medewerker , ` +
      `r.locatie , r.omschrijving, r.gscore_calc_total, r.escore_calc_total, r.gscore_mutareden, ` +
      `r.escore_mutareden , r.gscore_afwijken , r.escore_afwijken , r.gscore_letter , r.escore_cijfer, ` +
      `r.ernstq7atekst, r.gedragq8tekst, r.gedragq9tekst, g.gemeente ` +
      `from rapporten r ` +
      `left join gemeentes g on CAST(g.pkey as varchar) = r.gemeenteid ` +
      `where r.pkey = ($1)`;
    const values = [rapportPkeyRecord];

    let result = await db.query(query, values);
    result = result.rows[0];

    console.log(result);

    // Wijkt de toezichthouder af van de score?
    let scoreAfwijken = true;

    if (
      result.escore_afwijken.length === 0 &&
      result.gscore_afwijken.length === 0
    ) {
      scoreAfwijken = false;
    }

    const scores = {
      E1: result.score_e1,
      E2: result.score_e2,
      E3: result.score_e3,
      E4: result.score_e4,
      E5: result.score_e5,
      E6: result.score_e6,
      E7: result.score_e7,
      E8: result.score_e8,
      G1: result.score_g1,
      G2: result.score_g2,
      G3: result.score_g3,
      G4: result.score_g4,
      G5: result.score_g5,
      G6: result.score_g6,
      G7: result.score_g7,
    };

    console.log(scores);

    const tekstWaarden = {
      E7A: result.ernstq7atekst,
      G8: result.gedragq8tekst,
      G9: result.gedragq9tekst,
    };

    let rawDate = new Date(result.datum);
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

    const zaakInfo = {
      constdat: constDat,
      medewerker: result.medewerker,
      locatie: result.locatie,
      omschrijving: result.omschrijving,
      GTotal: result.gscore_calc_total,
      ETotal: result.escore_calc_total,
      gMutaReden: result.gscore_mutareden,
      eMutaReden: result.escore_mutareden,
      gAfwijken: result.gscore_afwijken,
      eAfwijken: result.escore_afwijken,
      gscoreLetter: result.gscore_letter,
      escoreCijfer: result.escore_cijfer,
      pkey: result.pkey,
      gemeente: result.gemeente,
    };

    /* Nog niet van belang, wellicht in de toekomst afwijkende rapportteksten per organisatie?
      const textQuery = `SELECT vraag, tekst, minwaarde, maxwaarde, tekstwaarde FROM rapportteksten WHERE org = ($1)`;
      const textValues = [organisatie];
      */

    const textQuery = `SELECT vraag, tekst, minwaarde, maxwaarde, tekstwaarde FROM rapportteksten`;

    let reportText = await db.query(textQuery);
    reportText = reportText.rows;

    let teksten = {};

    for (const [key, value] of Object.entries(scores)) {
      //console.log("key " + key);
      //console.log("value " + value);
      let text = reportText.find(
        (o) => o.vraag === key && o.maxwaarde >= value && o.minwaarde <= value
      );
      teksten[key] = text.tekst;
    }

    for (const [key, value] of Object.entries(tekstWaarden)) {
      //console.log("key " + key);
      //console.log("value " + value);
      let text = reportText.find(
        (o) => o.vraag === key && o.tekstwaarde === value
      );
      teksten[key] = text.tekst;
    }

    const rapportPdf = new jsPDF();

    let tekstE1 = rapportPdf.splitTextToSize(teksten.E1, 350);
    let tekstE2 = rapportPdf.splitTextToSize(teksten.E2, 350);
    let tekstE3 = rapportPdf.splitTextToSize(teksten.E3, 350);
    let tekstE4 = rapportPdf.splitTextToSize(teksten.E4, 350);
    let tekstE5 = rapportPdf.splitTextToSize(teksten.E5, 350);
    let tekstE6 = rapportPdf.splitTextToSize(teksten.E6, 350);
    let tekstE7 = rapportPdf.splitTextToSize(teksten.E7, 350);
    let tekstE7A = rapportPdf.splitTextToSize(teksten.E7A, 350);
    let tekstE8 = rapportPdf.splitTextToSize(teksten.E8, 350);
    let tekstG1 = rapportPdf.splitTextToSize(teksten.G1, 350);
    let tekstG2 = rapportPdf.splitTextToSize(teksten.G2, 350);
    let tekstG3 = rapportPdf.splitTextToSize(teksten.G3, 350);
    let tekstG4 = rapportPdf.splitTextToSize(teksten.G4, 350);
    let tekstG5 = rapportPdf.splitTextToSize(teksten.G5, 350);
    let tekstG6 = rapportPdf.splitTextToSize(teksten.G6, 350);
    let tekstG7 = rapportPdf.splitTextToSize(teksten.G7, 350);
    let tekstG8 = rapportPdf.splitTextToSize(teksten.G8, 350);
    let tekstG9 = rapportPdf.splitTextToSize(teksten.G9, 350);

    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style type="text/css">
        body {
            font-family: 'Arial', sans-serif;
        }
        .heading-container {
            display: table;
            width: 100%;
            background-color: #666666;
            color: #fff;
            font-size: 11pt;
        }
        .heading-gevolg {
            background-color: #999966;
        }
        .heading-gedrag {
            background-color: #006699;
        }
        .heading-totaalscores {
          background-color: #999999;
          color: #000;
        }
        .heading-afwijking {
          background-color: #cccccc;
          color: #000;
        }
        .heading {
            display: table-cell;
            vertical-align: middle;
        }
    </style>
</head>
<body>
    <p>Goedendag,<br / >
        <br />
        Onderstaand vind je een terugkoppeling van de inschattingen die je hebt 
        gemaakt bij de beoordeling van een overtreding op de locatie ${zaakInfo.locatie}.<br />
        We vragen je de onderstaande data vast te leggen in het controledossier in Squit.</p>
        <br />
        <div class="heading-container">
            <div class="heading" >
                <h3>&nbsp;De bevindingen</h3>
            </div>
        </div>
        <p>De overtreding (${zaakInfo.pkey}) werd op ${zaakInfo.constdat} in de LHS matrix ingedeeld door: ${zaakInfo.medewerker}.<br /><br />
        De waarneming vond plaats op de locatie ${zaakInfo.locatie} in de gemeente ${zaakInfo.gemeente} en werd als volgt omschreven:<br /><br />
        ${zaakInfo.omschrijving}.</p>
        <br />
        <div class="heading-container heading-gevolg">
            <div class="heading" >
                <h4>&nbsp;Over de gevolgen van de overtreding:</h4>
            </div>
        </div>
        <p>${tekstE1}. <b>(${scores.E1})</b><br />
        ${tekstE2} <b>(${scores.E2})</b> en ${tekstE3}. <b>(${scores.E3})</b><br />
        <br />
        ${tekstE4}. <b>(${scores.E4})</b><br />
        ${tekstE5}. <b>(${scores.E5})</b><br />
        <br />
        ${tekstE6} <b>(${scores.E6})</b> en raakt dan waarschijnlijk ${tekstE7A}.<br />
        ${tekstE7}. <b>(${scores.E7})</b><br />
        <br />
        ${tekstE8}. <b>(${scores.E8})</b></p>
        <br />
        <div class="heading-container heading-gedrag">
            <div class="heading" >
                <h4>&nbsp;Over het gedrag van de overtreder:</h4>
            </div>
        </div>
        <p>${tekstG1}. <b>(${scores.G1})</b><br />
        ${tekstG2}. <b>(${scores.G2})</b><br />
        ${tekstG3}. <b>(${scores.G3})</b><br />
        <br />
        ${tekstG4}. <b>(${scores.G4})</b><br />
        <br />
        ${tekstG5}. <b>(${scores.G5})</b><br />
        ${tekstG6}. <b>(${scores.G6})</b><br />
        ${tekstG7}. <b>(${scores.G7})</b><br /></p>
        <br />
        <div class="heading-container">
            <div class="heading" >
                <h4>&nbsp;Verzwarende/verzachtende omstandigheden</h4>
            </div>
        </div>
        <p>Is legalisatie van de overtreding een mogelijkheid? <b>${tekstG8}</b> <br /><br />
        Is dezelfde overtreding al eerder geconstateerd bij dit bedrijf? <b>${tekstG9}</b> </p>
        <br />
        <div class="heading-container heading-totaalscores">
            <div class="heading" >
                <h4><b>&nbsp;TOTAALSCORES</b></h4>
            </div>
        </div>
        <table style="width: 100%;">
        <thead>
        <tr>
        <td>Totaalscore gedrag:</td>
        <td></td>
        <td></td>
        <td></td>
        <td rowspan="2"><b><h3>${zaakInfo.gscoreLetter}</b></h3></td>
        <td></td>
        <td></td>
        <td></td>
        <td>Totaalscore ernst</td>
        <td></td>
        <td></td>
        <td rowspan="2"><b><h3>${zaakInfo.escoreCijfer}</b></h3></td>
        </tr>
        <tr>
        <td><b>${zaakInfo.GTotal}</b></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td><b>${zaakInfo.ETotal}</b></td>
        </tr>
        </thead>
        </table></p>
</body>
</html>`;

    if (scoreAfwijken === true) {
      html =
        html +
        `
            <div class="heading-container heading-afwijking">
              <div class="heading">
                <h4>
                  <b>Afwijking tov berekende score</b>
                </h4>
              </div>
            </div>
          ` +
        `<p>De toezichthouder heeft aangegeven af te wijken van de bovenstaande score en heeft de volgende ` +
        `scores vastgelegd:<br /><br />`;
    }

    if (zaakInfo.gAfwijken.length > 0) {
      html =
        html +
        `<b>Gedrag: </b>${zaakInfo.gAfwijken}<br />` +
        `Reden: ${zaakInfo.gMutaReden}<br />` +
        `<br />`;
    }

    if (zaakInfo.eAfwijken.length > 0) {
      html =
        html +
        `<b>Ernst: </b>${zaakInfo.eAfwijken}<br />` +
        `Reden: ${zaakInfo.eMutaReden}<br />`;
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    await page.pdf({
      path: path.join(
        __dirname,
        "..",
        "reports",
        `lhs-terugkoppeling-overtreding-${zaakInfo.pkey}.pdf`
      ),
      format: "A4",
      printBackground: true,
    });
    await browser.close();

    sendMail(
      `LHS Assistent`,
      `info@lhsassistent.nl`,
      email,
      `Terugkoppeling vastgelegde overtreding`,
      ``,
      html,
      `lhs-terugkoppeling-overtreding-${zaakInfo.pkey}.pdf`,
      path.join(
        __dirname,
        "..",
        "reports",
        `lhs-terugkoppeling-overtreding-${zaakInfo.pkey}.pdf`
      )
    );

    if (boaMail.reviewed === false && boaMail.mailtype == 1) {
      let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style type="text/css">
        body {
            font-family: 'Arial', sans-serif;
        }
        .heading-container {
            display: table;
            width: 100%;
            background-color: #666666;
            color: #fff;
            font-size: 11pt;
        }
        .heading-gevolg {
            background-color: #999966;
        }
        .heading-gedrag {
            background-color: #006699;
        }
        .heading-totaalscores {
          background-color: #999999;
          color: #000;
        }
        .heading-afwijking {
          background-color: #cccccc;
          color: #000;
        }
        .heading {
            display: table-cell;
            vertical-align: middle;
        }
    </style>
</head>
<body>
    <p>Goedendag,<br / >
        <br />
        Collega ${user.aanhef} ${user.lastname} heeft zojuist een overtreding vastgelegd<br /> 
        met een score (Ernst: ${zaakInfo.ETotal}, Gedrag: ${zaakInfo.GTotal} (${zaakInfo.gscoreLetter}${zaakInfo.escoreCijfer}) ) die aanleiding geeft om te overleggen <br />
        over de te kiezen handhavingstrategie.<br />
        De overtreding is geconstateerd op locatie: ${zaakInfo.locatie}.<br />
        <br />
        Verzoek aan jou is om de vastlegging te <a href="https://app.lhsassistent.nl/boaform?token=${boaMail.emailToken}&reportid=${boaMail.reportid}">bekijken en aan te vullen</a> en in overleg met de collega keuzes te maken <br />
        mbt de te volgen strategie.<br />
        <br />
        Vriendelijke groeten.<br />
        <br />
        Informatie die is vastgelegd tref je hieronder (ook in het formulier als je dat via de link opent)
        <br />
        <div class="heading-container">
            <div class="heading" >
                <h3>&nbsp;De bevindingen</h3>
            </div>
        </div>
        <p>De overtreding werd op ${zaakInfo.constdat} in de LHS matrix ingedeeld door: ${zaakInfo.medewerker}.<br /><br />
        De waarneming vond plaats op de locatie ${zaakInfo.locatie} en werd als volgt omschreven:<br /><br />
        ${zaakInfo.omschrijving}.</p>
        <br />
        <div class="heading-container heading-gevolg">
            <div class="heading" >
                <h4>&nbsp;Over de gevolgen van de overtreding:</h4>
            </div>
        </div>
        <p>${tekstE1}. <b>(${scores.E1})</b><br />
        ${tekstE2} <b>(${scores.E2})</b> en ${tekstE3}. <b>(${scores.E3})</b><br />
        <br />
        ${tekstE4}. <b>(${scores.E4})</b><br />
        ${tekstE5}. <b>(${scores.E5})</b><br />
        <br />
        ${tekstE6} <b>(${scores.E6})</b> en raakt dan waarschijnlijk ${tekstE7A}.<br />
        ${tekstE7}. <b>(${scores.E7})</b><br />
        <br />
        ${tekstE8}. <b>(${scores.E8})</b></p>
        <br />
        <div class="heading-container heading-gedrag">
            <div class="heading" >
                <h4>&nbsp;Over het gedrag van de overtreder:</h4>
            </div>
        </div>
        <p>${tekstG1}. <b>(${scores.G1})</b><br />
        ${tekstG2}. <b>(${scores.G2})</b><br />
        ${tekstG3}. <b>(${scores.G3})</b><br />
        <br />
        ${tekstG4}. <b>(${scores.G4})</b><br />
        <br />
        ${tekstG5}. <b>(${scores.G5})</b><br />
        ${tekstG6}. <b>(${scores.G6})</b><br />
        ${tekstG7}. <b>(${scores.G7})</b><br /></p>
        <br />
        <div class="heading-container">
            <div class="heading" >
                <h4>&nbsp;Verzwarende/verzachtende omstandigheden</h4>
            </div>
        </div>
        <p>Is legalisatie van de overtreding een mogelijkheid? <b>${tekstG8}</b> <br /><br />
        Is dezelfde overtreding al eerder geconstateerd bij dit bedrijf? <b>${tekstG9}</b> </p>
        <br />
        </thead>
        </table></p>
</body>
</html>`;

      sendMail(
        `LHS Assistent`,
        `info@lhsassistent.nl`,
        boaMail.email,
        `Verzoek overname behandeling beoordeling handhavingsstrategie`,
        ``,
        html
      );
    }

    if (boaMail.reviewed === false && boaMail.mailtype == 2) {
      let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style type="text/css">
        body {
            font-family: 'Arial', sans-serif;
        }
        .heading-container {
            display: table;
            width: 100%;
            background-color: #666666;
            color: #fff;
            font-size: 11pt;
        }
        .heading-gevolg {
            background-color: #999966;
        }
        .heading-gedrag {
            background-color: #006699;
        }
        .heading-totaalscores {
          background-color: #999999;
          color: #000;
        }
        .heading-afwijking {
          background-color: #cccccc;
          color: #000;
        }
        .heading {
            display: table-cell;
            vertical-align: middle;
        }
        .afwijking-box {
            border:1px solid black;
        }
    </style>
</head>
<body>
    <p>Goedendag,<br / >
        <br />
        Collega ${user.aanhef} ${user.lastname} heeft zojuist een overtreding vastgelegd met een score (Ernst: ${zaakInfo.ETotal}, Gedrag: ${zaakInfo.GTotal} (${zaakInfo.gscoreLetter}${zaakInfo.escoreCijfer}) ) <br />
        werd gecorrigeerd tot ${zaakInfo.gAfwijken}${zaakInfo.eAfwijken}.<br />
        De berekende score geeft aanleiding om te overleggen over de te kiezen handhavingstrategie.<br />
        <br />
        De overtreding is geconstateerd op locatie: ${zaakInfo.locatie}.<br />
        <br />
        De genoemde reden om af te wijken van de berekende score die ${user.aanhef} ${user.lastname} aangaf is de volgende:<br />
        <div class="afwijking-box">
            <b>Gedrag:</b>${zaakInfo.gMutaReden}<br/>
            <br />
            <b>Ernst:</b>${zaakInfo.eMutaReden}<br/>
        </div>
        <br />
        Verzoek aan jou is om de vastlegging te <a href="https://app.lhsassistent.nl/boaform?token=${boaMail.emailToken}&reportid=${boaMail.reportid}">bekijken en aan te vullen</a> en in overleg met de collega keuzes te maken <br />
        mbt de te volgen strategie.<br />
        <br />
        Vriendelijke groeten.<br />
        <br />
        Informatie die is vastgelegd tref je hieronder (ook in het formulier als je dat via de link opent)
        <br />
        <div class="heading-container">
            <div class="heading" >
                <h3>&nbsp;De bevindingen</h3>
            </div>
        </div>
        <p>De overtreding werd op ${zaakInfo.constdat} in de LHS matrix ingedeeld door: ${zaakInfo.medewerker}.<br /><br />
        De waarneming vond plaats op de locatie ${zaakInfo.locatie} en werd als volgt omschreven:<br /><br />
        ${zaakInfo.omschrijving}.</p>
        <br />
        <div class="heading-container heading-gevolg">
            <div class="heading" >
                <h4>&nbsp;Over de gevolgen van de overtreding:</h4>
            </div>
        </div>
        <p>${tekstE1}. <b>(${scores.E1})</b><br />
        ${tekstE2} <b>(${scores.E2})</b> en ${tekstE3}. <b>(${scores.E3})</b><br />
        <br />
        ${tekstE4}. <b>(${scores.E4})</b><br />
        ${tekstE5}. <b>(${scores.E5})</b><br />
        <br />
        ${tekstE6} <b>(${scores.E6})</b> en raakt dan waarschijnlijk ${tekstE7A}.<br />
        ${tekstE7}. <b>(${scores.E7})</b><br />
        <br />
        ${tekstE8}. <b>(${scores.E8})</b></p>
        <br />
        <div class="heading-container heading-gedrag">
            <div class="heading" >
                <h4>&nbsp;Over het gedrag van de overtreder:</h4>
            </div>
        </div>
        <p>${tekstG1}. <b>(${scores.G1})</b><br />
        ${tekstG2}. <b>(${scores.G2})</b><br />
        ${tekstG3}. <b>(${scores.G3})</b><br />
        <br />
        ${tekstG4}. <b>(${scores.G4})</b><br />
        <br />
        ${tekstG5}. <b>(${scores.G5})</b><br />
        ${tekstG6}. <b>(${scores.G6})</b><br />
        ${tekstG7}. <b>(${scores.G7})</b><br /></p>
        <br />
        <div class="heading-container">
            <div class="heading" >
                <h4>&nbsp;Verzwarende/verzachtende omstandigheden</h4>
            </div>
        </div>
        <p>Is legalisatie van de overtreding een mogelijkheid? <b>${tekstG8}</b> <br /><br />
        Is dezelfde overtreding al eerder geconstateerd bij dit bedrijf? <b>${tekstG9}</b> </p>
        <br />
        </thead>
        </table></p>
</body>
</html>`;

      sendMail(
        `LHS Assistent`,
        `info@lhsassistent.nl`,
        boaMail.email,
        `Verzoek overname behandeling beoordeling handhavingsstrategie`,
        ``,
        html
      );
    }

    res
      .status(200)
      .send({ message: "Rapport opnieuw verzonden naar toezichthouder" });
  } catch (error) {
    console.log(error);
  }
};
