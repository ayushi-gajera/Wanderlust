const User = require("../models/user.js");

// SIGNUP

module.exports.signup = async (req, res) => {
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
};

// LOGIN

module.exports.login = (req, res) => {
  res.render("user/login.ejs");
};

// LOGIN-AUTHENTICATION

module.exports.loginAuthentication = (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");
  let redirectURL = res.locals.redirectURL || "/listings";
  res.redirect(redirectURL);
};

// LOGOUT

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      req.next(err);
    }
    req.flash("success", "You are Logged Out Successfully!");
    res.redirect("/listings");
  });
};
