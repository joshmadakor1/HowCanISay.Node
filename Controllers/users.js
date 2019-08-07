const JWT = require("jsonwebtoken");
const User = require("../Models/user");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const { JWT_SECRET } = require("../Keys/keys");

signToken = user => {
  const displayName = user.displayName;

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
  getDisplayname: async (req, res, next) => {
    try {
      //const { email, password, displayName } = req.value.body;
      if (req.body.userID === undefined)
        return res.status(404).json({ message: "Must provide userID" });
      const user = await User.findOne({ _id: req.body.userID });

      return res.status(200).json({ displayName: user.displayName });
    } catch (error) {
      return res.status(404).json({ displayName: error });
    }
  },
  signUp: async (req, res, next) => {
    const { email, password, displayName } = req.value.body;
    console.log(req.value.body);
    // Check if there is a user with the same email
    const foundUser = await User.findOne({ "local.email": email });
    if (foundUser)
      return res.status(409).json({ message: "Error: e-mail already exists." });

    const newUser = new User({
      displayName: displayName,
      method: "local",
      local: {
        email: email,
        password: password
      }
    });
    await newUser.save();

    // Respond with token
    const token = signToken(newUser);
    res.status(200).json({ token });
  },

  signIn: async (req, res, next) => {
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  secret: async (req, res, next) => {
    console.log("I got here!");
    console.log(req.user);

    res.status(200).json({ secret: "SecretMessage" });
  },

  updatedisplayname: async (req, res, next) => {
    try {
      const newDisplayName = req.body.displayName;
      console.log(newDisplayName);

      // Search if a user already exists with the desired displayName
      const displayNameExists = await User.findOne({
        displayName: newDisplayName
      });
      console.log("EXISTS?????????????", displayNameExists);

      // If user already exists with the desired displayname, return 201 and notify client
      if (displayNameExists)
        return res
          .status(201)
          .json({ message: "A user with that display name already exists." });

      // If user does not exist with that display name, assign the new name, save and return 200
      let user = await User.findOne({ _id: req.user._id });

      user.displayName = newDisplayName;
      console.log("ATTEMPTING TO SAVE!!!!", user);
      await user.save();
      console.log(user);
      return res.status(200).json({ message: "good work men" });

      //return res.status(200).json({ message: "Display name updated successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "There was some kind of server error: " + error.message
      });
    }
  },

  oauthGoogle: async (req, res, next) => {
    // Generate token
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  oauthFacebook: async (req, res, next) => {
    // Generate token
    //const token = signToken(req.user);
    const token = signToken(req.user);
    res.status(200).json({ token });
  }
};
