const express = require("express");
const router = express.Router();
const errorHandlingMiddleware = require("../Middleware/errorHandlingMiddleware");
// Create Profile
router.post(
  "/",
  errorHandlingMiddleware(async (req, res) => {
    res.status(200).send(`Profile created!`);
  })
);

// Read by User ID or re-direct to login page
router.get(
  "/",
  errorHandlingMiddleware(async (req, res) => {
    res.status(200).send({ message: "Welcome to Profile" });
  })
);

module.exports = router;
