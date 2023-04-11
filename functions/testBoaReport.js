const { jsPDF } = require("jspdf");
const db = require("../config/postgres");
const { sendMail } = require("./sendMail");
const puppeteer = require("puppeteer");
const { lhsApiUrl } = require("../config/config");
const path = require("path");

async function generateBoaReportPdf(rapportPkeyRecord, email) {
  try {
    const query =
      `SELECT r.pkey, r.score_e1, r.score_e2, r.score_e3, r.score_e4, ` +
      `r.score_e5, r.score_e6, r.score_e7, r.score_e8, r.score_g1, ` +
      `r.score_g2, r.score_g3, r.score_g4, r.score_g5, r.score_g6, r.score_g7, r.score_g8, ` +
      `r.medewerker, r.datum, r.score_s1 , r.score_s2 , r.score_s3 , r.score_s4 , ` +
      `r.score_s5 , r.score_s6 , r.score_s7, r.s4_tekst, r.s5_toelichting, ` +
      `r.locatie, r.omschrijving, r.gscore_calc_total, r.escore_calc_total, ` +
      `r.gscore_mutareden, r.escore_mutareden, r.gscore_afwijken, r.escore_afwijken, ` +
      `r.gscore_letter, r.escore_cijfer, r.ernstq7atekst, r.gedragq8tekst, r.gedragq9tekst, ` +
      `r.toelichting_e4, r.toelichting_e6, g.gemeente ` +
      `from rapporten r ` +
      `left join gemeentes g on CAST(g.pkey as varchar) = r.gemeenteid ` +
      `where r.pkey = ($1)`;
    const values = [rapportPkeyRecord];

    let result = await db.query(query, values);
    result = result.rows[0];

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
      S1: result.score_s1,
      S2: result.score_s2,
      S3: result.score_s3,
      S5: result.score_s5,
      S6: result.score_s6,
      S7: result.score_s7,
    };

    const tekstWaarden = {
      S4: result.s4_tekst,
      E7A: result.ernstq7atekst,
      G8: result.gedragq8tekst,
      G9: result.gedragq9tekst,
    };

    let curDate = new Date();
    let curdag_raw = curDate.getDate();
    let curmaand_raw = curDate.getMonth() + 1;
    let curjaar = curDate.getFullYear();
    let curdate, curmonth;

    if (curdag_raw < 10) {
      curdate = "0" + curdag_raw.toString();
    } else {
      curdate = curdag_raw.toString();
    }
    if (curmaand_raw < 10) {
      curmonth = "0" + curmaand_raw.toString();
    } else {
      curmonth = curmaand_raw.toString();
    }

    let curDat = curdate + "-" + curmonth + "-" + curjaar;

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
      console.log(teksten);
    }

    let tekstE1 = teksten.E1; //rapportPdf.splitTextToSize(teksten.E1, 350);
    let tekstE2 = teksten.E2; //rapportPdf.splitTextToSize(teksten.E2, 350);
    let tekstE3 = teksten.E3; //rapportPdf.splitTextToSize(teksten.E3, 350);
    let tekstE4 = teksten.E4; //rapportPdf.splitTextToSize(teksten.E4, 350);
    let tekstE5 = teksten.E5; //rapportPdf.splitTextToSize(teksten.E5, 350);
    let tekstE6 = teksten.E6; //rapportPdf.splitTextToSize(teksten.E6, 350);
    let tekstE7 = teksten.E7; //rapportPdf.splitTextToSize(teksten.E7, 350);
    let tekstE7A = teksten.E7A; //rapportPdf.splitTextToSize(teksten.E7A, 350);
    let tekstE8 = teksten.E8; //rapportPdf.splitTextToSize(teksten.E8, 350);
    let tekstG1 = teksten.G1; //rapportPdf.splitTextToSize(teksten.G1, 350);
    let tekstG2 = teksten.G2; //rapportPdf.splitTextToSize(teksten.G2, 350);
    let tekstG3 = teksten.G3; //rapportPdf.splitTextToSize(teksten.G3, 350);
    let tekstG4 = teksten.G4; //rapportPdf.splitTextToSize(teksten.G4, 350);
    let tekstG5 = teksten.G5; //rapportPdf.splitTextToSize(teksten.G5, 350);
    let tekstG6 = teksten.G6; //rapportPdf.splitTextToSize(teksten.G6, 350);
    let tekstG7 = teksten.G7; //rapportPdf.splitTextToSize(teksten.G7, 350);
    let tekstG8 = teksten.G8; //rapportPdf.splitTextToSize(teksten.G8, 350);
    let tekstG9 = teksten.G9; //rapportPdf.splitTextToSize(teksten.G9, 350);
    let tekstS1 = teksten.S1; //rapportPdf.splitTextToSize(teksten.S1, 350);
    let tekstS2 = teksten.S2; //rapportPdf.splitTextToSize(teksten.S2, 350);
    let tekstS3 = teksten.S3; //rapportPdf.splitTextToSize(teksten.S3, 350);
    let tekstS4 = teksten.S4; //rapportPdf.splitTextToSize(teksten.S4, 350);
    let tekstS5 = teksten.S5; //rapportPdf.splitTextToSize(teksten.S5, 350);
    let tekstS6 = teksten.S6; //rapportPdf.splitTextToSize(teksten.S6, 350);
    let tekstS7 = teksten.S7; //rapportPdf.splitTextToSize(teksten.S7, 350);

    if (scores.S1 < 31) {
      tekstS1 = "";
    }

    if (scores.S2 < 31) {
      tekstS2 = "";
    }

    if (scores.S3 < 31) {
      tekstS3 = "";
    }

    if (scores.S5 < 31) {
      tekstS5 = "";
    }

    if (scores.S6 < 31) {
      tekstS6 = "";
    }

    if (scores.S7 < 31) {
      tekstS7 = "";
    }

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
        Op datum ${constDat} werd een overtreding geconstateerd door ${result.medewerker}. De vastgelegde score in de LHS matrix
        gaf aanleiding om een BOA te raadplegen over de te kiezen handhavingstrategie.<br />
        In overleg met een BOA werd de door de toezichthouder opgemaakte rapportage nogmaals bekeken en eventueel aangepast.<br />
        <br />
        Vervolgens is bezien of er verzwarende aspecten zijn die betrokken dienen te worden bij de afweging om  
        het bestuurs- en/of strafrecht toe te passen. De bevindingen daarover zijn op ${curDat}, achter de nogmaals
        bekeken en eventueel aangepaste rapportage van toezichthouder, in deze rapportage vastgelegd. De keuzes over het bestuurlijk ofwel
        strafrechtelijk optreden zijn gebasserd op de totale rapportage.<br />
        <br />
        </p>
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
        ${tekstG4} <br />
        ${result.toelichting_e4}. <b>(${scores.G4})</b><br />
        ${tekstG5}. <b>(${scores.G5})</b><br />
        ${tekstG6}<br />
        ${result.toelichting_e6}. <b>(${scores.G6})</b><br />
        ${tekstG7}.<br /></p>
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
        <div class="heading-container heading-gevolg">
            <div class="heading" >
                <h4>&nbsp;Overwegingen bij de keuze voor een handhavingsstrategie (BOA):</h4>
            </div>
        </div>
        <p>`;

    if (scores.S1 > 30) {
      html =
        html +
        `1_<br />
        ${tekstS1} <b>(${scores.S1})</b><br />`;
    }

    if (scores.S2 > 30) {
      html =
        html +
        `2_<br />
        ${tekstS2} <b>(${scores.S2})</b><br />`;
    }

    if (scores.S3 > 30) {
      html =
        html +
        `3_<br />
        ${tekstS3} <b>(${scores.S3})</b><br />`;
    }

    html =
      html +
      `4_<br />
        ${tekstS4} <br />`;

    if (scores.S5 > 30) {
      html =
        html +
        `5_<br />
        ${tekstS5} <b>(${scores.S5})</b><br />
        ${result.s5_toelichting}<br />`;
    }

    if (scores.S6 > 30) {
      html =
        html +
        `6_<br />
        ${tekstS6} <b>(${scores.S6})</b><br />`;
    }

    if (scores.S7 > 30) {
      html =
        html +
        `7_<br />
        ${tekstS7} <b>(${scores.S7})</b><br />`;
    }

    html =
      html +
      `</body>
</html>`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    await page.pdf({
      path: path.join(
        __dirname,
        "..",
        "reports",
        `lhs-terugkoppeling-overtreding-${rapportPkeyRecord}.pdf`
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
      `lhs-terugkoppeling-overtreding-${rapportPkeyRecord}.pdf`,
      path.join(
        __dirname,
        "..",
        "reports",
        `lhs-terugkoppeling-overtreding-${rapportPkeyRecord}.pdf`
      )
    );
  } catch (error) {
    console.log(error);
  }
}

generateBoaReportPdf(496, "ramonvandelft@gmail.com");
