const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js");
const {
  isLoggedIn,
  validateReviewSchema,
  isReviewUser,
} = require("../middleware/middlewares.js");
const reviewController = require("../controllers/reviewController.js");

// DELETE REVIEW

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewUser,
  wrapAsync(reviewController.destroyReview)
);

// REVIEW

router.post(
  "/",
  validateReviewSchema,
  isLoggedIn,
  wrapAsync(reviewController.createReview)
);

module.exports = router;
