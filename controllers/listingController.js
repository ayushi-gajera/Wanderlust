const Listing = require("../models/listing.js");

// INDEX

module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// CREATE

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createNewListing = async (req, res, next) => {
  let url = req.file.path;
  let fileName = req.file.fileName;
  let listing = req.body.listing;
  listing.owner = req.user._id;
  listing.image = { url, fileName };
  req.flash("success", "New Listing is Created");
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
  next();
};

// SHOW

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing is not Exist");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

// EDIT

module.exports.renderEditListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing is not Exist");
    res.redirect("/listings");
  }
  let originalImageURL = listing.image.url;
  originalImageURL = originalImageURL.replace("/uploads", "/uploads/w_250");
  res.render("listings/edit.ejs", { listing, originalImageURL });
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let editListing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let fileName = req.file.fileName;
    editListing.image = { url, fileName };
    await editListing.save();
  }

  req.flash("success", "Listing is Updated");
  res.redirect(`/listings/${id}`);
};

// DELETE

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing is Deleted");
  res.redirect("/listings");
};
