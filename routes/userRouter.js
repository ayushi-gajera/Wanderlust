const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectURL } = require("../middleware/isLoggedin.js");

router.get("/signup", (req, res) => {
  res.render("user/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let user = new User({ username, email });

      let userRegistered = await User.register(user, password);

      req.logIn(userRegistered, (err) => {
        if (err) {
          req.next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

router.post(
  "/login",
  saveRedirectURL,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectURL = res.locals.redirectURL || "/listings";
    res.redirect(redirectURL);
  }
);

router.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      req.next(err);
    }
    req.flash("success", "You are Logged Out Successfully!");
    res.redirect("/listings");
  });
});

module.exports = router;
