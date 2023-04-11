const db = require("../../config/postgres");
const { sendMail } = require("../../functions/sendMail");
const {
  generateBoaReportPdf,
} = require("../../functions/generateBoaReportPdf");
const sql = require("sql-tag");

module.exports = async (req, res) => {
  try {
    const getEmail = await db.query(`SELECT email FROM users WHERE pkey = $1`, [
      req.user.pkey,
    ]);

    const email = getEmail.rows[0].email;

    const rapportData = req.body;

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
    let S1Calc = rapportData.strat1Calc.toFixed(2);
    let S2Calc = rapportData.strat2Calc.toFixed(2);
    let S3Calc = rapportData.strat3Calc.toFixed(2);
    //let S4Calc = rapportData.strat4Calc.toFixed(2);
    let S5Calc = rapportData.strat5Calc.toFixed(2);
    let S6Calc = rapportData.strat6Calc.toFixed(2);
    let S7Calc = rapportData.strat7Calc.toFixed(2);

    const updateQuery = sql`UPDATE rapporten
        SET score_e1 = ${1}, 
            score_multipl_e1 = ${2},
            score_e2 = ${3}, 
            score_multipl_e2= ${4},
            score_e3 = ${5},
            score_multipl_e3= ${6},
            score_e4 = ${7},
            score_multipl_e4 = ${8},
            score_e5 = ${9},
            score_multipl_e5 = ${10},
            score_e6 = ${11},
            score_multipl_e6 = ${12},
            score_e7 = ${13},
            score_multipl_e7 = ${14},
            score_e7a = ${15},
            score_e8 = ${16},
            score_multipl_e8 = ${17},
            score_g1 = ${18},
            score_multipl_g1 = ${19},
            score_g2 = ${20},
            score_multipl_g2 = ${21},
            score_g3 = ${22},
            score_multipl_g3 = ${23},
            score_g4 = ${24},
            score_multipl_g4 = ${25},
            score_g5 = ${26},
            score_multipl_g5 = ${27},
            score_g6 = ${28},
            score_multipl_g6 = ${29},
            score_g7 = ${30},
            score_multipl_g7 = ${31},
            score_g8 = ${32},
            score_g9 = ${33},
            score_g10 = ${34},
            score_e9 = ${35},
            gscore_afwijken = ${36},
            gscore_calc_total = ${37},
            escore_afwijken = ${38},
            escore_calc_total = ${39},
            gscore_mutareden = ${40},
            escore_mutareden = ${41},
            toelichting_e4 = ${42},
            toelichting_e6 = ${43},
            gscore_letter = ${44},
            escore_cijfer = ${45},
            ernstq7atekst = ${46},
            gedragq8tekst = ${47},
            gedragq9tekst = ${48},
            score_s1 = ${49},
            score_multipl_s1 = ${50},
            score_s2 = ${51},
            score_multipl_s2 = ${52},
            score_s3 = ${53},
            score_multipl_s3 = ${54},
            s4_tekst = ${55},
            score_s5 = ${56},
            score_multipl_s5 = ${57},
            score_s6 = ${58},
            score_multipl_s6 = ${59},
            score_s7 = ${60},
            score_multipl_s7 = ${61},
            s5_toelichting = ${62},
            reviewed = true,
            strat_opmerking = ${63}
        WHERE pkey = ${64}
        RETURNING *;`;

    const updateValues = [
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
      rapportData.eAfwijking,
      EscoreTotal,
      rapportData.gAfwijkingToelichting,
      rapportData.eAfwijkingToelichting,
      rapportData.G4Toelichting,
      rapportData.G6Toelichting,
      rapportData.gscoreLetter,
      rapportData.escoreCijfer,
      rapportData.ernstq7aTekst,
      rapportData.gedragq8Tekst,
      rapportData.gedragq9Tekst,
      rapportData.strat1,
      S1Calc,
      rapportData.strat2,
      S2Calc,
      rapportData.strat3,
      S3Calc,
      rapportData.strat4tekst,
      rapportData.strat5,
      S5Calc,
      rapportData.strat6,
      S6Calc,
      rapportData.strat7,
      S7Calc,
      rapportData.strat5Toelichting,
      rapportData.strat_remarks,
      rapportData.rapportId,
    ];

    const result = await db.query(updateQuery, updateValues);

    if (result.rowCount > 0) {
      await generateBoaReportPdf(
        rapportData.rapportId,
        "ramonvandelft@gmail.com"
      );
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
