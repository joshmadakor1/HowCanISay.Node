const express = require("express");
const router = express.Router();
const Keys = require("../Internal/keys");
const Locations = require("../Internal/locations");
const queryEs = require("../modules/queryEs");
router.use(express.json());

router.get("/term/:searchTerm", (req, res) => {
  console.log(req.params.searchTerm);
  if (req.params)
    queryEs(req.params.searchTerm, results => {
      if (results) res.status(200).send(results);
      else res.status(200).send({ message: "Elasticsearch is down :D" });
    });
});

// Create by Term
// Post validate user input and post new definition to MongoDB
router.post("/term/:term", (req, res) => {
  console.log(Locations);
  res.status(200).send({ message: `Created definition: ${req.params.term}` });
});

// Read by Term
// Query MongoDB for req.params.term, return array of matching objects
router.get("/term/:term", (req, res) => {
  const definitions = [
    {
      id: 1,
      dateCreated: "6/25/2019",
      author: "Joshsmad",
      sourceLanguage: "English",
      destinationLanguage: "Japanese",
      sourceTerm: req.params.term,
      destinationTermNative: "ちんこ",
      destinationTermRoman: "chinko",
      thumbsUp: 55,
      thumbsDown: 22,
      audio: "🔊",
      tags: ["Lol", "Funny", "Memes"]
    },
    {
      id: 2,
      dateCreated: "5/15/2018",
      author: "Joshsmad",
      sourceLanguage: "English",
      destinationLanguage: "Japanese",
      sourceTerm: req.params,
      destinationTermNative: "けつ",
      destinationTermRoman: "ketsu",
      thumbsUp: 100,
      thumbsDown: 4,
      audio: "🔊",
      tags: ["Daily", "Travel", "General"]
    }
  ];
  res.status(200).send(definitions);
});

// Read by ID
// Query MongoDB for req.params.id, return array of matching objects
router.get("/id/:id", (req, res) => {
  const definition = [
    {
      id: req.params.id,
      dateCreated: "6/25/2019",
      author: "Joshsmad",
      sourceLanguage: "English",
      destinationLanguage: "Japanese",
      sourceTerm: "penis",
      destinationTermNative: "ちんこ",
      destinationTermRoman: "chinko",
      thumbsUp: 55,
      thumbsDown: 22,
      audio: "🔊",
      tags: ["Lol", "Funny", "Memes"]
    }
  ];
  res.status(200).send(definition);
});

// Update by ID
// Update record in MongoDB for req.params.id
router.put("/id/:id", (req, res) => {
  res.status(200).send(`Updated definition: ${req.params.id}`);
});

// Delete by ID
// Validate user input and delete record in MongoDB for req.params.id
router.delete("/id/:id", (req, res) => {
  res.status(200).send(`Deleted definition: ${req.params.id}`);
});

module.exports = router;
