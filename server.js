// Import NPM modules
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const ejsLayouts = require("express-ejs-layouts");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");

// Import local modules
const landingRoute = require("./routes/landing");
const authRoute = require("./routes/auth");
const dashboardRoute = require("./routes/dashboard");
const blogsRoute = require("./routes/blogs/blogs");
const connectDB = require("./db/connect");
const passportConfig = require("./config/passport");

// Load config
dotenv.config({ path: "./config/.env" });

// Connect with database
connectDB();

// Instantiate express server
const app = express();

// EJS
app.set("view engine", "ejs");
app.use(ejsLayouts);

// Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      autoRemoveInterval: 3600,
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// Passport config
passportConfig(passport);

// Routes
app.use("/", landingRoute);
app.use("/auth", authRoute);
app.use("/dashboard", dashboardRoute);
app.use("/blogs", blogsRoute);

// 404 route
app.use("/*", (req, res) => {
  res.render("errors/404");
});

// Start listening
const PORT = process.env.PORT;
app.listen(
  PORT,
  console.log(
    `\nServer running in ${process.env.NODE_ENV} mode on port: ${PORT}`
  )
);
