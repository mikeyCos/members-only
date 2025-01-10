const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { getAccount } = require("../db/queries");
const bcrypt = require("bcryptjs");

const verifyCallback = async (username, password, done) => {
  console.log("verifyCallback running...");
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
  console.log("serializeUser running...");
  done(null, account.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("deserializeUser running...");
  try {
    const account = await getAccount({ id });
    return done(null, account);
  } catch (err) {
    done(err);
  }
});
