const express = require("express");
const router = express.Router();

// Create Profile
router.post("/", (req, res) => {
  console.log(req.body);
  res.status(200).send(`Profile created!`);
});

// Read by User ID or re-direct to login page
router.get("/", (req, res) => {
  res.status(200).send({ message: "Welcome to Profile" });
});

module.exports = router;
