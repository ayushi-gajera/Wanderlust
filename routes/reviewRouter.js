const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchemas } = require("../schema.js");
const Review = require("../models/reviews.js");

// MiddleWare

let validateReviewSchema = (req, res, next) => {
  const { error } = reviewSchemas.validate(req.body);
  if (error) {
    let errorMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errorMsg);
  } else {
    next();
  }
};

// DELETE REVIEW

router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review is Deleted");
    res.redirect(`/listings/${id}`);
  })
);

// REVIEW

router.post(
  "/",
  validateReviewSchema,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();
    req.flash("success", "Review Added");
    res.redirect(`/listings/${listing._id}`);
  })
);

module.exports = router;
