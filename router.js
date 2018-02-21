const express = require("express");
const router = express.Router();

const play = require("./routes/play.js");
const signup = require("./routes/signup.js");
const verify = require("./routes/verify.js");
const login = require("./routes/login.js");
const adduser = require("./routes/adduser.js");

const init_locals = function(req, res, next) {
  res.locals.currenUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
};

router.use(init_locals);

// home page
router.use("/", login);
router.use("/signup", signup);
router.use("/verify", verify);
// play API
router.use("/play", play);
router.use("/adduser", adduser);

module.exports = router;
