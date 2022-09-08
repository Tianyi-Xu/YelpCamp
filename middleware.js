const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schemas");
const Campground = require("./models/campground");
const catchAsync = require("./utils/catchAsync");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You mush be signed in");
    return res.redirect("/login");
  }
  next();
};

// validation user input
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// varify if the author has permisson for this url
module.exports.isAuthor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "Sorry, you don't have permission for that.");
    return res.redirect(`/campgrounds/${campground._id}`);
  }
  next();
});

// varify if the author of the review has permisson for this url
module.exports.isReviewAuthor = catchAsync(async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "Sorry, you don't have permission for that.");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
});




// validate user input review
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

