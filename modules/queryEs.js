const request = require("request");
const Locations = require("../Internal/locations");
const esIP = Locations.ElasticSearch.serverIp;
const esPort = Locations.ElasticSearch.serverPort;

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
