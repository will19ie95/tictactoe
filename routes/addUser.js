const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const passport = require("passport");
const home = require("./home.js");

const verify_page = function(req, res) {
  res.send("verify account to continue")
};

router.post("/", function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  //check for existing user name
  User.findOne({ username: username }, function(err, user) {
    if (err) {
      return next(err)
    }
    // check username in db
    if (user) {
      req.flash("error", "username already exists");
      return res.redirect("/signup");
    }

    // create new user 
    const newUser = new User({
      username: username,
      email: email,
      password: password
    })
    // newUser.save(next);    
    newUser.save();   
    req.flash("info", "verify account to continue");
    return res.redirect("/"); 
  })
 
});

module.exports = router;
