const express = require("express");
const router = express.Router();
const queryEs = require("../modules/queryEs");
const errorHandlingMiddleware = require("../Middleware/errorHandlingMiddleware");
const Controller_Definitions = require("../Controllers/definitions");
const {
  validateDefinition,
  validateVote,
  validateRequest,
  schemas
} = require("../Helpers/routeHelpers");

router.get(
  "/search",
  errorHandlingMiddleware(Controller_Definitions.getRequests)
);

router.post(
  "/create",
  validateRequest(schemas.requestSchema),
  errorHandlingMiddleware(Controller_Definitions.createRequest)
);

router.delete(
  "/delete",
  errorHandlingMiddleware(Controller_Definitions.deleteRequest)
);

module.exports = router;
