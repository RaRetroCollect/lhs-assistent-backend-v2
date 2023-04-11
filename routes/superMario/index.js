const supermario = require("express").Router();
const authenticateToken = require("../../middleware/authenticateToken");
const superUserRequired = require("../../middleware/authenticateSuperUser.js");
const getSingleOrganisation = require("./getSingleOrganisation");
const getOrganisations = require("./getOrganisations");
const createOrganisation = require("./createOrganisation");
const updateOrganisation = require("./updateOrganisation");
const deleteOrganisation = require("./deleteOrganisation");
const getMultipliercodes = require("./getMultiplierCodes");
const { verifyUser } = require("../../authenticate");

//TODO JSDoc nalopen
supermario.get("/getorganisation/:pkey", [verifyUser, superUserRequired], getSingleOrganisation);
/**
 * @swagger
 * /supermario/getorganisation/{pkey}:
 *   get:
 *     summary: Gebruiker verwijderen.
 *     tags:
 *       - SuperUser
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

supermario.get("/getorganisations", [verifyUser, superUserRequired], getOrganisations);
/**
 * @swagger
 * /supermario/getorganisations:
 *   get:
 *     summary: Gebruiker verwijderen.
 *     tags:
 *       - SuperUser
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

supermario.post("/createorganisation", [verifyUser, superUserRequired], createOrganisation);
/**
 * @swagger
 * /supermario/createorganisation:
 *   post:
 *     summary: Gebruiker verwijderen.
 *     tags:
 *       - SuperUser
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

supermario.patch("/updateorganisation", [verifyUser, superUserRequired], updateOrganisation);
/**
 * @swagger
 * /supermario/updateorganisation:
 *   patch:
 *     summary: Gebruiker verwijderen.
 *     tags:
 *       - SuperUser
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

supermario.delete(
  "/deleteorganisation",
  [verifyUser, superUserRequired],
  deleteOrganisation
);
/**
 * @swagger
 * /supermario/deleteorganisation:
 *   delete:
 *     summary: Gebruiker verwijderen.
 *     tags:
 *       - SuperUser
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

supermario.get(
  "/getmultipliercodes",
  [verifyUser, superUserRequired],
  getMultipliercodes
);
/**
 * @swagger
 * /supermario/getmultipliercodes:
 *   get:
 *     summary: Gebruiker verwijderen.
 *     tags:
 *       - SuperUser
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

module.exports = supermario;
