const winston = require("winston");
const express = require("express");
const router = express.Router();
const queryEs = require("../modules/queryEs");
const errorHandlingMiddleware = require("../Middleware/errorHandlingMiddleware");
router.use(express.json());
const {
  validateDefinition,
  validateVote,
  schemas
} = require("../Helpers/routeHelpers");
const Controller_Definitions = require("../Controllers/definitions");
const passport = require("passport");
require("../passport");

router.get(
  "/search/:searchTerm",
  errorHandlingMiddleware(async (req, res) => {
    if (req.params) {
      await queryEs.searchDefinition(
        req.params.searchTerm.toLowerCase(),
        results => {
          if (results) res.status(200).send(results.hits);
          else {
            winston.error("Unable to reach search engine.");
            console.log({ message: "Unable to reach search engine." });
            res.status(501).send({ message: "Unable to reach search engine." });
          }
        }
      );
    }
  })
);

router.post(
  "/search/:searchTerm",
  errorHandlingMiddleware(async (req, res) => {
    const languages = req.body;
    if (req.params) {
      await queryEs.searchDefinitionPost(
        req.params.searchTerm.toLowerCase(),
        languages,
        results => {
          if (results) res.status(200).send(results.hits);
          else {
            winston.error("Unable to reach search engine.");
            console.log({ message: "Unable to reach search engine." });
            res.status(501).send({ message: "Unable to reach search engine." });
          }
        }
      );
    }
  })
);

// Create by Term
// Post validate user input and post new definition to elasticsearch
router
  .route("/create")
  .post(
    validateDefinition(schemas.definitionSchema),
    errorHandlingMiddleware(Controller_Definitions.createDefinition)
  );

router
  .route("/submitvote")
  .post(
    passport.authenticate("jwt", { session: false }),
    validateVote(schemas.voteSchema),
    errorHandlingMiddleware(Controller_Definitions.submitVote)
  );

router
  .route("/countVotes")
  .post(errorHandlingMiddleware(Controller_Definitions.countVotes));

router
  .route("/getvotestatusforuser")
  .post(errorHandlingMiddleware(Controller_Definitions.getvotestatusforuser));

router
  .route("/getall")
  .get(errorHandlingMiddleware(Controller_Definitions.getAllDefinitions));

module.exports = router;
