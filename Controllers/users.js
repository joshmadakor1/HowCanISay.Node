const JWT = require("jsonwebtoken");
const User = require("../Models/user");
const { JWT_SECRET } = require("../Keys/keys");

signToken = user => {
  return JWT.sign(
    {
      iss: "HowCaniSay.com",
      sub: user._id,
      iat: new Date().getTime(), // Now
      exp: new Date().setDate(new Date().getDate() + 1) // Now + 1 day
    },
    JWT_SECRET
  );
};

module.exports = {
  signUp: async (req, res, next) => {
    const { email, password } = req.value.body;

    // Check if there is a user with the same email
    const foundUser = await User.findOne({ "local.email": email });
    if (foundUser)
      return res.status(409).json({ message: "Error: e-mail already exists." });

    // Create new user
    const newUser = new User({
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
    res.status(200).json({ 0: 0 });
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