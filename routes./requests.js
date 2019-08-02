const express = require("express");
const router = express.Router();
const queryEs = require("../modules/queryEs");
const errorHandlingMiddleware = require("../Middleware/errorHandlingMiddleware");

router.get(
  "/search",
  errorHandlingMiddleware(async (req, res) => {
    const MAX_HITS = 100;
    await queryEs.searchRequest(MAX_HITS, results => {
      if (results) res.status(200).send(results.hits);
      else if (res)
        res.status(500).send({ message: "Unable to reach search engine." });
      else {
      }
    });
  })
);

router.post(
  "/create",
  errorHandlingMiddleware(async (req, res) => {
    const request = req.body;
    await queryEs.createRequest(request, results => {
      const result = JSON.parse(results).result;
      if (result === "created") res.status(200).send({ message: "success" });
      else res.status(500).send({ message: "Unable to reach search engine." });
    });
  })
);

router.delete(
  "/delete",
  errorHandlingMiddleware(async (req, res) => {
    const definitionId = req.body._id;
    await queryEs.deleteRequest(definitionId, result => {
      //Todo: Handle other scenarios?
      if (result.result === "not_found" || "deleted")
        res.status(200).send({ message: "success" });
      else res.status(500).send({ message: "Unable to reach search engine." });
    });
  })
);

module.exports = router;
