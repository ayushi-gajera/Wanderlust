const Listing = require("../models/listing.js");
const { listingSchemas, reviewSchemas } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/reviews.js");

module.exports.validateSchema = (req, res, next) => {
  const { error } = listingSchemas.validate(req.body);
  if (error) {
    let errorMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errorMsg);
  } else {
    next();
  }
};

module.exports.validateReviewSchema = (req, res, next) => {
  const { error } = reviewSchemas.validate(req.body);
  if (error) {
    let errorMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errorMsg);
  } else {
    next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectURL = req.originalUrl;
    req.flash("error", "You are not Logged In");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectURL = (req, res, next) => {
  if (req.session.redirectURL) {
    res.locals.redirectURL = req.session.redirectURL;
  }
  next();
};

module.exports.saveRedirectURLForReview = (req, res, next) => {
  if (req.session.redirectURL) {
    res.locals.redirectURL = req.session.redirectURL;
  }
  next();
};

module.exports.isCurrUser = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewUser = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
