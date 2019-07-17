const express = require("express");
const router = express.Router();
const queryEs = require("../modules/queryEs");

router.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200);
  res.end(JSON.stringify({ message: "Welcome to HowCanISay!" }));
});

/*
async function queryEs(searchTerm, callback) {
  await request(
    {
      url: `http://${esIP}:${esPort}/definitions/_search`,
      method: "GET",
      json: { query: { match: { sourceTerm: searchTerm } } }
    },
    (req, res) => {
      if (res) callback(res.body.hits);
      else callback(null); // If Elasticsearch is down or there is some other problem
    }
  );
}
*/

function elasticsearchClusterIsUp() {
  client.ping({ requestTimeout: 1000 }, error => {
    if (error) {
      console.trace("ES cluster is down.");
      return true;
    } else {
      console.log("Ping success.");
      return false;
    }
  });
}

module.exports = router;
