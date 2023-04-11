const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

require("./utils/connectdb");
require("./strategies/JwtStrategy");
require("./strategies/LocalStrategy");
require("./strategies/GoogleStrategy");
require("./strategies/MicrosoftStrategy");
require("./authenticate.js");

const app = express();
const routes = require("./routes");

const corsConfig = {
  credentials: true,
  origin: true,
};

app.use(cors(corsConfig));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(passport.initialize());

app.use("/", routes);

const server = app.listen(process.env.PORT || 8081, function () {
  const port = server.address().port;

  console.log("App started at port:", port);
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LHS Assistent API",
      version: "1.0.0",
    },
  },

  apis: [
    "./routes/auth/*.js",
    "./routes/admin/*.js",
    "./routes/dashboard/*.js",
    "./routes/data/*.js",
    "./routes/forms/*.js",
  ],
};

var swaggerOptions = {
  swaggerOptions: {
    docExpansion: "list",
  },
};

const openapiSpecification = swaggerJsdoc(options);

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(openapiSpecification, swaggerOptions)
);
