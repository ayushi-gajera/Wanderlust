const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {
  isLoggedIn,
  isCurrUser,
  validateSchema,
} = require("../middleware/middlewares.js");
const listingController = require("../controllers/listingController.js");
const multer = require("multer");
const { storage } = require("../cloudinaryConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateSchema,
    wrapAsync(listingController.createNewListing)
  );

router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .patch(
    upload.single("listing[image]"),
    validateSchema,
    isCurrUser,
    wrapAsync(listingController.editListing)
  )
  .delete(isLoggedIn, isCurrUser, wrapAsync(listingController.destroyListing));

router.get(
  "/:id/edit",
  isLoggedIn,
  isCurrUser,
  wrapAsync(listingController.renderEditListing)
);

module.exports = router;
