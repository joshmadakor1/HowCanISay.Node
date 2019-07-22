const express = require("express");
const router = express.Router();
const interractWithMongoDb = require("../modules/queryMdbDefinitions");

router.post("/mongorequest", (req, res) => {
  interractWithMongoDb
    .postRequest(req.body)
    .then(() => {
      res.status(200).send({ message: "success" });
    })
    .catch(err => {
      res.status(500).send({ message: "error", error: err });
    });

  /*
  console.log(req.body);
  res.status(200).send({ message: "Welcome to Request" });
  */
});

router.get("/mongorequest", (req, res) => {
  const maxNumberOfRecordsToReturn = 100;
  interractWithMongoDb
    .getRequests(maxNumberOfRecordsToReturn)
    .then(data => {
      res.status(200).send(data);
    })
    .catch(error => {
      res.status(500).send({ message: "There was an error.", error: error });
    });
});

router.get("/mongorequest/:id", (req, res) => {
  interractWithMongoDb
    .getSingleRequest(req.params.id)
    .then(data => {
      res.status(200).send(data);
    })
    .catch(error => {
      res.status(500).send({ message: "There was an error.", error: error });
    });
});

router.delete("/removemongorequest", (req, res) => {
  interractWithMongoDb
    .deleteSingleRequest(req.body)
    .then(data => {
      console.log(data);
      res.status(200).send({ message: "success" });
    })
    .catch(error => {
      console.log(error.message);
      res.status(500).send({ message: error.message });
    });

  console.log(req.body);
});

module.exports = router;
