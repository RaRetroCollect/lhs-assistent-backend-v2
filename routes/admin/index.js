const admin = require("express").Router();
const adminRequired = require("../../middleware/authenticateAdmin.js");
const getSingleUser = require("./getSingleUser");
const getSingleGemeente = require("./getSingleGemeente.js");
const getUsers = require("./getUsers");
const getGemeenten = require("./getGemeenten.js");
const createUser = require("./createUser");
const createGemeente = require("./createGemeente");
const updateUser = require("./updateUser");
const updateGemeente = require("./updateGemeente");
const deleteUser = require("./deleteUser");
const deleteGemeente = require("./deleteGemeente");
const deleteReport = require("./deleteReport");
const resendReport = require("./resendReport");
const activateUser = require("./activateUser");
const { verifyUser } = require("../../authenticate");

admin.get("/getuser/:pkey", [verifyUser, adminRequired], getSingleUser);
/**
 * @swagger
 * /admin/getuser/{pkey}:
 *   get:
 *     summary: Gegevens van gebruiker ophalen
 *     tags:
 *       - Gebruikers
 *     responses:
 *       200:
 *         description: User Object
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pkey:
 *                     type: string
 *                   username:
 *                     type: string
 *                   password:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                   firstname:
 *                     type: string
 *                   lastname:
 *                     type: string
 *                   sex:
 *                     type: string
 *                   organisationid:
 *                     type: string
 *                   deleted:
 *                     type: boolean
 *                   inactive:
 *                     type: boolean
 *     parameters:
 *       - in: path
 *         name: pkey
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 */

admin.get("/getusers", [verifyUser, adminRequired], getUsers);
/**
 * @swagger
 * /admin/getusers:
 *   get:
 *     summary: Alle gebruikers binnen organisatie ophalen.
 *     tags:
 *       - Gebruikers
 *     responses:
 *       200:
 *         description: array of user objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pkey:
 *                     type: string
 *                   username:
 *                     type: string
 *                   password:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                   firstname:
 *                     type: string
 *                   lastname:
 *                     type: string
 *                   sex:
 *                     type: string
 *                   organisationid:
 *                     type: string
 *                   deleted:
 *                     type: boolean
 *                   inactive:
 *                     type: boolean
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 */

admin.get("/getgemeenten", [verifyUser, adminRequired], getGemeenten);
/**
 * @swagger
 * /admin/getgemeenten:
 *   get:
 *     summary: Alle gemeenten binnen organisatie ophalen.
 *     tags:
 *       - Gemeenten
 *     responses:
 *       200:
 *         description: array of gemeente objects
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

admin.post("/createuser", [verifyUser, adminRequired], createUser);

admin.post("/creategemeente", [verifyUser, adminRequired], createGemeente);

admin.patch("/updateuser", [verifyUser, adminRequired], updateUser);

admin.patch("/updategemeente", [verifyUser, adminRequired], updateGemeente);

admin.delete("/deleteuser", [verifyUser, adminRequired], deleteUser);

admin.delete("/deletegemeente", [verifyUser, adminRequired], deleteGemeente);

admin.delete("/deletereport", [verifyUser, adminRequired], deleteReport);

admin.get("/resendreport/:pkey", [verifyUser, adminRequired], resendReport);

admin.patch("/activateuser/:status", [verifyUser, adminRequired], activateUser);

admin.get("/getgemeente/:pkey", [verifyUser, adminRequired], getSingleGemeente);
/**
 * @swagger
 * /admin/getgemeente/{pkey}:
 *   get:
 *     summary: Gegevens van gemeente
 *     tags:
 *       - Gemeenten
 *     responses:
 *       200:
 *         description: Gemeente Object
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
 *       - in: path
 *         name: pkey
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 */

module.exports = admin;
