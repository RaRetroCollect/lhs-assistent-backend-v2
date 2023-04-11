const auth = require("express").Router();
const login = require("./login");
const passport = require("passport");
const isVerify = require("./isVerify");
const lostPassword = require("./lostpassword");
const refreshToken = require("./refreshToken");
const microsoftCallback = require("./microsoftCallback");
const logout = require("./logout");
const { verifyUser } = require("../../authenticate");
const authenticateResetToken = require("../../middleware/authenticateResetToken");
const resetPassword = require("./resetpassword");

auth.post("/lost-password", lostPassword);

auth.post("/login", passport.authenticate("local", { session: false }), login);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inloggen met username en password
 *     requestBody:
 *       description: A JSON
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     tags:
 *       - Authenticatie
 *     responses:
 *       200:
 *         description: JSON Web Token
 *         content:
 *           application/json:
 *             schema:
 *                 type: string
 */

auth.get("/is-verify", verifyUser, isVerify);
/**
 * @swagger
 * /auth/is-verify:
 *   get:
 *     summary: Controleer of token geldig is
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     tags:
 *       - Authenticatie
 *     responses:
 *       200:
 *         description: JSON Web Token
 *         content:
 *           application/json:
 *             schema:
 *                 type: boolean
 */

auth.post("/resetpassword", authenticateResetToken, resetPassword);

auth.post("/refreshtoken", refreshToken);

auth.get(
  "/login/azure",
  passport.authenticate("microsoft", { session: false })
);

auth.get(
  "/login/azure/callback",
  passport.authenticate("microsoft", { session: false }),
  microsoftCallback
);

auth.get("/logout", verifyUser, logout);

module.exports = auth;
