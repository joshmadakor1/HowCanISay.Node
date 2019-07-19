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
  date: { type: Date, default: Date.now }
});
const esIP = process.env.ELASTICSEARCH_IP;
const esPort = process.env.ELASTICSEARCH_PORT;
const mongoIP = process.env.MONGO_IP;
const mongoPort = process.env.MONGO_PORT;

definitionSchema.plugin(mongoosastic, {
  host: esIP,
  port: esPort
});

const Definition = mongoose.model("Definition", definitionSchema);

Definition.createMapping((err, mapping) => {
  if (err) console.log("Error: Create mapping failed...", err);
  else console.log("Success: Mapping created");
});

mongoose
  .connect(`mongodb://${mongoIP}/Definitions`)
  .then(() => console.log("Success: Connected to MongoDB"))
  .catch(err => console.error("Error: Could not connect to MongoDB...", err));

/** Records the definition to MongoDB*/
async function postDefinition(def) {
  const definition = new Definition(def);

  const result = await definition
    .save()
    .then(() => {
      console.log("Success");
      //mongoose.disconnect();
    })
    .catch(err => {
      console.log("Error", err);
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

module.exports = { postDefinition, getDefinition };
