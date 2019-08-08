const router = require("express-promise-router")();
const Controller_Users = require("../Controllers/users");
const {
  validateBody,
  validateDisplayName,
  schemas
} = require("../Helpers/routeHelpers");
const passport = require("passport");

require("../passport");

router
  .route("/oauth/facebook")
  .post(
    passport.authenticate("facebookToken", { session: false }),
    Controller_Users.oauthFacebook
  );

router.route("/oauth/google").post(
  (req, res, next) => {
    next();
  },
  passport.authenticate("googleToken", { session: false }),
  Controller_Users.oauthGoogle
);

router
  .route("/signup")
  .post(validateBody(schemas.authSchema), Controller_Users.signUp);

router
  .route("/signin")
  .post(
    validateBody(schemas.authSchema),
    passport.authenticate("local", { session: false }),
    Controller_Users.signIn
  );

router
  .route("/secret")
  .get(
    passport.authenticate("jwt", { session: false }),
    Controller_Users.secret
  );

router
  .route("/updatedisplayname")
  .post(
    passport.authenticate("jwt", { session: false }),
    validateDisplayName(schemas.displayNameSchema),
    Controller_Users.updatedisplayname
  );

router.route("/getdisplayname").post(Controller_Users.getDisplayname);

module.exports = router;
