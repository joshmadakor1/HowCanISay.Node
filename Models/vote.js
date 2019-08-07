const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * userID: userID,
      definitionID: definitionID,
      direction: -1 */
// Create schema
const voteSchema = new Schema({
  userID: {
    type: String,
    lowercase: true,
    required: true
  },
  definitionID: {
    type: String,
    lowercase: true,
    required: true
  },
  direction: {
    type: Number,
    lowercase: true,
    required: true,
    min: -1,
    max: 1
  }
});

// Create model
const Vote = mongoose.model("vote", voteSchema);

// Export model
module.exports = Vote;
