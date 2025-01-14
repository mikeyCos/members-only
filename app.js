const express = require("express");
const session = require("express-session");
const passport = require("passport");
const pgSession = require("connect-pg-simple")(session);
const { PORT } = require("./config/environment");
const pool = require("./db/pool");
const { staticPaths, viewsPaths } = require("./paths/paths");
const logger = require("./utils/logger");
const indexRouter = require("./routes/indexRouter");
const placeholderRouter = require("./routes/placeholderRouter");
const accountRouter = require("./routes/accountRouter");
const myAccountRouter = require("./routes/myAccountRouter");
const profileRouter = require("./routes/profileRouter");
const supportRouter = require("./routes/supportRouter");

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

// Application-level
// app.use(logger);

app.use((req, res, next) => {
  console.log("application-level middleware running...");
  console.log("req.session:", req.session);
  console.log("req.user:", req.user);
  console.log("req.originalUrl:", req.originalUrl);
  res.locals.currentUser = req.user;
  next();
});

// Router-level
app.use("/", indexRouter);
app.use("/placeholderA", placeholderRouter);
app.use("/account", accountRouter);
app.use("/my-account", myAccountRouter);
app.use("/account/view-profile", profileRouter);
app.use("/support", supportRouter);

app.use((req, res) => {
  res.render("404", { title: "404 - Page Not Found" });
});

// Error middleware function
app.use((err, req, res, next) => {
  console.log("error middleware running...");
  console.log("err:", err);
  res.status(404).render("404", { error: err.msg ?? "Resource not found" });
});

app.listen(PORT, () => console.log(`Application running on port: ${PORT}`));
