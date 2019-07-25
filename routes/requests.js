const express = require("express");
const router = express.Router();
const queryEs = require("../modules/queryEs");

router.post("/create", (req, res) => {
  const request = req.body;
  queryEs.createRequest(request, results => {
    const result = JSON.parse(results).result;
    if (result === "created") res.status(200).send({ message: "success" });
    else res.status(500).send(results);
  });
});

router.get("/search", (req, res) => {
  const MAX_HITS = 100;
  queryEs.searchRequest(MAX_HITS, results => {
    if (results) res.status(200).send(results.hits);
    else if (res)
      res
        .status(500)
        .setHeader("Content-Type", "application/json")
        .send({ message: "error" });
    else {
    }
  });
});

//*************old:*********** */
router.get("/mongorequest", (req, res) => {
  const maxNumberOfRecordsToReturn = 100;
  interractWithMongoDb
    .getRequests(maxNumberOfRecordsToReturn)
    .then(data => {
      res.status(200).send(data);
    })
    .catch(error => {
      res.status(500).send({ message: "There was an error.", error: error });
    });
});

router.get("/mongorequest/:id", (req, res) => {
  interractWithMongoDb
    .getSingleRequest(req.params.id)
    .then(data => {
      res.status(200).send(data);
    })
    .catch(error => {
      res.status(500).send({ message: "There was an error.", error: error });
    });
});

router.delete("/removemongorequest", (req, res) => {
  interractWithMongoDb
    .deleteSingleRequest(req.body)
    .then(data => {
      res.status(200).send({ message: "success" });
    })
    .catch(error => {
      res.status(500).send({ message: error.message });
    });
});

module.exports = router;
