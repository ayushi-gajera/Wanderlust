const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

// DELETE REVIEW

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review is Deleted");
  res.redirect(`/listings/${id}`);
};

// REVIEW

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);

  await listing.save();
  await newReview.save();
  req.flash("success", "Review Added");
  res.redirect(`/listings/${listing._id}`);
};
