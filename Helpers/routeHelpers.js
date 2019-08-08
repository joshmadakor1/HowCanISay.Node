const Joi = require("joi");

module.exports = {
  validateBody: schema => {
    return (req, res, next) => {
      // Create temporary displayName
      const temporaryDisplayName =
        "user" + Math.floor(Math.random() * Math.floor(10000000000000000));

      // Create new user
      let user = req.body;
      user["displayName"] = temporaryDisplayName;

      // Validate user properties
      const result = Joi.validate(user, schema);
      if (result.error) return res.status(203).json(result.error);
      if (!req.value) req.value = {};
      req.value["body"] = result.value;
      next();
    };
  },
  validateVote: schema => {
    return (req, res, next) => {
      // Get vote
      let vote = req.body;

      // Validate user properties
      const result = Joi.validate(vote, schema);
      if (result.error) return res.status(203).json(result.error);
      if (!req.value) req.value = {};
      req.value["body"] = result.value;
      next();
    };
  },
  validateDisplayName: schema => {
    return (req, res, next) => {
      const displayName = req.body;
      const result = Joi.validate(displayName, schema);
      console.log(result);
      if (result.error) return res.status(203).json(result.error);
      //if (!req.value) req.value = {};
      //req.value["body"] = result.value;
      next();
    };
  },
  schemas: {
    authSchema: Joi.object().keys({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required()
        .min(1)
        .max(128),
      displayName: Joi.string()
        .required()
        .min(1)
        .max(32)
    }),
    voteSchema: Joi.object().keys({
      userID: Joi.string().required(),
      definitionID: Joi.string().required(),
      direction: Joi.number()
        .required()
        .min(-1)
        .max(1)
    }),
    displayNameSchema: Joi.object().keys({
      displayName: Joi.string()
        .required()
        .min(1)
        .max(20)
        .regex(/(^[\w\d-]{1,32}$)/)
    })
  }
};
