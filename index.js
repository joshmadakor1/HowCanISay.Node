const winston = require("winston");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const home = require("./routes/home");
const definitions = require("./routes/definitions");
const requests = require("./routes/requests");
const profile = require("./routes/profile");
const login = require("./routes/login");
const upload = require("./routes/upload");
const users = require("./routes/users");
const accessControlAllowMethods = require("./Middleware/accessControlAllowMethods");
const error = require("./Middleware/error");
const environment = process.env.ENVIRONMENT || "DEV";
const port = process.env.PORT || 8080;
//const result = require("dotenv").config();

winston.add(
  new winston.transports.File({
    filename: `date.log`,
    level: "error"
  })
);

// Handle all uncaught exceptions
process.on("uncaughtException", ex => {
  winston.error(ex.message, ex, () => {
    process.exit(1);
  });
});

// Handle all uncaught rejections
process.on("unhandledRejection", ex => {
  winston.error(ex.message, ex);
  setTimeout(() => {
    process.exit(1);
  }, 3000);
});

const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_FULL_CONNECTION_STRING);

// Middleware
app.use(morgan("dev"));
app.use(cors());
console.log(environment);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(accessControlAllowMethods);
app.use("/", home);
app.use("/definitions", definitions);
app.use("/requests", requests);
app.use("/profile", profile);
app.use("/login", login);
app.use("/upload", upload);
app.use("/users", users);
app.use(error);

// Start server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
