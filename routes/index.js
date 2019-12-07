const api = require("../api"),
      authRoutes = require("../routes/auth"),
      config = require("../config"),
      db = require("../database"),
      express = require("express"),
      { validateKey } = require("../middleware"),
      utils = require("../utils");

let router = express.Router();

router.get("/", (req, res) => res.render("home"));

router.get("/commands", (req, res) => res.render("commands", { prefix: req.query.prefix }));

router.get("/pro", (req, res) => res.render("pro"));

router.get("/user", validateKey, (req, res) => res.render("user/show"));

router.get("/user/billing", validateKey, (req, res) => res.render("user/billing"));

router.get("/support", (req, res) => res.redirect(config.app.discordLink));

module.exports = router;