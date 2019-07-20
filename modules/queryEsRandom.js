require("dotenv").config();
const request = require("request");
const esIP = process.env.ELASTICSEARCH_IP;
const esPort = process.env.ELASTICSEARCH_PORT;

async function queryEsRandom(callback) {
  await request(
    {
      url: `http://${esIP}:${esPort}/definitions/_search`,
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
