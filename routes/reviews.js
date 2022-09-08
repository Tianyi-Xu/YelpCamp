const express = require("express");
const { reviewSchema } = require("../schemas.js");

const Campground = require("../models/campground");
const Review = require("../models/review");

const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const router = express.Router({mergeParams: true});
const reviews = require("../controllers/reviews");


// add review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(reviews.createReview)
);

// delete review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;