const express = require("express");
const router = express.Router();
router.use(express.json());

router.get("/", (req, res) => {
  res.status(200).send({ message: "Welcome to Definition" });
});

// Create by Term
router.post("/term/:term", (req, res) => {
  res.status(200).send({ message: `Created definition: ${req.params.term}` });
});

// Read by Term
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
  console.log();
  res.status(200).send(definitions);
});

// Read by ID
router.get("/id/:id", (req, res) => {
  //Get a single definition based on ID
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
router.put("/id/:id", (req, res) => {
  res.status(200).send(`Updated definition: ${req.params.id}`);
});

// Delete by ID
router.delete("/id/:id", (req, res) => {
  res.status(200).send(`Deleted definition: ${req.params.id}`);
});
module.exports = router;
