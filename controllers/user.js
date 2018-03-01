const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

// const auth = passport.authenticate('login', { failWithError: true });

// add new user to db
exports.addUser = function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  //check for existing user name
  User.findOne({ username: username }, function (err, user) {
    if (err) {
      return next(err)
    }
    // check username in db
    if (user) {
      return res.status(404).json({
        status: "ERROR",
        message: "Username is taken"
      })
    }
    // create new user 
    const newUser = new User({
      username: username,
      email: email,
      password: password
    })
    newUser.save();
    return res.status(200).json({
      status: "OK",
      message: "Successfully created user"
    })
  })
}  

// verify new user to db
exports.verify = function (req, res, next) {

  const email = req.body.email || req.query.email;
  const key = req.body.key || req.query.key;

  User.findOne({ email: email }, function (err, user) {
    if (err) { return next(err) }
    if (!user) {
      req.flash("error", "Username Not Found")
      // return res.redirect("/")
      return res.status(404).json({
        status: "ERROR"
      })
    }

    // check user is not alredy verified 
    if (user.isVerified) {
      req.flash("error", "Already Verified");
      // return res.redirect("/");
      return res.status(404).json({
        status: "ERROR"
      })
    }

    if (key === "abracadabra") {
      user.isVerified = true;
      user.save(function (err, updatedUser) {
        if (err) { return next(err) }
        console.log("user updated")
        req.flash("info", "Thank You for Verifying.")
        // return res.redirect("/");
        return res.status(200).json({
          status: "OK"
        })
      })
    } else {
      // next()
      return res.status(404).json({
        status: "ERROR"
      })

    }

  })

}

exports.login_post = function(req, res, next) {
  // custom callback function for passport.
  passport.authenticate('login', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      return res.json({
        "status": "ERROR"
      });
    }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      return res.json({
        "status": "OK"
      });
    });
  })(req, res, next);
}

exports.login_get = function(req, res) {
  if (req.user) {
    res.locals.name = req.user.username;r
    res.locals.date = new Date();
    res.locals.data = {
      grid: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
    }
    res.render("ttt");
  } else {
    res.render("login")
  }
}

exports.logout = function(req, res) {
  if (req.user) {
    req.logout();
    return res.json({
      "status": "OK"
    });
  } else {
    return res.json({
      "status": "ERROR"
    });
  }
}

exports.signup_get = function(req, res) {
  res.render("signup")
} 