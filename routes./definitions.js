const winston = require("winston");
const express = require("express");
const router = express.Router();
const queryEs = require("../modules/queryEs");
const errorHandlingMiddleware = require("../Middleware/errorHandlingMiddleware");
router.use(express.json());

router.get(
  "/search/:searchTerm",
  errorHandlingMiddleware(async (req, res) => {
    if (req.params) {
      await queryEs.searchDefinition(req.params.searchTerm, results => {
        if (results) res.status(200).send(results.hits);
        else {
          winston.error("Unable to reach search engine.");
          console.log({ message: "Unable to reach search engine." });
          res.status(501).send({ message: "Unable to reach search engine." });
        }
      });
    }
  })
);

// Create by Term
// Post validate user input and post new definition to elasticsearch
router.post(
  "/create",
  errorHandlingMiddleware(async (req, res) => {
    const definition = req.body;
    await queryEs.createDefinition(definition, results => {
      const result = JSON.parse(results).result;
      if (result === "created") res.status(200).send({ message: "success" });
      else {
        winston.error("Unable to reach search engine.");
        console.log({ message: "Unable to create definition." });
        res.status(501).send({ message: "Unable to create definition." });
      }
    });
  })
);

module.exports = router;
