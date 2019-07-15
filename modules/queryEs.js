require("dotenv").config();
const request = require("request");
const esIP = process.env.ELASTICSEARCH_IP;
const esPort = process.env.ELASTICSEARCH_PORT;

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

module.exports = queryEs;
