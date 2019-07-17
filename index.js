const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Joi = require("Joi");
const home = require("./routes/home");
const definitions = require("./routes/definitions");
const requests = require("./routes/requests");
const profile = require("./routes/profile");
const upload = require("./routes/upload");
const https = require("https");
const fs = require("fs");
const result = require("dotenv").config();
if (result.error) console.log(result.error);
else console.log(result.parsed);

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
app.use("/api/definitions", definitions);
app.use("/api/requests", requests);
app.use("/api/profile", profile);
app.use("/api/upload", upload);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  //console.log(`Now listening on port ${port}`);
  //console.log(process.env);
});

/*
https
  .createServer(
    {
      key: fs.readFileSync("server.key"),
      cert: fs.readFileSync("server.cert")
    },
    app
  )
  .listen(port, () => {
    console.log(`Listening on port ${port}.`);
  });
*/
