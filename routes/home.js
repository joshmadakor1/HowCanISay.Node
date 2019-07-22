const express = require("express");
const router = express.Router();
const queryEsRandom = require("../modules/queryEsRandom");

router.get("/", (req, res) => {
  //Handle error here
  queryEsRandom(results => {
    if (results) console.log(results.hits[0]._source.sourceTerm);
    else console.log("Empty");
    res.status(200).send({ message: results.hits[0]._source.sourceTerm });
  });
});

module.exports = router;
