// app.js

// Import necessary packages
const express = require("express");
const session = require("express-session");
const logger = require("morgan");
const MongoStore = require("connect-mongo");
const flash = require("express-flash");
const passport = require("passport");
const mongoose = require("mongoose");
const path = require("path");

// Load environment variables from a .env file
require("dotenv").config();

// Import controllers and configurations
const homeController = require("./controllers/home");
const userController = require("./controllers/user");
const loanController = require("./controllers/loan");
const passportConfig = require("./config/passport");

// Initialize the Express app
const app = express();

// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "%s MongoDB connection error. Please verify that MongoDB is running."
  );
  process.exit();
});

// Set app configuration options
app.set("port", process.env.PORT || 8080);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: "dashboard",
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 7200000 }, // Two hours in milliseconds
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login redirect to intended page other than login, signup or auth.
  if (
    !req.user &&
    req.path !== "/login" &&
    req.path !== "/signup" &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)
  ) {
    req.session.returnTo = req.originalUrl;
  } else if (
    req.user &&
    (req.path === "/account" || req.path.match(/^\/api/))
  ) {
    req.session.returnTo = req.originalUrl;
  }
  next();
});

// Set up static file serving for the public directory and third-party libraries
app.use("/", express.static(path.join(__dirname, "public")));
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js/lib",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(
  "/js/lib",
  express.static(path.join(__dirname, "node_modules/jquery/dist"))
);

// Set up routes
app.get("/", homeController.index);
// app.get("/access", homeController.access);
app.get("/login", userController.getLogin);
app.post("/login", userController.postLogin);
app.get("/logout", userController.logout);
app.get("/signup", userController.getSignup);
app.post("/signup", userController.postSignup);
app.get("/account", passportConfig.isAuthenticated, userController.getAccount);
app.post(
  "/account/profile",
  passportConfig.isAuthenticated,
  userController.postUpdateProfile
);
app.get("/access", loanController.getAccess);
app.post("/access", loanController.postAccess);
app.get("/verification-1", loanController.getVerification1);
app.post("/verification-1", loanController.postVerification1);

app.get("/verification-2", loanController.getVerification2);
app.post("/verification-2", loanController.postVerification2);

app.get("/verification-3", loanController.getVerification3);
app.post("/verification-3", loanController.postVerification3);

app.get("/congratulations", loanController.getCongratulations);

app.get("/mono-webhook", loanController.postWebhook);

// Handle 404 errors
app.use((req, res) => {
  res.render("404", {
    title: "Page Not Found · Lendr",
  });
});

// Start the server
app.listen(app.get("port"), () => {
  console.log(
    `App is running on http://localhost:${app.get("port")} in ${app.get(
      "env"
    )} mode`
  );
  console.log("Press CTRL-C to stop");
});

// Export the app
module.exports = app;
