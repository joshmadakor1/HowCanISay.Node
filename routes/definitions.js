const express = require("express");
const router = express.Router();
const queryEs = require("../modules/queryEs");
const interractWithMongoDb = require("../modules/queryMdbDefinitions");

router.use(express.json());

router.get("/term/:searchTerm", (req, res) => {
  if (req.params)
    queryEs(req.params.searchTerm, results => {
      if (results) res.status(200).send(results);
      else
        res
          .status(200)
          .setHeader("Content-Type", "application/json")
          .send({ message: "Elasticsearch is down :D" });
    });
});

// Create by Term
// Post validate user input and post new definition to MongoDB
router.post("/mongoterm", (req, res) => {
  interractWithMongoDb
    .postDefinition(req.body)
    .then(() => {
      res.status(200).send({ message: "success" });
    })
    .catch(err => {
      res.status(500).send({ message: err });
    });
});

// Read by Term
// Query MongoDB for req.params.term, return array of matching objects
router.get("/mongoterm/:term", (req, res) => {
  interractWithMongoDb
    .getDefinition(req.params.term)
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({ message: "There was an error." });
    });
  //getDefinition(req.body.params)
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
