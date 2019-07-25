const mongoose = require("mongoose");
const mongoosastic = require("mongoosastic");
const definitionSchema = new mongoose.Schema({
  author: { type: String, default: "Josh" },
  sourceLanguage: String,
  destinationLanguage: String,
  sourceTerm: String,
  destinationTermNative: String,
  destinationTermRoman: String,
  sourceSentence: String,
  destinationSentence: String,
  thumbsUp: { type: Number, default: 0 },
  thumbsDown: { type: Number, default: 0 },
  audioUrl: String,
  tags: [String],
  notes: String,
  date: { type: Date, default: Date.now }
});

const requestSchema = new mongoose.Schema({
  author: { type: String, default: "Josh" },
  sourceLanguage: String,
  destinationLanguage: String,
  sourceTerm: String,
  notes: String,
  date: { type: Date, default: Date.now }
});

const esIP = process.env.ELASTICSEARCH_IP || "192.168.1.20";
const esPort = process.env.ELASTICSEARCH_PORT || "9200";
const esUser = process.env.ELASTICSEARCH_USER;
const esPass = process.env.ELASTICSEARCH_PASSWORD;

/** Records the definition to MongoDB*/
async function postDefinition(def) {
  const definition = new Definition(def);

  const result = await definition
    .save()
    .then(() => {
      //console.log("Success");
      //mongoose.disconnect();
    })
    .catch(err => {
      //console.log("Error", err);
    });
  return { result };
}

async function getDefinition(sourceTerm) {
  const result = await Definition.find({
    sourceTerm: sourceTerm
  })
    .limit(10)
    .sort({ name: 1 });
  return { result };
}

async function getRequests(limit) {
  const result = await Requests.find({})
    .limit(limit)
    .sort({ name: 1 });
  return { result };
}

async function getSingleRequest(requestId) {
  const result = await Requests.find({ _id: requestId }).sort({ name: 1 });
  return { result };
}

async function deleteSingleRequest(requestToDelete) {
  const result = await Requests.remove(requestToDelete, (err, data) => {
    if (err) console.log(err.message);
    else console.log(data);
  });
  return { result };
}

async function postRequest(definitionRequest) {
  const request = new Requests(definitionRequest);

  const result = await request
    .save()
    .then(() => {
      console.log("Request Successfully Logged");
    })
    .catch(error => {
      console.log("There was a fuckin error");
    });
  return { result };
}

module.exports = {
  postDefinition,
  getDefinition,
  postRequest,
  getRequests,
  getSingleRequest,
  deleteSingleRequest
};
