require("dotenv").config();
const request = require("request");
const esIP = process.env.ELASTICSEARCH_IP || "167.99.172.34";
const esPort = process.env.ELASTICSEARCH_PORT || "9200";

async function queryEs(searchTerm, callback) {
  const non_English_Regex = /([^\x00 -\x7F]+)/g;
  const searchTermContainsSpaces =
    searchTerm.includes(" ") || searchTerm.includes("　");

  //This is to determine if it is a non-ascii character (japanese, for example)
  //If the search term has hiragana, need to do a match search, not fuzzy

  //If the search term contains spaces, do a fuzzy/match query
  if (
    searchTermContainsSpaces ||
    searchTerm.match(non_English_Regex) !== null
  ) {
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

  //If the search term does not contain spaces, do a wildcard search
  else {
    await request(
      {
        url: `http://${esIP}:${esPort}/definitions/_search`,
        method: "GET",
        json: { query: { wildcard: { sourceTerm: `*${searchTerm}*` } } }
      },
      (req, res) => {
        if (res) callback(res.body.hits);
        else callback(null); // If Elasticsearch is down or there is some other problem
      }
    );
  }
}
module.exports = queryEs;
