const dashboard = require("express").Router();
const { verifyUser } = require("../../authenticate");
const authenticateToken = require("../../middleware/authenticateToken");
const adminRequired = require("../../middleware/authenticateAdmin.js");
const getDashboard = require("./getDashboard");

dashboard.get("/getdashboard", [verifyUser, adminRequired], getDashboard);
/**
 * @swagger
 * /dashboard/getdashboard:
 *   get:
 *     summary: Rapportdata voor dashboard ophalen.
 *     description: Dit endpoint geeft altijd de data van 90 dagen voor tot en met de peildatum.
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: ScoreCard Object. Geeft percentages van rapportages binnen geselecteerde periode. (m.u.v. total, dit is totaal aantal rapporten)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 A1:
 *                   type: integer
 *                 A2:
 *                   type: integer
 *                 A3:
 *                   type: integer
 *                 A4:
 *                   type: integer
 *                 B1:
 *                   type: integer
 *                 B2:
 *                   type: integer
 *                 B3:
 *                   type: integer
 *                 B4:
 *                   type: integer
 *                 C1:
 *                   type: integer
 *                 C2:
 *                   type: integer
 *                 C3:
 *                   type: integer
 *                 C4:
 *                   type: integer
 *                 D1:
 *                   type: integer
 *                 D2:
 *                   type: integer
 *                 D3:
 *                   type: integer
 *                 D4:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 recidiven:
 *                   type: integer
 *                 gAfwijk:
 *                   type: integer
 *                 eAfwijk:
 *                   type: integer
 *                 startDate:
 *                   type: string
 *                 peilDatum:
 *                   type: string
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: peildatum
 *         required: true
 *         schema:
 *           type: string
 *           format: YYYY-MM-DD
 *       - in: query
 *         name: gemeente
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: userid
 *         required: false
 *         schema:
 *           type: string
 */

module.exports = dashboard;
