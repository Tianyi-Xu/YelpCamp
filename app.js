const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");

const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const { userInfo } = require("os");



async function main() {
  await mongoose.connect("mongodb://localhost:27017/yelp-camp", {});
}
main().catch((err) => console.log(err));
const db = mongoose.connection;

const app = express();

// set view engine view directory
app.engine("ejs", ejsMate); // use ejsMate engine for ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// set express to parse the body of request
app.use(express.urlencoded({ extended: true }));
// override method (form doesnt support put/patch)
app.use(methodOverride("_method"));
// serve the public directory(static assets)
app.use(express.static( path.join(__dirname, "public")));

const sessionConfig = {
  secret: "thisshouldbeabettersecrets",
  resave: false,
  saveUninitialized: true,
  cookie: {
    http: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }

}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

// register form



app.get("/", (req, res) => {
  res.render("home");
});

app.use("/", userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.all("*", (req, res, next) => next(new ExpressError("Page is not found...", 404)));

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong..."
  res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
