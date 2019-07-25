const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const home = require("./routes/home");
const definitions = require("./routes/definitions");
const requests = require("./routes/requests");
const profile = require("./routes/profile");
const upload = require("./routes/upload");

const result = require("dotenv").config();

//console.log(process.env);
//app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});
app.use("/", home);
app.use("/definitions", definitions);
app.use("/requests", requests);
app.use("/profile", profile);
app.use("/upload", upload);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
