const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectURL } = require("../middleware/middlewares.js");
const userController = require("../controllers/userController.js");

router
  .route("/signup")
  .get((req, res) => {
    res.render("user/signup.ejs");
  })
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.login)
  .post(
    saveRedirectURL,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.loginAuthentication
  );

router.get("/logout", userController.logout);

module.exports = router;
