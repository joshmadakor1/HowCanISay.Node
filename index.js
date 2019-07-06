const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Joi = require("Joi");
const home = require("./routes/home");
const definition = require("./routes/definition");
const requests = require("./routes/requests");
const profile = require("./routes/profile");

//app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use("/", home);
app.use("/api/definition", definition);
app.use("/api/requests", requests);
app.use("/api/profile", profile);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
