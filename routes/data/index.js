const data = require("express").Router();
const { verifyUser } = require("../../authenticate");
const adminRequired = require("../../middleware/authenticateAdmin.js");
const getRawData = require("./getRawData");

data.get("/", [verifyUser, adminRequired], getRawData);
/**
 * @swagger
 * /data:
 *   get:
 *     summary: Dataset van een periode ophalen
 *     tags:
 *       - Ruwe data
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
 *       - in: query
 *         name: type
 *         description: Data kan als 'json' of als 'excel' opgehaald worden
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: startDate
 *         description: Vanaf datum
 *         schema:
 *           type: string
 *           format: YYYY-MM-DD
 *         required: false
 *       - in: query
 *         name: endDate
 *         description: tot en met datum
 *         schema:
 *           type: string
 *           format: YYYY-MM-DD
 *         required: false
 */

module.exports = data;
