const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

// Create schema
const userSchema = new Schema({
  displayName: { type: String },
  method: {
    type: String,
    enum: ["local", "google", "facebook"],
    required: true
  },
  local: {
    email: { type: String, lowercase: true },
    password: { type: String }
  },
  google: {
    id: { type: String },
    email: {
      type: String,
      lowercase: true
    }
  },
  facebook: {
    id: { type: String },
    email: {
      type: String,
      lowercase: true
    }
  }
});

userSchema.pre("save", async function(next) {
  try {
    // If the account is fb/google, don't execute this
    if (this.local.password === undefined) {
      console.log(
        "************Password already hashed, skipping hash function"
      );
      next();
    }

    // If the password is already hashed, don't execute this
    if (
      this.local.password.substring(0, 1) === "$" &&
      this.local.password.length === 60
    ) {
      console.log(
        "************Password already hashed, skipping hash function"
      );
      next();
    }

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
