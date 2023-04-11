const forms = require("express").Router();
const boaRequired = require("../../middleware/authenticateBoa.js");
const sendForm = require("./sendForm");
const sendBoaForm = require("./sendBoaForm");
const getMultipliers = require("./getMultipliers");
const getGemeenten = require("./getGemeenten");
const getReport = require("./getReport.js");
const getBoaForms = require("./getBoaForms.js");
const getBoaFormCount = require("./getBoaFormCount.js");
const getAllReports = require("./getAllReports.js");
const { verifyUser } = require("../../authenticate");

forms.post("/", verifyUser, sendForm);
forms.post("/boaform", verifyUser, sendBoaForm);
forms.get("/getboaforms", verifyUser, getBoaForms);
forms.get("/getallreports", verifyUser, getAllReports);
forms.get("/getboaformcount", verifyUser, getBoaFormCount);

forms.get("/getreport/:reportid", [verifyUser, boaRequired], getReport);
/**
 * @swagger
 * /forms/getreport/{reportid}:
 *   get:
 *     summary: Gegevens enkel rapport ophalen op reportid
 *     tags:
 *       - Formulieren
 *     responses:
 *       200:
 *         description: array of report objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pkey:
 *                     type: string
 *                   zaaknummer:
 *                     type: string
 *                   medewerker:
 *                     type: string
 *                   score_e1:
 *                     type: integer
 *                   score_multipl_e1:
 *                     type: integer
 *                   score_e2:
 *                     type: integer
 *                   score_multipl_e2:
 *                     type: integer
 *                   score_e3:
 *                     type: integer
 *                   score_multipl_e3:
 *                     type: integer
 *                   score_e4:
 *                     type: integer
 *                   score_multipl_e4:
 *                     type: integer
 *                   score_e5:
 *                     type: integer
 *                   score_multipl_e5:
 *                     type: integer
 *                   score_e6:
 *                     type: integer
 *                   score_multipl_e6:
 *                     type: integer
 *                   score_e7:
 *                     type: integer
 *                   score_multipl_e7:
 *                     type: integer
 *                   score_e7a:
 *                     type: integer
 *                   score_e8:
 *                     type: integer
 *                   score_multipl_e8:
 *                     type: integer
 *                   score_g1:
 *                     type: integer
 *                   score_multipl_g1:
 *                     type: integer
 *                   score_g2:
 *                     type: integer
 *                   score_multipl_g2:
 *                     type: integer
 *                   score_g3:
 *                     type: integer
 *                   score_multipl_g3:
 *                     type: integer
 *                   score_g4:
 *                     type: integer
 *                   score_multipl_g4:
 *                     type: integer
 *                   score_g5:
 *                     type: integer
 *                   score_multipl_g5:
 *                     type: integer
 *                   score_g6:
 *                     type: integer
 *                   score_multipl_g6:
 *                     type: integer
 *                   score_g7:
 *                     type: integer
 *                   score_multipl_g7:
 *                     type: integer
 *                   score_g8:
 *                     type: integer
 *                   score_g9:
 *                     type: integer
 *                   score_g10:
 *                     type: integer
 *                   score_e9:
 *                     type: integer
 *                   gscore_afwijken:
 *                     type: string
 *                   gscore_calc_total:
 *                     type: integer
 *                   escore_afwijken:
 *                     type: integer
 *                   escore_calc_total:
 *                     type: integer
 *                   gscore_mutareden:
 *                     type: string
 *                   escore_mutareden:
 *                     type: string
 *                   datum:
 *                     type: string
 *                   toelichting_e4:
 *                     type: string
 *                   toelichting_e6:
 *                     type: string
 *                   locatie:
 *                     type: string
 *                   omschrijving:
 *                     type: string
 *                   gscore_letter:
 *                     type: string
 *                   escore_cijfer:
 *                     type: integer
 *                   ernstq7atekst:
 *                     type: string
 *                   gedragq8tekst:
 *                     type: string
 *                   gedragq9tekst:
 *                     type: string
 *                   gemeenteid:
 *                     type: string
 *                   userid:
 *                     type: string
 *                   organisationid:
 *                     type: string
 *                   starttijd:
 *                     type: string
 *                   eindtijd:
 *                     type: string
 *                   score_s1:
 *                     type: integer
 *                   score_multipl_s1:
 *                     type: integer
 *                   score_s2:
 *                     type: integer
 *                   score_multipl_s2:
 *                     type: integer
 *                   score_s3:
 *                     type: integer
 *                   score_multipl_s3:
 *                     type: integer
 *                   score_s4:
 *                     type: integer
 *                   score_multipl_s4:
 *                     type: integer
 *                   score_s5:
 *                     type: integer
 *                   score_multipl_s5:
 *                     type: integer
 *                   score_s6:
 *                     type: integer
 *                   score_multipl_s6:
 *                     type: integer
 *                   score_s7:
 *                     type: integer
 *                   score_multipl_s7:
 *                     type: integer
 *                   reviewed:
 *                     type: string
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: reportid
 *         schema:
 *           type: string
 *         required: true
 */

forms.get("/multipliers", verifyUser, getMultipliers);
/**
 * @swagger
 * /forms/multipliers:
 *   get:
 *     summary: Wegingsfactoren van organisatie ophalen.
 *     tags:
 *       - Formulieren
 *     responses:
 *       200:
 *         description: Object met de huidige multiplier instellingen van de organisatie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 E1:
 *                   type: integer
 *                 E2:
 *                   type: integer
 *                 E3:
 *                   type: integer
 *                 E4:
 *                   type: integer
 *                 E5:
 *                   type: integer
 *                 E6:
 *                   type: integer
 *                 E7:
 *                   type: integer
 *                 E8:
 *                   type: integer
 *                 G1:
 *                   type: integer
 *                 G2:
 *                   type: integer
 *                 G3:
 *                   type: integer
 *                 G4:
 *                   type: integer
 *                 G5:
 *                   type: integer
 *                 G6:
 *                   type: integer
 *                 G7:
 *                   type: integer
 *                 S2:
 *                   type: integer
 *                 S3:
 *                   type: integer
 *                 S4:
 *                   type: integer
 *                 S5:
 *                   type: integer
 *                 S6:
 *                   type: integer
 *                 S7:
 *                   type: integer
 *                 S1:
 *                   type: integer
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 */

forms.get("/gemeenten", verifyUser, getGemeenten);
/**
 * @swagger
 * /forms/gemeenten:
 *   get:
 *     summary: Gemeentes van organisatie ophalen.
 *     tags:
 *       - Formulieren
 *     responses:
 *       200:
 *         description: Array van gemeente objecten.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pkey:
 *                     type: string
 *                   gemeente:
 *                     type: string
 *                   organisationid:
 *                     type: string
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 */

module.exports = forms;
