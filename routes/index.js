const routes = require("express").Router();
const auth = require("./auth");
const forms = require("./forms");
const user = require("./user");
const admin = require("./admin");
const data = require("./data");
const dashboard = require("./dashboard");
const superMario = require("./superMario");

routes.get("/", (req, res) => {
  res.status(200).json({ message: "Connected!" });
});

routes.use("/auth", auth);
routes.use("/forms", forms);
routes.use("/user", user);
routes.use("/admin", admin);
routes.use("/data", data);
routes.use("/dashboard", dashboard);
routes.use("/supermario", superMario);

module.exports = routes;
