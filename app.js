require("dotenv").config();
const express = require("express");
const path = require("node:path");
const session = require("express-session");
const passport = require("passport");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./db/pool.js");
const {
  useFlashMessages,
  setFlashMessage,
  getFlashMessage,
} = require("./utils/flashMessages.js");
const saveSessionAndRedirect = require("./utils/saveSessionAndRedirect.js");

const CustomNotFoundError = require("./errors/CustomNotFoundError.js");

// require Routers here
const indexRouter = require("./routes/indexRouter.js");
const authRouter = require("./routes/authRouter.js");
const messageRouter = require("./routes/messageRouter.js");
const userRouter = require("./routes/userRouter.js");

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
  res.locals.pageTitle = process.env.TITLE;

  const msg = req.session.messages || [];
  res.locals.messages = msg;
  res.locals.hasMessages = !!msg.length;
  req.session.messages = [];

  res.locals.currentUrl = req.originalUrl;

  res.locals.currentUser = req.user;

  res.locals.isGuest = req.session.isGuest;

  next();
});

// Save flash messages [requires session initialized]
app.use(useFlashMessages);

// Parse data for req.body
app.use(express.urlencoded({ extended: true }));

// Use Routers here
app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/", messageRouter);
app.use("/", userRouter);

// Error handling

app.use("/error", (req, res, next) => {
  const notGetError = getFlashMessage(res, "notGetError");

  if (notGetError) {
    next(notGetError);
  } else {
    next();
  }
});

// catch-all route throwing a 404 error
app.use((req, res, next) => {
  throw new CustomNotFoundError("Page not found");
});

app.use((error, req, res, next) => {
  console.error(`[${req.method}] ${req.originalUrl} >`, error);

  error.statusCode = error.statusCode || 500;
  error.message =
    error.statusCode !== 500 ? error.message : "Internal server error";

  // enforce PRG pattern
  if (req.method !== "GET") {
    const redirectTo = res.locals.onNotGetErrorRedirectTo ?? "/error";
    const notGetError = { ...error, message: error.message };

    setFlashMessage(req, "notGetError", notGetError);

    console.log("REDIRECT TO:", redirectTo);

    return saveSessionAndRedirect(req, res, redirectTo);
  }

  const code = error.statusCode;
  const message = error.message;
  const partial = error.partial;

  res.status(code).render("error", {
    code,
    message,
    partial,
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
