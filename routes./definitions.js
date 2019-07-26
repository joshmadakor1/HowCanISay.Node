const express = require("express");
const router = express.Router();
const queryEs = require("../modules/queryEs");
router.use(express.json());

router.get("/search/:searchTerm", (req, res) => {
  if (req.params) {
    queryEs.searchDefinition(req.params.searchTerm, results => {
      if (results) res.status(200).send(results.hits);
      else
        res
          .status(500)
          .setHeader("Content-Type", "application/json")
          .send(results);
    });
  }
});

// Create by Term
// Post validate user input and post new definition to elasticsearch
router.post("/create", (req, res) => {
  const definition = req.body;
  queryEs.createDefinition(definition, results => {
    const result = JSON.parse(results).result;
    if (result === "created") res.status(200).send({ message: "success" });
    else res.status(500).send(results);
  });
});

module.exports = router;
