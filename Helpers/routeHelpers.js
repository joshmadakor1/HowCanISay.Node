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
  schemas: {
    authSchema: Joi.object().keys({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required()
        .min(8)
        .max(128),
      displayName: Joi.string()
        .required()
        .min(8)
        .max(32)
    })
  }
};
