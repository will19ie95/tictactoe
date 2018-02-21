const express = require("express");
const router = express.Router();
// const Token = require("../models/user.model");
const User = require("../models/user.model");

router.use("/", function(req, res, next) {

  const email = req.body.email || req.query.email;
  const key = req.body.key || req.query.key;

  console.log("email", email)
  console.log("token", key)

  User.findOne({ email: email }, function(err, user){
    if (err) { return next(err) }
    if (!user) {
      req.flash("error", "Username Not Found")
      console.log("NO USER FOUND")
    }

    if (user.isVerified) {
      req.flash("error", "Already Verified");
      return res.redirect("/");
    }

    if(key === "abracadabra") {
      // check user is not alredy verified 
      user.isVerified = true;
      user.save(function(err, updatedUser) {
        if (err) { return next(err) }
        console.log("user updated")
        return res.send("Thank you for Verifying.");
      })
    } else {
      next()
    }

  })

});

module.exports = router;
