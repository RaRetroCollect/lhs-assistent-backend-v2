const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
  verifyUser,
} = require("../authenticate");

const {
  usernameExists,
  updateRefreshToken,
  clearRefreshToken,
} = require("../utils/helper");

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  async (req, res, next) => {
    try {
      const token = getToken({ username: req.user.username });
      const refreshToken = getRefreshToken({ username: req.user.username });
      await updateRefreshToken(req.user.username, refreshToken);
      const user = await usernameExists(req.user.username);

      if (!user) {
        res.status(400).send({
          message: "Gebruiker niet gevonden.",
          description: "Geef de juiste gebruikersnaam op.",
        });
      } else {
        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
        res.send({ succes: true, token });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.get(
  "/login/azure",
  passport.authenticate("microsoft", { session: false })
);

router.get(
  "/login/azure/callback",
  passport.authenticate("microsoft", { session: false }),
  async (req, res, next) => {
    try {
      console.log(req);
      const refreshToken = getRefreshToken({ username: req.user.username });
      await updateRefreshToken(req.user.username, refreshToken);
      const user = await usernameExists(req.user.username);

      if (!user) {
        res.statusCode = 500;
        //TODO onderstaan redirecten naar login niet gelukt!
        res.send();
      } else {
        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
        res.redirect("https://demo.lhsassistent.nl");
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.get(
  "/login/google",
  passport.authenticate("google", { session: false, scope: ["email"] })
);

router.get(
  "/login/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res, next) => {
    try {
      const refreshToken = getRefreshToken({ username: req.user });
      await updateRefreshToken(req.user, refreshToken);
      const user = await usernameExists(req.user);

      if (!user) {
        res.statusCode = 500;
        //TODO onderstaan redirecten naar login niet gelukt!
        res.send();
      } else {
        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
        res.redirect("http://localhost:3000");
      }
    } catch (error) {
      next(error);
    }
  }
);

router.post("/refreshtoken", async (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  if (refreshToken) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      const userId = payload.username;
      const user = await usernameExists(userId);

      if (user) {
        if (user.refreshtoken !== refreshToken) {
          res.statusCode = 401;
          res.send("Unauthorized");
        } else {
          const token = getToken({
            username: userId,
          });
          const newRefreshToken = getRefreshToken({
            username: userId,
          });

          await updateRefreshToken(userId, newRefreshToken);
          res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
          res.send({ succes: true, token });
        }
      } else {
        res.statusCode = 401;
        res.send("Unauthorized");
      }
    } catch (error) {
      res.statusCode = 401;
      res.send("Unauthorized");
    }
  } else {
    res.statusCode = 401;
    res.send("Unauthorized");
  }
});

router.get("/me", verifyUser, (req, res, next) => {
  res.send(req.user);
});

router.get("/logout", verifyUser, async (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  try {
    const user = await usernameExists(req.user.username);
    if (user) {
      if (user.refreshtoken !== refreshToken) {
        res.statusCode = 401;
        res.send("Unauthorized");
      } else {
        await clearRefreshToken(req.user.username);
        res.clearCookie("refreshToken", COOKIE_OPTIONS);
        res.send({ success: true });
      }
    } else {
      res.statusCode = 401;
      res.send("Unauthorized");
    }
  } catch (error) {
    res.statusCode = 500;
    res.send(error);
  }
});

module.exports = router;
