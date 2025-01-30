const express = require("express");
const session = require("express-session");
const passport = require("passport");
const pgSession = require("connect-pg-simple")(session);
const { PORT } = require("./config/environment");
const pool = require("./db/pool");
const { staticPaths, viewsPaths } = require("./paths/paths");
const indexRouter = require("./routes/indexRouter");
const placeholderRouter = require("./routes/placeholderRouter");
const accountRouter = require("./routes/accountRouter");
const myAccountRouter = require("./routes/myAccountRouter");
const profileRouter = require("./routes/profileRouter");
const supportRouter = require("./routes/supportRouter");
const hasRole = require("./utils/hasRole");

const app = express();

// Specify static paths
app.use(staticPaths.map((path) => express.static(path)));

// Setting views
app.set("views", viewsPaths);
app.set("view engine", "ejs");

// What to call this block?
const sessionStore = new pgSession({
  pool: pool,
  tableName: "account_sessions",
  createTableIfMissing: true,
});

app.use(
  session({
    secret: "giraffe",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      // maxAge: 1000 * 30, // 30 seconds (1000ms / 1sec)
      maxAge: 1000 * 2 * 24 * 60 * 60, // Equals 2 days (2 days * 24 hr/1 day * 60 min/1 hour * 60 sec/1 min * 1000ms/1 sec)
    },
  })
);

require("./config/passport");
app.use(passport.session());

// Parses form data
app.use(express.urlencoded({ extended: true }));

// Application-leve
app.use((req, res, next) => {
  res.locals.utils = {
    hasRole,
  };
  res.locals.currentUser = req.user;
  next();
});

// Router-level
app.use("/", indexRouter);
app.use("/placeholderA", placeholderRouter);
app.use("/account", [accountRouter, profileRouter]);
app.use("/my-account", myAccountRouter);
app.use("/support", supportRouter);

app.use((req, res, next) => {
  // res.render("404", { title: "404 - Page Not Found" });
  next({ status: 404, msg: "Resource not found" });
});

// Error middleware function
app.use((err, req, res, next) => {
  const { status, msg } = err;
  res.status(status).render("errors", { status, error: msg });
});

app.listen(PORT, () => console.log(`Application running on port: ${PORT}`));
