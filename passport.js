const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const GooglePlusTokenStrategy = require("passport-google-plus-token");
const FacebookTokenStrategy = require("passport-facebook-token");
const {
  JWT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET
} = require("./Keys/keys");
const User = require("./Models/user");

// Google Oauth Strategy
passport.use(
  "googleToken",
  new GooglePlusTokenStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if current user exists in database
        const user = await User.findOne({ "google.id": profile.id });
        if (user) return done(null, user);

        // If user doesn't exist
        const temporaryDisplayName =
          "user" + Math.floor(Math.random() * Math.floor(10000000000000000));
        const newUser = new User({
          displayName: temporaryDisplayName,
          method: "google",
          google: {
            id: profile.id,
            email: profile.emails[0].value
          }
        });

        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: JWT_SECRET
    },
    async (payload, done) => {
      try {
        // Find the user specified in token
        const user = await User.findOne({ _id: payload.sub });
        // If user doesn't exist, handle
        if (!user) done(null, false);

        // Return user
        return done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// Facebook Strategy
passport.use(
  "facebookToken",
  new FacebookTokenStrategy(
    {
      clientID: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if current user exists in database
        const user = await User.findOne({ "facebook.id": profile.id });
        if (user) return done(null, user);

        // If user doesn't exist
        const temporaryDisplayName =
          "user" + Math.floor(Math.random() * Math.floor(10000000000000000));
        const newUser = new User({
          displayName: temporaryDisplayName,
          method: "facebook",
          facebook: {
            id: profile.id,
            email: profile.emails[0].value
          }
        });

        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);

// Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    async (email, password, done) => {
      try {
        // Find the user given the email
        const user = await User.findOne({ "local.email": email });

        // If not, handle
        if (!user) return done(null, false);

        // Check if the password is correct
        const isMatch = await user.isValidPassword(password);

        // If not, handle
        if (!isMatch) return done(null, false);

        // Return user
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
