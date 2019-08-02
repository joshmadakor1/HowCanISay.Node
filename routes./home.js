const express = require("express");
const router = express.Router();
const errorHandlingMiddleware = require("../Middleware/errorHandlingMiddleware");
const queryEsRandom = require("../modules/queryEsRandom");

router.get(
  "/",
  errorHandlingMiddleware(async (req, res) => {
    await queryEsRandom(results => {
      if (results) res.status(200).send({ message: results.hits[0]._source });
      else {
        res.status(500).send({ message: "Unable to reach search engine." });
      }
    });
  })
);

module.exports = router;
