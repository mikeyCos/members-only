const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { getAccount } = require("../db/queries");
const bcrypt = require("bcryptjs");

const verifyCallback = async (username, password, done) => {
  try {
    const account = await getAccount({ username, password });
    const match = account && (await bcrypt.compare(password, account.password));

    if (!account || !match) {
      return done(null, false, { message: "Invalid username or password" });
    }

    return done(null, account);
  } catch (err) {
    return done(err);
  }
};

const strategy = new LocalStrategy(verifyCallback);
passport.use(strategy);

passport.serializeUser((account, done) => {
  done(null, account.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const account = await getAccount({ id });
    return done(null, account);
  } catch (err) {
    done(err);
  }
});
