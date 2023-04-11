const user = require("express").Router();
const { verifyUser } = require("../../authenticate");
const adminRequired = require("../../middleware/authenticateAdmin.js");
//const getUserinfo = require("./getUserinfo");
const insertNewPassword = require("./insertNewPassword");

user.get("/me", verifyUser, (req, res, next) => {
  res.send(req.user);
});

//user.get("/", authenticateToken, getUserinfo);
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Gebruiker verwijderen.
 *     tags:
 *       - User
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

user.post("/newpass", [verifyUser, adminRequired], insertNewPassword);
/**
 * @swagger
 * /user/newpass:
 *   post:
 *     summary: Gebruiker verwijderen.
 *     tags:
 *       - User
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

module.exports = user;
