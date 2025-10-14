require("dotenv").config();
const express = require("express");
const path = require("node:path");
const session = require("express-session");
const passport = require("passport");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./db/pool.js");

// require Routers here
const indexRouter = require("./routes/indexRouter.js");
const authRouter = require("./routes/authRouter.js");

const app = express();

// Init view Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serve static files
app.use(express.static("public", { extensions: ["html"] }));

// Ignore favicon icon / ... request
app.get(
  ["/favicon.ico", "/.well-known/appspecific/com.chrome.devtools.json"],
  (req, res) => {
    // console.log(`Ignoring request of ${req.path}`);
    res.sendStatus(204); // No Content
  }
);

// Setup session for authentication
const sessionStore = new pgSession({ pool: pool, createTableIfMissing: true });

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
  })
);
app.use(passport.session());

// Save useful data in res.locals
app.use((req, res, next) => {
  const msg = req.session.messages || [];
  res.locals.messages = msg;
  res.locals.hasMessages = !!msg.length;
  req.session.messages = [];

  res.locals.currentUser = req.user;

  res.locals.isGuest = req.session.isGuest;

  next();
});

// Parse data for req.body
app.use(express.urlencoded({ extended: true }));

// Use Routers here
app.use("/", indexRouter);
app.use("/", authRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
