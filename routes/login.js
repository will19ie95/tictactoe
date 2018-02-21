const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/", function(req, res) {
  res.render("login");
});

router.post("/login", passport.authenticate("login", {
  successRedirect: "/home",
  failureRedirect: "/login",
  failureFlash: true
}));

module.exports = router;
