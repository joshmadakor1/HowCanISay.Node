const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

// Create schema
const userSchema = new Schema({
  method: {
    type: String,
    enum: ["local", "google", "facebook"],
    required: true
  },
  local: {
    email: { type: String, lowercase: true },
    password: { type: String },
    displayName: { type: String }
  },
  google: {
    id: { type: String },
    email: {
      type: String,
      lowercase: true
    },
    displayName: { type: String }
  },
  facebook: {
    id: { type: String },
    email: {
      type: String,
      lowercase: true
    },
    displayName: { type: String }
  }
});

userSchema.pre("save", async function(next) {
  try {
    if (this.method !== "local") next();
    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Generate hash
    const hash = await bcrypt.hash(this.local.password, salt);

    // Assign hash to password value
    this.local.password = hash;
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function(newPassword) {
  try {
    console.log(`${await bcrypt.compare(newPassword, this.local.password)}`);
    return await bcrypt.compare(newPassword, this.local.password);
  } catch (error) {
    throw new Error(error);
  }
};

// Create model
const User = mongoose.model("user", userSchema);

// Export model
module.exports = User;
