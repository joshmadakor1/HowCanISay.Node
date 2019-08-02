const winston = require("winston");
module.exports = function(err, req, res, next) {
  //Log
  console.log(err.message, err);
  winston.error(new Date() + `: ${err.message}`, err);
  res.status(501).send({ message: err.message });
};
