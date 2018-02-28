const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.get("/", function (req, res) {
  // check if user logged in
  if (req.user) {
    res.locals.name = req.user.username;
    res.locals.date = Date.now()
    res.locals.data = {
      grid: req.user.ttt.grid
    }
    res.locals.winner = req.user.winner
    res.render("ttt", {
      name: req.user.username,
      date: new Date()
    });
  } else {
    // req.flash("error", "Login to continue")
    res.redirect("/login")
  }
});

module.exports = router;
