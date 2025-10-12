const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../db/queries.js");
const { checkPassword } = require("./passwordUtils.js");

// Define veryfy function called by passport.authenticate()
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.read.userFromUsername(username);

      if (!user) {
        return done(null, false, { message: "This username does not exists!" });
      }

      const match = await checkPassword(password, user.password_hash);

      if (!match) {
        return done(null, false, { message: "Incorrect password!" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Define serializeUser function called after authenticate, to store user info on the session data
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Define deserializeUser function called after authenticate('session'), to get user info from the session data
passport.deserializeUser(async (serializedUser, done) => {
  const id = serializedUser;

  try {
    const user = await db.read.userFromId(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
