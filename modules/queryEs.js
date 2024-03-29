require("dotenv").config();
const request = require("request");
const esIP = process.env.ELASTICSEARCH_IP || "192.168.1.20";
const esPort = process.env.ELASTICSEARCH_PORT || "9200";
const esUser = process.env.ELASTICSEARCH_USER || "";
const esPass = process.env.ELASTICSEARCH_PASSWORD || "";
const definitions = process.env.ELASTICSEARCH_DEFINITIONS || "definitions_dev";
const requests = process.env.ELASTICSEARCH_REQUESTS || "requests_dev";

async function searchDefinition(searchTerm, callback) {
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
        url: `https://${esUser}:${esPass}@${esIP}:${esPort}/${definitions}/_search`,
        method: "GET",
        json: { query: { match: { sourceTerm: searchTerm } } }
      },
      (req, res) => {
        if (res) callback(res.body.hits);
        else callback(null); // If Elasticsearch is down or there is some other problem
      }
    );
  } //If the search term does not contain spaces, do a wildcard search
  else {
    await request(
      {
        url: `https://${esUser}:${esPass}@${esIP}:${esPort}/definitions/_search`,
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

async function searchDefinitionPost(searchTerm, languages, callback) {
  console.log(languages);
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
        url: `https://${esUser}:${esPass}@${esIP}:${esPort}/${definitions}/_search`,
        method: "GET",
        json: {
          query: {
            bool: {
              must: [
                { match: { sourceTerm: searchTerm } },
                { match: { sourceLanguage: languages.sourceLanguage } },
                {
                  match: { destinationLanguage: languages.destinationLanguage }
                }
              ]
            }
          }
        }
      },
      (req, res) => {
        if (res) callback(res.body.hits);
        else callback(null); // If Elasticsearch is down or there is some other problem
      }
    );
  } //If the search term does not contain spaces, do a wildcard search
  else {
    await request(
      {
        url: `https://${esUser}:${esPass}@${esIP}:${esPort}/${definitions}/_search`,
        method: "GET",
        json: {
          query: {
            bool: {
              must: [
                { wildcard: { sourceTerm: `*${searchTerm}*` } },
                { match: { sourceLanguage: languages.sourceLanguage } },
                {
                  match: { destinationLanguage: languages.destinationLanguage }
                }
              ]
            }
          }
        }
      },
      (req, res) => {
        if (res) callback(res.body.hits);
        else callback(null); // If Elasticsearch is down or there is some other problem
      }
    );
  }
}
async function createDefinition(definition, callback) {
  await request(
    {
      url: `https://${esUser}:${esPass}@${esIP}:${esPort}/${definitions}/_doc/`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(definition)
    },
    (req, res) => {
      if (res) callback(res.body);
      else callback(null);
    }
  );
}

async function searchRequest(maxHits, callback) {
  await request(
    {
      url: `https://${esUser}:${esPass}@${esIP}:${esPort}/${requests}/_search`,
      headers: { "Content-Type": "application/json" },
      method: "GET"
    },
    (req, res) => {
      //console.log(JSON.parse(res.body).hits.hits[0]);
      if (res) callback(JSON.parse(res.body).hits);
      else callback(null); // If Elasticsearch is down or there is some other problem
    }
  );
}

async function createRequest(req, callback) {
  await request(
    {
      url: `https://${esUser}:${esPass}@${esIP}:${esPort}/${requests}/_doc/`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req)
    },
    (req, res) => {
      if (res) callback(res.body);
      else callback(null);
    }
  );
}

async function deleteRequest(requestId, callback) {
  await request(
    {
      url: `https://${esUser}:${esPass}@${esIP}:${esPort}/${requests}/_doc/${requestId}`,
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    },
    (req, res) => {
      if (res) callback(res.body);
      else callback(null);
    }
  );
}

async function getAllDefinitions(callback) {
  await request(
    {
      url: `https://${esUser}:${esPass}@${esIP}:${esPort}/${definitions}/_search?size=10000`,
      method: "GET",
      json: {
        query: { match_all: {} }
      }
    },
    (req, res) => {
      console.log(res.body.hits);
      if (res) return callback(res.body.hits);
      else return callback(null); // If Elasticsearch is down or there is some other problem
    }
  );
}

module.exports = {
  searchDefinition,
  searchDefinitionPost,
  createDefinition,
  searchRequest,
  createRequest,
  deleteRequest,
  getAllDefinitions
};
