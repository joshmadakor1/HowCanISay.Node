require("dotenv").config();
const request = require("request");
const esIP = process.env.ELASTICSEARCH_IP || "192.168.1.20";
const esPort = process.env.ELASTICSEARCH_PORT || "9200";
const esUser = process.env.ELASTICSEARCH_USER || "";
const esPass = process.env.ELASTICSEARCH_PASSWORD || "";
const definitions = process.env.ELASTICSEARCH_DEFINITIONS || "definitions_dev";
const requests = process.env.ELASTICSEARCH_REQUESTS || "requests_dev";

async function queryEsRandom(callback) {
  await request(
    {
      url: `https://${esUser}:${esPass}@${esIP}:${esPort}/${definitions}/_search`,
      method: "GET",
      json: {
        size: 1,
        query: {
          function_score: {
            functions: [
              {
                random_score: {
                  seed: Math.floor(Math.random() * 10000000000)
                }
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
module.exports = queryEsRandom;
