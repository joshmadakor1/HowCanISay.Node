const JWT = require("jsonwebtoken");
const User = require("../Models/user");
const Vote = require("../Models/vote");
const { JWT_SECRET } = require("../Keys/keys");
const queryEs = require("../modules/queryEs");

signToken = user => {
  const displayName = user.displayName;
  //console.log("*************");
  //console.log(user);
  //console.log(displayName);
  return JWT.sign(
    {
      iss: "HowCaniSay.com",
      sub: user._id,
      name: displayName,
      iat: new Date().getTime(), // Now
      exp: new Date().setDate(new Date().getDate() + 1) // Now + 1 day
    },
    JWT_SECRET
  );
};

module.exports = {
  submitVote: async (req, res, next) => {
    try {
      //const vote = req.value.body;
      const { userID, definitionID, direction } = req.value.body;

      // Check if there are any votes this particular user has subbmited for the given definition
      const votes = await Vote.find({ userID, definitionID });

      // If there are no votes, submit a vote entry, return response to client
      if (votes.length === 0) {
        console.log("No votes exist. Adding vote.");

        const newVote = new Vote({ userID, definitionID, direction });
        await newVote.save();
        return res.status(200).json({ message: "vote added" });
      }

      // If there is an existing vote, do some action based on existing vote
      const userVote = await Vote.findOne({ userID, definitionID });

      if (userVote.direction === req.value.body.direction) {
        // User voted the same thing, delete the record
        console.log("User voted the same thing, delete the record");
        await userVote.remove();
        return res.status(200).json({ message: "vote deleted" });
      } else {
        // User voted the opposite direction,
        console.log("User voted the opposite direction");
        userVote.direction = req.value.body.direction;
        await userVote.save();
        return res.status(200).json({ message: "vote changed" });
      }
    } catch (error) {
      return res.status(500).json({ error });
    }
  },

  getAllDefinitions: async (req, res, next) => {
    await queryEs.getAllDefinitions(results => {
      if (results) return res.status(200).json(results);
      return res
        .status(500)
        .json({ message: "No results return, check connection" });
    });
  },

  createDefinition: async (req, res) => {
    const definition = req.body;
    await queryEs.createDefinition(definition, results => {
      const result = JSON.parse(results).result;
      if (result === "created") res.status(200).send({ message: "success" });
      else {
        winston.error("Unable to reach search engine.");
        console.log({ message: "Unable to create definition." });
        res.status(501).send({ message: "Unable to create definition." });
      }
    });
  },
  createRequest: async (req, res) => {
    const request = req.body;
    console.log(request);
    await queryEs.createRequest(request, results => {
      const result = JSON.parse(results).result;
      if (result === "created") res.status(200).send({ message: "success" });
      else res.status(500).send({ message: "Unable to reach search engine." });
    });
  },
  getRequests: async (req, res) => {
    const MAX_HITS = 100;
    await queryEs.searchRequest(MAX_HITS, results => {
      if (results) res.status(200).send(results.hits);
      else if (res)
        res.status(500).send({ message: "Unable to reach search engine." });
      else {
      }
    });
  },
  deleteRequest: async (req, res) => {
    const definitionId = req.body._id;
    await queryEs.deleteRequest(definitionId, result => {
      //Todo: Handle other scenarios?
      if (result.result === "not_found" || "deleted")
        res.status(200).send({ message: "success" });
      else res.status(500).send({ message: "Unable to reach search engine." });
    });
  },
  countVotes: async (req, res) => {
    try {
      const userVotes = await Vote.find({
        definitionID: req.body.definitionID
      });

      // Calculate score
      let score = 0;
      let upvotes = 0;
      let downvotes = 0;

      userVotes.forEach(v => {
        // Calculate total number of upvotes/downvotes
        v.direction === 1 ? ++upvotes : ++downvotes;
      });

      // Calculate score
      score = upvotes - downvotes;

      res.status(200).json({ upvotes, downvotes, score });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
  getvotestatusforuser: async (req, res) => {
    try {
      // Check if there are any votes this particular user has subbmited for the given definition
      const userVote = await Vote.findOne({
        userID: req.body.userID,
        definitionID: req.body.definitionID
      });
      // If there are no votes, submit a vote entry, return response to client
      if (userVote === null) return res.status(200).json({ direction: 0 });
      else return res.status(200).json({ direction: userVote.direction });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
};
