const express = require("express");
const router = express.Router();
const queryEs = require("../modules/queryEs");

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

router.post("/create", (req, res) => {
  const request = req.body;
  queryEs.createRequest(request, results => {
    const result = JSON.parse(results).result;
    if (result === "created") res.status(200).send({ message: "success" });
    else res.status(500).send(results);
  });
});

router.delete("/delete", (req, res) => {
  const definitionId = req.body._id;
  queryEs.deleteRequest(definitionId, result => {
    //Todo: Handle other scenarios?
    if (result.result === "not_found" || "deleted")
      res.status(200).send({ message: "success" });
    else res.status(200).send({ message: "success" });
  });
});

module.exports = router;
