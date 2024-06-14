const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchemas } = require("../schema.js");
const passport = require("passport");
const { isLoggedIn } = require("../middleware/isLoggedin.js");

let validateSchema = (req, res, next) => {
  const { error } = listingSchemas.validate(req.body);
  if (error) {
    let errorMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errorMsg);
  } else {
    next();
  }
};

router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// CREATE

router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

router.post(
  "/",
  validateSchema,
  wrapAsync(async (req, res, next) => {
    let listing = req.body.listing;
    listing.owner = req.user._id;
    req.flash("success", "New Listing is Created");
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// SHOW

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing is not Exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

// EDIT

router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing is not Exist");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

router.patch(
  "/:id",
  validateSchema,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let editListing = await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });
    req.flash("success", "Listing is Updated");
    res.redirect(`/listings/${id}`);
  })
);

// DELETE

router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is Deleted");
    res.redirect("/listings");
  })
);
module.exports = router;
